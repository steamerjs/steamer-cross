CrossJS 易用跨域库
==============

特性
==============
* 简单易用，部署类似jQuery的Ajax方法
* 无依赖，代码是原生javascript,免去第三方库
* 跨浏览器支持, 支持IE6+, Chrome, Firefox2.0+, Safari

开始使用
==============

CrossJS的使用相当快捷，而且仿照jQuery的Ajax部署格式。一般来说，跨域至少需要两个页面，请求页面以及反馈页面。首先两个页面都在body底部引用资源*cross.js*。

<script type="text/javascript" src="/cross.js"></script>

然后，在请求页面输入下面javascript代码

``` javascript
    cx(
        {
            url: 'http://leehey.org/crossjs/cross_browser/data.html',
            processData: function() {
                return "data from index.html";
            },
            beforesend: function() {
                //before send process
            },
            success: function(data) {
                //process data
            },
            complete: function() {
                //complete process
            },
            error: function(e) {
                //error message
            }
        }
    ).request();  
```

接着在反馈页面输入下面代码
``` javascript
    cx(
        {
            url: 'http://crossjs.leehey.org/cross_browser/index.html',
            processData: function() {
                return "data from data.html";
            },
            beforesend: function() {
                //before send process
            },
            success: function(data) {
                //process data
            },
            complete: function() {
                //complete process
            },
            error: function(e) {
                //error message
            }
        }
    ).response();
```

以上代码即可完成最基本的跨域页面信息双向传递。

如果你想用HTML加载的iframe而非crossJS帮你自动生成，你可以先在body里面建立一个iframe，指向你需要的反馈页面，例如

```
<iframe id="dataFrame" src="http://leehey.org/crossjs/cross_browser/data.html" width="100px" height="100px"></iframe>
```

然后请求页面里面，初始化的url选项改成frameSrc选项。更详细代码可以参考cross_browser里面的代码。

``` javascript
frameSrc: document.getElementById('dataFrame')
```


深入了解crossJS
==============
如果是想进行dom的操作，两个页面的javascript代码会有所不同。请求页面的代码如下:
``` javascript
    cx(
        {
            url: 'http://leehey.org/crossjs/demo/dom/target.html',
            type: 'dom',
            domain: 'leehey.org',
            beforesend: function() {
                //process before send
            },
            success: function(data) {
                //process data
            },
            complete: function() {
                //complete process
            },
            error: function(e) {
                //error message
            }
        }
    ).request();  
```
反馈页面的代码如下:
``` javascript
    cx(
        {
            frameSrc: 'http://crossjs.leehey.org/demo/dom/',
            type: 'dom',
            domain: 'leehey.org',
            beforesend: function() {
                //process before send
            },
            success: function(data) {
                //process data
            },
            complete: function() {
                //complete process
            },
            error: function(e) {
                //error message
            }
        }
    ).response();  
```



案例
==============
* 操作dom http://crossjs.leehey.org/demo/dom/


跨域知识点和实现中的坑
==============
此页介绍跨域实现中的各种方法和坑

下面是crossJS实现的各种跨域方法demo页面
<b>单向通信</b>
* Cross Origin Resources Sharing(cors) http://crossjs.leehey.org/cors/
* jsonp http://crossjs.leehey.org/jsonp/
* window.name http://crossjs.leehey.org/window_name/
* location.hash http://crossjs.leehey.org/location_hash/

<b>双向通信</b>
* document.domain http://crossjs.leehey.org/cross_browser/
* postMessage http://crossjs.leehey.org/postmessage/
* window.navigator http://crossjs.leehey.org/window_navigator/

选项
==============
<table>
<thead>
	<tr>
		<td>选项</td>
		<td>适用</td>
		<td>数值</td>
		<td>解释</td>
	</tr>
</thead>
<tbody>
	<tr>
		<td>url</td>
		<td>所有方法</td>
		<td>String</td>
		<td>请求/反馈的页面url</td>
	</tr>
	<tr>
		<td>frameSrc</td>
		<td>除cors及jsonp外</td>
		<td>iframe HTML Element</td>
		<td>发送请求的iframe</td>
	</tr>
	<tr>
		<td>removeFrame</td>
		<td>适用于需要建立iframe的方法</td>
		<td>Boolean (true | false)</td>
		<td>是否在完成后去除removeFrame</td>
	</tr>
	<tr>
		<td>method</td>
		<td>适用于cors方法</td>
		<td>String (GET | POST)</td>
		<td>需要发送请求的方法</td>
	</tr>
	<tr>
		<td>domain/td>
		<td>适用于document.domain方法</td>
		<td>String</td>
		<td>请求页与反馈页统一的domain</td>
	</tr>
	<tr>
		<td>processData</td>
		<td>适用于单向通信的cors中的request, location.hash和window.name的response,双向通信的window.nagvigator和postMessage的request和response</td>
		<td>Function</td>
		<td>将需要发送给iframe的数据return即可</td>
	</tr>
	<tr>
		<td>beforesend</td>
		<td>除proxy页和window.name的反馈页外</td>
		<td>Function</td>
		<td>信息发送前回调函数</td>
	</tr>
	<tr>
		<td>success</td>
		<td>适用于双向通信的request和response页以及单向通信的request页</td>
		<td>Function</td>
		<td>数据获取回调函数</td>
	</tr>
	<tr>
		<td>complete</td>
		<td>除location_hash的proxy页和反馈页以及window.name的反馈页外</td>
		<td>Function</td>
		<td>信息接收完成回调函数</td>
	</tr>
	<tr>
		<td>error</td>
		<td>所有方法</td>
		<td>Function</td>
		<td>错误回调函数</td>
	</tr>
</tbody>
</table>

