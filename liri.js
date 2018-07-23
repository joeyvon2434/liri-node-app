
//Pull in needed packages
require("dotenv").config();

var query = '';

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');


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
    myTweets();
} else if (command == 'spotify-this-song') {
    spotifyThis();
} else if (command == 'movie-this') {
    movieThis();
} else if (command == 'do-what-it-says') {
    doWhatItSays();
} else {
    invalidInput();
}; //end else if statements

/////////////////////////////////////////////
//Called functions
/////////////////////////////////////////////


function myTweets() {
    var params = { screen_name: 'JosephVonEdwins' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);

            for (i = 0; i < 2; i++) {
                console.log(tweets[i].created_at + ': ' + tweets[i].text);
            }//close for loop
        }
    });

}; //end my tweets function



function spotifyThis() {
    queryBuilder() ;

    if (query == '') {
        query = 'the sign ace of base';
    }

    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //console.log(data.tracks.items[0]);
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('Title: ' + data.tracks.items[0].name);
        console.log('Release Date: ' + data.tracks.items[0].release_date);
        console.log('Preview: ' + data.tracks.items[0].preview_url);

    });
}; // end spotify function



function movieThis() {
    console.log('movie');
};// end movie this function



function doWhatItSays() {
    console.log('do what');
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

    if (commandList[3] == null) {
        query = '';
    } else {
        for (i = 3; i < commandList.length; i++) {
            query = query + ' ' + commandList[i];
        }
    }
};