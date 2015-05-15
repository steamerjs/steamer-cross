// /**
//  *	cross.js
//  *	For cross domain data transfer
//  *
//  */



function Cross(arg) {

	this.beforeF = null;
	this.succF = null;
	this.completeF = null;
	this.failF = null;
	this.arg = arg;
	
	this.init(this.arg);
}

Cross.prototype = {

	init: function(arg) {
		try {
			if (!arg.type) {
				throw 1;
			}
		}
		catch (e) {
			console.log(this.errorHandler(e));
		}	
	},

	errorHandler: function(e) {
		var errorArr = [
			'Please provide url',
			'Please provice type',
		];
		if (typeof e === 'object') {
			return errorArr[e];
		}
		else {
			return e;
		}
	},

	before: function(cb) {
		this.beforeF = cb;
		return this;
	},

	succ: function(cb) {
		this.succF = cb;
		this.arg.succ = this.succF;
		return this;
	},

	complete: function(cb) {
		this.completeF = cb;
		this.arg.complete = this.completeF;
		return this;
	},

	fail: function(cb) {
		this.failF = cb;
		return this;
	},

	send: function() {
		try {

			this.beforeF && this.beforeF();
			switch(this.arg.type) {
				case 'jsonp':
					this.jsonp.request(this.arg);
				break;

				case 'cors':
					this.cors.request(this.arg);
				break;

				case 'doc_domain':
					this.doc_domain.request(this.arg);
				break;
			}
		}
		catch (e) {
			this.failF(this.errorHandler(e));
		}
	},

	receive: function() {
		try {
			this.beforeF && this.beforeF();
			switch(this.arg.type) {

				case 'doc_domain':
					this.doc_domain.response(this.arg);
				break;

			}
			this.completeF && this.completeF();
		}
		catch(e) {
			this.failF(this.errorHandler(e));
		}
	},

	jsonp: {
		request: function(arg) {
			window.success = function(data) {
				arg.succ && arg.succ(data);

				if (arg.complete) {
					arg.complete();

					var scriptParent = window.document.getElementById('jsonp_script').parentNode;
					var script = window.document.getElementById('jsonp_script');

					scriptParent.removeChild(script);
				}
			}

			this.script = document.createElement("script");
			this.script.id = 'jsonp_script';
			this.script.src = arg.url + '?callback=this.success';
			window.document.body.appendChild(this.script);
		}
	},

	cors: {
		request: function(arg) {

			if (!arg.asyn) {
				arg.asyn = true;
			}

			if (!arg.method) {
				arg.method = "POST";
			}

			if (!arg.data) {
				arg.data = {};
			}

			var getData = arg.data;

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

	    			arg.succ && arg.succ(data);

	    			arg.complete && arg.complete();

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
	},
	doc_domain: {
		request: function(arg) {
			if (! arg.frameSrc && ! arg.url) {
				throw 'please input frame src';
			}

			if (! arg.domain) {
				throw 'please input domain';
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

					if (arg.succ) {

						arg.succ(dataDocument);

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
		},

		response: function(arg) {
			window.document.domain = arg.domain;

			if (arg.succ) {

				if (window.parent.document) {
					arg.succ(window.parent.document);
				}
				else {
					throw 'cannot get data';
				}
				

			}

			if (arg.complete) {
				arg.complete();
			}
		}
	}
};

(function(win){

	// if (!win.cx) {
	// 	win.cx = Cross;
	// }
	
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


