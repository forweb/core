var Engine=function(){function e(t,n,i){if(!document.body)return void console.log(t);n||(n="S"),i||(i=3e3);var r=document.createElement("div"),o="padding:10px;margin:5px;border-radius: 3px;";switch(n){case"S":o+="color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6;";break;case"E":o+="color:#a94442;background-color:#f2dede;border-color:#ebccd1;";break;default:throw"Undefined message type: "+n}r.setAttribute("style",o),r.innerHTML=t,e.container.appendChild(r),null==e.container.parentNode&&document.body.appendChild(e.container),setTimeout(function(){r.remove(),""===e.container.innerHTML&&e.container.remove()},i)}function t(e,t){var n;if(n=null!==s.pathBuilder?s.findPath(e):"js/"+e+".js",!n)throw"Can't load module "+e+" because path is undefined ";var i=document.createElement("script");i.onload=t,i.src=n,document.getElementsByTagName("head")[0].appendChild(i)}function n(e,t,n){if(r[e]="function"==typeof t?t.apply(window,n):t,a[e]&&a[e].deferredCallbacks)for(var i=a[e].deferredCallbacks.length-1;i>=0;i--)a[e].deferredCallbacks.pop()();if(o[e])for(var s=0;s<o[e].length;s++)o[e].pop()()}function i(e,n,o){if(s.limit--,s.limit<1)throw"Something wrong, too much modules in project! It look like circular dependency. Othervise, please change Engine.limit property";if(0===n.length)o();else{var u=n.pop(),l=function(){i(e,n,o)};l.toString=function(){return"Callback for "+e},a[u]?r[u]?l():-1===a[u].callers.indexOf(e)&&(a[u].callers.push(e),a[u].deferredCallbacks.push(l)):(a[u]={afterLoad:l,callers:[],deferredCallbacks:[]},t(u,function(){s.log&&s.console("Script "+u+" was loaded as dependency for: "+e,"S"),a[u].afterLoad()}))}}var r={},o={},a={};e.container=document.createElement("div"),e.container.setAttribute("style","position: fixed; right: 0; top: 0; width: 200px;");var s={pathBuilder:null,limit:500,log:!0,modules:{},load:function(e,n){r[e]?n():(o[e]||(o[e]=[]),o[e].push(n),t(e))},define:function(e,t,o){if(!o)return void n(e,t,[]);t||(t=[]);var a,u=[];if(t)if("string"==typeof t)r[t]||u.push(t);else for(a=0;a<t.length;a++)void 0===r[t[a]]&&u.push(t[a]);if(u.length>0){var l=function(){s.define(e,t,o)};l.toString=function(){return"Callback for "+e+" when all dependencies resolved"},i(e,u,l)}else{var p=[];if(t)if("string"==typeof t)p=[s.require(t)];else for(a=0;a<t.length;a++)p.push(s.require(t[a]));n(e,o,p)}},require:function(e){if(void 0===r[e])throw"Module not instantiated "+e;return r[e]},console:function(t,n){new e(t,n)},findPath:function(e){for(var t=0;t<s.pathBuilder.length;t++){var n=s.pathBuilder[t],i=n.buildPath(e);if(i)return i}throw"Can't find module "+e}};return s}();Engine.define("Ajax",function(){var e={headers:null};return e.ajax=function(t,n,i){var r=e.getXhr();r.open(t.type,t.url,!0);var o=e.headers;if(o)for(var a in o)o.hasOwnProperty(a)&&r.setRequestHeader(a,o[a]);return r.onload=function(){200==r.status?n(e.process(r,t.responseType),r):i&&i(r)},r.send(t.data),r},e.process=function(e,t){var n=e.responseText;return"text"!==t&&n?JSON.parse(e.responseText):n},e.getXhr=function(){var e=null;try{e=new XMLHttpRequest}catch(t){try{e=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){try{e=new ActiveXObject("Microsoft.XMLHTTP")}catch(n){alert("Hey man, are you using browser?")}}}return e},e}),Engine.define("Rest","Ajax",function(){var e=Engine.require("Ajax"),t={host:null};return t.doGet=function(e,n){return t._onRequest(e,"get",null,n)},t.doPost=function(e,n,i){return t._onRequest(e,"post",n,i)},t.doPut=function(e,n,i){return t._onRequest(e,"put",n,i)},t.doDelete=function(e,n,i){return t._onRequest(e,"delete",n,i)},t._onRequest=function(n,i,r,o){return null!==t.host&&(n=t.host+n),new Promise(function(t,a){e.ajax({responseType:o?o:"json",type:i,url:n,data:"string"==typeof r||"number"==typeof r?r:JSON.stringify(r)},t,a)})},t}),Engine.define("Config",function(){function e(e){this.configName=e;try{this.storage=JSON.parse(localStorage.getItem(e))}catch(t){this.storage=null}null==this.storage&&(this.storage={})}return e.prototype.get=function(e){return this.storage[e]},e.prototype.has=function(e){return void 0!==this.get(e)},e.prototype.set=function(e,t){this.storage[e]=t,localStorage.setItem(this.configName,JSON.stringify(this.storage))},e.prototype.remove=function(e){delete this.storage[e],localStorage.setItem(this.configName,JSON.stringify(this.storage))},e.prototype.toString=function(){return"Config instance"},e}),Engine.define("Dom",function(){function e(e,t,n){for(var i in t)if(t.hasOwnProperty(i)){var r=t[i],o=0===i.indexOf("on")?i.substring(2):i;if("function"==typeof r)n(e,o,r);else for(var a=0;a<r.length;a++)n(e,o,r[a])}}var t={};return t.el=function(e,n,i){var r=document.createElement(e);return t.update(r,n),t.append(r,i),r},t.addClass=function(e,t){e.className?-1===e.className.indexOf(t)?e.className+=" "+t:-1===e.className.split(" ").indexOf(t)&&(e.className+=" "+t):e.className=t},t.removeClass=function(e,t){var n=e.className;if(n&&n.indexOf(t)>-1){var i=n.split(" "),r=i.indexOf(t);r>-1&&(i.splice(r,1),e.className=i.join(" "))}},t.hasClass=function(e,t){var n=e.className;return n.indexOf(t)>-1?n.split(" ").indexOf(t)>-1:!1},t.id=function(e){return document.getElementById(e)},t.update=function(e,t){if("string"==typeof t)e.className=t;else if(t)for(var n in t)if(t.hasOwnProperty(n))if("function"==typeof t[n]){var i=n;0===i.indexOf("on")&&(i=i.substring(2)),e.addEventListener(i,t[n])}else e.setAttribute(n,t[n])},t.append=function(e,n){if(n)if("string"==typeof n||"number"==typeof n)e.appendChild(document.createTextNode(n+""));else if(n.length&&n.push&&n.pop)for(var i=0;i<n.length;i++){var r=n[i];r&&t.append(e,r)}else e.appendChild(n)},t.addListeners=function(t,n){n||(n=t,t=window),e(t,n,function(e,t,n){e.addEventListener(t,n,!1)})},t.removeListeners=function(t,n){n||(n=t,t=window),e(t,n,function(e,t,n){e.removeEventListener(t,n,!1)})},t.calculateOffset=function(e){var t=0,n=0;if(e.getBoundingClientRect){var i=e.getBoundingClientRect(),r=document.body,o=document.documentElement,a=window.pageYOffset||o.scrollTop||r.scrollTop,s=window.pageXOffset||o.scrollLeft||r.scrollLeft,u=o.clientTop||r.clientTop||0,l=o.clientLeft||r.clientLeft||0;return t=i.top+a-u,n=i.left+s-l,{top:Math.round(t),left:Math.round(n)}}for(;e;)t+=parseInt(e.offsetTop),n+=parseInt(e.offsetLeft),e=e.offsetParent;return{top:t,left:n}},t.insert=function(e,n,i){if(""===e.innerHTML)return void t.append(e,n);if(i||(i=e.childNodes[0]),n)if("string"==typeof n||"number"==typeof n)e.insertBefore(document.createTextNode(n+""),i);else if(n.length&&n.push&&n.pop)for(var r=0;r<n.length;r++){var o=n[r];o&&t.insert(e,o,i)}else e.insertBefore(n,i)},t.animate=function(e,n,i,r,o,a){a||(a=0),r||(r=10);var s=function(e,t,n,i){var r=[];for(var o in t)if(t.hasOwnProperty(o)){var a=e.style[o];a||0===a||(a=getComputedStyle(e)[o]),a?a=parseInt(a):(e.style[o]=0,a=0);var s=t[o];!function(t,n,o){e.style[t]=n+"px",r.push(setInterval(function(){n+=o,e.style[t]=n+"px"},i))}(o,a,(s-a)*i/n)}setTimeout(function(){for(var e=0;e<r.length;e++)clearInterval(r[e])},n)};return setTimeout(function(){s(e,n,i,r,o)},a),a+=i,{animate:function(e,n,i,r,o){return t.animate(e,n,i,r,o,a)},then:function(e){setTimeout(function(){e()},a)}}},t}),Engine.define("KeyboardUtils",{translateButton:function(e){switch(e){case 9:return"tab";case 13:return"enter";case 16:return"shift";case 17:return"ctrl";case 18:return"alt";case 20:return"caps lock";case 27:return"esc";case 32:return"space";case 33:return"pg up";case 34:return"pg dn";case 35:return"end";case 36:return"home";case 37:return"ar left";case 38:return"ar top";case 39:return"ar right";case 40:return"ar bottom";case 45:return"ins";case 46:return"del";case 91:return"super";case 96:return"num 0";case 97:return"num 1";case 98:return"num 2";case 99:return"num 3";case 100:return"num 4";case 101:return"num 5";case 102:return"num 6";case 103:return"num 7";case 104:return"num 8";case 105:return"num 9";case 106:return"*";case 107:return"+";case 109:return"-";case 111:return"/";case 112:return"f2";case 113:return"f3";case 114:return"f4";case 115:return"f5";case 116:return"f6";case 117:return"f7";case 119:return"f8";case 120:return"f9";case 121:return"f10";case 122:return"f11";case 123:return"f12";case 144:return"num lock";case 186:return";";case 187:return"=";case 188:return",";case 189:return"-";case 190:return".";case 191:return"/";case 192:return"~";case 219:return"[";case 220:return"\\";case 221:return"]";case 222:return"'";default:return String.fromCharCode(e)}}}),Engine.define("ScreenUtils",{window:function(){var e=window,t="inner";return t+"Width"in window||(t="client",e=document.documentElement||document.body),{width:e[t+"Width"],height:e[t+"Height"]}},monitor:function(){return{width:outerWidth,height:outerHeight}}}),Engine.define("StringUtils",function(){var e=/([a-z])([A-Z])/g,t=/^(\/)|(\/)$/g,n=/\_/g,i=/\_/g,r={unique:function(e){return Math.random().toString(36).substring(2,e?e+2:7)},removeSlashes:function(e){return e.replace(t,"")},normalizeText:function(t,r){if(void 0===r&&(r=" "),t||(t=""),t.indexOf("_")>-1&&(t=t.replace(n," ")),t.indexOf("-")>-1&&(t=t.replace(i," ")),t.match(e)&&(t=t.replace(e,"$1 $2")),t.indexOf(" ")>-1){for(var o=t.split(" "),a="",s=0;s<o.length;s++)o[s]&&(a+=o[s].charAt(0).toUpperCase()+o[s].substring(1)+(s!==o.length-1?r:""));return a}return t.charAt(0).toUpperCase()+t.substring(1)}};return r}()),Engine.define("Tabs",["Dom"],function(e){var t=function(){this.header=e.el("div","tabs-header"),this.content=e.el("div","tabs-body"),this.container=e.el("div","tabs",[this.header,this.content]),this.tabs=[]};return t.prototype.addTab=function(t,n){var i=!this.tabs.length,r={title:e.el("a",{href:"#","class":"tab-name "+(i?"active":"")},t),body:e.el("div","tab-content"+(i?"":" hidden"),n)};this.tabs.push(r);var o=this;return r.title.onclick=function(t){t.preventDefault();for(var n=0;n<o.tabs.length;n++)e.addClass(o.tabs[n].body,"hidden"),e.removeClass(o.tabs[n].title,"active");e.removeClass(r.body,"hidden"),e.addClass(r.title,"active")},this.header.appendChild(r.title),this.content.appendChild(r.body),this.tabs.length-1},t.prototype.removeTab=function(e){var t=this.tabs.splice(e,1);t.title.remove(!0),t.body.remove(!0)},t}),Engine.define("Pagination",["Dom"],function(e){var t=function(t,n){if(!t||!n)throw"Pagination instantiation error";var i=this;this.refreshButton=e.el("input",{type:"button",value:"Refresh"}),this.refreshButton.onclick=function(e){i.refresh(e)},this.page=e.el("input",{type:"text",value:n}),this.page.onkeyup=function(e){i.onChange(e)},this.pageNumber=n,this.onOpenPage=t,this.previousButton=e.el("input",{type:"button",value:"Previous page"}),this.previousButton.onclick=function(e){i.previous(e)},this.nextButton=e.el("input",{type:"button",value:"Next page"}),this.nextButton.onclick=function(e){i.next(e)},this.container=e.el("form",{"class":"pagination"},[this.refreshButton,this.previousButton,this.page,this.nextButton]),this.container.onsubmit=function(e){i.refresh(e)}};return t.prototype.refresh=function(e){e&&e.preventDefault(),this.openPage(this.pageNumber)},t.prototype.previous=function(e){e&&e.preventDefault(),this.openPage(this.pageNumber>1?this.pageNumber-1:1)},t.prototype.next=function(e){e&&e.preventDefault(),this.openPage(this.pageNumber+1)},t.prototype.openPage=function(e){this.pageNumber=e,this.page.value=e,this.onOpenPage(e)},t.prototype.regexp=/^\d*$/,t.prototype.onChange=function(){this.regexp.test(this.page.value)?(this.pageNumber=parseInt(this.page.value),this.openPage(this.pageNumber)):this.page.value=this.pageNumber},t}),Engine.define("Popup",["Dom","ScreenUtils"],function(){function e(e){e=e||{};var n=this;this.title=t.el("div",null,e.title),this.isOpen=e.isOpen||!1,this.minimized=e.minimized||!1,this.withOverlay=e.withOverlay!==!1,this.drag={active:!1,x:0,y:0,mx:0,my:0},this.listeners={onmousemove:function(e){n.onMouseMove(e)},onkeyup:function(e){n.onKeyUp(e)}},this.initHeader(e),this.body=t.el("div","panel-body"+(this.minimized?" minimized":""),e.content),this.container=t.el("div",{"class":"Popup panel"},[this.header,this.body]),e.isOpen&&this.show()}var t=Engine.require("Dom"),n=Engine.require("ScreenUtils"),i=1e3,r="position:fixed;z-index"+i+";left:0;top:0;width:100%;height:100%;background: rgba(0,0,0,0.4)",o=t.el("div",{style:r}),a=!1,s=0;return e.prototype.initHeader=function(e){var n=t.el("div","control-buttons",[e.controlMinimize===!1?null:t.el("button",{"class":"success small Popup-minimize",onclick:function(){r.minimized?t.removeClass(r.container,"minimized"):t.addClass(r.container,"minimized"),r.minimized=!r.minimized}},t.el("span",null,"_")),e.controlClose===!1?null:t.el("button",{"class":"danger small Popup-close",onclick:function(){r.hide()}},t.el("span",null,"x"))]),i=[n,this.title];this.header=t.el("div","panel-heading",i);var r=this;t.addListeners(this.header,{onmousedown:function(e){e&&(e.preventBubble=!0,e.stopPropagation(),e.preventDefault()),r.onDragStart(e)},onmouseup:function(e){e&&(e.preventBubble=!0,e.stopPropagation(),e.preventDefault()),r.onDragEnd()}})},e.prototype.onMouseMove=function(e){if(this.drag.active){var t=document.body;this.container.style.left=this.drag.x+(e.clientX-this.drag.mx+t.scrollLeft)+"px",this.container.style.top=this.drag.y+(e.clientY-this.drag.my+t.scrollTop)+"px"}},e.prototype.onDragEnd=function(){this.drag.active=!1},e.prototype.onDragStart=function(e){if(!this.drag.active){this.drag.active=!0,this.drag.x=parseInt(this.container.style.left),this.drag.y=parseInt(this.container.style.top);var t=document.body;this.drag.mx=e.clientX+t.scrollLeft,this.drag.my=e.clientY+t.scrollTop}},e.prototype.show=function(){this.withOverlay&&!a&&document.body.appendChild(o),s++,this.container.style.zIndex=++i,document.body.appendChild(this.container),t.addListeners(this.listeners),this.isOpen||(this.isOpen=!0,this.container.style.top=document.body.scrollTop+30+"px",this.container.style.left=(n.window().width-this.container.offsetWidth)/2+"px")},e.prototype.setContent=function(e){this.body.innerHTML="",t.append(this.body,e)},e.prototype.setTitle=function(e){this.title.innerHTML="",t.append(this.title,e)},e.prototype.onKeyUp=function(e){this.isOpen&&27==e.keyCode&&(e.preventDefault(),this.hide())},e.prototype.hide=function(){s--,this.isOpen=!1,0>s&&(s=0),0===s&&o.remove(),this.container.remove(),t.removeListeners(this.listeners)},e.getParams=function(){return{isOpen:!1,minimized:!1,content:null,title:null,controlClose:!0,controlMinimize:!0,withOverlay:!0}},e}),Engine.define("Menu",["Dom","StringUtils"],function(e,t){function n(t,n){this.container=e.el("div",n||"menu"),this.defaultCallback=t,this.menus=[]}return n.prototype.hide=function(){e.addClass(this.container,"hidden")},n.prototype.show=function(){e.removeClass(this.container,"hidden")},n.prototype.diactivateAll=function(){for(var t=0;t<this.menus.length;t++)e.removeClass(this.menus[t],"active")},n.prototype.menu=function(n,i,r,o){var a=this;"function"!=typeof i||r||(r=i,i=null),n&&!i&&(i=t.normalizeText(n)),!r&&this.defaultCallback&&(r=this.defaultCallback);var s=null,u=e.el("div","menu-item");this.menus.push(u);var l=function(t){o?o(t):(t.preventDefault(),a.diactivateAll()),e.addClass(u,"active")};if(n){var p={href:"/"+t.normalizeText(n,"-")};p.onclick=function(e){l(e),r&&r(n,e)},s=e.el("a",p,i),u.appendChild(s)}var c=null;return this.container.appendChild(u),{menu:function(e,t,n){return a.menu(e,t,n,l)},subMenu:function(t,n,i){var r=a.menu(t,n,i,l);null===c&&(c=e.el("ul"),u.appendChild(c));var o=r.activate;return r.activate=function(e){l(e),o(e)},r.link&&e.addListeners(r.link,{onclick:l}),c.appendChild(e.el("li","submenu",r.item)),r},item:u,link:s}},n}),Engine.define("Grid",["Dom","Pagination","StringUtils"],function(){function e(e){var i=this;if(this.header=t.el("thead"),this.body=t.el("tbody"),this.footer=t.el("tfoot"),!e.columns)throw"columns is required parameter for grid";var r={};this.params=e,e.class&&(r.class=e.class),e.id&&(r.id=e.id),this.table=t.el("table",null,[this.header,this.body,this.footer]),this.data=e.data?e.data:[];var o=null;e.onOpenPage&&(this.pagination=new n(function(t){e.onOpenPage(t).then(function(e){i.data=e.data,i.update()})},e.page||1),o=this.pagination.container,this.pagination.refresh()),this.fullUpdate(),this.container=t.el("div",null,[o,this.table])}var t=Engine.require("Dom"),n=Engine.require("Pagination"),i=Engine.require("StringUtils");return e.prototype.buildRow=function(e){if(this.params.rowRender)return this.params.rowRender(e);var n=e%2?"odd":"even";return t.el("tr",n)},e.prototype.fullUpdate=function(){this.update();var e=this.params;e.class&&t.addClass(this.container,this.params.class),e.id&&t.update(this.container,{id:e.id}),this.header.innerHTML="",this.footer.innerHTML="";for(var n=t.el("tr"),r=t.el("tr"),o=0;o<this.params.columns.length;o++){var a=this.params.columns[o],s=a.title||i.normalizeText(a.name);t.append(n,t.el("th",null,s)),a.footer&&t.append(r,a.footer)}this.header.appendChild(n),r.innerHTML&&this.footer.appendChild(r)},e.prototype.update=function(){this.body.innerHTML="";for(var e=this.params.columns,n=this.data,i=0;i<n.length;i++){for(var r=this.buildRow(i),o=0;o<e.length;o++){var a=e[o],s=n[i][a.name];a.render?t.append(r,t.el("td",a.class,a.render(s,n[i]))):t.append(r,t.el("td",a.class,s))}t.append(this.body,r)}},e}),Engine.define("AbstractInput",["Dom","StringUtils"],function(e,t){function n(t){if(!t.name)throw"Name is reqired for input";this.input=e.el(this.getElementType(),this.prepareAttributes(t),this.prepareContent(t)),this.label=this.buildLabel(t),this.container=e.el("div","formfield-holder "+(t.class||""),[this.label,this.input]),this.errors=null,this.errorsData=null}return n.prototype.addError=function(t){if(null===this.errors?(this.errors=e.el("div","formfield-errors"),this.container.appendChild(this.errors),this.errorsData={}):this.errors.innerHTML="","string"==typeof t)this.errorsData.custom=t;else for(var n in t)t.hasOwnProperty(n)&&(this.errorsData[n]=t[n]);for(var i in this.errorsData)this.errorsData.hasOwnProperty(i)&&this.errorsData[i]&&this.errors.appendChild(e.el("div","err",this.errorsData[i]))},n.prototype.buildLabel=function(n){var i;i=n.noLabel===!0?null:n.label?n.label:t.normalizeText(n.name);var r={};return r.id=n.id?n.id:n.formId?n.formId+"_"+n.name:n.name,e.el("label",r,i)},n.prototype.getInputType=function(){throw"This function must be overrided"},n.prototype.getElementType=function(){throw"This function must be overrided"},n.prototype.prepareContent=function(){return null},n.prototype.prepareAttributes=function(e){var n={value:e.value||"",name:e.name,type:this.getInputType(),id:e.id||t.unique()};if(null===n.type&&delete n.type,e.attr)for(var i in e.attr)e.attr.hasOwnProperty(i)&&(n[i]=e.attr[i]);for(var r in e)e.hasOwnProperty(r)&&0===r.indexOf("on")&&(n[r]=e[r]);return n},n.prototype.getValue=function(){return this.input.value},n.prototype.setValue=function(e){this.input.value=e},n}),Engine.define("Checkbox",["Dom","AbstractInput"],function(e,t){function n(){t.apply(this,arguments),e.insert(this.label,this.input),this.input.checked=this._initChecked,delete this._initChecked}return n.prototype=Object.create(t.prototype),n.prototype.getElementType=function(){return"input"},n.prototype.getInputType=function(){return"checkbox"},n.prototype.getValue=function(){return this.input.checked},n.prototype.setValue=function(e){this.input.checked=e},n.prototype.prepareAttributes=function(e){var n=t.prototype.prepareAttributes.apply(this,arguments);return this._initChecked=!!e.value,delete n.value,n},n.prototype.constructor=n,n}),Engine.define("FieldMeta",function(){function e(e){e||(e={}),this.ignore=e.ignore||!1,this.render=e.render||null,this.wrapper=e.wrapper||null,this.contentBefore=e.contentBefore||null,this.contentAfter=e.contentAfter||null,this.onchange=e.onchange||null,this.validations=e.validations||null}return e}),Engine.define("Text",["Dom","AbstractInput"],function(e,t){function n(){t.apply(this,arguments)}return n.prototype=Object.create(t.prototype),n.prototype.getElementType=function(){return"input"},n.prototype.getInputType=function(){return"text"},n.prototype.constructor=n,n}),Engine.define("Select",["Dom","AbstractInput"],function(e,t){function n(e){t.apply(this,arguments),this.input.remove(),delete this.input,this.params=e,this.options=e.options,this.update(e.value)}return n.prototype=Object.create(t.prototype),n.prototype.constructor=n,n.prototype.update=function(){this.input.innerHTML="";for(var t=0;t<this.options.length;t++){var n=this.options[t],i=e.el("option",{value:n.value},n.label);e.update(this.input,i)}},n.prototype.getElementType=function(){return"select"},n.prototype.getInputType=function(){return null},n}),Engine.define("Radio",["Dom","AbstractInput"],function(e,t){function n(n){t.apply(this,arguments),this.input.remove(),delete this.input,this.params=n,this.options=n.options,this.inputs=null,this.optionsContainer=e.el("div"),this.update(n.value),this.container.appendChild(this.optionsContainer),e.insert(this.label,this.input)}return n.prototype=Object.create(t.prototype),n.prototype.constructor=n,n.prototype.update=function(t){this.optionsContainer.innerHTML="",this.inputs=[];for(var n=this.params.name,i=0;i<this.options.length;i++){var r=this.options[i],o=e.el("input",{type:"radio",id:n+"_"+r.value,name:n,value:r.value});(r.value===this.getValue()||r.value===t)&&(o.checked=!0);var a={};for(var s in this.params)this.params.hasOwnProperty(s)&&0===(s+"").indexOf("on")&&"function"==typeof this.params[s]&&(a[s]=this.params[s]);e.addListeners(o,a),this.inputs.push(o),this.optionsContainer.appendChild(e.el("label",{"for":n+"_"+r.value},[o,r.label]))}},n.prototype.getElementType=function(){return"input"},n.prototype.getInputType=function(){return""},n.prototype.getValue=function(){for(var e=0;e<this.inputs.length;e++)if(this.inputs[e].checked)return this.inputs[e].value;return""},n}),Engine.define("Password",["Dom","AbstractInput"],function(e,t){function n(n){t.apply(this,arguments),this.showChars=n.showChars||!1;var i=this;this.toggler=e.el("a",{href:"#",onclick:function(e){e.preventDefault(),i.toggleInput()}},[this.getTogglerContent()]),this.container.appendChild(this.toggler)}return n.prototype=Object.create(t.prototype),n.prototype.getElementType=function(){return"input"},n.prototype.toggleInput=function(){this.showChars=!this.showChars,this.input.type=this.getInputType(),this.toggler.innerHTML=this.getTogglerContent()},n.prototype.getTogglerContent=function(){return this.showChars?"Hide":"Show"},n.prototype.getInputType=function(){return this.showChars?"text":"password"},n.prototype.constructor=n,n}),Engine.define("GenericForm",["Dom","Text"],function(){function e(e,n,i){if(!i)throw"onSubmit is required for generic form";var r=[],o=this;this.fields=[],this.model={},this.onSubmitSuccess=i,n||(n={}),this.meta=n;for(var a in e)if(e.hasOwnProperty(a)){var s=e[a];this.model[a]=s;var u;if(n[a]){var l=n[a];if(l.ignore)continue;u=l.render?"function"==typeof l.render?l.render(this.onChange,a,s):l.render:this.buildText(a,s,l.onchange),this.fields.push(u);var p=["function"==typeof l.contentBefore?l.contentBefore(a,s):l.contentBefore,u.container,"function"==typeof l.contentAfter?l.contentAfter(a,s):l.contentAfter];l.wrapper?"function"==typeof l.wrapper?r.push(l.wrapper(p,a,s)):(t.append(l.wrapper(p)),r.push(l.wrapper)):r=r.concat(p)}else u=this.buildText(a,s),this.fields.push(u),r.push(u.container)}this.submit=t.el("div",null,t.el("input",{type:"submit","class":"primary",value:"Submit"})),this.container=t.el("form",null,[r,this.submit]),this.container.onsubmit=function(e){o.onSubmit(e)}}var t=Engine.require("Dom"),n=Engine.require("Text");return e.prototype.onSubmit=function(e){e&&e.preventDefault(),this.validate&&this.onSubmitSuccess(this.model)},e.prototype.validate=function(){if(this.meta){for(var e in this.meta)if(this.meta.hasOwnProperty(e)){var t=this.meta[e];t.validations}return!0}return!0},e.prototype.onChange=function(e,t){this.model[e]=t},e.prototype.buildText=function(e,t,i){var r=this,o=new n({name:e,value:t,onchange:function(){r.onChange(e,o.getValue()),i&&i()}});return o},e}),Engine.define("UrlResolver",["StringUtils"],function(e){return{regex:/(^\/)|(\/$)/,wSregex:/\s/g,strategy:"path",resolve:function(){var t;"path"===this.strategy?(t=document.location.pathname,t=t.replace(this.regex,"")):(t=document.location.hash,0===t.indexOf("#")&&(t=t.substring(1)));var n=t.indexOf("/");return n>-1&&(t=t.substring(n)),t||(t="Home"),e.normalizeText(t).replace(wSregex,"")}}}),Engine.define("Dispatcher",["Dom","UrlResolver"],function(){var e=Engine.require("Dom"),t=Engine.require("UrlResolver"),n=/(^\/)|(\/$)/,i=function(n,i,r,o){this.app="string"==typeof n?e.id(n):n,this.context=i,this.config=r||{},this.applications={},this.activeApplication=null,this.history=history,this.urlResolver=o||t;var a=this;e.addListeners({onpopstate:function(){if(a.urlResolver){var e=a.urlResolver.resolve();a.placeApplication(e)}}}),this.events=null};return i.prototype.addListener=function(e,t){switch(t||(t=e,e="afterOpen"),e){case"beforeOpen":case"afterOpen":case"beforeClose":case"afterClose":break;default:throw"Unknown event: "+e}null===this.events&&(this.events={}),this.events[e]||(this.events[e]=[]),this.events[e].push(t)},i.prototype.initApplication=function(e){var t,n=function(e,t){i.placeApplication(e,t)};if("function"==typeof e){var i=this;t=new e(this.context,this.config,n)}else t=e,t.init&&t.init(this.context,this.config,n);return t},i.prototype.placeApplication=function(e,t){var i=this,r=i.applications[e],o=function(r){var o=i.initApplication(r);if(!r)throw"Undefined application "+e;i.activeApplication&&(i.activeApplication.beforeClose&&i.activeApplication.beforeClose(),i.fireEvent("beforeClose",e),i.app.innerHTML="",i.activeApplication.afterClose&&i.activeApplication.afterClose(),i.fireEvent("afterClose",e));var a;a=o.getUrl?o.getUrl():o.URL||o.url?o.URL||o.url:"";var s;s=o.getTitle?o.getTitle():o.TITLE||o.title?o.TITLE||o.title:"";var u=document.location.pathname.replace(n,"");if(a!==u){var l=document.location.hash;this.history.pushState({},s,a+(l?l:""))}i.activeApplication=o,o.beforeOpen&&o.beforeOpen(t),i.fireEvent("beforeOpen",e),o.container&&i.app.appendChild(o.container),o.afterOpen&&o.afterOpen(),i.fireEvent("afterOpen",e)};r?o(r):Engine.load(e,function(){i.applications[e]=Engine.require(e),i.placeApplication(e,t)})},i.prototype.fireEvent=function(e,t){if(null!==this.events&&this.events[e])for(var n=this.events[e],i=0;i<n.length;i++)n[i](t)},i}),Engine.define("Word",["Ajax"],function(){var e=Engine.require("Ajax"),t={},n=!1,i=function(e,t,n,r){n||(n=t,t="default");var o=function(e){r&&"text"!=r?"append"==r?n.appendChild(document.createTextNode(e)):n.innerHTML=e:n.innerText=e};i.languageLoaded(i.language)?o(i.get(e,t)):i.loadLanguage(i.language,function(){o(i.get(e,t))})};return i.dictionaries={},i.dictionariesPath="assets/js/word/",i.get=function(e,t,n){n||(n=i.language),t||(t="default");var r=i.dictionaries[n];if(r){var o=r[t]||r["default"]||{};return o[e]}return null},i.languageLoaded=function(e){return e||(e=i.language),void 0!==i.dictionaries[e]},i.loadLanguage=function(r,o){return"function"!=typeof r||o?r||(r=i.language):(o=r,r=i.language),t[r]?void("function"==typeof o?t[r].push(o):t[r]=t[r].concat(o)):(t[r]="function"==typeof o?[o]:o,void(i.loader?i.loader(r,t[r]):e.ajax({url:i.dictionariesPath+r+".json",type:"get"},function(e){var n={};for(var o in e)if(e.hasOwnProperty(o)){var a=e[o];"string"==typeof a?(n.default||(n.default={}),n.default[o]=a):n[o]=a}i.dictionaries[r]=n,i.language=r;for(var s=0;s<t[r].length;s++)t[r][s]()},function(){n?Engine.console("Can't load language - "+r,"E"):(n=!0,i.loadLanguage("en",t[r]),delete t[r])})))},i.translate=function(e,t){function n(){for(var e=t.getElementsByClassName("word"),n=0;n<e.length;n++){var r=e[n],o=r.getAttribute("data-w-key"),a=r.getAttribute("data-w-module"),s=r.getAttribute("data-w-strategy");o&&i(o,a,r,s)}}e||(e=i.language),t||(t=document.body),i.languageLoaded(e)?(i.language=e,n()):i.loadLanguage(e,n)},i.create=function(e,t){var n=function(n,r,o,a){return"string"!=typeof r&&(o=r,r=null),i(n,r||e,o||t,a)};return n.get=function(t,n){return i.get(t,e,n)},n.languageLoaded=i.languageLoaded,n.loadLanguage=i.loadLanguage,n.translate=i.translate,n},i.language=navigator.language||navigator.userLanguage||"en",i});