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
	var transportType = (arg.type)? arg.type : 'msg';

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

						var frameParent = window.document.getElementById('jsonp_script').parentNode;
						var frame = window.document.getElementById('jsonp_script');

						frameParent.removeChild(frame);
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

			if (! arg.frameSrc && ! arg.url) {
				throw 'please input frame src';
			}

			if (! arg.domain) {
				throw 'please input domain';
			}

			if (arg.beforesend) {
				arg.beforesend();
			}

			var removeFrame = (arg.removeFrame === true)? arg.removeFrame : false;

			if (arg.url) {
				var iframe = document.createElement("iframe");

				iframe.style.display = 'none';

				iframe.src = arg.url;

				window.document.body.appendChild(iframe);
			}
			else {
				var iframe = arg.frameSrc;
			}
			
			window.document.domain = arg.domain;

			iframe.onload = function() {

				if (iframe.contentDocument || iframe.contentWindow.document){
					var dataDocument = iframe.contentDocument || iframe.contentWindow.document;

					if (arg.success) {

						arg.success(dataDocument);

						if (arg.complete) {
							arg.complete();

							(! removeFrame) || (!iframe.parentNode) || iframe.parentNode.removeChild(iframe);
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

			if (! window.postMessage) {
				throw 'your browser does not support postMessage';
			}

			if (! arg.frameSrc && ! arg.url) {
				throw 'please input frame src';
			}

			if (! arg.processData) {
				throw 'please input processData function';
			}

			var removeFrame = (arg.removeFrame === true)? arg.removeFrame : false;

			if (arg.url) {
				var iframe = window.document.createElement('iframe');

				iframe.style.display = 'none';

				iframe.src = arg.url;
			}
			else {
				var iframe = arg.frameSrc;
			}

			if (arg.beforesend) {
				arg.beforesend();
			}

			var getData = arg.processData();

			window.document.body.appendChild(iframe);

			var sendMsg = function() {

				var frameWindow = iframe.contentWindow || iframe.contentDocument;
				if (arg.frameSrc) {
					frameWindow.postMessage(getData, iframe.src);
				}
				else {
					frameWindow.postMessage(getData, arg.url);
				}
			};

			window.onload = sendMsg;

			if (window.attachEvent) {
				window.attachEvent('onmessage', function(event){
					if (arg.success) {
						arg.success(event.data);
					}

					if (arg.complete) {
						arg.complete();
						(! removeFrame) || (!iframe.parentNode) || iframe.parentNode.removeChild(iframe);
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
						(! removeFrame) || (!iframe.parentNode) || iframe.parentNode.removeChild(iframe);
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

			if (! window.postMessage) {
				throw 'your browser does not support postMessage';
			}

			if (! arg.url) {
				throw 'please input parent url';
			}

			if (! arg.processData) {
				throw 'please input processData function';
			}

			var getData = arg.processData();

			if (arg.beforesend) {
				arg.beforesend();
			}

			var sendMsg = function() {
				parent.postMessage(getData, arg.url);
			};

			window.onload = sendMsg;

			if (window.attachEvent) {
				window.attachEvent('onmessage', function(event){
					if (arg.success) {
						arg.success(event.data);
					}

					if (arg.complete) {
						arg.complete();
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
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	var winname = {};
	winname.request = function() {

		try {

			if (! arg.frameSrc && ! arg.url) {
				throw 'please input frame src or url';
			}

			var removeFrame = (arg.removeFrame === true)? arg.removeFrame : false;

			var state = 0;

			if (arg.url) {
				var iframe = window.document.createElement('iframe');

				iframe.style.display = 'none';

				iframe.id = 'dataFrame';

				iframe.src = arg.url;
			}
			else {

				var iframe = arg.frameSrc;
			}
			

			if (arg.beforesend) {
				arg.beforesend();
			}

			var dataFrame = false;
			var otherDocument = false;

			var loadfn = function() {
		        if (state === 1) {
		            var data = otherDocument.name; 

		            if (arg.success) {
		            	arg.success(data);
		            }

		            if (arg.complete) {
		            	arg.complete();
		            	(! removeFrame) || (!iframe.parentNode) || iframe.parentNode.removeChild(iframe);
		            }

		        } else if (state === 0) {
		            state = 1;

		            dataFrame = window.document.getElementById('dataFrame');
		            otherDocument = dataFrame.contentWindow || dataFrame.contentDocument;

		            otherDocument.location = "about:blank";
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

	//window.navigator method object
	//arg.frameSrc
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	var winnav = {};
	winnav.request = function() {

		try {

			if (! arg.frameSrc && ! arg.url) {
				throw 'please input frame src';
			}

			var removeFrame = (arg.removeFrame === true)? arg.removeFrame : false;

			var state = 0;

			if (arg.url) {
				var iframe = window.document.createElement('iframe');

				iframe.style.display = 'none';

				iframe.id = 'dataFrame';

				iframe.src = arg.url;
			}
			else {
				var iframe = arg.frameSrc;
			}
			

			if (arg.processData) {
				window.navigator['request_data'] = arg.processData();
			}

			if (arg.beforesend) {
				arg.beforesend();
			}

			var dataFrame = false;
			var otherDocument = false;

			var loadfn = function() {

		        if (state === 1) {
		            var data = window.navigator['response_data'] || ''; 

		            if (arg.success) {
		            	arg.success(data);
		            }

		            if (arg.complete) {
		            	arg.complete();
		            	(! removeFrame) || (!iframe.parentNode) || iframe.parentNode.removeChild(iframe);
		            }

		        } else if (state === 0) {
		            state = 1;

		            dataFrame = iframe;
		            otherDocument = dataFrame.contentWindow || dataFrame.contentDocument;

		            otherDocument.location = "about:blank";
		        }  
		    };

		    if (iframe.attachEvent) {
		        iframe.attachEvent('onload', loadfn);
		    } else {
		        iframe.onload  = loadfn;
		    }

		    if (arg.url) {
		    	window.document.body.appendChild(iframe);
		    }
		    
		}
		catch (e) {
			if (arg.error) {
				arg.error(e);
			}
		}
	};

	//window.navigator method object
	//arg.processData
	//arg.error
	winnav.response = function() {

		try {

			if (arg.processData) {
					window.navigator['response_data'] = arg.processData();
			}

			if (arg.beforesend) {
				arg.beforesend();
			}

			var data = window.navigator['request_data'] || ''; 

			if (arg.success) {
		        arg.success(data);
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

			if (! arg.frameSrc && ! arg.url) {
				throw 'please input frame src';
			}

			if (! arg.interval) {
				arg.interval = 1000;
			}

			var removeFrame = (arg.removeFrame === true)? arg.removeFrame : false;

			if (arg.url) {
				var iframe = document.createElement('iframe');

				iframe.src = arg.url;

				iframe.style.display = 'none';

				window.document.body.appendChild(iframe);
			}
			else {
				var iframe = arg.frameSrc;
			}
			

			if (arg.beforesend) {
				arg.beforesend();		
			}


			var getHash = function() {

				var data = location.hash ? location.hash.substring(1) : '';

				if (arg.success && data !== '') {
					arg.success(data);

					if (arg.complete) {
			   			arg.complete();
			   			(! removeFrame) || (!iframe.parentNode) || iframe.parentNode.removeChild(iframe);
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

			if (! arg.url) {
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

	    	iframe.src = arg.url + '#' + getData;

	    	iframe.style.display ='none';

	    	document.body.appendChild(iframe);
    		
    		var tick = function() {

    			getData = arg.processData();

    			iframe.onload = function() {
  					iframe.src = iframe.src + '#' +getData;
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
	//arg.beforesend
	//arg.success
	//arg.complete
	//arg.error
	//arg.asyn
	//arg.method
	var cors = {};
	cors.request = function() {

		try {

			if (! arg.url) {
				throw 'Please input request url';
			}

			if (! arg.processData) {
				throw 'please input processData function';
			}

			if (typeof arg.asyn == undefined) {
				arg.asyn = true;
			}

			if (typeof arg.method == undefined) {
				arg.method = "POST";
			}

			var getData = arg.processData();

			if (arg.beforesend) {
				arg.beforesend();
			}

			var xmlhttp = null;


	  		var XMLHttpFactories = [

	  			function () {return new XDomainRequest()},
	  			function () {return new XMLHttpRequest()},
	  			function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	  			function () {return new ActiveXObject("Msxml3.xmlhttp")},
	  			function () {return new ActiveXObject("Microsoft.XMLHTTP")}

	  		];

	  		for (var i = 0; i < XMLHttpFactories.length; i++) {
	  			try {
	  				xmlhttp = XMLHttpFactories[i]();
	  			}
	  			catch (e) {
	  				continue;
	  			}
	  			break;
	  		}

	  		var appendData = '';

	  		if (getData instanceof Object) {

	  			for (key in getData) {

	  				if (getData.hasOwnProperty(key)) {
	  					
	  					if (appendData !== '') {
	  						appendData += ('&' + key + '=' + getData[key]);
	  					}
	  					else {
	  						appendData += (key + '=' + getData[key]);
	  					}
	  				}
	  			}

	  			if (appendData !== '' && arg.method == 'GET') {
	  				arg.url += ('?' + appendData);
	  			}
	  		}

  			xmlhttp.onreadystatechange = function() {
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

	  		if (window.XDomainRequest) {
	  			xmlhttp.onload = function() {
	  				
	  				var data = eval( '(' + xmlhttp.responseText + ')');
	    			if (arg.success) {
	    				arg.success(data);
	    			}

	    			if (arg.complete) {
	    				arg.complete();
	    			}
	  			}
	  		}
	  		
	  		xmlhttp.open(arg.method, arg.url, arg.asyn);

			if (arg.method === "POST") {
				if (xmlhttp.setRequestHeader) {
					xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				}
				xmlhttp.send(appendData);
			}
			else {
				xmlhttp.send();
			}
			
		}
		catch (e) {

			if (arg.error) {
	    		arg.error(e);
	    	}
		}


	};

	//default method, cross browser compatibility
	var crossBrowser = {};

	crossBrowser.request = function() {

		if (transportType === 'msg') {
			if (window.postMessage) {
				postMessage.request();
			}
			else {
				winnav.request();
			}
		}
		else if (transportType === 'dom') {
			docdomain.request();
		}
		

	};

	crossBrowser.response = function() {
		
		if (transportType === 'msg') {
			if (window.postMessage) {
				postMessage.response();
			}
			else {
				winnav.response();
			}
		}
		else if (transportType === 'dom') {
			docdomain.response();
		}
		
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
		winNavRequest: winnav.request,
		winNavResponse: winnav.response,
		locHashRequest: lochash.request,
		locHashResponse: lochash.response,
		locHashProxy: lochash.proxy,
		corsRequest: cors.request,
		request: crossBrowser.request,
		response: crossBrowser.response
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

