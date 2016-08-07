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

Cross.prototype.init = function () {
	if (!window.postMessage) {
		throw new Error('"steamer-cross: your browser does not support postMessage"');
	}
};

Cross.prototype.register = function (targetName, target) {

	var key = this.projectName + '|' + targetName;
	if (!this.targets.hasOwnProperty(key)) {
		var t = {
			target: target
		};
		this.targets[key] = t;
	}

	return this;
};

Cross.prototype.unregister = function (targetName) {
	if (this.targets.hasOwnProperty(targetName)) {
		delete this.targets[targetName];
	} else {
		this.targets = {};
	}

	return this;
};

Cross.prototype.encryptMsg = function (projectTargetName, msg) {
	var direction = arguments.length <= 2 || arguments[2] === undefined ? 'ptc' : arguments[2];
	var destinationName = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

	destinationName = destinationName ? '|' + destinationName : '';
	return projectTargetName + '|' + direction + destinationName + this.className + msg;
};

/**
 * [broadcast description]
 * @param  {[type]} msg       [description]
 * @param  {String} direction [description]
 * @return {[type]}           [description]
 */
// ptc => parent to children ctp => children to parent
Cross.prototype.broadcast = function (msg) {
	var _this = this;

	var direction = arguments.length <= 1 || arguments[1] === undefined ? 'ptc' : arguments[1];
	var ignoreTargetName = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

	setTimeout(function () {
		if (_this.relationName === 'parent') {
			var ignoreKey = _this.projectName + '|' + ignoreTargetName;
			for (var key in _this.targets) {
				if (key !== ignoreKey) {
					var targetUrl = _this.targets[key].target.location.href;
					_this.targets[key].target.postMessage(_this.encryptMsg(key, msg, direction), targetUrl);
				}
			}
		} else {
			_this.send('parent', msg, 'ctp', 'all|' + _this.relationName);
		}
	}, 0);

	return this;
};

Cross.prototype.send = function (targetName, msg) {
	var _this2 = this;

	var direction = arguments.length <= 2 || arguments[2] === undefined ? 'ptc' : arguments[2];
	var destinationName = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

	setTimeout(function () {
		var key = _this2.projectName + '|' + targetName;

		if (_this2.targets.hasOwnProperty(key)) {
			var targetUrl = _this2.targets[key].target.location.href;
			_this2.targets[key].target.postMessage(_this2.encryptMsg(key, msg, direction, destinationName), targetUrl);
		} else if (_this2.relationName !== 'parent') {
			_this2.send('parent', msg, 'ctp', targetName);
		} else {
			throw new Error("steamer-cross: targetName not exists");
		}
	}, 0);

	return this;
};

Cross.prototype.listen = function (callback) {
	var _this3 = this;

	var listenFunc = function listenFunc(e) {

		_this3.register('parent', e.source);

		var msg = e.data;

		// console.log(msg, this.projectName + '-' + this.relationName);
		// filter msg from other projects
		if (!~msg.indexOf(_this3.projectName + '|' + _this3.relationName)) {
			return;
		}

		msg = msg.split(_this3.className);

		var info = msg[0] || '',
		    data = msg[1] || '';
		info = info.split('|');

		// send from child to parent
		if (_this3.relationName === 'parent' && info.length >= 4 && info[2] == 'ctp') {
			if (info[3] !== 'all') {
				_this3.send(info[3], data);
			} else if (info[3] === 'all') {
				callback(data, e);
				_this3.broadcast(data, 'ptc', info[4]);
			}
		} else {
			callback(data, e);
		}
	};

	if (window.addEventListener) {
		window.addEventListener('message', listenFunc, false);
	} else {
		window.attachEvent('onmessage', listenFunc);
	}

	return this;
};

exports.default = Cross;