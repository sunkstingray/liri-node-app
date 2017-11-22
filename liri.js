var twitterKeys = require('./keys')
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');


var liriCommands = process.argv[2];
var songMovie = process.argv[3];

writeFile("\n \n" + process.argv);

commandSwitch(liriCommands,songMovie);

function commandSwitch(liriCommands,songMovie) {

	switch(liriCommands) {
	    case "my-tweets":
	        myTweets();
	        break;
	    case "spotify-this-song":
	    	if (songMovie === undefined){
	    		songMovie = "The Sign Ace of Base"
	    	}
	        spotifyThisSong(songMovie);
	        break;
	    case "movie-this":
	    	if (songMovie === undefined){
	    		songMovie = "Mr. Nobody"
	    	}
	        movieThis(songMovie);
	        break;
	    case "do-what-it-says":
	        doWhatItSays();
	        break;
	    default:
	        console.log("Sorry, that is not a command I recognize.");
	}

}

function myTweets() {
	var client = new Twitter({
	  consumer_key: twitterKeys.consumer_key,
	  consumer_secret: twitterKeys.consumer_secret,
	  access_token_key: twitterKeys.access_token_key,
	  access_token_secret: twitterKeys.access_token_secret
	});
	 
	var params = {screen_name: 'chris_ku_lynam'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log("\nHERE ARE YOUR TWEETS -->\n");
	    writeFile("\nHERE ARE YOUR TWEETS -->\n");

	    for (var i = 0; i < tweets.length; i++) {
	    	console.log(tweets[i].created_at + "  " + tweets[i].text);
	    	writeFile(tweets[i].created_at + "  " + tweets[i].text + "\n");
	    }
	  }
	});
}

function spotifyThisSong(song) {
	var spotify = new Spotify({
	  id: "c50cfc09f6da4c419892b041ecdbd6a8",
	  secret: "ceb2063c5fd9464fa30acddb8080652b"
	});
	 
	spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	 
	console.log("\nArtist Name: " + data.tracks.items[0].album.artists[0].name);
	console.log("Song Name: " + data.tracks.items[0].name);
	console.log("Song Preview URL: " + data.tracks.items[0].preview_url);
	console.log("Album Name: " + data.tracks.items[0].album.name);

	writeFile("\nArtist Name: " + data.tracks.items[0].album.artists[0].name);
	writeFile("\nSong Name: " + data.tracks.items[0].name);
	writeFile("\nSong Preview URL: " + data.tracks.items[0].preview_url);
	writeFile("\nAlbum Name: " + data.tracks.items[0].album.name);

	});
}

function movieThis(movie) {
	var omdbURL = "http://www.omdbapi.com/?apikey=ed4a5f02&t=" + movie;

	request(omdbURL, function (error, response, body) {
	  if (error) {
	    return console.log('Error occurred: ' + error);
	  }
	  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  var movieInfo = JSON.parse(body);

	  console.log("\nTitle: " + movieInfo.Title);
	  writeFile("\nTitle: " + movieInfo.Title);

	  console.log("Year: " + movieInfo.Year);
	  writeFile("\nYear: " + movieInfo.Year);

	  //console.log("Ratings: " + JSON.stringify(movieInfo.Ratings));
	  for (var i = 0; i < movieInfo.Ratings.length; i++) {
	  	console.log(movieInfo.Ratings[i].Source + ":  " + movieInfo.Ratings[i].Value);
	  	writeFile(movieInfo.Ratings[i].Source + ":  " + movieInfo.Ratings[i].Value);
	  }

	  console.log("Country: " + movieInfo.Country);
	  writeFile("\nCountry: " + movieInfo.Country);
	  console.log("Language: " + movieInfo.Language);
	  writeFile("\nLanguage: " + movieInfo.Language);
	  console.log("Plot: " + movieInfo.Plot);
	  writeFile("\nPlot: " + movieInfo.Plot);
	  console.log("Actors: " + movieInfo.Actors);
	  writeFile("\nActors: " + movieInfo.Actors);
	});
}

function doWhatItSays() {
	fs.readFile('random.txt', "utf8", function(err, data) {

		dataArray = data.split(",");

		commandSwitch(dataArray[0],dataArray[1]);

	  });
}

function writeFile(textToWrite) {
	fs.appendFile("log.txt", textToWrite, function(err) {

	  if (err) {
	    console.log(err);
	  }

	  // else {
	  //   console.log("\nContent Added to Log File!");
	  // }

	});
}