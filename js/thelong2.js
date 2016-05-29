//global variable for year
var yearSelected = 2010; 
var teamSelected = "warriors";
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

        updateData();
    });

});

//Code for D3 starts here
//Width and height
var w = 1000;
var h = 1000;

var padding = 50;

// Set ranges
var xScale = d3.scale.linear()
    .domain([-400, 400])
    .range([0, w/2]);

var yScale = d3.scale.linear()
    .domain([0, 500])
    .range([h/2 - padding, 0 - padding]);

// Define axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

d3.xhr("team_data/" + teamSelected + "/" + yearSelected, function(data) {
   	var dataset = eval(data.response);
	dataset.forEach(function(d) {
        d.player_name = d.player_name;
        d.x = +d.x;
        d.y = +d.y;
        // if 1, then made shot
        d.made = +d.made;
        d.opponent = d.opponent;
        d.game_date = d.game_date;
    });

   console.log(dataset);
   console.log(dataset[0]);

    //Create SVG element
        /*
     var season_rank = d3.select("#season_rank")
        .append("svg")
        .attr("width", w/2 + padding)
        .attr("height", h/2 + padding); 

   */
    //season_rank.append("image")

    var shot_chart = d3.select("#shot_chart")
    .append("svg")
        .attr("width", w/2 + padding)
        .attr("height", h/2 + padding);

    shot_chart.append("image")
        .attr("xlink:href", "images/court4.png")
        .attr("width", w/2)
        .attr("height", h/2);

    shot_chart.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "shot")
        .attr("cx", function(d) {
                return xScale(d.x);
        })
        .attr("cy", function(d) {
                return yScale(d.y);
        })
        .attr("r", function(d) {
                return 2;
        });
});



d3.csv("outcomes/2010_outcome.csv", function(data){
    console.log("data is: ", data);

    var data_copy = data;

    var index = d3.range(30),
    data_one = index.map(d3.random.normal(100, 0));

    var x = d3.scale.linear()
        .domain([0, 100])
        .range([0, w/4]);

    var y = d3.scale.ordinal()
        .domain(index)
        .rangeRoundBands([0, h/2], .1);

    var season_rank = d3.select("#season_rank")
                        .append("svg")
                        .attr("width",w/4 + padding)
                        .attr("height",h/2 + padding)
                        .append("g")
                        

        var bar = season_rank.selectAll(".bar")
            .data(data_one)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

    bar.append("rect")
        .attr("height", y.rangeBand())
        .attr("width", x)
        .on("mouseover", function(){
            console.log("here");
            d3.select(this).style("fill","red");
        })
        .on("mouseout", function(){
            console.log("here");
            d3.select(this).style("fill","steelblue");
        })
        .on("click", function(d, i) { teamSelected = data_copy[i].Team; console.log(data_copy[i].Team); updateData(); });


    bar.append("text")
        .attr("text-anchor", "start")
        .attr("x", 40)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d, i) { console.log(data_copy[i].Team); return data_copy[i].Team; });

    

});

function updateData() {
    console.log("updating data" + yearSelected);
    // Get the data again
    d3.xhr("team_data/" + teamSelected + "/" + yearSelected, function(data) {
        var dataset = eval(data.response);
        dataset.forEach(function(d) {
            d.player_name = d.player_name;
            d.x = +d.x;
            d.y = +d.y;
            // if 1, then made shot
            d.made = +d.made;
            d.opponent = d.opponent;
            d.game_date = d.game_date;
        });

        // Select the section to apply change to
        d3.select("#shot_chart")
            .selectAll(".shot")
            .data(dataset)
            .transition()
            .duration(2000)
            
            .attr("cx", function(d) {
                return xScale(d.x);
            })
            .attr("cy", function(d) {
                    return yScale(d.y);
            })
            .attr("r", function(d) {
                    return 2;
            });

    });
}