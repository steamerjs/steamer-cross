/**
 *	cross.js
 *	For cross domain data transfer
 *
 */

//main object
var cross = {};

//method
cross.method = {'jsonp': null, 'docdomain': null, 'lochash': null, 'winname': null, 'postMessage': null, 'cors': null};


//window.name method object
//arg.pageType
//arg.frameSrc
//arg.beforesend
//arg.success
//arg.complete
//arg.error

//arg.processData
cross.method.winname = function(arg) {

	try {

		if (! arg.pageType) {
			throw 'please input page type main | data';
		}

		if (arg.pageType == 'main') {

			if (! arg.frameSrc) {
				throw 'please input frame src';
			}

			if (! arg.proxySrc) {
				throw 'please input proxy frame src';
			}

			var state = 0;

			var iframe = window.document.createElement('iframe');

			iframe.style.display = 'none';

			iframe.src = arg.frameSrc;

			if (arg.beforesend) {
				arg.beforesend();
			}

			var loadfn = function() {

		        if (state === 1) {
		        	var otherDocument = iframe.contentDocument || iframe.contentWindow;
		            var data = iframe.contentWindow.name; 

		            if (arg.success) {
		            	arg.success(data);
		            }

		            if (arg.complete) {
		            	arg.complete(data);
		            }

		        } else if (state === 0) {
		            state = 1;
		            iframe.contentWindow.location = arg.proxySrc;
		        }  
		    };

		    if (iframe.attachEvent) {
		        iframe.attachEvent('onload', loadfn);
		    } else {
		        iframe.onload  = loadfn;
		    }

		    window.document.body.appendChild(iframe);

		}
		else if (arg.pageType == 'data'){

			if (arg.processData) {
				window.name = arg.processData();
			}
			
		}

	}
	catch (e) {
		if (arg.error) {
			arg.error(e);
		}
	}
}

//location.hash method object
//arg.pageType
//arg.frameSrc
//arg.beforesend
//arg.success
//arg.complete
//arg.error
//arg.interval

//arg.processData

cross.method.lochash = function(arg) {

	try {

		if (! arg.pageType) {
			throw 'please input page type main | data | proxy';
		}

		if (arg.pageType == 'main') {

			if (! arg.frameSrc) {
				throw 'please input frame src';
			}

			if (! arg.interval) {
				arg.interval = 1000;
			}

			var iframe = document.createElement('iframe');

			iframe.src = arg.frameSrc + '#';

			iframe.style.display = 'none';

			if (arg.beforesend) {
				arg.beforesend();		
			}

			window.document.body.appendChild(iframe);

			var getHash = function() {

				var data = location.hash ? location.hash.substring(1) : '';

		   		arg.success(data);

		   		arg.complete();

			}

			var hashInterval = setInterval(function(){getHash()}, arg.interval);	
		}
		else if (arg.pageType == 'data') {

			if (! arg.frameSrc) {
				throw 'please input frame src';
			}

			if (! arg.processData) {
				throw 'please input processData function';
			}

			if (! arg.interval) {
				arg.interval = 1000;
			}

			var getData = arg.processData();

    		var iframe = document.createElement('iframe');
    		
    		iframe.id = "proxy";

    		iframe.src = arg.frameSrc + '#' + getData;

    		iframe.style.display ='none';

    		document.body.appendChild(iframe);

    		var proxy = document.getElementsByTagName('iframe')[0];

    		var gap = false;

    		var tick = function() {

    			clearInterval(gap);

    			getData = arg.processData();

    			proxy.src = '';

    			proxy.onload = function() {
  					proxy.src = arg.frameSrc + '#' +getData;
  					gap = setInterval(tick, 1000);
  				}
    		}

    		gap = setInterval(tick, 1000);


		}
		else if (arg.pageType == 'proxy'){

    		window.parent.parent.location.hash = self.location.hash.substring(1);
		}
		
	}
	catch (e) {
		if (arg.error) {
			arg.error(e);
		}
	}
}

//document.domain method object
//arg.frameSrc
//arg.domain
//arg.beforesend
//arg.success
//arg.complete
//arg.error
cross.method.docdomain = function(arg) {

	try {

		if (! arg.frameSrc) {
			throw 'please input frame src';
		}

		if (! arg.domain) {
			throw 'please input domain';
		}

		if (arg.beforesend) {
			arg.beforesend();
		}

		var iframe = document.createElement("iframe");

		iframe.style.display = 'none';

		iframe.src = arg.frameSrc;

		window.document.body.appendChild(iframe);

		window.document.domain = arg.domain;

		iframe.onload = function() {

			var dataDocument = iframe.contentDocument || iframe.contentWindow.document;

			if (arg.success) {

				arg.success(dataDocument);

				if (arg.complete) {
					arg.complete();
				}
			}
			
		}


	}
	catch (e) {
		if (arg.error) {
			arg.error(e);
		}
	}

}

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

			if (arg.beforesend) {
				arg.beforesend();
			}

			window.success = function(data) {
				arg.success(data);

				if (arg.complete) {
					arg.complete();
				}
			}
		}

		this.script = document.createElement("script");
		this.script.src = arg.url + '?callback=this.success';
		window.document.body.appendChild(this.script);

	}
	catch (e) {

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
 			return cross.method['docdomain'](arg);
 			break;
 		case 'location.hash':
 			return cross.method['lochash'](arg);
 			break;
 		case 'window.name':
 			return cross.method['winname'](arg);
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