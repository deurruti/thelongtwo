//global variable for year
var yearSelected = 2010; 

//Code for D3 starts here
//Width and height
var w = 1200;
var h = 1200;

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

d3.xhr("../team_data/Warriors/" + yearSelected, function(data) {
   	var dataset = eval(data.response);
	dataset.forEach(function(d) {
        d.player_name = d.player_name;
        d.x = +d.x;
        d.y = +d.y;
        d.distance = +d.distance;
        // if 1, then made shot
        if (d.made == 1) {
            d.made = true;
        } else {
            d.made = false;
        }
        d.opponent = d.opponent;
        d.game_date = d.game_date;
    });

   console.log(dataset);
   console.log(dataset[0]);

    //Create SVG element
    var shot_chart = d3.select("#shot_chart")
    .append("svg")
        .attr("width", w/2 + padding)
        .attr("height", h/2 + padding);

    shot_chart.append("image")
        .attr("xlink:href", "../images/court4.png")
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
            if (longtworange(d)) {
                return 4;
            } else {
                return 2;
            }
        })
        .style("stroke", function(d){
            return "black";
        })
        .style("fill", function(d){
            if (longtworange(d)) {
                if (d.made){
                    return "green";
                } else {
                    return "red";
                }
            } else {
                return "gray";
            }
        });
});

function updateYear(year) {
    yearSelected = year;
    console.log("updating data" + yearSelected);
    // Get the data again
    d3.xhr("../team_data/Warriors/" + yearSelected, function(data) {
        var dataset = eval(data.response);
        dataset.forEach(function(d) {
            d.player_name = d.player_name;
            d.x = +d.x;
            d.y = +d.y;
            d.distance = +d.distance;
            // if 1, then made shot
            if (d.made == 1) {
                d.made = true;
            } else {
                d.made = false;
            }
            d.opponent = d.opponent;
            d.game_date = d.game_date;
        });

        // Select the section to apply change to
        d3.select("#shot_chart")
            .selectAll(".shot")
            .data(dataset)
            .transition()
            .duration(3000)
            .attr("cx", function(d) {
                return xScale(d.x);
            })
            .attr("cy", function(d) {
                    return yScale(d.y);
            })
            .attr("r", function(d) {
                if (longtworange(d)) {
                    return 4;
                } else {
                    return 2;
                }
            })
            .style("stroke", function(d){
                return "black";
            })
            .style("fill", function(d){
                if (longtworange(d)) {
                    if (d.made){
                        return "green";
                    } else {
                        return "red";
                    }
                } else {
                    return "gray";
                }
            });

    });
}

function longtworange(d) {
    if (d.distance <= 22 && d.distance >= 19) {
        return true;
    } else {
        return false;
    }
}