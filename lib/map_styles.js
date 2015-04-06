var MapStyles = { };

MapStyles.proj4 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over";

MapStyles.heatmap = "\
  <Style name='style' comp-op='src-over' image-filters='colorize-alpha(violet, violet, violet, blue, blue, blue, green, green, green, yellow, yellow, yellow, yellow, yellow, orange, orange, orange, red)'>\
    <Rule>\
      <MarkersSymbolizer file='public/marker_10px.png' allow-overlap='true' opacity='0.4' />\
    </Rule>\
  </Style>";

MapStyles.grid = "\
  <Style name='style'>\
    <Rule>\
      <LineSymbolizer stroke='#6e6e6e' stroke-opacity='0.3' />\
      <PolygonSymbolizer fill='#6e6e6e' fill-opacity='0.8' />\
    </Rule>\
  </Style>";

MapStyles.points = "\
  <Style name='style'>\
    <Rule>\
      <MarkersSymbolizer marker-type='ellipse' fill='red' width='5' opacity='0.2' allow-overlap='true' placement='point'/>\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 1)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#1e90ff' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 48222)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#993300' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 47686)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#8b008b' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 47178)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#1e90ff' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 47170)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#ff1493' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 47158)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#ff4500' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 47126)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#73ac13' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 47119)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#ff4500' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 47115)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#ff4500' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 40151)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#1e90ff' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 26036)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#1e90ff' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
    <Rule>\
      <Filter>([iconic_taxon_id] = 20978)</Filter>\
      <MarkersSymbolizer placement='point' marker-type='ellipse' fill='#1e90ff' multi-policy='whole' fill-opacity='1' width='8' stroke='#d8d8d8' stroke-width='1.5' stroke-opacity='1' allow-overlap='true' comp-op='src' />\
    </Rule>\
  </Style>";

MapStyles.mapXML = function( specificStyle ) {
  return "\
    <Map srs='" + MapStyles.proj4 + "' buffer-size='64' maximum-extent='-20037508.34,-20037508.34,20037508.34,20037508.34'>\
      " + specificStyle + "\
    </Map>";
}

module.exports = MapStyles;
