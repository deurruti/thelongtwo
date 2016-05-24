// This app is powered by ExpressJS on top of NodeJs.

// The guide for this scraping can be found here
// https://scotch.io/tutorials/scraping-the-web-with-node-js

// require express framework,
// node packages request and cheerio
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app     = express();
var yearToWrite = 2015;
var teamWeAreScraping;
var server;


// navigate to localhost:8188/scrape
// to begin scraping from NBASavant API.
app.get('/scrape', function(req, res){
   
   url = "http://nbasavant.com/ajax/getShotsCompare.php?ids=1610612764%7C&st=&q1=&q2=&sza=&szb=&sd1=&ed1=&sd2=&ed2=&szr=&y1=2014&y2=2014&dgt=&dlt=&defdistgt1=&defdistlt1=&defdistgt2=&defdistlt2=&team=&min_gt=&min_lt=&sec_gt=&sec_lt=&shot_made=&shot_made_p2=&sp=false&gb1=player&gb2=player&_=1464124818705"
   
   
   // grab the API URL for the team we are getting data
   // for and set that team's name for this variable
   // this variable will be used in finding location to save data.
   teamWeAreScraping = "wizards";
   
   
   // break the URL up to automate grabbing data for all
   // years (2010 -> 2015) for some particular team.
   var urlBeforeYear = url.substring(0, 110);
   console.log("urlBeforeYear: " + urlBeforeYear);   
   console.log(urlBeforeYear.length);   
   var theYear;      
   var urlAfterYear = url.substring(118, url.length);
   console.log("urlAfterYear: " +urlAfterYear);
   
   var urlList = [];
   var results = [];
   
   
   // construct all of the URLs for data scraping
   // where each URL specifies a year/season of data.
   for(var i = 2010; i < 2016; i++){
      theYear = "&y1=" + i;
      console.log("theYear: " + theYear);
      
      url = urlBeforeYear + theYear + urlAfterYear;
      urlList.push(url);
   }
   if(urlList){
      syncCalls(urlList);
   }
   
})

// we want to synchronize the URL calls so that we can
// keep track of proper files to save data to.
// this is a recursive function that takes a list of URLs.
// As long as a URL is available to pop from urls array,
// we recurse on syncCalls. Once we are out of URLs from
// urls array, we can exit. Recursion is necessary
// in order to synchronize otherwise asynchronous URL calls
// for the purposes of writing to the correct year file.
function syncCalls(urls){
   url = urls.pop();
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
                     
        $('script').filter(function(){
           var j = yearToWrite;
           
           
           var data = $(this);
           console.log("type of data is: " +typeof(data));
           
           // take object response and convert to string
           var dataString = " " + data;
           
           
           // position n is the position of the closing
           // bracket for the JSON data.
           var n = dataString.indexOf("]");
           //console.log("n is: " + n);
           
           //console.log("beginning: " + dataString.substring(25, 30));
           
           //console.log("substring: " + dataString.substring(25, n-1));
           
           // position 25 is where the actual JSON data starts,
           // so we take the substring from 25 up to position n,
           // where position n is the indexOf("]"), the closing
           // brackets for the JSON data.
           
           var jsonStats = dataString.substring(25, n-1);
           
           // append closing bracket for the JSON data.
           jsonStats = jsonStats + "]";
           
           //console.log(jsonStats);
           console.log(jsonStats.substring(0, 75));
           
           var fileToWrite = "team_data/" + teamWeAreScraping + "/" + j;
           console.log("fileToWrite: " + fileToWrite);
           fs.writeFile(fileToWrite, jsonStats, function(err){
              if (err){
                 return console.log(err);  
              }
              console.log("The file was saved!");
              yearToWrite--;
              
              // still have URLs to make requests to.
              if(urls.length > 0){
                 syncCalls(urls);   
              }else{
                  server.close();  
              }
           });
           
           //console.log("jsonStats: " + jsonStats);
        });
        
        
        
        
     }else{
        // unsuccessful request
        console.log("an error has occurred: " +error);  
            
     }
   });    
}

server = app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;