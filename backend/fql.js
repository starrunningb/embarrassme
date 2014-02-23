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
