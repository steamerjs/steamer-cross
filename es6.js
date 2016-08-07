"use strict";
/**
 * steamer-cross
 * github: https://github.com/SteamerTeam/steamer-cross
 * npm: https://www.npmjs.com/package/steamer-cross
 * version: 0.1.0
 * date: 2016.08.06
 */



/**
 * [Cross description]
 * @param {String} projectName  [project name]
 * @param {String} relationName [parent|window|iframe]
 */
function Cross(projectName, relationName) {

	this.className = "__SteamerCrossV0.1.0__";

	this.targets = {};

	this.projectName = projectName || '';

	this.relationName = relationName || 'parent';

	this.init();

	return this;
}

Cross.prototype.init = function() {
	if (!window.postMessage) {
		throw new Error('"steamer-cross: your browser does not support postMessage"');	
	}

};

Cross.prototype.register = function (targetName, target) {

	let key = this.projectName + '|' + targetName;
	if (!this.targets.hasOwnProperty(key)) {
		let t = {
			target: target
		};
		this.targets[key] = t;
	}

	return this;
};

Cross.prototype.unregister = function(targetName) {
	if (this.targets.hasOwnProperty(targetName)) {
		delete this.targets[targetName];
	}
	else {
		this.targets = {};
	}

	return this;
};

Cross.prototype.encryptMsg = function(projectTargetName, msg, direction = 'ptc', destinationName = '') {
	destinationName = (destinationName) ? ('|' + destinationName) : '';
	return projectTargetName + '|' + direction + destinationName + this.className + msg;
};

/**
 * [broadcast description]
 * @param  {[type]} msg       [description]
 * @param  {String} direction [description]
 * @return {[type]}           [description]
 */
// ptc => parent to children ctp => children to parent
Cross.prototype.broadcast = function (msg, direction = 'ptc', ignoreTargetName = '') {
	setTimeout(() => {
		if (this.relationName === 'parent') {
			let ignoreKey = this.projectName + '|' +ignoreTargetName;
			for (let key in this.targets) {
				if (key !== ignoreKey) {
					let targetUrl = this.targets[key].target.location.href;
					this.targets[key].target.postMessage(this.encryptMsg(key, msg, direction), targetUrl);
				}
			}
		}
		else {
			this.send('parent', msg, 'ctp', 'all|' + this.relationName);
		}
	}, 0);

	return this;
};

Cross.prototype.send = function (targetName, msg, direction = 'ptc', destinationName = '') {
	setTimeout(() => {
		let key = this.projectName + '|' + targetName;

		if (this.targets.hasOwnProperty(key)) {
			let targetUrl = this.targets[key].target.location.href;
			this.targets[key].target.postMessage(this.encryptMsg(key, msg, direction, destinationName), targetUrl);
		}
		else if (this.relationName !== 'parent') {
			this.send('parent', msg, 'ctp', targetName);
		}
		else {
			throw new Error("steamer-cross: targetName not exists");
		}
		
	}, 0);

	return this;
};

Cross.prototype.listen = function (callback) {

	let listenFunc = (e) => {

		this.register('parent', e.source);

		let msg = e.data;
		
		// console.log(msg, this.projectName + '-' + this.relationName);
		// filter msg from other projects
		if (!~msg.indexOf(this.projectName + '|' + this.relationName)) {
			return;
		}
		
		msg = msg.split(this.className);

		let info = msg[0] || '',
		 	data = msg[1] || '';
			info = info.split('|');

		// send from child to parent
		if (this.relationName === 'parent' && info.length >= 4 && info[2] == 'ctp') {
			if (info[3] !== 'all') {
				this.send(info[3], data);
			}
			else if (info[3] === 'all') {
				callback(data, e);
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