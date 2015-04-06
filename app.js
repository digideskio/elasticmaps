var express = require("express");
var routes = require("./routes");
var app = express( );

app.get("/heatmap", routes.heatmap);
app.get("/grid", routes.grid);

var port = Number(process.env.PORT || 4000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
