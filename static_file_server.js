//console.log('serving files from',__dirname,'/public');
var http = require('http');
var express = require('express');
var phone = require('./phone-client.js');
var app = express();
var fs = require('fs');

//app.get(express.static(__dirname + '/public'));

function updatePhones(newButtonText){
	fs.readFile('users.txt', function (err, userData) {
		if (err) throw err;
		var text = userData.toString();
		var users = text.split('\n');
		users.forEach(function(user) {
			var userInfo = user.split(' ');
			var baseURL = userInfo[0];
			var username = userInfo[1];
			var userpsw = userInfo[2];
			var userLabel = userInfo[3];
			var buttonLabel = newButtonText;
			
			phone.updateButton(baseURL,username,userpsw,buttonLabel,userLabel);
		});
	});
}

var buzzed = false;

app.use('/buzz',function(req,res){
	if ( buzzed ) {
		res.send('someone else already buzzed');
		return;
	}
	
	buzzed = true;
	
	http.get('http://door.lan/open');
	var whoBuzzed = (req.path).substring(1);
	
	updatePhones(whoBuzzed +' buzzed');
	
	timeoutId = setTimeout(function(){
		updatePhones('..zzz...');
		buzzed = false;
	}, 5000);
	
	res.send('buzzed');
});

app.listen(8080);
