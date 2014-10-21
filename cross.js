// /**
//  *	cross.js
//  *	For cross domain data transfer
//  *
//  */

//bug
// attach event message / onmessage

function cross(arg) {

	//module private properties
	var request;
	var response;
	var proxy;

	//jsopn method object
	//arg.url
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	var jsonp = function() {

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
						window.document.getElementById('jsonp_script').remove();
					}
				}
			}

			this.script = document.createElement("script");
			this.script.id = 'jsonp_script';
			this.script.src = arg.url + '?callback=this.success';
			window.document.body.appendChild(this.script);

		}
		catch (e) {

			if (arg.error) {
				arg.error(e);
			}
		}
		
	};

	//document.domain method object
	//arg.frameSrc
	//arg.domain
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	var docdomain = {};

	docdomain.request = function() {

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

				if (iframe.contentDocument || iframe.contentWindow.document){
					var dataDocument = iframe.contentDocument || iframe.contentWindow.document;

					if (arg.success) {

						arg.success(dataDocument);

						if (arg.complete) {
							arg.complete();
						}
					}
				}
				else {
					throw 'cannot get data';
				}
				
			}


		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}

	};


	//document.domain method object
	//arg.domain
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	docdomain.response = function() {

		try {

			if (! arg.domain) {
				throw 'please input domain';
			}

			if (arg.beforesend) {
				arg.beforesend();
			}

			window.document.domain = arg.domain;

			if (arg.success) {

				if (window.parent.document) {
					arg.success(window.parent.document);
				}
				else {
					throw 'cannot get data';
				}
				

			}

			if (arg.complete) {
				arg.complete();
			}


		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}

	};


	//postMessage method object
	//arg.frameSrc
	//arg.processData
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	var postMessage = {};
	postMessage.request = function() {

		try {

			if (! postMessage) {
				throw 'your browser does not support postMessage';
			}

			if (! arg.frameSrc) {
				throw 'please input frame src';
			}

			if (! arg.processData) {
				throw 'please input processData function';
			}

			var iframe = window.document.createElement('iframe');

			iframe.style.display = 'none';

			iframe.src = arg.frameSrc;

			if (arg.beforesend) {
				arg.beforesend();
			}

			var getData = arg.processData();

			window.document.body.appendChild(iframe);

			var sendMsg = function() {

				var frameWindow = iframe.contentWindow || iframe.contentDocument;
				frameWindow.postMessage(getData, arg.frameSrc);
			};

			window.onload = sendMsg;

			if (window.attachEvent) {
				window.attachEvent('message', function(event){
					if (arg.success) {
						arg.success(event.data);
					}

				});
			}
			else {
				window.addEventListener('message', function(event){
					if (arg.success) {
						arg.success(event.data);
					}

					if (arg.complete) {
						arg.complete();
					}

				}, true);
			}


		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}

	};

	//postMessage method object
	//arg.parentSrc
	//arg.processData
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	postMessage.response = function() {

		try {

			if (! postMessage) {
				throw 'your browser does not support postMessage';
			}

			if (! arg.parentSrc) {
				throw 'please input parent src';
			}

			if (! arg.processData) {
				throw 'please input processData function';
			}

			var getData = arg.processData();

			if (arg.beforesend) {
				arg.beforesend();
			}

			var sendMsg = function() {

				parent.postMessage(getData, arg.parentSrc);
			};

			window.onload = sendMsg;

			if (window.attachEvent) {
				window.attachEvent('message', function(event){
					if (arg.success) {
						arg.success(event.data);
					}

				});
			}
			else {
				window.addEventListener('message', function(event){
					if (arg.success) {
						arg.success(event.data);
					}

					if (arg.complete) {
						arg.complete();
					}

				}, true);
			}

		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}
		
	};

	//window.name method object
	//arg.frameSrc
	//arg.proxySrc
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	var winname = {};
	winname.request = function() {

		try {

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
		        	var otherDocument = iframe.contentWindow || iframe.contentDocument ;
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
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}
	};

	//window.name method object
	//arg.processData
	//arg.error
	winname.response = function() {

		try {

			if (arg.processData) {
					window.name = arg.processData();
			}

		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}
	};


	//location.hash method object
	//arg.frameSrc
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	//arg.interval
	var lochash = {};
	lochash.request = function() {

		try {

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

				if (arg.success && data != '') {
					arg.success(data);

					if (arg.complete) {
			   			arg.complete();
			   		}

			   		clearInterval(hashInterval);
				}

			}

			getHash();

			var hashInterval = setInterval(function(){getHash()}, arg.interval);	
			
		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}
	};

	//location.hash method object
	//arg.frameSrc
	//arg.processData
	//arg.error
	lochash.response = function() {

		try {

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

    		var tick = function() {

    			getData = arg.processData();

    			proxy.src = '';

    			proxy.onload = function() {
  					proxy.src = arg.frameSrc + '#' +getData;
  				}
    		}

    		tick();

		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}

	};

	//location.hash method object
	//arg.error
	lochash.proxy = function() {

		try {
			window.parent.parent.location.hash = self.location.hash.substring(1);
		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}
	};

	//cors method object
	//arg.url
	//arg.data
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	//arg.asyn
	//arg.method
	var cors = {};
	cors.request = function() {

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

		}

		//sendRequest
		this.sendRequest = function() {

			try {

				if (arg.beforesend) {
					arg.beforesend();
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

		  		var str = '';

				for (key in arg.data) {
					str += key + '=' + arg.data[key];
				}

				if (str != '') {
					str = '?' + str;
				}

				xmlhttp.open('GET', arg.url + str, arg.asyn);
				xmlhttp.send();

		  		xmlhttp.onreadystatechange=function() {

		  			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
		    			
		    			var data = eval( '(' + xmlhttp.responseText + ')');

		    			if (arg.success) {
		    				arg.success(data);
		    			}

		    			if (arg.complete) {
		    				arg.complete();
		    			}

		    		}
		    		else if (xmlhttp.readyState === 4 && xmlhttp.status !== 200) {
		    			throw 'cannot return data';
		    		}
		  		}
				
			}
			catch (e) {

				if (arg.error) {
		    		arg.error();
		    	}
			}

		}

		this.processArg(arg);

		this.sendRequest();
	};




	//return module public method
	return {
		jsonp: jsonp,
		docDomainRequest: docdomain.request,
		docDomainResponse: docdomain.response,
		postMessageRequest: postMessage.request,
		postMessageResponse: postMessage.response,
		winNameRequest: winname.request,
		winNameResponse: winname.response,
		locHashRequest: lochash.request,
		locHashResponse: lochash.response,
		locHashProxy: lochash.proxy,
		corsRequest: cors.request
	};

}


(function(win){

	if (!win.cx) {
		win.cx = cross;
	}
	
	if (!win.cxLog) {

		win.cxLog = function(msg) {

			if (window.console) {
				console.log(msg);
			}
			else {
				alert(msg);
			}

		};

	}

})(window);	


