var Q = require('q');
var request = require("request");

var APIScrapping = {};

APIScrapping.getResults = function(next_href, inputResultsList) {
	
	var deferred = Q.defer();
	request(next_href, function(error, response, body) {

		try {
			var parsedBody = JSON.parse(body);
		}
		catch(e) {
			console.log("Got Error for track : "+next_href+", error : ", e);
			return;
		}

		//var newResultsList;
		var newResultsList = APIScrapping.addResultsToList(parsedBody.collection, inputResultsList);
		console.log("list length in req:",newResultsList.length);

		// Do we continue ?
		// YES
		if(parsedBody.next_href) {

			APIScrapping.getResults(parsedBody.next_href, newResultsList).then(function(){
				deferred.resolve(newResultsList);
			});
		}
		// NO
		else {
			console.log("END");
			deferred.resolve(newResultsList);
		}
	});
	return deferred.promise;
}

APIScrapping.addResultsToList = function(collection, resultsList) {

	// pushing only URIs
	for(i=0; i<collection.length; i++) {
		resultsList.push(collection[i].id);
	}

	return resultsList;
}

module.exports = APIScrapping;