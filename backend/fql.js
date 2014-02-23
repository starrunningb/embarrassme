var FB = require('./fb');


//var accesstoken = "CAACEdEose0cBABpw34V2oZCh945ZCYW6OZB8v6AE69kKpksZBRwEAW2wO3n5iqsnTvd3dypAFnEFYuS8SFd1Ps4B1KhDZAWHTTKIB28cHeSuqCu03aUcntJteVauTwTcNngFx6Hhk3hQVbbFW44e0cXbqf2OeKgwg7kohyBeRDVhdUW9FoBihOa00IJuXT1AZD";
var accesstoken = "CAACEdEose0cBAHnmqxq4PD4bgpZAktxuU5QiIG5Jgz2h8Cu1ZCwyiZCXeOMG6A4DLFvqug7Uz8WacZCKT6oa3ZBBaRbn1lxDyszp03u8TxkEVLGtw4sKRBTRBC3x425GbRijJNZAnmG8dDfCGoMbJkZB2nQpIV9mqmVf1BbNBQuKJidlT6GxBf0VrkyUx9xPYQZD";
FB.setAccessToken(accesstoken);

var userPhotos = [];

var tolerance = 0.5;
var like_weight = 0.6;
var comment_weight = 0.4;
var heapObj = new Heap();

//Retrieves up to 400 photos of a user's tagged photos dating newestTime (epoch time) or older. -1 for newestTime to get newest photos. 
function getPhotos(newestTime, photos){
	var query1string = "SELECT pid,created FROM photo_tag WHERE subject=me()";
	if(newestTime != -1)
		query1string = query1string + " AND created<" + newestTime;

	FB.api({
		    method: 'fql.multiquery',
		    queries: {
			'query1': query1string,
			'query2': 'SELECT object_id, like_info, link, pid, created, comment_info FROM photo WHERE pid IN (SELECT pid FROM #query1)'
		    }
	}, function(response) {
		    // response should have 2 objects in it, both containing an fql_result_set 
		    // array with the data and the name you entered for the query (i.e. 'query1')
		var latestTime;
		var responseLength;
		if (response.error_code) {
			console.log(response);
		} else {
			console.log("response ready to go");
		}

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
	FB.api(photo.object_id, function(response){
		console.log("Adding photo comment");
	        photo.comments = response.comments;  
        });
}

//needs to be tested
function addComments(photos){
	for(var i = 0; i < photos.length; i++){
		getPhotoComments(photos[i], photos);
	}

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

	addComments(tempPhotos);

	setTimeout(function(){
//		console.log(tempPhotos);
	}, 1000);
	
	var filtered = getFilteredLikes(userPhotos);
	for(var i = 0; i < filtered.length; i++)
		console.log(filtered[i].link);

	console.log(filtered.length);
}, 10000);




function weighting(obj1, obj2, tolerance) {
	var delta = function(x1, x2) {
		return (x2 - x1) / (Math.max(x1, x2));
	}
	var dl = Math.max(delta(obj2.like_info.like_count, obj1.like_info.like_count), 0);
	var dc = Math.max(delta(obj2.comment_info.comment_count, obj1.comment_info.comment_count), 0);
	return Math.max(dl * like_weight + dc * comment_weight, 0);
}

function getFilteredLikes(photos) {
	var topPhotos = [], weights = [], times = [];
	for (var i = 0; i < photos.length; i++) {
		times[times.length] = photos[i].created;
	}
	photos = (heapObj.sort(times, photos))[1];
	var old_weight_gradient = [];
	for (var i = 0; i < photos.length; i++) {
		old_weight_gradient = 1.0 - ((i / photos.length) / 2);
	}
	//console.log(photos);
	for (var obji = 0; obji < photos.length - 1; obji++) {
		var obj1 = photos[obji];
		var obj2 = photos[obji + 1];
		var w = weighting(obj1, obj2);
		if (obj1.like_info.like_count < 3) {
			continue;
		}
		if (obj1.comment_info.comment_count < 2) {
			continue;
		}
		w += old_weight_gradient[obji];
		w /= 2.0;
		if (w < tolerance) {
			//console.log("adding photo with weight [" + w + "]");
			topPhotos[topPhotos.length] = obj1;
			weights[weights.length] = w;
		}
	}
	var results = heapObj.sort(weights, topPhotos);
	return results[1];
}


function Heap() {
	function hparent(index) {
		return Math.floor((index - 1) / 2);
	}
	function lchild(index) {
		return index * 2 + 1;
	}
	function rchild(index) {
		return index * 2 + 2;
	}
	function SWAP(array, index1, index2) {
		var temp = array[index1];
		array[index1] = array[index2];
		array[index2] = temp;
		return array;
	}
	function siftUp(array1, array2, index) {
		while (index != 0) {
			if (array1[index] > array1[hparent(index)]) {
				array1 = SWAP(array1, index, hparent(index));
				array2 = SWAP(array2, index, hparent(index));
				index = hparent(index);
			} else {
				break;
			}
		}
		return [array1, array2];
	}
	function siftDown(array1, array2, index) {
		var ptr = 0;
		var end = index - 1;
		array1 = SWAP(array1, 0, index);
		array2 = SWAP(array2, 0, index);
		while (ptr < end) {
			var new_index = lchild(ptr);
			if (new_index == index) {
				break;
			}
			if (rchild(ptr) < index && array1[lchild(ptr)] < array1[rchild(ptr)]) {
				new_index = rchild(ptr);
			}
			if (new_index < index && array1[new_index] > array1[ptr]) {
				array1 = SWAP(array1, ptr, new_index);
				array2 = SWAP(array2, ptr, new_index);
				ptr = new_index;
			} else {
				break;
			}
		}
		return [array1, array2];
	}
	function heapSort(array1, array2) {
		for (var i = 0; i < array1.length; i++) {
			var moor = siftUp(array1, array2, i);
			array1 = moor[0];
			array2 = moor[1];
		}
		var i = 0;
		for (var i = 0; i < array1.length; i++) {
			var moor = siftDown(array1, array2, array1.length - i - 1);
			array1 = moor[0];
			array2 = moor[1];
		}
		return [array1, array2];
	}
	this.sort = function (array1, array2) {
		var result = heapSort(array1, array2);
		return result;
	}
}
