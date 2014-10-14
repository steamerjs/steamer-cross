/**
 *	cross.js
 *	For cross domain data transfer
 *
 */

//main object
var cross = {};

//method
cross.method = {'jsonp': null, 'document.domain': null, 'location.hash': null, 'window.name': null, 'postMessage': null, 'cors': null};

//jsopn method object
//arg.url
//arg.beforesend
//arg.success
//arg.complete
//arg.error
cross.method.jsonp = function(arg) {

	try {
		if (! arg.url) {
			throw 'please input url';
		}

		if (! arg.success) {
			throw 'please input callback function';
		}
		else {
			window.success = function(data) {
				arg.success(data);

				if (arg.complete) {
					arg.complete();
				}

				script.remove();
			}
		}

		var script = document.createElement("script");
		script.src = arg.url + '?callback=this.success';
		if (window.document.body.appendChild(script)) {

			if (arg.beforesend) {
				arg.beforesend();
			}
		}

	}
	catch(e) {
		cross.errorReport(e);

		if (arg.error) {
			arg.error(e);
		}
	}
	
}

//cors method object
//arg.url
//arg.data
//arg.beforesend
//arg.success
//arg.end
//arg.error
//arg.method
//arg.asyn
cross.method.cors = function(arg) {

	this.processArg = function(arg) {

		if (! arg.url) {
			throw 'Please input request url';
		}

		if (! arg.asyn) {
			arg.asyn = true;
		}

		if (! arg.data || ! arg.data.length) {
			arg.data = {};
		}

		this.arg = arg;

	}

	//sendRequest
	this.sendRequest = function() {

		try {

			if (this.arg.beforesend) {
				this.arg.beforesend();
			}

			var xmlhttp;

			if (window.XMLHttpRequest) {
	  			// code for IE7+, Firefox, Chrome, Opera, Safari
	  			xmlhttp = new XMLHttpRequest();
	  		}
			else {
				// code for IE6, IE5
	  			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  		}

	  		xmlhttp.onreadystatechange=function() {
	  			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    			
	    			var data = JSON.parse(data);

	    			if (this.arg.success) {
	    				this.arg.success(data);
	    			}

	    		}
	    		else {

	    			throw 'Can\'t return data.';

	    		}
	  		}
			

			var str = '';

			for (key in this.arg.data) {
				str += key + '=' + this.arg.data[key];
			}

			xmlhttp.open('GET', this.arg.url + '?' + str + 'callback=success', this.arg.asyn);
			xmlhttp.send();
		}
		catch (e) {
			cross.errorReport(e);

			if (this.arg.error) {
	    		this.arg.error();
	    	}
		}

	}

	this.processArg(arg);

	this.sendRequest();
}

//initialization
cross.initialize = function(arg, method) {

 	switch (method) {
 		case 'jsonp':
 			return cross.method[method](arg);
 			break;
 		case 'document.domain':
 			return cross.method[method](arg);
 			break;
 		case 'location.hash':
 			return cross.method[method](arg);
 			break;
 		case 'window.name':
 			return cross.method[method](arg);
 			break;
 		case 'postMessage':
 			return cross.method[method](arg);
 			break;
 		default:
 			cross.errorReport('Wrong Method');
 			break;
 	}

}


//error report function
cross.errorReport = function(msg) {
	console.log(msg);
}