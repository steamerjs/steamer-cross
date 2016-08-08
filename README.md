## steamer-cross
cross domain communication for development


## Features
* Bi-drectional communication
	- parent can send/broadcast message to children
	- chidren can send/broadcast message to parent and other children
* Chaining method
	- ie, cross.register().send()
* Iframe And New Window Supported
	- IE8 - IE9 may have problems in new window communication
* Exclude Support For IE6 and IE7


## Usage
### Parent Send Message to Children

#### Send message to specific child
```
var cross = new Cross('project1', 'parent');
cross.register('iframe1', document.getElementById('iframe1').contentWindow);

cross.send('iframe1', "hello ifram1, from parent");
```

#### Broadcast message to all children
```
var cross = new Cross('project1', 'parent');

// chaining methods
var window1 = window.open('./window1.html');
cross.register('iframe1', document.getElementById('iframe1').contentWindow)
	 .register('iframe2', document.getElementById('iframe2').contentWindow)
	 .register('window1', window1);

cross.broadcast("broadcast message, from parent");
```

#### Listen to message
```
var cross = new Cross('project1', 'iframe1');

cross.listen(function(msg, event) {
	// do something here
});
```

#### Clear registration
```
// unregister specific child
var cross = new Cross('project', 'parent');
cross.register('iframe1', document.getElementById('iframe1').contentWindow);
cross.unregister('iframe1');

// unregister all children
cross.unregister();
```

### Child Send Message to Parent or Other Children
#### Send message to parent
```
var cross = new Cross('project', 'iframe1');
// if current window is iframe, use window.parent as parent reference
cross.register('parent', window.parent)
      send('parent', 'hello parent, from iframe1');
```

#### Send message to specific child
```
var cross = new Cross('project', 'window1');
// if current window is a new window, use window.opener as parent reference
cross.register('parent', window.opener)
	 .send('iframe2', 'hello ifram2, from iframe1');
```

#### Broadcast message to parent and all children
```
var cross = new Cross('project', 'iframe1');
cross.register('parent', window.parent)
	 .broadcast('broadcast from iframe1, project1');
```

## Demo
Please checkout the repo, and take a look at `test` folder