var MapGenerator = require("./lib/map_generator");

var routes = { };

routes.heatmap = function( req, res ) {
  MapGenerator.heatmapTileRequest( req, res );
};

routes.grid = function( req, res ) {
  MapGenerator.gridTileRequest( req, res );
};

module.exports = routes;
