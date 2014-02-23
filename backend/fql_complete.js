var FB = require('./fb');

var accesstoken = "CAACEdEose0cBALjXnr9FVrivMkFUA4uknJcLjZCFbta7MzVoKKZAwPylHJ6YjjrsZAiR2fTU0AoX07DQJ1Me0HskPRDH9ZBm4owwFUilTRvObYr6MPjM4RL72ZBNORhkdhCZAyZCmvJ8yDYU1Ssr22WPe15wthqNH9BTszidyZCZBtvZB7ZCFwcTFcZADoZAQJhZA8CGoZD";

FB.setAccessToken(accesstoken);

var userPhotos = [];

//Retrieves up to 400 photos of a user's tagged photos dating newestTime (epoch time) or older. -1 for newestTime to get newest photos. 
function getPhotos(newestTime, photos){
	var query1string = "SELECT pid,created FROM photo_tag WHERE subject=me()";
	if(newestTime != -1)
		query1string = query1string + " AND created<" + newestTime;

	FB.api({
		    method: 'fql.multiquery',
		    queries: {
			'query1': query1string,
			'query2': 'SELECT object_id, like_info, link, pid, created FROM photo WHERE pid IN (SELECT pid FROM #query1)'
		    }
	}, function(response) {
		    // response should have 2 objects in it, both containing an fql_result_set 
		    // array with the data and the name you entered for the query (i.e. 'query1')
		var latestTime;
		var responseLength;

		for(var i = 0; i < response[1].fql_result_set.length; i++){
			userPhotos.push(response[1].fql_result_set[i]);
			//console.log(response[1].fql_result_set[i]);

			if(i == response[1].fql_result_set.length-1)
				latestTime = response[1].fql_result_set[i].created;
		}

		responseLength = response[1].fql_result_set.length;

		if(responseLength == 400){ //more photos to be found
			getPhotos(latestTime, photos);	
		}
	});
};

//needs to be tested
function getPhotoComments(photo, photos){
	console.log(photo.object_id);
	FB.api('/' + photo.object_id, function(response){
		console.log(response);
	        photo.comments = response.comments;  
		photos.commentsRetrieved++;
        });
}

//needs to be tested
function addComments(photos){
	photos.commentsRetrieved = 0;

	for(var i = 0; i < photos.length; i++){
		getPhotoComments(photos[i], photos);
	}

	while(photos.commentsRetrieved != photos.length);
	return;
};

//determines likelihood that a user commented on the photo with the intention of resurfacing it
function resurfacedPhotoWeight(photo){

}

//analyzes comments to determine sentience. funny/gibberish results in higher return values
function commentSentientWeight(photo){

}

//judges the photos embarrassing value based on comment analysis
function embarrassingWeight(photo){

}

getPhotos(-1, userPhotos);

setTimeout(function(){
	var duplicates = 0;

	for(var x = 0; x < userPhotos.length; x++){
		for(var y = x+1; y < userPhotos.length; y++){
			if(userPhotos[x].link === userPhotos[y].link)
				duplicates++;	
		}
	}

	console.log(userPhotos.length);
	console.log(duplicates);

	var tempPhotos = [];
	tempPhotos.push(userPhotos[2]);
	tempPhotos.push(userPhotos[8]);
	tempPhotos.push(userPhotos[5]);
	tempPhotos.push(userPhotos[7]);
	tempPhotos.push(userPhotos[1]);

	console.log(tempPhotos);
	addComments(tempPhotos);
	console.log(tempPhotos);
}, 10000);
