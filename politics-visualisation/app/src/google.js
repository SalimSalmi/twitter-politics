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
