function createGoogleMap () {

  // Create the Google Map…
  var map = new google.maps.Map(d3.select("#google").node(), {
    zoom: 12,
    center: new google.maps.LatLng(52.3702, 4.8952),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }, {
        featureType: "all",
        stylers: [
          { saturation: -80 },
          { lightness: 30 }
        ]
      },
    ]
  });


  d3.csv("../data/nokeys-filtered.csv", function(d) {
 // Reading from the csv file and getting the variables needed
 console.log(d);

    return {
      id: +d.id,
      location: [+d.long, +d.lat],
      tag: d.tag,
      colors: ["#991111"]
    };

  }, function(error, data) {
    if (error) throw error;

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "photos");

      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 10;

        var marker = layer.selectAll("svg")
            .data(data)
            .each(transform)
          .enter().append("svg")
            .each(transform)
            .attr("class", "marker");

        // Add a circle, set the color if it's within the bounds, set opacity to 0 if it's not within the bounds.
        marker.append("circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding)
            .attr("stroke", "#333333")
            .attr("fill", function(d) {
              return d.colors[0];
            })
            // .attr("opacity", function(d) {
            //   if(inBounds(d, bounds) > -1){
            //     return 1;
            //   } else {
            //     return 0;
            //   }
            // });

        // Identifying the location of the points
        function transform(d) {
          d = new google.maps.LatLng(d.location[1], d.location[0]);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }
      };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);
  });


}

function createGoogleMap_old () {
   // Identifying the location of the 10 different cities
  var cities = { tokyo: { lng: 139.797171584, lat: 35.71781637 },
      london: { lng: -0.097197167, lat: 51.532795 },
      newyork: { lng: -74.04198026, lat: 40.72831085 },
      berlin: { lng: 13.373883333, lat: 52.526611667 },
      seoul: { lng: 127.012843219, lat: 37.565160341 },
      moscow: { lng: 37.675085361, lat: 55.753156237 },
      paris: { lng: 2.334376506, lat: 48.861800657 },
      rome: { lng: 12.469875229, lat: 41.890391589 },
      tehran: { lng: 51.3728388, lat: 35.6824128 },
      stockholm: { lng: 18.038223494, lat: 59.342382941 } }


  // Create the Google Map…
  var map = new google.maps.Map(d3.select("#google").node(), {
    zoom: 12,
    center: new google.maps.LatLng(40.72831085, -74.04198026),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }, {
        featureType: "all",
        stylers: [
          { saturation: -80 },
          { lightness: 30 }
        ]
      },
    ]
  });

  for(let city in cities) {
    // Whenever a city button is clicked pan to the location of that city.
    d3.select( "#"+city ).on("click", function() {
      var center = new google.maps.LatLng(cities[city].lat, cities[city].lng);
      map.panTo(center);
      d3.selectAll("ul.controls li").classed("active", false);
      d3.select("#"+city).classed("active", true);
    });
  }

  d3.csv("../data/parsed-data.csv", function(d) {
 // Reading from the csv file and getting the variables needed
    return {
      time: new Date(+d.Created_Time),
      city: d.city,
      location: [+d.Longitude, +d.Latitude],
      likes: +d.Likes,
      comments: +d.Comments,
      colors: [d.color1, d.color2, d.color3, d.color4, d.color5]
    };

  }, function(error, data) {
    if (error) throw error;

    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "photos");

      // Creating and displaying the default of the color pickers
      var bounds = {
        lower : colorPicker("lower", 0.2, updateColor),
        upper : colorPicker("upper", 0.8, updateColor)
      }

      /**
       * Update the color of the points.
       * @param id the bound that was changed.
       * @param hsl the up to date hsl channels
       */
      function updateColor(id, hsl) {
        bounds[id] = hsl;

        layer.selectAll("svg").selectAll("circle")
          .attr("fill", function(d) {
            var result = inBounds(d,bounds);
            if(result > -1){
              return d.colors[result];
            } else {
              return d.colors[0];
            }
          })
          .attr("opacity", function(d) {
            if(inBounds(d, bounds) > -1){
              return 1;
            } else {
              return 0;
            }
          });
      };

      /**
       * Checking the upper and lower bounds of the sliders and returning the
       * color that is the closest to the center of the bounds.
       * @param d the current point
       * @param bounds the bounds
       * @return id of the best color, -1 if no color within bounds
       */
      function inBounds(d, bounds){
        var selected = -1;
        var selectedDistance = -1;

        for(let i = 0; i < d.colors.length; i++){
          var currentColor = d3.rgb(d.colors[i]).hsl();

          var inBoundsH = bounds.lower.h < currentColor.h && bounds.upper.h > currentColor.h;
          var inBoundsS = bounds.lower.s < currentColor.s && bounds.upper.s > currentColor.s;
          var inBoundsL = bounds.lower.l < currentColor.l && bounds.upper.l > currentColor.l;

          if(bounds.lower.h > bounds.upper.h) {
            inBoundsH = bounds.lower.h < currentColor.h || bounds.upper.h > currentColor.h;
          }
          if(bounds.lower.s > bounds.upper.s) {
            inBoundsS = bounds.lower.s < currentColor.s || bounds.upper.s > currentColor.s;
          }
          if(bounds.lower.l > bounds.upper.l) {
            inBoundsL = bounds.lower.l < currentColor.l || bounds.upper.l > currentColor.l;
          }

          if (isNaN(currentColor.h)) { inBoundsH = true; }
          if (isNaN(currentColor.s)) { inBoundsS = true; }
          if (isNaN(currentColor.l)) { inBoundsL = true; }

          if(inBoundsH && inBoundsS && inBoundsL) {

            var distanceLBH = Math.abs(currentColor.h - bounds.lower.h);
            var distanceUBH = Math.abs(currentColor.h - bounds.upper.h);
            var distanceLBS = Math.abs(currentColor.s - bounds.lower.s);
            var distanceUBS = Math.abs(currentColor.s - bounds.upper.s);
            var distanceLBL = Math.abs(currentColor.l - bounds.lower.l);
            var distanceUBL = Math.abs(currentColor.l - bounds.upper.l);

            var distance = Math.abs(distanceLBH - distanceUBH + distanceLBS - distanceUBS + distanceLBL - distanceUBL);

            if(selectedDistance < 0 || selectedDistance > distance){
              selected = i;
            }
          }
        }
        return selected;
      }

      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 10;

        var marker = layer.selectAll("svg")
            .data(data)
            .each(transform)
          .enter().append("svg")
            .each(transform)
            .attr("class", "marker");


        // Add a circle, set the color if it's within the bounds, set opacity to 0 if it's not within the bounds.
        marker.append("circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding)
            .attr("stroke", "#333333")
            .attr("fill", function(d) {
              var result = inBounds(d,bounds);
              if(result > -1){
                return d.colors[result];
              } else {
                return d.colors[0];
              }
            })
            .attr("opacity", function(d) {
              if(inBounds(d, bounds) > -1){
                return 1;
              } else {
                return 0;
              }
            });

        // Identifying the location of the points
        function transform(d) {
          d = new google.maps.LatLng(d.location[1], d.location[0]);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }
      };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);
  });


}
