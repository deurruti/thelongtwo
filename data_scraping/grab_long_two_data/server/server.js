// require express framework,
// node packages request and cheerio
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app     = express();
var allTeams = [];
var teamLongTwo = [];
var years = [2010, 2011, 2012, 2013, 2014, 2015];
/*var teams = ['76ers', 'blazers', 'bucks', 'bulls', 'cavaliers',
             'celtics', 'clippers', 'grizzlies', hawks', 'heat', 'hornets',
             'jazz', 'kings', 'knicks', 'lakers', 'magic',
             'mavericks', 'nets', 'nuggets', 'pacers', 'pistons',
             'raptors', 'rockets', 'spurs', 'suns', 'thunder', 'timberwolves',
             'warriors', 'wizards'];*/
var team = "wizards";
//var originalLength = teams.length;

app.get("/scrape", function(req, res){

    getLongTwoData();
    console.log("retured");



});

/*
function iterateTeams(){
    
}*/

function getLongTwoData(){
    var year = years.pop();
    fs.readFile('../../../team_data/' +team + '/' + year, 'utf-8', function(err, data){
        if(err){
            console.log("error: ", err);
        }else{
            //console.log("data: ", data);
            var evaluatedData = eval(data);
            //console.log("evaluatedData: ", evaluatedData);
            //console.log("evaluateData[0]: ", evaluatedData[0]);
            var longTwoObject = {
                "team": team,
                "year": year,
                "total_attempted": 0,
                "long_two_attempted": 0,
                "long_two_percent": 0
            }
            for(var i = 0; i < evaluatedData.length; ++i){
                longTwoObject.total_attempted++;
                if(longtworange(evaluatedData[i])) longTwoObject.long_two_attempted++;
            }
            longTwoObject.long_two_percent = (longTwoObject.long_two_attempted /
                                                longTwoObject.total_attempted) * 100;
            longTwoObject.long_two_percent = longTwoObject.long_two_percent.toFixed(1);
            longTwoObject.long_two_percent = parseFloat(longTwoObject.long_two_percent);
            //console.log("longTwoObject: ", longTwoObject);
            teamLongTwo.push(longTwoObject);
            //console.log("teamLongTwo: ", teamLongTwo);
            if(years.length != 0){
                console.log("teamLongTwo: ", teamLongTwo);
                getLongTwoData();
            }else{
                var orderByYear = teamLongTwo.reverse();
                console.log("rightOrder: ", orderByYear);
                years = [2010, 2011, 2012, 2013, 2014, 2015];
                writeToYearFile(orderByYear);
                //allTeams.push(orderByYear);
                return;
            }
        }
    });        
}

function writeToYearFile(teamData){
    var year = years.pop();
    var index = year % 10;
    var dataToWrite = JSON.stringify(teamData[index]);
    fs.appendFile("../../../long_two_data/" + year, dataToWrite + ',\n', function(err){
        if (err) {
            console.log("error: ", err);
        }
        if (years.length != 0){
            writeToYearFile(teamData);
        } else {
            server.close();
            return;
        }

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

server = app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;