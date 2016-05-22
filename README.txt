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