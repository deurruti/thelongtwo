Members : 

##Daniel Urrutia (deurruti@ucsc.edu). 


Web/data scraping is done using JavaScript via NodeJS & ExpressJS
	
ExpressJS is the web framework that sits on top of the NodeJS backend

Cheerio is a node package that allows you to use jquery
on the server side JS (server.js).

Request is a node package that allows you to perform the API call
to NBASavant.

You must have NodeJS installed on your computer to run this.
https://nodejs.org/en/download/

Node modules such as the ExpressJS framework, Request, and Cheerio
are already apart of this project. You just need to install NodeJS.

Once NodeJS is installed, you can run this project's web scraper by:
	navigate to project root and type
	"node server/server.js"

This will run server.js on localhost port 8081.

To trigger the API request and subsequent web/data scraping,
go to http://localhost:8081/scrape. You will see output
in the console/terminal you launched the node server on.

See server.js comments for more details on the call/response
on NBASavant's API.

We are utilizing the API URL that NBASavant client-side uses
to pull data from the server. This URL takes different arguments
specifying the team, season, etc. The response from this URL
contains all the data we need (team, player, shot location
in x-, y-coordinates) in JSON format.


How to use script:

1) You must grab the NBASavant API URL for the specific team you are
trying to scrape data from. This URL will go in the "url" variable

2) You must supply the name of the team you are scraping data from
in the variable "teamWeAreSraping". This is done for file writing
purposes so that the stats are written to the correct team folders.

3) Run the script as described above, navigate to localhost:8081/scrape
and watch the command line. After the command line has finished writing
2010 stats, you can go ahead and kill the server (CTRL-C). The data
will be written at that point inside of the folder "team_data"
