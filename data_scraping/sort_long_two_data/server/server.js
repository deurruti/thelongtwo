// require express framework,
// node packages request and cheerio
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app     = express();
var year = 2015;

app.get('/sort', function(req, res){
    fs.readFile("../../../long_two_data/" + year, "utf-8", function(err, data){
        if (err) {
            console.log("error: ", err);
        }else{
            var evalData = JSON.parse(data);
            console.log("evalData: ", evalData);
            evalData.sort(sortByProperty('long_two_percent'));
            console.log("evalData after sort: ", evalData);
            fs.writeFile('../../../long_two_data/' + year, JSON.stringify(evalData), function(err){
                if (err) {
                    console.log("error: ", err);
                }
            });
        }
    });
});


// thanks to http://www.levihackwith.com/code-snippet-how-to-sort-an-array-of-json-objects-by-property/
function sortByProperty(property) {
    'use strict';
    return function (a, b) {
        var sortStatus = 0;
        if (a[property] < b[property]) {
            sortStatus = -1;
        } else if (a[property] > b[property]) {
            sortStatus = 1;
        }
 
        return sortStatus;
    };
}
 
//array.sort(sortByProperty('firstName'));


server = app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;