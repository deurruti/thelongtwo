// This app is powered by ExpressJS on top of NodeJs.

// The guide for this scraping can be found here
// https://scotch.io/tutorials/scraping-the-web-with-node-js

// require express framework,
// node packages request and cheerio
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


// navigate to localhost:8188/scrape
// to begin scraping from NBASavant API.
app.get('/scrape', function(req, res){
   //All the web scraping magic will happen here
   
   
   // test URL for now that retrieves Lakers shot chart info
   // for 2010->2011 season
   url = "http://nbasavant.com/ajax/getShotsCompare.php?ids=1610612747%7C&st=&q1=&q2=&sza=&szb=&sd1=&ed1=&sd2=&ed2=&szr=&y1=2010&y2=2014&dgt=&dlt=&defdistgt1=&defdistlt1=&defdistgt2=&defdistlt2=&team=&min_gt=&min_lt=&sec_gt=&sec_lt=&shot_made=&shot_made_p2=&sp=false&gb1=player&gb2=player&_=1463886691041"
 
   // perform the request.
   request(url, function(error, response, html){
     if(!error){
        // successful request.
        
        // cheerio.load(html) loads the entirety
        // of the API response (an html page) into
        // the variable $.
        //
        // We use the variable $ because we are using
        // a node package called cheerio that lets you use
        // jquery syntax on the server side, allowing us to 
        // easily select for the dom element we want (data inside
        // <script> </script>).
        // so $ contains the entirety of the HTML reponse.
        var $ = cheerio.load(html);
        
     }else{
        // unsuccessful request
        console.log("an error has occurred: " +error);  
            
     }
     });
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;