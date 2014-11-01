// /**
//  *	cross.js
//  *	For cross domain data transfer, cross-browser only version
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


