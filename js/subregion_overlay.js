<script>

//add leaflet layer. Sydney
// var southWest = L.latLng(-34.642247,151.674099),
//     northEast = L.latLng(-32.858825,148.61991),
//     bounds = L.latLngBounds(southWest, northEast);
// var map = new L.Map("map", 
//             {center: [-33.706063,150.125027] ,
//               zoom:8,
//               maxBounds: bounds,
//               maxZoom: 11,
//               minZoom: 7
//             })
//     .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/ayamsgsep.jn5k6922/{z}/{x}/{y}.png"));

//Oz
//OZ
var southWest = L.latLng(-44.653024,157.757263),
    northEast = L.latLng(-8.320212,112.098083),
    bounds = L.latLngBounds(southWest, northEast);
var map = new L.Map("map", {center: [-26.431228,133.667908], zoom: 5, maxBounds: bounds})
    .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/ayamsgsep.jn5k6922/{z}/{x}/{y}.png"));

var stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
  attribution: 'Labour Markets by <a href="http://www.sgsep.com.au">SGS</a> | Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
}).addTo(map);


//set colour scale
var color = d3.scale.category20b();

var div = d3.select("body").append("div") 
    .attr("class", "tooltip");  

// var div2 = d3.select("body").append("div").attr("class", "table");    

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

d3.json("https://dl.dropboxusercontent.com/u/13024394/SA2/satwo.json", function(error, satwo) {
  // if (error) return console.error(error);
  console.log(satwo);

    var bounds = d3.geo.bounds(topojson.feature(satwo, satwo.objects.satwoGeojson));
      path = d3.geo.path().projection(project);

//     ////////////
  var feature = g.selectAll("path")
                .data(topojson.feature(satwo, satwo.objects.satwoGeojson).features)
                .enter().append("path")
                .attr("class","path")
                .attr("d", path)
                .style("fill", function(d) { 
                    if(d.properties.SEA==null){
                        return "#f0f0f0";
                    }
                    else{
                        return color(((d.properties.SEA)%19+1));
                      }
                    })
      .style("stroke-width",0)
      .style("opacity",0.4)
      .on("mouseover", function(d){
        // console.log(d.id)
        d3.select(this)
        .style("opacity",0.5)
        .style("stroke","#fff")
        .style("stroke-width", .1)
        div.transition()    
          .duration(500)    
          .style("opacity", .9);
        div.html("<h1>"+"SUBMARKET "+d.properties.SEA+"</h1>"
          +"<h3>"+"( "+d.id+")"+"</h3>"
          +"<p>"+"Self-containment: "+"</p>"+"<h1>"+d3.format("%")(d.properties.SEA48_Self/d.properties.SEA48_Tota)+"</h1>"
          +"<p>"+"Total migrations: "+"<p>"+"<h2>"+d3.format(",")(d.properties.SEA48_Tota)+"</h2>"
          +"<p>"+"Self contained migrations: "+"</p>"+"<h2>"+d3.format(",")(d.properties.SEA48_Self)+"</h2>")
          .style("left", (d3.event.pageX)- 40 +"px")
          .style("top", (d3.event.pageY)+30 + "px");  
      })
      .on("mouseout", function(d){
        d3.select(this)
        .style("opacity",function(d){
          return 0.4  
        })
        .style("stroke","#808080")
        .style("stroke-width",0)
        div.transition()
          .duration(500)    
          .style("opacity", 0);
        div.html("")
      })
     
      map.on("viewreset", reset);
      reset();

      function reset(){
        var bottomLeft = project(bounds[0]),
        topRight = project(bounds[1]);

        svg .attr("width", topRight[0] - bottomLeft[0])
        .attr("height", bottomLeft[1] - topRight[1])
        .style("margin-left", bottomLeft[0] + "px")
        .style("margin-top", topRight[1] + "px");

        g   .attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

      feature.attr("d", path);
      }

  function project(x) {
    var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  } 

// var SHA_sydney = [1,11,12,13,14,15,16,17,18,19,20,21,22];

function tabulate (data, columns) {
  var div2 = d3.select("body").append("div").attr("class", "table");
        thead = table.append("thead"),
        tbody = table.append("tbody");

        thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

  var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });
    
    return table;
}

});
</script>
