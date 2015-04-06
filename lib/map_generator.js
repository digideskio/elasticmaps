var mapnik = require("mapnik");
var geohash = require("ngeohash");
var SphericalMercator = require("sphericalmercator");
var ElasticRequest = require("./elastic_request");
var MapStyles = require("./map_styles");
var config = require("../config");

// register shapefile plugin
if( mapnik.register_default_input_plugins ) {
  mapnik.register_default_input_plugins( );
}

var merc = new SphericalMercator({ size: config.tileSize });

var MapGenerator = { };

MapGenerator.bboxFromParams = function( req ) {
  return merc.bbox( parseInt(req.query.x),
                    parseInt(req.query.y),
                    parseInt(req.query.z), false, "900913" );
};

MapGenerator.createLayer = function( ) {
  var layer = new mapnik.Layer( "tile", "+init=epsg:4326" );
  layer.styles = [ "style" ];
  return layer;
};

MapGenerator.finishMap = function( res, map, layer, features ) {
  var mem_ds = new mapnik.Datasource({
    type: "csv",
    inline: 'wkt\n"' + features.join('"\n"') + '"'
  })
  layer.datasource = mem_ds;
  map.add_layer( layer );
  var im = new mapnik.Image( config.tileSize, config.tileSize );
  map.render( im, function( err, im ) {
    if( err ) {
      throw err;
      return;
    }
    res.writeHead( 200, {
      "Content-Type": "image/png"
    });
    res.end( im.encodeSync("png") );
  });
};

MapGenerator.heatmapTileRequest = function( req, res ) {
  MapGenerator.gridOrHeatmapTileRequest( "heatmap", req, res );
};

MapGenerator.gridTileRequest = function( req, res ) {
  MapGenerator.gridOrHeatmapTileRequest( "grid", req, res );
};

MapGenerator.gridOrHeatmapTileRequest = function( type, req, res ) {
  var style = (type === "heatmap") ? MapStyles.heatmap : MapStyles.grid;
  var precision = (type === "heatmap") ?
    ElasticRequest.heatmapPrecision : ElasticRequest.gridPrecision;
  MapGenerator.createMapTemplate( req, style, function( map, layer, bbox ) {
    var query = ElasticRequest.elasticQuery( bbox, precision, parseInt(req.query.z) );
    ElasticRequest.search( query, function( result ) {
      if( !result.hits.hits ) {
        throw new Error( "no elastic search results" );
        return;
      }
      console.log( result.took + "ms / " + result.hits.total + " results :: [" + bbox + "]" );
      var grids = [ ];
      result.aggregations.zoom1.buckets.forEach( function( hit ) {
        var grid_bbox = geohash.decode_bbox(hit.key);
        var x1 = grid_bbox[0];
        var y1 = grid_bbox[1];
        var x2 = grid_bbox[2];
        var y2 = grid_bbox[3];
        if( type === "heatmap" ) {
          grids.push( "POINT("+y1+" "+x1+")" );
        } else {
          grids.push( "POLYGON(("+y1+" "+x1+", "+y1+" "+x2+", "+
                                  y2+" "+x2+", "+y2+" "+x1+", "+y1+" "+x1+"))" );
        }
      });
      MapGenerator.finishMap( res, map, layer, grids );
    });
  });
};

MapGenerator.createMapTemplate = function( req, specificStyle, callback ) {
  try {
    var map = new mapnik.Map( config.tileSize, config.tileSize, MapStyles.proj4 );
    var bbox = MapGenerator.bboxFromParams( req );
    var layer = MapGenerator.createLayer( );
    map.extent = bbox;
    map.fromString( MapStyles.mapXML( specificStyle ), { strict: true, base: "./" },
      function( err, map ) {
        if( err ) {
          throw err;
          return;
        }
        callback( map, layer, merc.convert(bbox))
      }
    );
  } catch( err ) {
    res.writeHead( 500, { "Content-Type": "text/plain" } );
    res.end( err.message );
  }
}

// result.hits.hits.forEach( function( hit ) {
//   if( !hit.fields.location ) { return; }
//   coordinates = hit.fields.location[0].split(",")
//   mem_ds.add({
//     "x": parseFloat(coordinates[1]),
//     "y": parseFloat(coordinates[0]),
//     "properties": {
//       "iconic_taxon_id": hit.fields["taxon.iconic_taxon_id"] ?
//         hit.fields["taxon.iconic_taxon_id"][0] : null
//     }
//   });
// });

module.exports = MapGenerator;
