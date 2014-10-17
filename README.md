cross.js README
==============

<h1>跨域框架crossJS</h1>

<h3><b>特别感谢鹏辉童鞋</b></h3>

<h3>灵感</h3>
<p>由于业务需要，需要了解各种各样不同的跨域方式。但由于各种方式千奇百怪，我觉得有必要将各种方法封闭起来，方便使用。结构上，受jQuery Ajax的启发，希望也有beforesend, success和complete等比较固定的方法，希望让整个更为固定。</p>
<p>本文主不会详细述说各种方法的具体实现，具体的办法可以点击后文参考资料里面的三篇文章。本文只会提及实现过程中的一些坑，以及框架的实现办法。具体的实现方法，可以参考cross.js文件，各种办法的实现，可以看对应文件夹里面的文件。</p>

<h3>跨域方法 -- 单向</h3>
<h4>jsonp</h4>
<p>这是最直观的办法，只需要一个页面，在页面内包含一个指向数据页面的script tag，然后在src后面多加一个回调函数即可以获取数据。</p>

<h4>location.hash</h4>
<p>这个办法坑比较多，网上的办法会有些问题。这个办法需要三个页面，分别是主调用页(index.html), 数据页(data.html),和代理页(proxy.html)。实质的结构是，index.html里有一个iframe指向data.html，而data.html里又有一个iframe指向proxy.html。要注意的是,index.html和proxy.html主域和子域都相同，只有data.html是异域，因此当data.html生成数据时，将数据放在proxy.html链接的hash(#)后面，然后再由proxy.html里的代码通过parent.parent这样的调用，将数据放到proxy.html的祖父index.html的链接上面。</p>

<p>大多数教程都是停留在这一步。这是不够的，还需要在index.html里面设置一个setInterval去监听index.html中#的变化，进而获取数据。据说有些高端浏览器里面可以直接用hashchange来监听，但低端的话最好还是用setInterval。因此框架里面用setInterval实现。</p>

<h4>window.name</h4>
<p>由于window.name在iframe的src的变化时不会改变，所以这个办法也可以用于跨域。这个方式虽然也需要跟location.hash也需要三个页面，但proxy.html的作用非常次要。由于data.html能够直接对window.name写值，因此写值完毕后，只需要将src改成与index.html主域和子域一致的页面，就可以让index.html直接调用了。</p>


<h3>跨域方法 -- 双向</h3>
<h4>document.domain</h4>
<p>这个办法对于主调用页(index.html)和数据页(data.html)而言是双向的，即两个页面都可以得到对方的数据(主要是DOM元素)。实质就是index.html包含一个指向data.html的iframe，然后在data.html中改变document.domain，使之和index.html的document.domain是一样的，这样就可以使两个页面互相调用对方的数据。唯一的缺点是只能应用于子域不同，但主域相同的两个页面。</p>

<h4>postMessage</h4>
<p>网上大部份教程都只教从index.html传数据到data.html。其实data.html也可以发数据到index.html。实现方法一样，只要在data.html里面发送的地址跟index.html的地址一样就可以了。否则浏览器会报错。这是比较优秀的一个办法，缺点是旧式浏览器并不支持。</p>

<h4>cross origin resource sharing (cors)</h4>
<p>这个办法前后端都涉及，因此前端的同学需要后端的配合。其实质只是一个ajax，可以接收除了post和get之后的其它服务器请求例如put。后端需要修改的是.htaccess文件。加入以下一句</p>
<pre>
Header set Access-Control-Allow-Origin *
</pre>
<p>符号*代表接收任意的HTTP请求，你也可以通过修改，限制接受请求的域名或者IP地址。</p>


<h3>参考资料</h3>
<p>
<ul>
	<li><a target="blank" href="http://targetkiller.net/cross-domain/">浅谈跨域</li>
	<li><a target="blank" href="http://blog.csdn.net/hfahe/article/details/7730944">HTML5安全：CORS（跨域资源共享）简介</li>
	<li><a target="blank" href="http://www.oschina.net/question/12_15673">JavaScript最全的10种跨域共享的方法</li>
</ul>
</p>

