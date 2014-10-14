/**
 *	cross.js
 *	For cross domain data transfer
 *
 */

//main object
var cross = {};

//method
cross.method = {'jsonp', 'document.domain', 'location.hash', 'window.name', 'postMessage'};

//method object
//arg.url
//arg.data
//arg.dataType
//arg.beforesend
//arg.success
//arg.end
//arg.error
//arg.method
//arg.asyn
cross.method.jsonp = function(arg) {

	this.processArg = function(arg) {

		if (! arg.url) {
			throw 'Please input request url';
		}

		if (! arg.method) {
			arg.method = 'GET';
		}

		if (! arg.asyn) {
			arg.asyn = true;
		}

		if (! arg.data || ! arg.data.length) {
			arg.data = {};
		}

		if (! arg.dataType) {
			arg.dataType = 'text';
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
	    			
	    			var data = false;

	    			switch (this.arg.dataType) {
	    				case 'xml':
	    					data = xmlhttp.responseXML;
	    					break;
	    				case 'json':
	    					data = JSON.parse(data);
	    					break;
	    				default:
	    					data = xmlhttp.responseText;
	    					break;
	    			}

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

			xmlhttp.open(this.arg.method, this.arg.url + '?' + str, this.arg.asyn);
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

//create object

cross.create = function(arg, method) {

}

//error report function
cross.errorReport = function(msg) {
	console.log(msg);
}