Engine.define('Dispatcher', ['Dom', 'UrlResolver'], function () {
    
    var Dom = Engine.require('Dom');
    var UrlResolver = Engine.require('UrlResolver');

    var regex = /(^\/)|(\/$)/;
    var Dispatcher = function(appNode, context, config, urlResolver){
        this.app = typeof appNode === 'string' ? Dom.id(appNode) : appNode;
        this.context = context;
        this.config = config || {};
        this.applications = {};
        this.activeApplication = null;
        this.history = history;
        this.urlResolver = urlResolver || UrlResolver;
        var me = this;
        Dom.addListeners({onpopstate: function(){
            if(me.urlResolver) {
                var app = me.urlResolver.resolve();
                me.placeApplication(app);
            }
        }});
        this.events = null;
    };

    Dispatcher.prototype.addListener = function(name, listner) {
        if(!listner) {
            listner = name;
            name = 'afterOpen';
        }
        switch (name) {
            case 'beforeOpen':
            case 'afterOpen':
            case 'beforeClose':
            case 'afterClose':
                break;
            default:
                throw 'Unknown event: ' + name;
        }
        if(this.events === null) {
            this.events = {};
        }
        if(!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(listner);
    };
    
    Dispatcher.prototype.initApplication = function (contructor) {
        var application;
        var placeApplication = function(applicationName, directives){
            me.placeApplication(applicationName, directives);
        };
        if(typeof contructor == "function") {
            var me = this;
            application = new contructor(this.context, this.config, placeApplication);
        } else {
            application = contructor;
            if(application.init) {
                application.init(this.context, this.config, placeApplication);
            }
        }
        return application;
    };
    Dispatcher.prototype.placeApplication = function (applicationName, directives) {
        var me = this;
        var application = me.applications[applicationName];
        var callback = function(application) {
            var app = me.initApplication(application);
            if (!application) {
                throw "Undefined application " + applicationName;
            }
            if (me.activeApplication) {
                if (me.activeApplication.beforeClose) {
                    me.activeApplication.beforeClose();
                }
                me.fireEvent('beforeClose', applicationName);
                me.app.innerHTML = '';
                if (me.activeApplication.afterClose) {
                    me.activeApplication.afterClose();
                }
                me.fireEvent('afterClose', applicationName);
            }
            var url;
            if(app.getUrl) {
                url = app.getUrl();
            } else if (app.URL || app.url) {
                url = app.URL || app.url;
            } else {
                url = '';
            }
            var title;
            if(app.getTitle) {
                title = app.getTitle();
            } else if (app.TITLE || app.title) {
                title = app.TITLE || app.title;
            } else {
                title = '';
            }
            var path = document.location.pathname.replace(regex, '');
            if(url !== path) {
                var hash = document.location.hash;
                this.history.pushState({}, title, url + (hash ? hash : ''));
            }
            
            me.activeApplication = app;
            if (app.beforeOpen) {
                app.beforeOpen(directives);
            }
            me.fireEvent('beforeOpen', applicationName);
            if(app.container) {
                me.app.appendChild(app.container);
            }
            if (app.afterOpen) {
                app.afterOpen();
            }
            me.fireEvent('afterOpen', applicationName);
        };
        if(application) {
            callback(application);
        } else {
            Engine.load(applicationName, function() {
                me.applications[applicationName] = Engine.require(applicationName);
                me.placeApplication(applicationName, directives);
            })
        }
    };
    Dispatcher.prototype.fireEvent = function(eventType, applicationName){
        if(this.events === null) return;
        if(!this.events[eventType])return;
        var events = this.events[eventType];
        for(var i = 0; i < events.length; i++) {
            events[i](applicationName);
        }
    };
    return Dispatcher;
});
