var http = require('http');
var url = require('url');
var querystring = require('querystring');



//var baseURL = 'http://192.168.1.68/servlet';

var loginCookie = null;

exports.updateButton = function(baseURL,username,userpsw,buttonLabel,userLabel){
	var postData = {
		"selType_9":	"17",
		"memValue_9":	"http://192.168.1.152:8080/buzz/"+ userLabel,
		"memLabel_9":	buttonLabel
	};
	
	var getData = {
		"p":"dsskey",
		"model":"1",
		"q":"write",
		"linepage":"1"
	};
	
	
	phoneRequest(
		{'p':'login','q':'login'},
		{'username':username,'pwd':userpsw,'jumpto':'status','acc':''},
		function(){
			phoneRequest(getData,postData);
		}
	);
	
	function phoneRequest(getData,postData,callback){
	var postDataString = querystring.stringify(postData);
	
	var options = url.parse(baseURL);
	options.method = 'POST';
	options.headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': postDataString.length
	};
	
	if ( loginCookie ) {
		options.headers['Cookie'] = loginCookie;
	}
	
	options.path += '?'+querystring.stringify(getData);
	
	var req = http.request(options,function(res){
		var data = '';
		
		loginCookie = res.headers['set-cookie'];
		
		res.setEncoding('utf8');
		res.on('data',function(chunk){
			data += chunk;
		});
		res.on('end',function(){
			console.log(res.statusCode);
			console.log(res.statusMessage);
			console.log(res.headers);
			console.log(data);
			
			if ( callback ) callback();
		});
	});
	
	req.write(postDataString);
	
	req.end();
}
};

