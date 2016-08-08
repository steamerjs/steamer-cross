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
	// listen callbacks
	this.listeners = [];
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
Cross.prototype.init = function () {
	if (!window.postMessage) {
		throw new Error('"steamer-cross: your browser does not support postMessage"');
	}

	this._listen();
};

/**
 * [register target and window]
 * @param  {String} targetName [target iframe/window name]
 * @param  {Window} target     [window object]
 * @return {Object}            [this]
 */
Cross.prototype.register = function (targetName, target) {
	// projectName|targetName
	var key = this.projectName + '|' + targetName;
	if (!this.targets.hasOwnProperty(key)) {
		var t = {
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
Cross.prototype.unregister = function () {
	var _this = this;

	var targetName = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


	setTimeout(function () {
		if (_this.targets.hasOwnProperty(targetName)) {
			delete _this.targets[targetName];
		}
		// targetName = null, clear all targets
		else if (!targetName) {
				_this.targets = {};
			}
	}, 0);

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
Cross.prototype.encryptMsg = function (projectTargetName, msg) {
	var direction = arguments.length <= 2 || arguments[2] === undefined ? 'ptc' : arguments[2];
	var destinationName = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

	destinationName = destinationName ? '|' + destinationName : '';
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
Cross.prototype.broadcast = function (msg) {
	var _this2 = this;

	var direction = arguments.length <= 1 || arguments[1] === undefined ? 'ptc' : arguments[1];
	var ignoreTargetName = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

	setTimeout(function () {
		// current window is parent, start broadcasting
		if (_this2.relationName === 'parent') {
			// prevent the broadcasting message sent by child sending back to this child again
			var ignoreKey = _this2.projectName + '|' + ignoreTargetName;
			for (var key in _this2.targets) {
				if (key !== ignoreKey) {
					var targetUrl = _this2.targets[key].target.location.href;
					_this2.targets[key].target.postMessage(_this2.encryptMsg(key, msg, direction), targetUrl);
				}
			}
		}
		// if not parent, send back to parent first, then parent will handle it
		else {
				_this2.send('parent', msg, 'ctp', 'all|' + _this2.relationName);
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
Cross.prototype.send = function (targetName, msg) {
	var _this3 = this;

	var direction = arguments.length <= 2 || arguments[2] === undefined ? 'ptc' : arguments[2];
	var destinationName = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

	setTimeout(function () {
		var key = _this3.projectName + '|' + targetName;

		if (_this3.targets.hasOwnProperty(key)) {
			var targetUrl = _this3.targets[key].target.location.href;
			_this3.targets[key].target.postMessage(_this3.encryptMsg(key, msg, direction, destinationName), targetUrl);
		}
		// if current window is not parent, send back to parent first to handle it
		else if (_this3.relationName !== 'parent') {
				_this3.send('parent', msg, 'ctp', targetName);
			} else {
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
	if (typeof callback === 'function') {
		this.listeners.push(callback);
	}
	return this;
};

Cross.prototype._triggerListeners = function (data, e) {
	for (var i = 0, len = this.listeners.length; i < len; i++) {
		this.listeners[i](data, e);
	}
};

Cross.prototype._listen = function () {
	var _this4 = this;

	var listenFunc = function listenFunc(e) {

		_this4.register('parent', e.source);

		var msg = e.data;

		// filter msg from other projects
		if (!~msg.indexOf(_this4.projectName + '|' + _this4.relationName)) {
			return _this4;
		}

		msg = msg.split(_this4.className);

		var info = msg[0] || '',
		    data = msg[1] || '';
		info = info.split('|');

		// send from child to parent
		// parent handle message sent from children here
		if (_this4.relationName === 'parent' && info.length >= 4 && info[2] == 'ctp') {

			if (info[3] !== 'all') {
				// child A send message to child B
				// info[3] => child B targetName
				_this4.send(info[3], data);
			}
			// all => broadcast
			else if (info[3] === 'all') {
					// parent will also receive broadcasting message
					_this4._triggerListeners(data, e);
					// parent broadcast the message to other children
					// info[4] => the child which broadcast message 
					_this4.broadcast(data, 'ptc', info[4]);
				}
		} else {
			_this4._triggerListeners(data, e);
		}
	};

	if (window.addEventListener) {
		window.addEventListener('message', listenFunc, false);
	} else {
		window.attachEvent('onmessage', listenFunc);
	}
};

exports.default = Cross;