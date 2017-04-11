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

  map.data.loadGeoJson('../data/amsterdamSalim3.json');
  map.data.addListener('click', function(event) {
    if(event.feature.f.data) {
      map.data.revertStyle();
      map.data.overrideStyle(event.feature, {strokeWeight: 4});

      $("#alignment").animate({
        width: event.feature.f.data.scaled*150
      })

      var sum = 0;
      for(var i = 0; i < 10; i++) {
        sum += event.feature.f.data.parties[i];
      }
      for(var i = 0; i < 10; i++) {
        var p = event.feature.f.data.parties[i]/sum;
        $("#score" + i + " span").animate({
          width: p*150
        })//.html(Math.floor(p*100) + "%");
      }
    }
  });

  d3.csv("../data/out10.csv", function(d) {
    return {
      postcode: d.POSTCODE,
      parties: [+d.vvd,+d.d66,+d.gl,+d.sp,+d.cu,+d.cda,+d.pvda,+d.pvv,+d.sgp,+d["50p"]],
      total: d.Total,
      scaled: d.Scaled,
      region: d.Region
    }

    // Reading from the csv file and getting the variables needed
    return {
      id: +d.id,
      location: [+d.long, +d.lat],
      tag: d.tag,
      colors: ["#991111"],
      lat: +d.lat,
      lng: +d.long,
      x: +d.long,
      y: +d.lat,
      region: +d.region || 0
    };

  }, function(error, data) {
    if (error) throw error;
    if(data.length > 1000) {data = data.slice(1,1000);}
    var color = {};
    var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    var colorId = 0;

    map.data.setStyle(function(feature) {
      for (var i = 0; i < data.length; i++) {
        if(feature.f.POSTCODE == data[i].postcode) {
          if(!color[data[i].region]) {
            color[data[i].region] = colors[colorId];
            colorId++;
          }
          feature.f.data = data[i];
          return {
            fillColor: color[data[i].region],
            strokeColor: color[data[i].region],
            strokeWeight: 1
          };
        }
      }

      return {
        fillColor: "#aaaaaa",
        opacity: 0,
        strokeWeight: 0
      };
  });

    //doPolygon(data);
    //doOverlayPoints(data);
  });

  function doPolygon(data) {
    var regions = {}

    for (var i = 0; i < data.length; i++) {
      if(regions[data[i].region]) regions[data[i].region].push(data[i]);
      else regions[data[i].region] = [data[i]];
    }

    for (var key in regions) {
      // Construct the polygon.
      var randc = '#'+Math.floor(Math.random()*16777215/2 + 16777215/4).toString(16)

      var polyarea = new google.maps.Polygon({
        paths: convexHull(regions[key]),
        strokeColor: randc,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: randc,
        fillOpacity: 0.35
      });
      polyarea.setMap(map);
    }
  }

  function doOverlayPoints(data) {
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

        marker.append("circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding)
            .attr("stroke", "#333333")
            .attr("fill", function(d) {
              return d.colors[0];
            });

        // Identifying the location of the points
        function transform(d) {
          d = new google.maps.LatLng(d.lat, d.lng);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }
      };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
  }

}
