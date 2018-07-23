
//Pull in needed packages
require("dotenv").config();

var query = '';
var useQueryBuilder = true;

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');


//bring in keys from local key file
var keys = require("./keys.js");

//store spotify and twitter keys separately
//var spotify = keys.spotify;
//var client = keys.twitter;

var spotify = new Spotify(keys.spotify); //Use these methods once the calls are live
var client = new Twitter(keys.twitter);



//Read in the command type from liri
var commandList = process.argv
var command = commandList[2];

//See which command was initiated and call the necessary API

if (command == 'my-tweets') {
    appendCommand();
    myTweets();
} else if (command == 'spotify-this-song') {
    appendCommand();
    spotifyThis();
} else if (command == 'movie-this') {
    appendCommand();
    movieThis();
} else if (command == 'do-what-it-says') {
    appendCommand();
    doWhatItSays();
} else {
    invalidInput();
}; //end else if statements

/////////////////////////////////////////////
//Called functions
/////////////////////////////////////////////


function myTweets() {
    var params = { screen_name: 'montypython' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);

            var logData = {};
            var logArray = []

            for (i = 0; i < 20; i++) {
                console.log(tweets[i].created_at + ': ' + tweets[i].text);
                logArray[i] = tweets[i].created_at + ': ' + tweets[i].text +'\n' ;
            }//close for loop

            logData.tweets = logArray;
            appendLogData(logData);
        }
    });

}; //end my tweets function



function spotifyThis() {
    queryBuilder();

    console.log(query);

    if (query == '') {
        query = 'the sign ace of base';
    }

    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var logData = {};
        //console.log(data.tracks.items[0]);
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        logData.Artist = data.tracks.items[0].artists[0].name;
        console.log('Title: ' + data.tracks.items[0].name);
        logData.Title = data.tracks.items[0].name;
        console.log('Release Date: ' + data.tracks.items[0].release_date);
        logData.Release = data.tracks.items[0].release_date
        console.log('Preview: ' + data.tracks.items[0].preview_url);
        logData.PreviewURL = data.tracks.items[0].preview_url;

        appendLogData(logData);

    });
}; // end spotify function



function movieThis() {

    queryBuilder();

    if (query == '') {
        query = 'Mr. Nobody';
    }

    var queryUrl = query.replace(' ', '+');

    queryUrl = "http://www.omdbapi.com/?t=" + queryUrl + "&y=&plot=short&apikey=trilogy"

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieInfo = JSON.parse(body);
            var logData = {};
            console.log('Title: ' + movieInfo.Title);
            logData.Title = movieInfo.Title;
            console.log('Year Released: ' + movieInfo.Year);
            logData.Release = movieInfo.Year;
            console.log('IMDB Rating: ' + movieInfo.Ratings[0].Value);
            logData.IMDBRating = movieInfo.Ratings[0].Value;
            console.log('Rotten Tomatoes Rating: ' + movieInfo.Ratings[1].Value);
            logData.RottenTomatoes = movieInfo.Ratings[1].Value
            console.log('Produced in: ' + movieInfo.Country);
            logData.Produced = movieInfo.Country;
            console.log('Language: ' + movieInfo.Language);
            logData.Language = movieInfo.Language;
            console.log('Summary: ' + movieInfo.Plot);
            logData.Plot = movieInfo.Plot;
            console.log('Actors: ' + movieInfo.Actors);
            logData.Actors = movieInfo.Actors;

            appendLogData(logData);
        }
    });
};// end movie this function

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log('Error: ' + error);
        }

        var randomText = data.split(",");

        command = randomText[0];
        query = randomText[1];

        useQueryBuilder = false;

        if (command == 'my-tweets') {
            myTweets();
        } else if (command == 'spotify-this-song') {
            spotifyThis();
        } else if (command == 'movie-this') {
            movieThis();
        }
    });

};// end do what it says function



function invalidInput() {
    console.log('Please enter a valid command.');
    console.log('Valid commands are: ');
    console.log('my-tweets');
    console.log('spotify-this-song');
    console.log('movie-this');
    console.log('do-what-it-says');
};// end invalid input function



function queryBuilder() {
    if (useQueryBuilder) {
        if (commandList[3] == null) {
            query = '';
        } else {
            for (i = 3; i < commandList.length; i++) {
                query = query + ' ' + commandList[i];
            }
        }
    }
};

function appendCommand() {
    fs.appendFile('logFile.txt', command + ': \n', function (err) {
        if (err) {
            console.log(err);
        } else { }

    });
};

function appendLogData(logData) {
    fs.appendFile('logFIle.txt', JSON.stringify(logData) + '\n', function (err) {
        if (err) {
            console.log(err);
        } else { }

    });
}