var expect = require('expect.js');
var assert = require('assert');
var request = require("request");

var favoriters = require("../routes/favoriters");
var resolve = require("../routes/resolve");
var likes = require("../routes/likes");
var APIScrapping = require("../routes/helpers/APIScrapping");
var config = require('../config');

describe('TESTS', function() {
	
	it('Should get all user\'s data', function(done) {
		this.timeout(999999999);
		
		//var url = "https://soundcloud.com/xtonex";
		//var url = "https://soundcloud.com/djmentol2";
		//var url = "https://soundcloud.com/jay-kay";
		//var url = "https://soundcloud.com/romain-vina";
		//var url = "https://soundcloud.com/user-141278973";
		var url = "https://soundcloud.com/astral-dopamineclub";

		request("http://localhost:3000/calculation/get-all-data?url="+url,
			function(error, response, body) {
			
			console.log(body);
			done();
		});
    });
});

describe.skip('TESTS - OK', function() {
	
	it('Should get results for favoriters', function(doneTest) {
		this.timeout(0);
		
		var trackId = "285989934";
		var next_href = "https://api.soundcloud.com/tracks/"+trackId+"/favoriters.json?consumer_key="+config.consumer_key+"&linked_partitioning=1&page_size=200";
		
		APIScrapping.getResults(next_href, [], "addResultsFavoriters").then(function(finalFavoritersList){

			//console.log("finalFavoritersList : ", finalFavoritersList);

			if(finalFavoritersList.error) {
				deferred.resolve({error:"Error occured in APIScrapping.getResults with trackId "+trackId+", error: "+finalFavoritersList.error});
			}

			//console.log("finalFavoritersList : ", finalFavoritersList);

			//console.log("Going to end job "+job.id);

			var resultObj = {};
			resultObj[trackId] = finalFavoritersList;

			expect(resultObj[trackId].length).to.be.greaterThan(1940);
			doneTest();
		}).done();
	});
	
	it('Should get all user\'s likes', function(done) {
		this.timeout(10000);
		
		url = encodeURIComponent("https://soundcloud.com/xtonex");
		
		resolve.profile(url).then(function(result) {		
			likes.all(result.userUri).then(function(result) {
				expect(result.likes.length).to.be.greaterThan(1240);
				done();
			}).done();
		}).done();
    });

	it('Should count favoriters for one track', function(done) {
		this.timeout(10000);

		trackId = "285989934";
		
		favoriters.favorites_count(trackId).then(function(result) {

			expect(result.favoritings_count).to.be.greaterThan(1970);
			done();

		}).done();		
    });

	it('Should get all user\'s data', function(done) {
		this.timeout(100000);
		
		//url = "https://soundcloud.com/xtonex";
		url = "https://soundcloud.com/djmentol2";
		
		request("http://localhost:3000/resolve-profile-uri?url="+url,
			function(error, response, body) {
			
			var responseObj = JSON.parse(body);
				
			request("http://localhost:3000/likes/all?uri="+responseObj.userUri,
				function(error, response, body) {
				
				var responseObj_likes = JSON.parse(body);
				expect(responseObj_likes.likes.length).equal(60);

				request("http://localhost:3000/calculation/get-all-data?url="+url,
					function(error, response, body) {
					
					var allData = JSON.parse(body);
					expect(allData['156427343'].length).equal(11);
					done();
				});
			});
		});
    });

    it('Resolve soundcloud user profile url', function(done) {
		
		url = "https://soundcloud.com/xtonex";
		
		request("http://localhost:3000/resolve-profile-uri?url="+url,
			function(error, response, body) {
			
			responseObj = JSON.parse(body);
			expect(responseObj.userUri).equal('https://api.soundcloud.com/users/5912982');
			done();
		});
    });
	
	it('Should get all user\'s likes', function(done) {
		this.timeout(10000);
		
		url = encodeURIComponent("https://soundcloud.com/xtonex");
		
		request("http://localhost:3000/resolve-profile-uri?url="+url,
			function(error, response, body) {
			
			responseObj = JSON.parse(body);
				
			request("http://localhost:3000/likes/all?uri="+responseObj.userUri,
				function(error, response, body) {
				
				responseObj_likes = JSON.parse(body);
				expect(responseObj_likes.likes.length).equal(1236);
				done();
			});
		});
    });	
});