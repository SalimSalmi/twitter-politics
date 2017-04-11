const offset = require('geojson-offset').offset;
const fs = require('fs');

let geojson = require('./app/data/amsterdamSalim2.json')

/**
 * Pass the geojson and the x/y coordinate offset
 */
offsetgeo = offset(geojson, 0, -0.001);

var json = JSON.stringify(offsetgeo);

fs.writeFile('./app/data/amsterdamSalim3.json', json, 'utf8');
