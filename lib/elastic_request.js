var http = require("http");
var config = require("../config");

var ElasticRequest = { };

ElasticRequest.search = function( query, callback ) {
  query = JSON.stringify( query );
  var headers = {
    "Content-Length": query.length,
    "charset": "UTF-8",
    "Content-Type": "application/json"
  };
  var request = http.request({
    port: config.elasticsearch.port,
    host: config.elasticsearch.host,
    method: "GET",
    path: config.elasticsearch.searchPath,
    headers: headers
  });
  request.write( query, "utf8" );
  request.on( "response", function( response ) {
    var body = "";
    response.on("data", function( data ) {
      body += data;
    });
    response.on("end", function( ) {
      callback( JSON.parse( body ) );
    });
  });
  request.end( );
};

ElasticRequest.heatmapPrecision = function( zoom ) {
  precision = 4;
  if( zoom >= 3 ) { precision = 5; }
  if( zoom >= 5 ) { precision = 6; }
  if( zoom >= 8 ) { precision = 7; }
  if( zoom >= 10 ) { precision = 8; }
  if( zoom >= 13 ) { precision = 9; }
  if( zoom >= 15 ) { precision = 10; }
  if( zoom >= 16 ) { precision = 12; }
  return precision
};

ElasticRequest.gridPrecision = function( zoom ) {
  precision = 3;
  if( zoom >= 4 ) { precision = 4; }
  if( zoom >= 7 ) { precision = 5; }
  if( zoom >= 10 ) { precision = 6; }
  if( zoom >= 13 ) { precision = 7; }
  if( zoom >= 16 ) { precision = 8; }
  return precision
};

ElasticRequest.elasticQuery = function( qbbox, precisionFunction, zoom ) {
  var height = Math.abs(qbbox[2] - qbbox[0]);
  var width = Math.abs(qbbox[3] - qbbox[1]);
  var factor = 0.1;
  qbbox[0] = qbbox[0] - (height * factor)
  qbbox[2] = qbbox[2] + (height * factor)
  qbbox[1] = qbbox[1] - (width * factor)
  qbbox[3] = qbbox[3] + (width * factor)
  if(qbbox[0] < -180) { qbbox[0] = -180; }
  if(qbbox[1] < -90) { qbbox[1] = -90; }
  if(qbbox[2] > 180) { qbbox[2] = 180; }
  if(qbbox[3] > 90) { qbbox[3] = 90; }
  var field = config.elasticsearch.geoPointField;
  var boundingBox = { }
  boundingBox[field] = {
      "bottom_left" : [qbbox[0], qbbox[1]],
      "top_right" : [qbbox[2], qbbox[3]]
  };
  return {
    "size": 0,
    "fields": [ "id", "location", "taxon.iconic_taxon_id" ],
    "query": {
      "filtered": {
        "query": {
          "match_all": { }
        },
        "filter": {
          "geo_bounding_box" : boundingBox
        }
      }
    },
    "aggregations" : {
                "zoom1":{
                    "geohash_grid" : {
                        "field": field,
                        "size": 50000,
                        "precision": precisionFunction( zoom )
                    }
                }
    }
  };
};

module.exports = ElasticRequest;

// "bool": {
//   "must": [
//     { "geo_bounding_box" : boundingBox },
//     { "geo_shape": {
//       "geojson": {
//         "indexed_shape": {
//           "id": 2,
//           "type": "place",
//           "index": "prod_dev_places",
//           "path": "geometry_geojson"
//         }
//       }
//     } }
//   ]
// }
