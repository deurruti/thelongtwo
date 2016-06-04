//global variable for year
var yearSelected = 2010; 
var teamSelected = "warriors";

//Code for D3 starts here
//Width and height
var w = 1200;
var h = 1600;

var padding = 50;

// Set ranges for shot chart
var xScale = d3.scale.linear()
    .domain([-400, 400])
    .range([0, w/2]);

var yScale = d3.scale.linear()
    .domain([0, 500])
    .range([h/2 - padding, 0 - padding]);


// Set ranges for season rank
var index = d3.range(30);

var x = d3.scale.linear()
    .domain([0, 100])
    .range([0, w/6]);

var y = d3.scale.ordinal()
    .domain(index)
    .rangeRoundBands([0, h/2], .1);


// Build shot chart
d3.xhr("team_data/" + teamSelected + "/" + yearSelected, function(data) {
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

    console.log(dataset[0]);

    var shot_chart = d3.select("#shot_chart")
        .append("svg")
        .attr("width", w/2 + padding)
        .attr("height", h/2 + padding);

    shot_chart.append("image")
        .attr("xlink:href", "/images/court4.png")
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

//Build season rank list
d3.csv("/outcomes/" + yearSelected + "_outcome.csv", function(data){

    console.log(data);

    var season_rank = d3.select("#season_rank")
        .append("svg")
        .attr("width", w/4 + padding)
        .attr("height", h/2 + padding)
        .append("g");

    var bar = season_rank.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { 
            return "translate(0," + y(i) + ")";
        });

    bar.append("rect")
        .attr("class", "team")
        .attr("height", y.rangeBand())
        .attr("width", w/6)
        .on("mouseover", function(){
            d3.select(this).style("fill","red");
        })
        .on("mouseout", function(){
            d3.select(this).style("fill","steelblue");
        })
        .on("click", function(d, i) {
            updateTeam(d.Team);
        });

    bar.append("text")
        .attr("class", "teamname")
        .attr("text-anchor", "start")
        .attr("x", 40)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d) { 
            console.log(d.Team);
            return d.Team;
        });

    
});

// Updates global year varibale
// Calls functions to update shot chart
// and season rank list
function updateYear(year) {
    yearSelected = year;
    updateShotChart();
    updateSeasonRank();
}

// Updates global team variable
// Calls function to update shot chart
function updateTeam(team) {
    teamSelected = team.toLowerCase();
    updateShotChart();
}

// Transitions Shot Chart
function updateShotChart(){
    console.log("Team: " + teamSelected + "\n");
    console.log("Year: " + yearSelected + "\n");
    // Get the data again
    d3.xhr("/team_data/" + teamSelected + "/" + yearSelected, function(data) {
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
        var shots = d3.select("#shot_chart")
            .selectAll(".shot")
            .data(dataset);

        shots.enter()
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

        shots.transition()
            .duration(2000)
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

        shots.exit().transition()
            .attr("r", 0)
            .remove();
    });
}

// Transitions Season Rank list
function updateSeasonRank(){
    console.log("updating season rank");
    console.log("season" + yearSelected);
    d3.csv("/outcomes/" + yearSelected + "_outcome.csv", function(data){
        console.log(data);

        var transition = d3.select("#season_rank")
        .selectAll(".bar")
        .data(data)
        .transition()
        .duration(2000)
        .delay(function(d, i) {
            return i * 50;
        });

        transition
        .attr("transform", function(d, i) { 
            return "translate(0," + y(i) + ")";
        });

        transition
        .select(".teamname")
        .text(function(d) { 
            console.log(d.Team);
            return d.Team;
        });

    });
}

// Returns true if shot is in long two range
function longtworange(d) {
    if (d.distance <= 22 && d.distance >= 19) {
        return true;
    } else {
        return false;
    }
}