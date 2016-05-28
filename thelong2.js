//global variable for year
var yearSelected ; 

//Code for Jquery things 
$(document).ready(function(){

var years = $(".year"); 
console.log(years);

//return the year selected 
years.click(function(){

for(var i = 0; i < years.length; i++){
   console.log(years[i].checked);

   if(years[i].checked === true){
      yearSelected = years[i].value;
      console.log(yearSelected);
   }
}
});

});

//Code for D3 starts here
//Width and height
var w = 1000;
var h = 1000;

var padding = 50;

var dataset = [
                [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
                [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [-9.6,6.1], [200, 260], [213, 160], [200, 400]
              ];
//d3.xhr("team_data/76ers/2010", function(data) {
//    console.log(data);
//        var dataset = data.response;
    warriors_2010_data.forEach(function(d) {
        d.player_name = d.player_name;
        d.x = +d.x;
        d.y = +d.y;
        // if 1, then made shot
        d.made = +d.made;
        d.opponent = d.opponent;
        d.game_date = d.game_date;
    });

//    console.log(dataset);
//    console.log(dataset[0]);

    var xScale = d3.scale.linear()
        .domain([-395, 395])
        .range([0, w/2]);

    var yScale = d3.scale.linear()
        .domain([0, 500])
        .range([h/2 - padding, 0 - padding]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
                //.ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
        //.ticks(5);

    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w/2 + padding)
        .attr("height", h/2 + padding);

    svg.append("image")
        .attr("xlink:href", "court4.png")
        .attr("width", w/2)
        .attr("height", h/2);

    svg.selectAll("circle")
        .data(warriors_2010_data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
                return xScale(d.x);
        })
        .attr("cy", function(d) {
                return yScale(d.y);
        })
        .attr("r", function(d) {
                //return Math.sqrt(h - d[1]);
                return 2;
        });

//    svg.selectAll("text")
//        .data(warriors_2010_data)
//        .enter()
//        .append("text")
//        .text(function(d) {
//                return d.x + "," + d.y;
//        })
//        .attr("x", function(d) {
//                return xScale(d.x);
//        })
//        .attr("y", function(d) {
//                return yScale(d.y);
//        })
//        .attr("font-family", "sans-serif")
//        .attr("font-size", "11px")
//        .attr("fill", "red");

     svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + w/4 + "," + padding + ")")
        .call(yAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + w/2 + ")")
        .call(xAxis);

//});