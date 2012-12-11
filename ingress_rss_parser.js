console.log("Starting parser");
var feedparser = require('feedparser')
, sax = require('sax')
, urbanairship = require('urban-airship')
, request = require('request')
, addressparser = require('addressparser')
, fs = require('fs');

ua = new urbanairship("app key","app secret","master secret");

var titles = [];
var counter = 0;

fs.readFile('codelist.txt', 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}
	console.log(data);

	feedparser.parseUrl("http://www.reddit.com/r/ingress/new/.rss?sort=new", function (error,meta,articles){
		//console.log('Got title: %s', JSON.stringify(article));
		//console.log(titles.toString());

		articles.forEach(function (article){
			//console.log(article.title);
			if((article.title.toLowerCase().indexOf("passcode") !==-1)
				&& (data.indexOf(article.title)==-1)){
					titles.push(article.title);
					console.log('%s', article.title);
					console.log('%s', article.link);
					var broadcastPayload = {
						"android": {
							"alert": article.title
						}
					};

					ua.pushNotification("/api/push/broadcast/",broadcastPayload,function(error){
						console.error(error)
						fs.appendFile('codelist.txt',article.title+"\n",function(err){
							if(err)
							console.log(err);
						});
					});
				}
		});

	});
});

