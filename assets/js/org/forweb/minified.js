var Engine=function(){function d(a,b,c){if(!document.body)return void console.log(a);b||(b="S"),c||(c=3e3);var e=document.createElement("div"),f="padding:10px;margin:5px;border-radius: 3px;";switch(b){case"S":f+="color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6;";break;case"I":f+="color: #31708f;background-color: #d9edf7;border-color: #9acfea;";break;case"W":f+="color: #8a6d3b;background-color: #fcf8e3;border-color: #f5e79e;";break;case"E":f+="color:#a94442;background-color:#f2dede;border-color:#ebccd1;";break;default:throw"Undefined message type: "+b}e.setAttribute("style",f),e.innerHTML=a,d.container.appendChild(e),null==d.container.parentNode&&document.body.appendChild(d.container),setTimeout(function(){e.remove(),""===d.container.innerHTML&&d.container.remove()},c)}function f(a,b){var c;if(c=null!==e.pathBuilder?e.findPath(a):"assets/js/"+a+".js",!c)throw"Can't load module "+a+" because path is undefined ";var d=document.createElement("script");d.onload=b,d.src=c,document.getElementsByTagName("head")[0].appendChild(d)}function g(d,e,f){if("function"==typeof e?a[d]=e.apply(window,f):a[d]=e,c[d]&&c[d].deferredCallbacks)for(var g=c[d].deferredCallbacks.length-1;g>=0;g--)c[d].deferredCallbacks.pop()();if(b[d])for(var h=0;h<b[d].length;h++)b[d].pop()()}function h(b,d,g){if(e.limit--,e.limit<1)throw"Something wrong, too much modules in project! It look like circular dependency. Othervise, please change Engine.limit property";if(0===d.length)g();else{var i=d.pop(),j=function(){h(b,d,g)};j.toString=function(){return"Callback for "+b},c[i]?a[i]?j():-1===c[i].callers.indexOf(b)&&(c[i].callers.push(b),c[i].deferredCallbacks.push(j)):(c[i]={afterLoad:j,callers:[],deferredCallbacks:[]},f(i,function(){e.log&&e.notify("Script "+i+" was loaded as dependency for: "+b,"S"),c[i].afterLoad()}))}}var a={},b={},c={};d.container=document.createElement("div"),d.container.setAttribute("style","position: fixed; right: 0; top: 0; width: 200px;");var e={pathBuilder:null,limit:500,log:!0,modules:{},load:function(c,d){a[c]?d():(b[c]||(b[c]=[]),b[c].push(d),f(c))},define:function(b,c,d){if(!d)return void g(b,c,[]);c||(c=[]);var f,i=[];if(c)if("string"==typeof c)a[c]||i.push(c);else for(f=0;f<c.length;f++)void 0===a[c[f]]&&i.push(c[f]);if(i.length>0){var j=function(){e.define(b,c,d)};j.toString=function(){return"Callback for "+b+" when all dependencies resolved"},h(b,i,j)}else{var k=[];if(c)if("string"==typeof c)k=[e.require(c)];else for(f=0;f<c.length;f++)k.push(e.require(c[f]));g(b,d,k)}},require:function(b){if(void 0===a[b])throw"Module not instantiated "+b;return a[b]},notify:function(a,b,c){new d(a,b,c)},findPath:function(a){var b;if("function"==typeof e.pathBuilder){if(b=e.pathBuilder(a))return b}else for(var c=0;c<e.pathBuilder.length;c++){var d=e.pathBuilder[c];if(b=d.buildPath(a))return b}throw"Can't find module "+a}};return e}();Engine.define("Ajax",function(){function b(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&a.setRequestHeader(c,b[c])}var a={headers:null};return a.ajax=function(c,d,e){var f=a.getXhr();return f.open(c.type,c.url,!0),b(a.headers),b(c.headers),f.onload=function(){f.status>199&&f.status<300?d(a.process(f,c.responseType),f):e&&e(f)},f.send(c.data),f},a.process=function(a,b){var c=a.responseText;return"text"!==b&&c?JSON.parse(a.responseText):c},a.getXhr=function(){var a=null;try{a=new XMLHttpRequest}catch(b){try{a=new ActiveXObject("Msxml2.XMLHTTP")}catch(b){try{a=new ActiveXObject("Microsoft.XMLHTTP")}catch(c){alert("Hey man, are you using browser?")}}}return a},a}),Engine.define("Rest","Ajax",function(){var a=Engine.require("Ajax"),b={host:null};return b.doGet=function(a,c){return b._onRequest(a,"get",null,c)},b.doPost=function(a,c,d){return b._onRequest(a,"post",c,d)},b.doPut=function(a,c,d){return b._onRequest(a,"put",c,d)},b.doDelete=function(a,c,d){return b._onRequest(a,"delete",c,d)},b._onRequest=function(c,d,e,f){return null!==b.host&&(c=b.host+c),new Promise(function(b,g){a.ajax({responseType:f?f:"json",type:d,url:c,data:"string"==typeof e||"number"==typeof e?e:JSON.stringify(e)},b,g)})},b}),Engine.define("Word",["Rest"],function(){var a=Engine.require("Rest"),b={},c=!1,d=function(a,b,c,e){e||"string"!=typeof c||(e=c,c=b,b="default"),e||(e="text"),"string"==typeof b||c||(c=b,b="default");var f=function(d){c.getAttribute("data-w-key")!==a&&c.setAttribute("data-w-key",a),c.getAttribute("data-w-module")!==b&&c.setAttribute("data-w-module",b),c.getAttribute("data-w-strategy")!==e&&c.setAttribute("data-w-strategy",e),"text"!=e?"append"==e?c.appendChild(document.createTextNode(d)):c.innerHTML=d:c.innerText=d};d.languageLoaded(d.language)?f(d.get(a,b)):d.loadLanguage(d.language,function(){f(d.get(a,b))})};return d.dictionaries={},d.dictionariesPath="assets/js/word/",d.get=function(a,b,c){c||(c=d.language),b||(b="default");var e=d.dictionaries[c];if(e){var f=e[b]||e["default"]||{};return void 0!==f[a]?f[a]:(b?b:"default")+":"+a}return null},d.languageLoaded=function(a){return a||(a=d.language),void 0!==d.dictionaries[a]},d.loadLanguage=function(e,f){return"function"!=typeof e||f?e||(e=d.language):(f=e,e=d.language),b[e]?void("function"==typeof f?b[e].push(f):b[e]=b[e].concat(f)):("function"==typeof f?b[e]=[f]:b[e]=f,void(d.loader?d.loader(e,b[e]):a.doGet(d.dictionariesPath+e+".json").then(function(a){var c={};for(var f in a)if(a.hasOwnProperty(f)){var g=a[f];"string"==typeof g?(c["default"]||(c["default"]={}),c["default"][f]=g):c[f]=g}d.dictionaries[e]=c,d.language=e;for(var h=0;h<b[e].length;h++)b[e][h]()},function(){c?Engine.notify("Can't load language - "+e,"E"):(c=!0,d.loadLanguage("en",b[e]),delete b[e])})))},d.translate=function(a,b){function c(){for(var a=b.getElementsByClassName("word"),c=0;c<a.length;c++){var e=a[c],f=e.getAttribute("data-w-key"),g=e.getAttribute("data-w-module"),h=e.getAttribute("data-w-strategy");f&&d(f,g,e,h)}}a||(a=d.language),b||(b=document.body),d.languageLoaded(a)?(d.language=a,c()):d.loadLanguage(a,c)},d.create=function(a,b){var c=function(c,e,f,g){return"string"!=typeof e&&(f=e,e=null),d(c,e||a,f||b,g)};return c.get=function(b,c){return d.get(b,a,c)},c.languageLoaded=d.languageLoaded,c.loadLanguage=d.loadLanguage,c.translate=d.translate,c},d.language=navigator.language||navigator.userLanguage||"en",d}),Engine.define("Config",function(){function a(a){this.configName=a;try{this.storage=JSON.parse(localStorage.getItem(a))}catch(b){this.storage=null}null==this.storage&&(this.storage={})}return a.prototype.get=function(a){return this.storage[a]},a.prototype.has=function(a){return void 0!==this.get(a)},a.prototype.set=function(a,b){this.storage[a]=b,localStorage.setItem(this.configName,JSON.stringify(this.storage))},a.prototype.remove=function(a){delete this.storage[a],localStorage.setItem(this.configName,JSON.stringify(this.storage))},a.prototype.toString=function(){return"Config instance"},a}),Engine.define("Dom",function(){function b(a,b,c){for(var d in b)if(b.hasOwnProperty(d)){var e=b[d],f=0===d.indexOf("on")?d.substring(2):d;if("function"==typeof e)c(a,f,e);else for(var g=0;g<e.length;g++)c(a,f,e[g])}}void 0!==typeof Element&&(Element.prototype.isDomElement=!0),void 0!==typeof HTMLElement&&(HTMLElement.prototype.isDomElement=!0);var a={};return a.el=function(b,c,d){var e=document.createElement(b);return a.update(e,c),a.append(e,d),e},a.addClass=function(a,b){a.className?-1===a.className.indexOf(b)?a.className+=" "+b:-1===a.className.split(" ").indexOf(b)&&(a.className+=" "+b):a.className=b},a.removeClass=function(a,b){var c=a.className;if(c&&c.indexOf(b)>-1){var d=c.split(" "),e=d.indexOf(b);e>-1&&(d.splice(e,1),a.className=d.join(" "))}},a.hasClass=function(a,b){var c=a.className;return c.indexOf(b)>-1?c.split(" ").indexOf(b)>-1:!1},a.id=function(a){return document.getElementById(a)},a.update=function(a,b){if("string"==typeof b)a.className=b;else if(b)for(var c in b)if(b.hasOwnProperty(c)){var d=b[c];if("function"==typeof b[c]){var e=c;0===e.indexOf("on")&&(e=e.substring(2)),a.addEventListener(e,d)}else"value"===c?a.value=d:a.setAttribute(c,d)}},a.append=function(b,c){if(c)if("string"==typeof c||"number"==typeof c)b.appendChild(document.createTextNode(c+""));else if(c.length&&c.push&&c.pop)for(var d=0;d<c.length;d++){var e=c[d];e&&a.append(b,e)}else if(c.isDomElement)b.appendChild(c);else{if(!c.container)throw"Can't append object";a.append(b,c.container)}},a.addListeners=function(a,c){c||(c=a,a=window),b(a,c,function(a,b,c){a.addEventListener(b,c,!1)})},a.removeListeners=function(a,c){c||(c=a,a=window),b(a,c,function(a,b,c){a.removeEventListener(b,c,!1)})},a.calculateOffset=function(a){var b=0,c=0;if(a.getBoundingClientRect){var d=a.getBoundingClientRect(),e=document.body,f=document.documentElement,g=window.pageYOffset||f.scrollTop||e.scrollTop,h=window.pageXOffset||f.scrollLeft||e.scrollLeft,i=f.clientTop||e.clientTop||0,j=f.clientLeft||e.clientLeft||0;return b=d.top+g-i,c=d.left+h-j,{top:Math.round(b),left:Math.round(c)}}for(;a;)b+=parseInt(a.offsetTop),c+=parseInt(a.offsetLeft),a=a.offsetParent;return{top:b,left:c}},a.insert=function(b,c,d){if(""===b.innerHTML)return void a.append(b,c);if(d||(d=b.childNodes[0]),c)if("string"==typeof c||"number"==typeof c)b.insertBefore(document.createTextNode(c+""),d);else if(c.length&&c.push&&c.pop)for(var e=0;e<c.length;e++){var f=c[e];f&&a.insert(b,f,d)}else if(c.isDomElement)b.insertBefore(c,d);else{if(!c.container)throw"Can't inesert object";a.insert(b,c.container,d)}},a.animate=function(b,c,d,e,f,g){g||(g=0),e||(e=10);var h=function(a,b,c,d){var e=[];for(var f in b)if(b.hasOwnProperty(f)){var g=a.style[f];g||0===g||(g=getComputedStyle(a)[f]),g?g=parseInt(g):(a.style[f]=0,g=0);var h=b[f];!function(b,c,f){a.style[b]=c+"px",e.push(setInterval(function(){c+=f,a.style[b]=c+"px"},d))}(f,g,(h-g)*d/c)}setTimeout(function(){for(var a=0;a<e.length;a++)clearInterval(e[a])},c)};return setTimeout(function(){h(b,c,d,e,f)},g),g+=d,{animate:function(b,c,d,e,f){return a.animate(b,c,d,e,f,g)},then:function(a){setTimeout(function(){a()},g)}}},a}),Engine.define("KeyboardUtils",{translateButton:function(a){switch(a){case 9:return"tab";case 13:return"enter";case 16:return"shift";case 17:return"ctrl";case 18:return"alt";case 20:return"caps lock";case 27:return"esc";case 32:return"space";case 33:return"pg up";case 34:return"pg dn";case 35:return"end";case 36:return"home";case 37:return"ar left";case 38:return"ar top";case 39:return"ar right";case 40:return"ar bottom";case 45:return"ins";case 46:return"del";case 91:return"super";case 96:return"num 0";case 97:return"num 1";case 98:return"num 2";case 99:return"num 3";case 100:return"num 4";case 101:return"num 5";case 102:return"num 6";case 103:return"num 7";case 104:return"num 8";case 105:return"num 9";case 106:return"*";case 107:return"+";case 109:return"-";case 111:return"/";case 112:return"f2";case 113:return"f3";case 114:return"f4";case 115:return"f5";case 116:return"f6";case 117:return"f7";case 119:return"f8";case 120:return"f9";case 121:return"f10";case 122:return"f11";case 123:return"f12";case 144:return"num lock";case 186:return";";case 187:return"=";case 188:return",";case 189:return"-";case 190:return".";case 191:return"/";case 192:return"~";case 219:return"[";case 220:return"\\";case 221:return"]";case 222:return"'";default:return String.fromCharCode(a)}}}),Engine.define("ScreenUtils",{window:function(){var a=window,b="inner";return b+"Width"in window||(b="client",a=document.documentElement||document.body),{width:a[b+"Width"],height:a[b+"Height"]}},monitor:function(){return{width:outerWidth,height:outerHeight}}}),Engine.define("StringUtils",function(){var a=/([a-z])([A-Z])/g,b=/^(\/)|(\/)$/g,c=/\_/g,d=/\-/g,e={unique:function(a){return Math.random().toString(36).substring(2,a?a+2:7)},removeSlashes:function(a){return a.replace(b,"")},capitalize:function(a){return a?a[0].toUpperCase()+a.substring(1):a},normalizeText:function(b,f){if(void 0===f&&(f=" "),b||(b=""),b.indexOf("_")>-1&&(b=b.replace(c," ")),b.indexOf("-")>-1&&(b=b.replace(d," ")),b.match(a)&&(b=b.replace(a,"$1 $2")),b.indexOf(" ")>-1){for(var g=b.split(" "),h="",i=0;i<g.length;i++)g[i]&&(h+=e.capitalize(g[i])+(i!==g.length-1?f:""));return h}return e.capitalize(b)}};return e}),Engine.define("UrlUtils","StringUtils",function(){var a=Engine.require("StringUtils"),b={getPath:function(b){var c=a.removeSlashes(document.location.pathname);return b?c.split("/")[b-1]:c},getQuery:function(a){var b=document.location.search.replace(QUESTION_CHAR,""),c=b.split("&");if(c.length>0)for(var d=a+"=",e=0;e<c.length;e++){if(0===c[e].indexOf(d))return decodeURIComponent(c[e].substring(d.length));if(c[e]===d||c[e]===a)return""}return null},appendQuery:function(a,c){var d=b.getPath(),e=b.getQuery(a);a=encodeURIComponent(a);var f=a+"=",g=c||0===c?f+encodeURIComponent(c):a,h=document.location.search;if(null===e&&""===h)h="?"+g;else{var i=h.replace(/^\?/,"").split("&"),j=!1;if(h.indexOf(a)>-1)for(var k=i.length-1;k>=0;k--)if(0===i[k].indexOf(f)||i[k]===a){i[k]=g,j=!0;break}j||i.push(g),h="?"+i.join("&")}history.push(d+h)},removeQuery:function(a){if(a){var c=document.location.search.replace(QUESTION_CHAR,""),d=c.split("&");if(d.length>0)for(var e=a+"=",f=0;f<d.length;f++)if(0===d[f].indexOf(e)||d[f]===a){d.splice(f,1);var g=b.getPath();history.push(g+(d.length?"?"+d.join("&"):""));break}}}};return b}),Engine.define("Tabs",["Dom"],function(a){var b=function(){this.header=a.el("div","tabs-header"),this.content=a.el("div","tabs-body"),this.container=a.el("div","tabs",[this.header,this.content]),this.tabs=[]};return b.prototype.addTab=function(b,c){var d=!this.tabs.length,e={title:a.el("a",{href:"#","class":"tab-name "+(d?"active":"")},b),body:a.el("div","tab-content"+(d?"":" hidden"),c)};this.tabs.push(e);var f=this;return e.title.onclick=function(b){b.preventDefault();for(var c=0;c<f.tabs.length;c++)a.addClass(f.tabs[c].body,"hidden"),a.removeClass(f.tabs[c].title,"active");a.removeClass(e.body,"hidden"),a.addClass(e.title,"active")},this.header.appendChild(e.title),this.content.appendChild(e.body),this.tabs.length-1},b.prototype.removeTab=function(a){var b=this.tabs.splice(a,1);b.title.remove(!0),b.body.remove(!0)},b}),Engine.define("Pagination",["Dom"],function(a){var b=function(b,c){if(!b||!c)throw"Pagination instantiation error";var d=this;this.refreshButton=a.el("input",{type:"button",value:"Refresh"}),this.refreshButton.onclick=function(a){d.refresh(a)},this.page=a.el("input",{type:"text",value:c}),this.page.onkeyup=function(a){d.onChange(a)},this.pageNumber=c,this.onOpenPage=b,this.previousButton=a.el("input",{type:"button",value:"Previous page"}),this.previousButton.onclick=function(a){d.previous(a)},this.nextButton=a.el("input",{type:"button",value:"Next page"}),this.nextButton.onclick=function(a){d.next(a)},this.container=a.el("form",{"class":"pagination"},[this.refreshButton,this.previousButton,this.page,this.nextButton]),this.container.onsubmit=function(a){d.refresh(a)}};return b.prototype.refresh=function(a){a&&a.preventDefault(),this.openPage(this.pageNumber)},b.prototype.previous=function(a){a&&a.preventDefault(),this.openPage(this.pageNumber>1?this.pageNumber-1:1)},b.prototype.next=function(a){a&&a.preventDefault(),this.openPage(this.pageNumber+1)},b.prototype.openPage=function(a){this.pageNumber=a,this.page.value=a,this.onOpenPage(a)},b.prototype.regexp=/^\d*$/,b.prototype.onChange=function(){this.regexp.test(this.page.value)?(this.pageNumber=parseInt(this.page.value),this.openPage(this.pageNumber)):this.page.value=this.pageNumber},b}),Engine.define("Popup",["Dom","ScreenUtils"],function(){function h(b){b=b||{};var c=this;this.title=a.el("div",null,b.title),this.isOpen=b.isOpen||!1,this.minimized=b.minimized||!1,this.withOverlay=b.withOverlay!==!1,this.drag={active:!1,x:0,y:0,mx:0,my:0},this.listeners={onmousemove:function(a){c.onMouseMove(a)},onkeyup:function(a){c.onKeyUp(a)}},this.initHeader(b),this.body=a.el("div","panel-body"+(this.minimized?" minimized":""),b.content),this.container=a.el("div",{"class":"Popup panel"},[this.header,this.body]),b.isOpen&&this.show()}var a=Engine.require("Dom"),b=Engine.require("ScreenUtils"),c=1e3,d="position:fixed;z-index"+c+";left:0;top:0;width:100%;height:100%;background: rgba(0,0,0,0.4)",e=a.el("div",{style:d}),f=!1,g=0;return h.prototype.initHeader=function(b){var c=a.el("div","control-buttons",[b.controlMinimize===!1?null:a.el("button",{"class":"success small Popup-minimize",onclick:function(){e.minimized?a.removeClass(e.container,"minimized"):a.addClass(e.container,"minimized"),e.minimized=!e.minimized}},a.el("span",null,"_")),b.controlClose===!1?null:a.el("button",{"class":"danger small Popup-close",onclick:function(){e.hide()}},a.el("span",null,"x"))]),d=[c,this.title];this.header=a.el("div","panel-heading",d);var e=this;a.addListeners(this.header,{onmousedown:function(a){a&&(a.preventBubble=!0,a.stopPropagation(),a.preventDefault()),e.onDragStart(a)},onmouseup:function(a){a&&(a.preventBubble=!0,a.stopPropagation(),a.preventDefault()),e.onDragEnd()}})},h.prototype.onMouseMove=function(a){if(this.drag.active){var b=document.body;this.container.style.left=this.drag.x+(a.clientX-this.drag.mx+b.scrollLeft)+"px",this.container.style.top=this.drag.y+(a.clientY-this.drag.my+b.scrollTop)+"px"}},h.prototype.onDragEnd=function(a){this.drag.active=!1},h.prototype.onDragStart=function(a){if(!this.drag.active){this.drag.active=!0,this.drag.x=parseInt(this.container.style.left),this.drag.y=parseInt(this.container.style.top);var b=document.body;this.drag.mx=a.clientX+b.scrollLeft,this.drag.my=a.clientY+b.scrollTop}},h.prototype.show=function(){this.withOverlay&&!f&&document.body.appendChild(e),g++,this.container.style.zIndex=++c,document.body.appendChild(this.container),a.addListeners(this.listeners),this.isOpen||(this.isOpen=!0,this.container.style.top=document.body.scrollTop+30+"px",this.container.style.left=(b.window().width-this.container.offsetWidth)/2+"px")},h.prototype.setContent=function(b){this.body.innerHTML="",a.append(this.body,b)},h.prototype.setTitle=function(b){this.title.innerHTML="",a.append(this.title,b)},h.prototype.onKeyUp=function(a){this.isOpen&&27==a.keyCode&&(a.preventDefault(),this.hide())},h.prototype.hide=function(){g--,this.isOpen=!1,0>g&&(g=0),0===g&&e.remove(),this.container.remove(),a.removeListeners(this.listeners)},h.getParams=function(){return{isOpen:!1,minimized:!1,content:null,title:null,controlClose:!0,controlMinimize:!0,withOverlay:!0}},h}),Engine.define("Menu",["Dom","StringUtils"],function(a,b){function c(b,c){this.container=a.el("div",c||"menu"),this.defaultCallback=b,this.menus=[]}return c.prototype.hide=function(){a.addClass(this.container,"hidden")},c.prototype.show=function(){a.removeClass(this.container,"hidden")},c.prototype.deactivateAll=function(){for(var b=0;b<this.menus.length;b++)a.removeClass(this.menus[b],"active")},c.prototype.menu=function(c,d,e,f){var g=this;"function"!=typeof d||e||(e=d,d=null),c&&!d&&(d=b.normalizeText(c)),!e&&this.defaultCallback&&(e=this.defaultCallback);var h=null,i=a.el("div","menu-item");this.menus.push(i);var j=function(b){f?f(b):(b&&b.preventDefault(),g.deactivateAll()),a.addClass(i,"active")};if(c){var k={href:"/"+c};k.onclick=function(a){j(a),e&&e(c,a)},h=a.el("a",k,d),i.appendChild(h),b.removeSlashes(c)===b.removeSlashes(document.location.pathname)&&j()}var l=null;return this.container.appendChild(i),{menu:function(a,b,c){return g.menu(a,b,c,j)},subMenu:function(b,c,d){var e=g.menu(b,c,d,j);null===l&&(l=a.el("ul"),i.appendChild(l));var f=e.activate;return e.activate=function(a){j(a),f(a)},e.link&&a.addListeners(e.link,{onclick:j}),l.appendChild(a.el("li","submenu",e.item)),e},item:i,link:h}},c}),Engine.define("Grid",["Dom","Pagination","StringUtils"],function(){function d(c){var d=this;if(this.header=a.el("thead"),this.body=a.el("tbody"),this.footer=a.el("tfoot"),!c.columns)throw"columns is required parameter for grid";var e={};this.params=c,c["class"]&&(e["class"]=c["class"]),c.id&&(e.id=c.id),this.table=a.el("table",null,[this.header,this.body,this.footer]),c.data?this.data=c.data:this.data=[];var f=null;c.onOpenPage&&(this.pagination=new b(function(a){c.onOpenPage(a).then(function(a){d.data=a.data,d.update()})},c.page||1),f=this.pagination.container,this.pagination.refresh()),this.fullUpdate(),this.container=a.el("div",null,[f,this.table])}var a=Engine.require("Dom"),b=Engine.require("Pagination"),c=Engine.require("StringUtils");return d.prototype.buildRow=function(b){if(this.params.rowRender)return this.params.rowRender(b);var c=b%2?"odd":"even";return a.el("tr",c)},d.prototype.fullUpdate=function(){this.update();var b=this.params;b["class"]&&a.addClass(this.container,this.params["class"]),b.id&&a.update(this.container,{id:b.id}),this.header.innerHTML="",this.footer.innerHTML="";for(var d=a.el("tr"),e=a.el("tr"),f=0;f<this.params.columns.length;f++){var g=this.params.columns[f],h=g.title||c.normalizeText(g.name);a.append(d,a.el("th",null,h)),g.footer&&a.append(e,g.footer)}this.header.appendChild(d),e.innerHTML&&this.footer.appendChild(e)},d.prototype.update=function(){this.body.innerHTML="";for(var b=this.params.columns,c=this.data,d=0;d<c.length;d++){for(var e=this.buildRow(d),f=0;f<b.length;f++){var g=b[f],h=c[d][g.name];g.render?a.append(e,a.el("td",g["class"],g.render(h,c[d]))):a.append(e,a.el("td",g["class"],h))}a.append(this.body,e)}},d}),Engine.define("AbstractInput",["Dom","StringUtils"],function(a,b){function c(b){if(!b.name)throw"Name is reqired for input";this.input=a.el(this.getElementType(),this.prepareAttributes(b),this.prepareContent(b)),this.label=this.buildLabel(b),this.container=a.el("div","formfield-holder "+(b["class"]||""),[this.label,this.input]),this.errors=null,this.errorsData=null}return c.prototype.removeErrors=function(a){var b={};if(this.errorsData&&a){"string"==typeof a&&(a=[a]);for(var c in this.errorsData)this.errorsData.hasOwnProperty(c)&&-1===a.indexOf(c)&&(b[c]=this.errorsData[c])}this.errorsData={},this.addError(b)},c.prototype.addError=function(b){if(null===this.errors?(this.errors=a.el("div","formfield-errors"),this.container.appendChild(this.errors),this.errorsData={}):this.errors.innerHTML="","string"==typeof b)this.errorsData.custom=b;else for(var c in b)b.hasOwnProperty(c)&&(this.errorsData[c]=b[c]);var d={};for(var e in this.errorsData)this.errorsData.hasOwnProperty(e)&&this.errorsData[e]&&(d[e]=a.el("div","err",this.errorsData[e]),this.errors.appendChild(d[e]));return d},c.prototype.buildLabel=function(c){var d;d=c.noLabel===!0?null:c.label?c.label:b.normalizeText(c.name);var e={"for":this.input.id};return a.el("label",e,d)},c.prototype.getInputType=function(){throw"This function must be overrided"},c.prototype.getElementType=function(){throw"This function must be overrided"},c.prototype.prepareContent=function(a){return null},c.prototype.prepareAttributes=function(a){var c={value:a.value||"",name:a.name,type:this.getInputType(),id:a.id||b.unique()};if(null===c.type&&delete c.type,a.attr)for(var d in a.attr)a.attr.hasOwnProperty(d)&&(c[d]=a.attr[d]);for(var e in a)a.hasOwnProperty(e)&&"function"==typeof a[e]&&(c[e]=a[e]);return c},c.prototype.getValue=function(){return this.input.value},c.prototype.setValue=function(a){this.input.value=a},c}),Engine.define("Checkbox",["Dom","AbstractInput"],function(a,b){function c(c){b.apply(this,arguments),a.append(this.container,[this.input,this.label]),this.input.checked=this._checked,delete this._checked}return c.prototype=Object.create(b.prototype),c.prototype.getElementType=function(){return"input"},c.prototype.getInputType=function(){return"checkbox"},c.prototype.getValue=function(){return this.input.checked},c.prototype.setValue=function(a){this.input.checked=a},c.prototype.prepareAttributes=function(a){var c=b.prototype.prepareAttributes.apply(this,arguments);return this._checked=!!a.value,delete c.value,c},c.prototype.toString=function(){return"Radio("+this.input.name+")"},c.toString=function(){return"Radio"},c.prototype.constructor=c,c}),Engine.define("FieldMeta",function(){function a(a){a||(a={}),this.ignore=a.ignore||!1,this.render=a.render||null,this.wrapper=a.wrapper||null,this.contentBefore=a.contentBefore||null,this.contentAfter=a.contentAfter||null,this.listeners=a.listeners||null,this.validations=a.validations||null,this.removeErrors=a.removeErrors||null,this.errorMessages=a.errorMessages||null,this.options=a.options||null,this.type=a.type||"text",this.label=a.label||null,this.wordKey=a.wordKey||null,this.wordErrorKey=a.wordErrorKey||null}return a}),Engine.define("Text",["Dom","AbstractInput"],function(a,b){function c(a){b.apply(this,arguments)}return c.prototype=Object.create(b.prototype),c.prototype.getElementType=function(){return"input"},c.prototype.getInputType=function(){return"text"},c.prototype.toString=function(){return"Text("+this.input.name+")"},c.toString=function(){return"Text"},c.prototype.constructor=c,c}),Engine.define("Select",["Dom","AbstractInput"],function(a,b){function c(a){b.apply(this,arguments),this.params=a,this.options=a.options,this.update(a.value)}return c.prototype=Object.create(b.prototype),c.prototype.constructor=c,c.prototype.update=function(b){this.input.innerHTML="";for(var c=0;c<this.options.length;c++){var d=this.options[c],e=a.el("option",{value:d.value},d.label);a.append(this.input,e)}},c.prototype.getElementType=function(){return"select"},c.prototype.getInputType=function(){return null},c.prototype.toString=function(){return"Select("+this.input.name+")"},c.toString=function(){return"Select"},c}),Engine.define("Radio",["Dom","AbstractInput"],function(a,b){function c(c){b.apply(this,arguments),this.input.remove(),delete this.input,this.params=c,this.options=c.options,this.inputs=null,this.optionsContainer=a.el("div"),this.update(c.value),this.container.appendChild(this.optionsContainer),a.insert(this.label,this.input)}return c.prototype=Object.create(b.prototype),c.prototype.constructor=c,c.prototype.update=function(b){this.optionsContainer.innerHTML="",this.inputs=[];for(var c=this.params.name,d=0;d<this.options.length;d++){var e=this.options[d],f=a.el("input",{type:"radio",id:c+"_"+e.value,name:c,value:e.value});(e.value===this.getValue()||e.value===b)&&(f.checked=!0);var g={};for(var h in this.params)this.params.hasOwnProperty(h)&&0===(h+"").indexOf("on")&&"function"==typeof this.params[h]&&(g[h]=this.params[h]);a.addListeners(f,g),this.inputs.push(f),this.optionsContainer.appendChild(a.el("label",{"for":c+"_"+e.value},[f,e.label]))}},c.prototype.getElementType=function(){return"input"},c.prototype.getInputType=function(){return""},c.prototype.getValue=function(){for(var a=0;a<this.inputs.length;a++)if(this.inputs[a].checked)return this.inputs[a].value;return""},c.prototype.toString=function(){return"Radio("+this.input.name+")"},c.toString=function(){return"Radio"},c}),Engine.define("Password",["Dom","AbstractInput"],function(a,b){function c(c){b.apply(this,arguments),this.showChars=c.showChars||!1;var d=this;this.toggler=a.el("a",{href:"#",onclick:function(a){a.preventDefault(),d.toggleInput()}},[this.getTogglerContent()]),this.container.appendChild(this.toggler)}return c.prototype=Object.create(b.prototype),c.prototype.getElementType=function(){return"input"},c.prototype.toggleInput=function(){this.showChars=!this.showChars,this.input.type=this.getInputType(),this.toggler.innerHTML=this.getTogglerContent()},c.prototype.getTogglerContent=function(){return this.showChars?"Hide":"Show"},c.prototype.getInputType=function(){return this.showChars?"text":"password"},c.toString=function(){return"Password"},c.prototype.constructor=c,c}),Engine.define("Textarea",["Dom","AbstractInput"],function(a,b){function c(a){b.apply(this,arguments)}return c.prototype=Object.create(b.prototype),c.prototype.getElementType=function(){return"textarea"},c.prototype.getInputType=function(){return null},c.toString=function(){return"Textarea"},c.prototype.constructor=c,c}),Engine.define("Validation",function(){function c(a){if("string"==typeof a){if(void 0===b[a]){for(var c=a.split(" "),d={},e=0;e<c.length;e++){var f=c[e].split(":"),g=f.shift();d[g]=f}b[a]=d}a=b[a]}else if(!Array.isArray(a))for(var h in a)a.hasOwnProperty(h)&&!Array.isArray(a[h])&&(a[h]=[a[h]]);return a?a:{}}var a=/^([a-zA-Z0-9_.+-])+\@(([cd a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,b={},d={validate:function(a,b){b=c(b);var e=[];for(var f in b){if(!b.hasOwnProperty(f)||!d.rules.hasOwnProperty(f))throw"Unknown validation rule: "+f+". Please use one of the following: "+Object.keys(d.rules);var g=d.rules[f].apply(d.rules,[].concat(a,b[f]));g||e.push(f)}return e},messages:{required:"Can't be empty.",max:"Number is too large.",min:"Number is too small.",length:"This is not valid length.",email:"Invalid email address",number:"Value is not a number",positive:"Value is not a positive number",negative:"Value is not a negative number",time:"Invalid time format",dateString:"Invalid date format.",timeString:"Invalid time format, must be hh:mm:ss.","default":"Something wrong."},rules:{required:function(a,b){if(!a)return!1;if("lazy"===b)return"0"===a||a.trim&&""===a.trim()?!1:!!a;if("checkboxes"===b){for(var c in a)if(a.hasOwnProperty(c)&&a[c])return!0;return!1}return!!a},max:function(a,b){return a||(a=0),parseInt(a)<=b},min:function(a,b){return a||(a=0),parseInt(a)>=b},length:function(a,b,c){return a||(a=""),(void 0===c?!0:a.length<=c)&&a.length>=b},pattern:function(a,b){return b.test(a)},number:function(a){return a?d.rules.pattern(a,/^(-?\d*)$/g):!0},positive:function(a){return d.rules.pattern(a,/^(\d*)$/g)},negative:function(a){return d.rules.pattern(a,/^(-\d*)$/g)},email:function(b){return d.rules.pattern(b,a)},time:function(a){if(!a)return!0;var b=/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;return b.test(a)},custom:function(a,b){return b(a)}}};return d}),Engine.define("UrlResolver",["StringUtils"],function(a){function b(a){this.mapping=[],this.strategy=a||"path"}return b.prototype.resolve=function(b){b=a.removeSlashes(b),""===b&&(b="home");for(var e,c=this.mapping,d=b.split("/"),f=null,g=0;g<c.length;g++){var h=!1;e={};var i=c[g],j=i.data;if(j.length===d.length||"*"===j[j.length-1]){h=!0,f=i.app,e={};for(var k=0;k<j.length;k++){var l=j[k];if(l.dynamic)e[l.name]=d[k];else if(l.name!==d[k]&&"*"!==l.name){h=!1;break}}}if(h){f=i.app;break}e={},f=""}return"home"===b&&(b=""),{params:e,app:f,url:b}},b.prototype.addMapping=function(a,b){if("string"!=typeof a||"string"!=typeof b)throw"Invalid arguments exception";for(var c=this.mapping,d=this.parseUrl(b),e=0;c>e;e++){var f=c[e].data,g=f.length===d.length;if(g)for(var h=0;h<f.length;h++){var i=f[h],j=d[h];if(!i.dynamic&&!j.dynamic&&i.name!==j.name){g=!1;break}}if(g)throw"Can't put two items with same request mapping: "+b}c.push({app:a,data:d})},b.prototype.parseUrl=function(b){b=a.removeSlashes(b);for(var c=b.split("/"),d=[],e=0;e<c.length;e++){var f=c[e],g=":"==f[0];g&&(f=f.substring(1)),d.push({name:f,dynamic:g})}return d},b}),Engine.define("AbstractFieldsContainer",["Dom","Text","Textarea","Radio","Select","Checkbox","Validation","Password","Word"],function(){function j(c,d,e){var f=[];this.fields={},this.word=e.wordKey?b.create(e.wordKey):null,this.model=c,this.containerMeta=e,d||(d={}),this.meta=d;for(var g in c)if(c.hasOwnProperty(g)){var i,h=c[g],j=null,k=d[g];if(k!==!1){if(k){if(k.ignore)continue;i=k.render?"function"==typeof k.render?k.render(this.onChange,g,h):k.render:this.buildInput(g,h,k);var l=["function"==typeof k.contentBefore?k.contentBefore(g,h):k.contentBefore,i.container,"function"==typeof k.contentAfter?k.contentAfter(g,h):k.contentAfter];if(k.wrapper){var m=k.wrapper;"function"==typeof m?f.push(m(l,g,h)):(a.append(m,l),-1===f.indexOf(m)&&f.push(m))}else f=f.concat(l);j=k.wordKey||null}else i=this.buildInput(g,h,null),f.push(i.container);e.wordKey&&i.label&&this.word(j||"label_"+g,i.label),this.fields[g]=i}}this.container=this.createContainer(),a.append(this.container,f)}var a=Engine.require("Dom"),b=Engine.require("Word"),c=Engine.require("Text"),d=Engine.require("Radio"),e=Engine.require("Select"),f=Engine.require("Checkbox"),g=Engine.require("Password"),h=Engine.require("Textarea"),i=Engine.require("Validation");
    return j.resolvers=[function(a,b,c){return"select"===c||a.options&&a.options.length>3?new e(a):null},function(a,b,c){return"radio"===c||a.options&&a.options.length>3?new d(a):null},function(a,b,c){return"checkbox"===c||"boolean"==typeof a.value?new f(a):null},function(a,b,c){return"password"===c||"string"==typeof a.name&&a.name.toLowerCase().indexOf("pass")>-1?new g(a):null},function(a,b,c){return"textarea"===c||"string"==typeof a.value&&(a.value.indexOf("\n")>-1||a.value.length>40)?new h(a):null},function(a,b,d){return"text"===d||"object"!=typeof a.value?new c(a):null}],j.prototype.validateField=function(a){var b=this.meta[a],c=this.fields[a];if(c instanceof j)return c.validate();if(!b||b.ignore===!0)return!0;var d=this.model[a];if(b.removeErrors?b.removeErrors():c.removeErrors&&c.removeErrors(),b.validations){var e=i.validate(d,b.validations);if(e.length>0){var f=this.findErrorMessages(b,e);if(b.addError)b.addError(f);else if(c.addError){var g=c.addError(f);if(this.word)for(var h in g)if(g.hasOwnProperty(h)){var l,k=g[h];b.wordErrorKey&&(l="string"==typeof b.wordErrorKey?b.wordErrorKey:b.wordErrorKey[h]),this.word(l||"error_"+a,k)}}return!1}return!0}return!0},j.prototype.validate=function(){if(this.meta){var a=!0;for(var b in this.meta)if(this.meta.hasOwnProperty(b)){var c=this.validateField(b);a&&!c&&(a=!1)}return a}return!0},j.prototype.findErrorMessages=function(a,b){for(var c={},d=0;d<b.length;d++){var e=b[d];a&&"string"==typeof a.errorMessages?c[e]=a.errorMessages:a&&a.errorMessages&&void 0!==a.errorMessages[e]?c[e]=a.errorMessages[e]:void 0!==i.messages[e]?c[e]=i.messages[e]:c[e]=i.messages["default"]}return c},j.prototype.onChange=function(a,b){this.model[a]=b,this.validateField(a)},j.prototype.buildInput=function(a,b,c){var d=this,e=null,f=null,g={name:a,value:b},h=null;c&&(f=c.listeners,g.options=c.options||null,g.label=c.label||null,c.label===!1&&(g.noLabel=!0),h=c.type||null);var i=null,k=null;if(f){"function"==typeof f&&(f={onchange:f});for(var l in f)if(f.hasOwnProperty(l)){var m=l.toLowerCase(),n=f[l];"onchange"===m||"change"===m?i=n:"onkeyup"===m||"keyup"===m?k=n:g[l]=n}}g.onchange=function(b){d.onChange(a,e.getValue()),i&&i(b)},g.onkeyup=function(b){d.onChange(a,e.getValue()),k&&k(b)};for(var o=0;o<j.resolvers.length&&(e=j.resolvers[o](g,c,h),null==e);o++);if(null!=e)return e;throw"Can't instantiate field for "-g.value},j}),Engine.define("GenericFieldset",["Dom","AbstractFieldsContainer"],function(){function c(a,c,d){b.apply(this,arguments)}var a=Engine.require("Dom"),b=Engine.require("AbstractFieldsContainer");return c.prototype=Object.create(b.prototype),b.resolvers.unshift(function(a,b,d){return"fieldset"===d||"object"==typeof a.value?new c(a.value,b.metaData,b):null}),c.prototype.createContainer=function(){var b={},c=this.containerMeta||{};c.id&&(b.id=c.id),c["class"]&&(b["class"]=c["class"]);var d;return c.legend===!1?d=null:"string"==typeof c.legend&&(d=a.el("legend",null,c.legend)),this.word&&c.wordLegend?this.word(c.wordLegend,d):!d&&c.legend&&(d=c.legend),a.el("fieldset",b,d)},c}),Engine.define("GenericForm",["AbstractFieldsContainer","Dom"],function(){function c(d,e,f){b.apply(this,c.prepareArguments(d,e,f)),f||(f=e),f.submitButton===!1?this.submit=null:f.submitButton?this.submit=f.submitButton:this.submit=a.el("div",null,a.el("input",{type:"submit","class":"primary",value:"Submit"})),a.append(this.container,this.submit)}var a=Engine.require("Dom"),b=Engine.require("AbstractFieldsContainer");return c.prototype=Object.create(b.prototype),c.prepareArguments=function(a,b,c){if(void 0===c&&(c=b,b=null),"function"==typeof c&&(c={onSubmit:c}),!c.onSubmit)throw"onSubmit is required for generic form";return[a,b,c]},c.prototype.createContainer=function(){var b=this,c={onsubmit:function(a){b.onSubmit(a)}},d=this.containerMeta||{};d["class"]&&(c["class"]=d["class"]),d.id&&(c.id=d.id);var e=null;return"string"==typeof d.title?e=a.el("h3",null,d.title):d.title&&(e=d.title),a.el("form",c,e)},c.prototype.onSubmit=function(a){a&&a.preventDefault(),this.validate()&&this.containerMeta.onSubmit(this.model)},c}),Engine.define("Dispatcher",["Dom","UrlResolver","UrlUtils"],function(){function e(a,c,d,e){var j=a.applications[d];if(!j)throw"Undefined application "+d;var k=function(){a.context&&(a.context.request=c)},l=function(a){var d=h(a),e=b.getPath();if(c.url!==e){var f=document.location.hash;this.history.pushState({},d,"/"+(c.url||"")+(f||""))}};if(a.applicationName===d&&a.activeApplication.canStay){k(),l(a.activeApplication);var m=a.activeApplication.canStay();if(m!==!1)return}g(a,d),k();var n=f(a,j);l(n),i(a,n,c.params,e,d)}function f(a,b){var c,d=function(b,c){a.placeApplication(b,c)};return"function"==typeof b?c=new b(a.context,d):(c=b,c.init&&c.init(a.context,d)),c}function g(a){var b=a.activeApplication;if(b){var c=a.applicationName;a.fireEvent("beforeClose",c),b.beforeClose&&b.beforeClose(),a.app.innerHTML="",b.afterClose&&b.afterClose(),a.fireEvent("afterClose",c)}}function h(a){return a.getTitle?a.getTitle():a.TITLE||a.title?a.TITLE||a.title:""}function i(a,b,c,d,e){a.fireEvent("beforeOpen",e),a.activeApplication=b,a.applicationName=e,b.beforeOpen&&b.beforeOpen(c,d),b.container&&a.app.appendChild(b.container),b.afterOpen&&b.afterOpen(c,d),a.fireEvent("afterOpen",e)}var a=Engine.require("Dom"),b=Engine.require("UrlUtils"),c=Engine.require("UrlResolver"),d=function(d,e,f){this.app="string"==typeof d?a.id(d):d,this.context=e||{},this.applications={},this.applicationName=null,this.activeApplication=null,this.history=history,this.urlResolver=f||new c;var g=this,h=function(){if(g.urlResolver){var a=b.getPath();g.placeApplication(a)}};a.addListeners({onpopstate:h}),this.events=null};return d.prototype.addMapping=function(a,b){this.urlResolver.addMapping(a,b)},d.prototype.addListener=function(a,b){switch(b||(b=a,a="afterOpen"),a){case"beforeOpen":case"afterOpen":case"beforeClose":case"afterClose":break;default:throw"Unknown event: "+a}null===this.events&&(this.events={}),this.events[a]||(this.events[a]=[]),this.events[a].push(b)},d.prototype.placeApplication=function(a,c){a||(a=b.getPath());var g,d=this,f=d.urlResolver.resolve(a);g=f.app?f.app:"Page404";var h=d.applications[g];h?e(d,f,g,c):Engine.load(g,function(){d.applications[g]=Engine.require(g),e(d,f,g,c)})},d.prototype.fireEvent=function(a,b){if(null!==this.events&&this.events[a])for(var c=this.events[a],d=0;d<c.length;d++)c[d](b)},d});