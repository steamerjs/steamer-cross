"use strict";
/**
 * steamer-cross
 * github: https://github.com/SteamerTeam/steamer-cross
 * npm: https://www.npmjs.com/package/steamer-cross
 * version: 0.1.0
 * date: 2016.08.06
 */



/**
 * [Cross]
 * @param {String} projectName  [project name]
 * @param {String} relationName [parent|window|iframe]
 */
function Cross(projectName, relationName) {
	// encrypted key
	this.className = "__SteamerCrossV0.1.0__";
	// target iframes/windows storage
	this.targets = {};
	// project name
	this.projectName = projectName || '';
	// current iframe/window name
	this.relationName = relationName || 'parent';

	this.init();

	return this;
}

/**
 * [check postMessage]
 */
Cross.prototype.init = function() {
	if (!window.postMessage) {
		throw new Error('"steamer-cross: your browser does not support postMessage"');	
	}

};

/**
 * [register target and window]
 * @param  {String} targetName [target iframe/window name]
 * @param  {Window} target     [window object]
 * @return {Object}            [this]
 */
Cross.prototype.register = function (targetName, target) {
	// projectName|targetName
	let key = this.projectName + '|' + targetName;
	if (!this.targets.hasOwnProperty(key)) {
		let t = {
			target: target
		};
		this.targets[key] = t;
	}

	return this;
};

/**
 * [unreigster targets]
 * @param  {String} targetName [target iframe/window name]
 * @return {Object}            [this]
 */
Cross.prototype.unregister = function(targetName = null) {
	if (this.targets.hasOwnProperty(targetName)) {
		delete this.targets[targetName];
	}
	// targetName = null, clear all targets
	else if (!targetName) {
		this.targets = {};
	}

	return this;
};

/**
 * [encrypt message]
 * @param  {String} projectTargetName [projectName + targetName]
 * @param  {String} msg               [msg]
 * @param  {String} direction         [ptc|ctp ptc => parent to children, ctp => children to parent]
 * @param  {String} destinationName   [destination target name]
 * @return {String}                   [encrypted message]
 */
Cross.prototype.encryptMsg = function(projectTargetName, msg, direction = 'ptc', destinationName = '') {
	destinationName = (destinationName) ? ('|' + destinationName) : '';
	// projectName|targetName|(ptc|ctp)(|destinationTargetName)|className|msg
	return projectTargetName + '|' + direction + destinationName + this.className + msg;
};

/**
 * [broadcast message all iframe/window]
 * @param  {String} msg       [message]
 * @param  {String} direction [ptc|ctp ptc => parent to children, ctp => children to parent]
 * @return {Object}           [this]
 */
// ptc => parent to children ctp => children to parent
Cross.prototype.broadcast = function (msg, direction = 'ptc', ignoreTargetName = '') {
	setTimeout(() => {
		// current window is parent, start broadcasting
		if (this.relationName === 'parent') {
			// prevent the broadcasting message sent by child sending back to this child again
			let ignoreKey = this.projectName + '|' +ignoreTargetName;
			for (let key in this.targets) {
				if (key !== ignoreKey) {
					let targetUrl = this.targets[key].target.location.href;
					this.targets[key].target.postMessage(this.encryptMsg(key, msg, direction), targetUrl);
				}
			}
		}
		// if not parent, send back to parent first, then parent will handle it
		else {
			this.send('parent', msg, 'ctp', 'all|' + this.relationName);
		}
	}, 0);

	return this;
};

/**
 * [send message to specific iframe/window]
 * @param  {String} targetName      [target iframe/window name]
 * @param  {String} msg             [message]
 * @param  {String} direction [ptc|ctp ptc => parent to children, ctp => children to parent]
 * @param  {String} destinationName   [destination target name]
 * @return {Object}                 [this]
 */
Cross.prototype.send = function (targetName, msg, direction = 'ptc', destinationName = '') {
	setTimeout(() => {
		let key = this.projectName + '|' + targetName;

		if (this.targets.hasOwnProperty(key)) {
			let targetUrl = this.targets[key].target.location.href;
			this.targets[key].target.postMessage(this.encryptMsg(key, msg, direction, destinationName), targetUrl);
		}
		// if current window is not parent, send back to parent first to handle it
		else if (this.relationName !== 'parent') {
			this.send('parent', msg, 'ctp', targetName);
		}
		else {
			throw new Error("steamer-cross: targetName not exists");
		}
		
	}, 0);

	return this;
};

/**
 * [listen message]
 * @param  {Function} callback [callback]
 * @return {Object}            [this]
 */
Cross.prototype.listen = function (callback) {

	let listenFunc = (e) => {

		this.register('parent', e.source);

		let msg = e.data;
		
		// filter msg from other projects
		if (!~msg.indexOf(this.projectName + '|' + this.relationName)) {
			return;
		}
		
		msg = msg.split(this.className);

		let info = msg[0] || '',
		 	data = msg[1] || '';
			info = info.split('|');

		// send from child to parent
		// parent handle message sent from children here
		if (this.relationName === 'parent' && info.length >= 4 && info[2] == 'ctp') {

			if (info[3] !== 'all') {
				// child A send message to child B
				// info[3] => child B targetName
				this.send(info[3], data);
			}
			// all => broadcast
			else if (info[3] === 'all') {
				// parent will also receive broadcasting message
				callback(data, e);
				// parent broadcast the message to other children
				// info[4] => the child which broadcast message 
				this.broadcast(data, 'ptc', info[4]);
			}
		}
		else {
        	callback(data, e);
		}
    };

    if (window.addEventListener) {
		window.addEventListener('message', listenFunc, false);
    }
    else {
    	window.attachEvent('onmessage', listenFunc);
    }

    return this;
};

exports.default = Cross;