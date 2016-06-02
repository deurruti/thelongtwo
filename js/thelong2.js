//global variable for year
var yearSelected = 2010; 
var oldYear;
var dataCopy;
var teamSelected = "Warriors";
//Code for Jquery things 
$(document).ready(function(){

    var years = $(".year"); 
    console.log(years);

    //return the year selected 
    years.click(function(){
        oldYear = yearSelected;
        for(var i = 0; i < years.length; i++){
           console.log(years[i].checked);

           if(years[i].checked === true){
              yearSelected = years[i].value;
              updateBarRank();
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

d3.xhr("../team_data/" + teamSelected + "/" + yearSelected, function(data) {
   	var dataset = eval(data.response);
	dataset.forEach(function(d) {
        d.player_name = d.player_name;
        d.x = +d.x;
        d.y = +d.y;
        if (d.made == 1) {
            d.made = true;
        } else {
            d.made = false;
        }
        // if 1, then made shot
        // d.made = +d.made;
        d.opponent = d.opponent;
        d.game_date = d.game_date;
    });

   //console.log(dataset);
   //console.log(dataset[0]);

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
                if (longtworange(d)){
                    return 4;
                }else{
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


var y;
var index;
var season_rank;
//Initialization this happens once. 
d3.csv("../outcomes/" + yearSelected + "_out.csv", function(data){
    console.log("data is: ", data);

    dataCopy = data;

    //console.log("data copy: ", data_copy); 

    
    //data_one = index.map(d3.random.normal(100, 0));
    index = d3.range(30);

    console.log("index is: ", index);

    var x = d3.scale.linear()
        .domain([0, 100])
        .range([0, w/4]);

    y = d3.scale.ordinal()
        .domain(index) // 30 individual boxes
        //.domain(data.map(function(d) { return d.Rk; }))
        .rangeRoundBands([0, h/2], .1);

    console.log("y is: ", y);

    console.log("y.rangeBands: ", y.rangeBand());

    season_rank = d3.select("#season_rank")
        .append("svg")
        .attr("width",w/4 + padding)
        .attr("height",h/2 + padding)
        .attr("class", "ranks")
        .append("g")
                        
//var bar
    var bar = season_rank.selectAll(".bar")
        .data(data) 
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

    bar.append("rect")
        .attr("height", 15)
        .attr("width", 200)
        //.attr("y", function(d) {return y(d.Rk); })
        .on("mouseover", function(){
            //console.log("here");
            d3.select(this).style("fill","red");
        })
        .on("mouseout", function(){
            //console.log("here");
            d3.select(this).style("fill","steelblue");
        })
        .on("click", function(d, i) {
            d3.select(this).style("fill", "red"); 
            teamSelected = data[i].Team; 
            console.log(data[i].Team); 
            updateData(); 
        });


    bar.append("text")
        .attr("text-anchor", "start")
        .attr("x", 40)
        //.attr("y", function(d) { console.log(d); return y(d.Rk) + 7;})
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d, i) { 
            //console.log(data_copy[i].Team); 
            return data[i].Team ; 
        });
    // goes from 0 - 29 and prints teams

    

});

function updateData() {
    console.log("updating data" + yearSelected);
    // Get the data again
    d3.xhr("../team_data/" + teamSelected + "/" + yearSelected, function(data) {
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
                if (longtworange(d)){
                    return 4;
                }else{
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

function deltaY(data, dataCopy){
    var temp;
    for(var i = 0; i < 30; ++i){
        for(var j = 0; j < 30; ++j){
            //console.log("dataCopy[i].Team: ", dataCopy[i].Team);
            var temp1 = data[j].Team;
            var temp2 = dataCopy[i].Team;
            console.log("temp1: ", temp1 + "temp2: ", temp2);
            if(temp1 === temp2){
                console.log("MATCH");
                if(i < j){
                    // if the new rank is higher than the old rank
                    // subtract
                    console.log("here1");
                    temp = j - i;
                    return  (temp * 16);
                }
                if(i === j){
                    console.log("here2");
                    return 0;
                }
                if(i > j){
                    console.log("here3");
                    temp = i - j;
                    return -1* temp * 16;
                }
            }
        }
    }
    return 0;

        //added i times 16 units 

        // subtracted i times 16

        //added 0 
}


function updateBarRank(){
    

    var dataTemp;
    console.log("here updateBar");
    d3.csv("../outcomes/" + yearSelected + "_out.csv", function(data){
           console.log("data is: ", data);
       dataCopy = data;
       $(".ranks").remove();

    //console.log("data copy: ", data_copy); 

    
    //data_one = index.map(d3.random.normal(100, 0));
    index = d3.range(30);

    console.log("index is: ", index);

    var x = d3.scale.linear()
        .domain([0, 100])
        .range([0, w/4]);

    y = d3.scale.ordinal()
        .domain(index) // 30 individual boxes
        //.domain(data.map(function(d) { return d.Rk; }))
        .rangeRoundBands([0, h/2], .1);

    console.log("y is: ", y);

    console.log("y.rangeBands: ", y.rangeBand());
    
    season_rank = d3.select("#season_rank")
        .append("svg")
        .attr("width",w/4 + padding)
        .attr("height",h/2 + padding)
        .attr("class", "ranks")
        .append("g")
                        
//var bar
    var bar = season_rank.selectAll(".bar")
        .data(data) 
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

    bar.append("rect")
        .attr("height", 15)
        .attr("width", 200)
        //.attr("y", function(d) {return y(d.Rk); })
        .on("mouseover", function(){
            //console.log("here");
            d3.select(this).style("fill","red");
        })
        .on("mouseout", function(){
            //console.log("here");
            d3.select(this).style("fill","steelblue");
        })
        .on("click", function(d, i) {
            d3.select(this).style("fill", "red"); 
            teamSelected = data[i].Team; 
            console.log(data[i].Team); 
            updateData(); 
        });


    bar.append("text")
        .attr("text-anchor", "start")
        .attr("x", 40)
        //.attr("y", function(d) { console.log(d); return y(d.Rk) + 7;})
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".35em")
        .text(function(d, i) { 
            //console.log(data_copy[i].Team); 
            return data[i].Team ; 
        });
    // goes from 0 - 29 and prints teams
   

/*
        dataTemp = data;
        console.log("updated Data");

        data.forEach(function(d){
           d.Rk = +d.Rk;
            //console.log("d.Rk is: " + d.Rk);
        });
        console.log("data is: " , data);
        
        console.log("bar: ", $('.bar'));

        //index.sort(function(a,b){ return y[a]} - y[b]; });
        //y.domain(index)
        console.log("dataCopy is: ", dataCopy);
        var bar = d3.selectAll(".bar");

        bar.each(function(d){
            d3.select(this).attr("transform", function(d, i){
                var temp = y(i) + deltaY(data, dataCopy);
                return "translate(0," + temp + ")";
            });
        });*/

        /*
        bar.transition()
            .duration(2000)
            .each(function(d){
                console.log("this is: ", d3.select(this));
                d3.select(this).attr("transform", function(d, i) { 
                console.log(y(i));
                console.log(i);
                var temp = y(i) + deltaY(data, dataCopy);

                console.log("temp is: ", temp);
                return "translate(0," + temp + ")"; 
            });
            })*/


    });
    //dataCopy = dataTemp;


}

function longtworange(d) {
    if (d.distance <= 22 && d.distance >= 19) {
        return true;
    } else {
        return false;
    }
}