//Width and height
var w = 1000;
var h = 1000;

var padding = 50;

var dataset = [
                [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
                [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [-9.6,6.1], [200, 260], [213, 160], [200, 400]
              ];



/*d3.json("2010.json", function(data) {
    data.forEach(function(d) {
        d.player_name = d.player_name;
        d.x = +d.x;
        d.y = +d.y;
        // if 0, then made shot
        d.made = +d.made;
        d.opponent = d.opponent;
        d.game_date = d.game_date;
    });*/

    var xScale = d3.scale.linear()
        .domain([-400, d3.max(dataset, function(d) { return d[0]; })])
        .range([10, w/2 + 10]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d[1]; })])
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
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
                return xScale(d[0]);
        })
        .attr("cy", function(d) {
                return yScale(d[1]);
        })
        .attr("r", function(d) {
                //return Math.sqrt(h - d[1]);
                return 2;
        });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
                return d[0] + "," + d[1];
        })
        .attr("x", function(d) {
                return xScale(d[0]);
        })
        .attr("y", function(d) {
                return yScale(d[1]);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");

     svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + w/4 + "," + padding + ")")
        .call(yAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + w/2 + ")")
        .call(xAxis);

//});