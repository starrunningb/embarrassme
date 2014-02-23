function evaluateResponse(response) {
	var pids = [];
	var src = [];
	var likes = [];
	var mapping = {};

	// compile data
	for (var obji in response[1]) {
		var obj = response[1].fql_result_set[obji];
		pids[pids.length] = obj.pid;
		src[src.length] = obj.src;
		likes[likes.length] = obj.like_info.like_count;
	}

	// create a weighting based on the number of likes
	heapSort(likes, pids);
	console.log(likes);

	
}
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






var FB = require('./fb');

var accesstoken = "CAACEdEose0cBAJLnhDr6DS9ZBGsYYL5PR9m3LZASjq0GyJO84UrQqLNwJlZBLxKZBD8U15FY5kxM0vrXwAw3pjZAHSQ5UH0GC8uXmi3YNBXZAkCZCtHnNYfMys3o79xPln7Rcb05uvPxY30O5lRTtXDG3uf6CoXwSdQIoyzX6ZCQHCiRZAAzNeFdnLkowKX4JoFgZD";

FB.setAccessToken(accesstoken);

var body = 'My first post using facebook-node-sdk';

FB.api({
	    method: 'fql.multiquery',
	    queries: {
			'query1': 'SELECT pid FROM photo_tag WHERE subject=me()',
	        'query2': 'SELECT pid, like_info, created, src FROM photo WHERE pid IN (SELECT pid FROM #query1)'
	    }
},
function(response) {
	    // response should have 2 objects in it, both containing an fql_result_set 
	    //     // array with the data and the name you entered for the query (i.e. 'query1')

	for(var i = 0; i < response[1].fql_result_set.length; i++){
			console.log(response[1].fql_result_set[i]);
	}

});

