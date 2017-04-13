function createGoogleMap () {

  // Create the Google Map
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

  // Triggers for toggle buttons
  var left = true, center = true, right = true;
  $("#left input").on("change", function(){
    left = !left;
    selectRegions();
  });
  $("#center input").on("change", function(){
    center = !center;
    selectRegions();
  });
  $("#right input").on("change", function(){
    right = !right;
    selectRegions();
  });

  // Hide regions that are not selected
  function selectRegions() {
    map.data.setStyle(function(feature) {
      if(feature.f.regionData &&
        ((left && feature.f.regionData.scaled < 0.45) ||
        (right && feature.f.regionData.scaled > 0.55) ||
        (center && feature.f.regionData.scaled >= 0.45 && feature.f.regionData.scaled <= 0.55)
      )) {
        return {
          fillColor: feature.f.color,
          strokeColor: feature.f.color,
          strokeWeight: 1
        };
      } else {
        return {
          fillOpacity: 0,
          strokeWeight: 0
        };
      }
    });
  }


  // Load geojson data of amsterdam
  map.data.loadGeoJson('../data/amsterdam.json');
  // Callback for clicking a zipcode polygon
  map.data.addListener('click', function(event) {
    if(event.feature.f.data) {
      // Reset styles
      map.data.revertStyle();
      // Style selected polygon
      map.data.overrideStyle(event.feature, {strokeWeight: 4});

      // Slide the alignment indicator of the polygon
      $("#zipcode .alignment #alignment").animate({
        width: 0,
        left: 260*event.feature.f.data.scaled + "px"
      });

      // Set the width of the bar for each party based on the percentage for the polygon
      var sum = 0;
      for(var i = 0; i < 10; i++) {
        sum += event.feature.f.data.parties[i];
      }
      for(var i = 0; i < 10; i++) {
        var p = event.feature.f.data.parties[i]/sum;
        $("#zipcode #score" + i + " span").animate({
          width: p*150
        })//.html(Math.floor(p*100) + "%");
      }

      // Slide the alignment indicator of the region
      $("#region .alignment #alignment").animate({
        width: 0,
        left: 260*event.feature.f.regionData.scaled + "px"
      });

      // Set the width of the bar for each party based on the percentage for the polygon
      var sum = 0;
      for(var i = 0; i < 10; i++) {
        sum += event.feature.f.regionData.parties[i];
      }
      for(var i = 0; i < 10; i++) {
        var p = event.feature.f.regionData.parties[i]/sum;
        $("#region #score" + i + " span").animate({
          width: p*150
        })//.html(Math.floor(p*100) + "%");
      }
    }
  });

  // Load cluster data
  d3.csv("../data/clusters.csv", function(d) {
    // Map csv to javascript object
    return {
      postcode: d.POSTCODE,
      parties: [+d.vvd,+d.d66,+d.gl,+d.sp,+d.cu,+d.cda,+d.pvda,+d.pvv,+d.sgp,+d["50p"]], //Tweet values
      total: +d.Total,
      scaled: +d.Scaled, //Political alignment value
      region: d.Region //MAX-P cluster assignment
    }
  }, function(error, data) {
    if (error) throw error;

    // Define colors for each region
    var color = {};
    var colors = ["#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    var colorId = 0;
    var regions = [];

    // Aggregate data for each zipcode into regions for each cluster number
    for (var i = 0; i < data.length; i++) {
      if(!regions[data[i].region]) {
        regions[data[i].region] = {};
        regions[data[i].region].parties = data[i].parties;
        regions[data[i].region].scaled = data[i].scaled;
        regions[data[i].region].number = 1;
      } else {
        for (var j = 0; j < data[i].parties.length; j++) {
          regions[data[i].region].parties[j] += data[i].parties[j];
        }
        regions[data[i].region].scaled += data[i].scaled;
        regions[data[i].region].number += 1;
      }
    }
    // Average the alignment value for a cluster
    for (var i = 0; i < regions.length; i++) {
      regions[i].scaled = regions[i].scaled / regions[i].number;
    }

    // Set colors of polygons based on the regions and hide the once that do not have data.
    map.data.setStyle(function(feature) {
      for (var i = 0; i < data.length; i++) {
        if(feature.f.POSTCODE == data[i].postcode) {
          if(!color[data[i].region]) {
            color[data[i].region] = colors[colorId];
            colorId++;
          }
          feature.f.data = data[i];
          feature.f.regionData = regions[data[i].region];
          feature.f.color = color[data[i].region];
          return {
            fillColor: color[data[i].region],
            strokeColor: color[data[i].region],
            strokeWeight: 1
          };
        }
      }

      return {
        fillColor: "#aaaaaa",
        fillOpacity: 0,
        strokeWeight: 0
      };
    });
  });
}
