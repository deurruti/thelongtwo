//global variable for year
var yearSelected = 2010; 
var teamSelected = "warriors";
var prevTeam = "warriors";
var prevTeamElement;
var prevTeamElementShot;
var prevTeamElementLong;
var elementSelected;

//Code for D3 starts here
//Width and height
var w = 1050;
var h = 1000;

var padding = 50;

// Set ranges for shot chart
var xScale = d3.scale.linear()
    .domain([-450, 450])
    .range([0, w/2]);

var yScale = d3.scale.linear()
    .domain([0, 450])
    .range([h/2 - padding, 0 - padding]);


// Set ranges for season rank
var index = d3.range(30);

var x = d3.scale.linear()
    .domain([0, 100])
    .range([0, w/6]);

var y = d3.scale.ordinal()
    .domain(index)
    .rangeRoundBands([0, h/2], .1);

var shot_chart, season_rank, longtwo_rank;

$(document).ready(function(){

    shot_chart = d3.select("#shot_chart");

    season_rank = d3.select("#season_rank")
        .append("svg")
        .attr("width", w/4 + padding)
        .attr("height", h/2)
        .append("g")
        .attr("class", "season_rank_g");

    longtwo_rank = d3.select("#longtwo_rank")
        .append("svg")
        .attr("width", w/4 + padding)
        .attr("height", h/2)
        .append("g")
        .attr("class", "long_two_g");

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
                d.made = "Yes";
            } else {
                d.made = "No";
            }
            d.opponent = d.opponent;
            d.game_date = d.game_date;
        });

        console.log(dataset[0]);

        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .style("opacity", 0)
            .style("background", "#F5F5F5")
            .style("z-index", 20)
            .style("position", "absolute")
            .html(function(d) {
                return "Shot by: " + d.player_name + "<br>" + "Distance: " + d.distance + "<br>" + "Made: " + d.made
            });
        
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
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .style("stroke", function(d){
                return "black";
            })
            .style("fill", function(d){
                if (longtworange(d)) {
                    if (d.made === "Yes"){
                        return "#4daf4a";
                    } else {
                        return "#e41a1c";
                    }
                } else {
                    return "gray";
                }
            });

        shot_chart.call(tip);
    });

    //Build season rank list
    d3.csv("outcomes/" + yearSelected + "_outcome.csv", function(data){
        
        console.log(data);

        var bar = season_rank.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", function(d, i) {
                console.log(i);
                return "translate(0," + y(i) + ")";
            });

        bar.append("rect")
            .attr("class", "team")
            .attr("height", y.rangeBand())
            .attr("width", w/7)
            .attr("fill", function(d){
                console.log("d.team.toLowerCase: ", d.Team.toLowerCase());
                if(d.Team.toLowerCase() === teamSelected){
                    prevTeamElement = d3.select(this);
                    prevTeamElementShot = d3.select(this);
                    console.log("match season rank");
                    return "#ff7f00";
                }else{
                    return "#377eb8";
                }
            })
            .on("mouseover", function(d){
                if(d.Team.toLowerCase() === teamSelected){
                   d3.select(this).style("fill", "#ff7f00"); 
                }else{
                   d3.select(this).style("fill","#7eaacd");  
                }
                
            })
            .on("mouseout", function(d){
                if(d.Team.toLowerCase() === teamSelected){
                    d3.select(this).style("fill", "#ff7f00");
                }else{
                    console.log("d.Team is: ", d.Team);
                    console.log("teamSelected: ", teamSelected);
                    d3.select(this).style("fill","#377eb8");  
                }
                
            })
            .on("click", function(d, i) {
                d3.select(this).style("fill", "#ff7f00")
                prevTeamElement.style("fill", "#377eb8");
                var longRankElement = $(".long_two_g");
                var seasonRankElement = $(".season_rank_g");
                // iterate through season w/l rankings
                for(var i = 0; i < longRankElement[0].children.length; ++i){
                    var currentIteration = longRankElement[0].children[i].__data__.team.toLowerCase();
                    
                    // if teamName selected in long two chart is found in
                    // season rankings
                    if(currentIteration === d.Team.toLowerCase()){
                        // update the fill style to reflect selection
                        console.log("okay: ", longRankElement[0].children[i].children[0].style);
                        longRankElement[0].children[i].children[0].style.fill = "#ff7f00";
                        //prevTeamElementLong.style("fill", "#377eb8");
                        //prevTeamElementShot.style("fill", "#377eb8");
                    }else{
                        longRankElement[0].children[i].children[0].style.fill = "#377eb8";
                    }
                    console.log("seasonRankElement[0] child: ", longRankElement[0].children[i].__data__.team);
                }
            
                // iterate through season w/l rankings
                for(var i = 0; i < seasonRankElement[0].children.length; ++i){
                    var currentIteration = seasonRankElement[0].children[i].__data__.Team.toLowerCase();
                    seasonRankElement[0].children[i].children[0].style.fill = "#377eb8";

                    console.log("seasonRankElement[0] child: ", seasonRankElement[0].children[i].__data__.Team);
                }
                prevTeamElement = d3.select(this);
                //elementSelected = d3.select(this);
                console.log("season_rank.click: ", d.Team);
                teamSelected = d.Team;
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

    d3.csv("long_two_data/csv_sorted/" + yearSelected + ".csv", function(data){

        var bar = longtwo_rank.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", function(d, i) { 
                return "translate(0," + y(i) + ")";
            });

        bar.append("rect")
            .attr("class", "team2")
            .attr("height", y.rangeBand())
            .attr("width", w/7)
            .attr("fill", function(d){
                console.log("d.team: append: ", d.team.toLowerCase());
                if(d.team.toLowerCase() === teamSelected){
                    prevTeamElementLong = d3.select(this);
                    return "#ff7f00";
                }else{
                    return "#377eb8";
                }
            })
            .on("mouseover", function(d){
                if(d.team.toLowerCase() === teamSelected){
                   d3.select(this).style("fill", "#ff7f00"); 
                }else{
                   d3.select(this).style("fill","#7eaacd");  
                }
            })
            .on("mouseout", function(d){
                if(d.team.toLowerCase() === teamSelected){
                    d3.select(this).style("fill", "#ff7f00");
                }else{
                    console.log("d.Team is: ", d.team);
                    console.log("teamSelected: ", teamSelected);
                    d3.select(this).style("fill","#377eb8");  
                }
            })
            .on("click", function(d, i) {
                console.log("d.team: ", d.team);
                d3.select(this).style("fill", "#ff7f00")
                
                console.log("PREVIOUS: ", prevTeamElement[0][0].style);
                prevTeamElement[0][0].style.fill = "#377eb8";
                prevTeamElement.style("fill", "#377eb8");
                
                var seasonRankElement = $(".season_rank_g");
                // iterate through season w/l rankings
                for(var i = 0; i < seasonRankElement[0].children.length; ++i){
                    var currentIteration = seasonRankElement[0].children[i].__data__.Team.toLowerCase();
                    
                    // if teamName selected in long two chart is found in
                    // season rankings
                    if(currentIteration === d.team.toLowerCase()){
                        // update the fill style to reflect selection
                        console.log("okay: ", seasonRankElement[0].children[i].children[0].style);
                        seasonRankElement[0].children[i].children[0].style.fill = "#ff7f00";
                        //prevTeamElementLong.style("fill", "#377eb8");
                        //prevTeamElementShot.style("fill", "#377eb8");
                    }else{
                        seasonRankElement[0].children[i].children[0].style.fill = "#377eb8";
                    }
                    console.log("seasonRankElement[0] child: ", seasonRankElement[0].children[i].__data__.Team);
                }
            
                var longRankElement = $(".long_two_g");
                // iterate through season w/l rankings
                for(var i = 0; i < longRankElement[0].children.length; ++i){
                    var currentIteration = longRankElement[0].children[i].__data__.team.toLowerCase();
                    
                    longRankElement[0].children[i].children[0].style.fill = "#377eb8";
                    console.log("seasonRankElement[0] child: ", longRankElement[0].children[i].__data__.team);
                }            
                console.log("seasonrank[0]: ", seasonRankElement[0].children);
                console.log("seasonRankElement: ", seasonRankElement);
                //prevTeamElement.style("fill", "#377eb8");
                prevTeamElement = d3.select(this);
                prevTeamElementLong = d3.select(this);
                elementSelected = d3.select(this);
                //elementSelected.style.fill = "#7eaacd";
                teamSelected = d.team;
                updateTeam(d.team);
            });

        bar.append("text")
            .attr("class", "teamname")
            .attr("text-anchor", "start")
            .attr("x", 40)
            .attr("y", y.rangeBand() / 2)
            .attr("dy", ".35em")
            .text(function(d) { 
                console.log(d.team);
                return d.team;
            });
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
    console.log("update team: ", team);
    if (team === "Trail Blazers") {
        teamSelected = "blazers";
    } else {
        teamSelected = team.toLowerCase();
    }
    updateShotChart();
}

// Transitions Shot Chart
function updateShotChart(){
    console.log("Team: " + teamSelected + "\n");
    console.log("Year: " + yearSelected + "\n");
    console.log("teamSelected in updateShotChart: ", teamSelected);
    //elementSelected.style("fill", "#7eaacd");
    // Get the data again
    d3.xhr("../team_data/" + teamSelected + "/" + yearSelected, function(data) {
        elementSelected.style("fill", "#ff7f00");
        var dataset = eval(data.response);

        dataset.forEach(function(d) {
            d.player_name = d.player_name;
            d.x = +d.x;
            d.y = +d.y;
            d.distance = +d.distance;
            // if 1, then made shot
            if (d.made == 1) {
                d.made = "Yes";
            } else {
                d.made = "No";
            }
            d.opponent = d.opponent;
            d.game_date = d.game_date;
        });

        // Select the section to apply change to
        var shots = shot_chart
            .selectAll(".shot")
            .data(dataset);

        shots.enter()
            .append("circle")
            .attr("class", "shot")
            .transition()
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
                    if (d.made === "Yes"){
                        return "#4daf4a";
                    } else {
                        return "#e41a1c";
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
                    if (d.made === "Yes"){
                        return "#4daf4a";
                    } else {
                        return "#e41a1c";
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

// Transitions Rank lists
function updateSeasonRank(){
    console.log("updating season rank");
    console.log("season" + yearSelected);
    d3.csv("../outcomes/" + yearSelected + "_outcome.csv", function(data){
        console.log(data);
        

        var transition = season_rank
        .selectAll(".bar")
        .data(data)
        .transition()
        .duration(2000);
        var seasonRankElement = $(".season_rank_g");
        // iterate through season w/l rankings
        for(var i = 0; i < seasonRankElement[0].children.length; ++i){
            var currentIteration = seasonRankElement[0].children[i].__data__.Team.toLowerCase();

            // if teamName selected in long two chart is found in
            // season rankings
            if(currentIteration === teamSelected){
                // update the fill style to reflect selection
                console.log("okay: ", seasonRankElement[0].children[i].children[0].style);
                seasonRankElement[0].children[i].children[0].style.fill = "#ff7f00";
                //prevTeamElementLong.style("fill", "#377eb8");
                //prevTeamElementShot.style("fill", "#377eb8");
            }else{
                seasonRankElement[0].children[i].children[0].style.fill = "#377eb8";
            }
            console.log("seasonRankElement[0] child: ", seasonRankElement[0].children[i].__data__.Team);
        }

        transition
            .select(".team");

        transition
            .select(".teamname")
            .text(function(d) { 
                console.log(d.Team);
                return d.Team;
            });

    });

    // Transitions Long Two Rank List
    d3.csv("../long_two_data/csv_sorted/" + yearSelected + ".csv", function(data){
        var longRankElement = $(".long_two_g");
        var seasonRankElement = $(".season_rank_g");

        
        
        var transition = longtwo_rank
        .selectAll(".bar")
        .data(data)
        .transition()
        .duration(2000);
        
        // iterate through season w/l rankings
        for(var i = 0; i < longRankElement[0].children.length; ++i){
            var currentIteration = longRankElement[0].children[i].__data__.team.toLowerCase();

            // if teamName selected in long two chart is found in
            // season rankings
            if(currentIteration === teamSelected){
                // update the fill style to reflect selection
                console.log("okay: ", longRankElement[0].children[i].children[0].style);
                longRankElement[0].children[i].children[0].style.fill = "#ff7f00";
                //prevTeamElementLong.style("fill", "#377eb8");
                //prevTeamElementShot.style("fill", "#377eb8");
            }else{
                longRankElement[0].children[i].children[0].style.fill = "#377eb8";
            }
            console.log("seasonRankElement[0] child: ", longRankElement[0].children[i].__data__.team);
        }

        transition
            .select(".team2");

        transition
            .select(".teamname")
            .text(function(d) { 
                console.log(d.team);
                return d.team;
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

