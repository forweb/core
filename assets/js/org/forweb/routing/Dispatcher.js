Engine.define('Dispatcher', ['Dom', 'UrlResolver', 'UrlUtils'], function () {

    var Dom = Engine.require('Dom');
    var UrlUtils = Engine.require('UrlUtils');
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
        var openApplication = function(){
            if(me.urlResolver) {
                var path = UrlUtils.getPath();
                me.placeApplication(path);
            }
        };
        Dom.addListeners({onpopstate: openApplication});
        this.events = null;
    };

    Dispatcher.prototype.addMapping = function(className, url) {
        this.urlResolver.addMapping(className, url);
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

    Dispatcher.prototype.placeApplication = function (url, directives) {
        if(!url) {
            url = UrlUtils.getPath();
        }
        var resolved = this.urlResolver.resolve(url);
        var applicationName;
        if(resolved.app) {
            applicationName = resolved.app;
        } else {
            applicationName = 'Page404';
        }
        var me = this;
        var application = me.applications[applicationName];
        var callback = function(application) {
            if (!application) {
                throw "Undefined application " + applicationName;
            }
            closeApplication(me, me.activeApplication, applicationName);
            if(me.context) {
                me.context.request = {
                    url: url,
                    params: resolved.params
                }
            }
            var app = initApplication(me, application);
            var title = getTitle(app);
            var path = document.location.pathname.replace(regex, '');
            if(url !== path) {
                var hash = document.location.hash;
                this.history.pushState({}, title, url + (hash ? hash : ''));
            }
            me.activeApplication = app;
            openApplication(me, app, resolved.params, directives, applicationName);
        };
        if(application) {
            callback(application);
        } else {
            Engine.load(applicationName, function() {
                me.applications[applicationName] = Engine.require(applicationName);
                callback(me.applications[applicationName], directives);
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



    function initApplication (dispatcher, contructor) {
        var application;
        var placeApplication = function(applicationName, directives){
            dispatcher.placeApplication(applicationName, directives);
        };
        if(typeof contructor == "function") {
            var me = this;
            application = new contructor(dispatcher.context, dispatcher.config, placeApplication);
        } else {
            application = contructor;
            if(application.init) {
                application.init(dispatcher.context, dispatcher.config, placeApplication);
            }
        }
        return application;
    }

    function closeApplication(dispatcher, application, applicationName) {
        if (application) {
            if (application.beforeClose) {
                application.beforeClose();
            }
            dispatcher.fireEvent('beforeClose', applicationName);
            dispatcher.app.innerHTML = '';
            if (application.afterClose) {
                application.afterClose();
            }
            dispatcher.fireEvent('afterClose', applicationName);
        }
    }
    function getTitle(app) {
        if(app.getTitle) {
            return app.getTitle();
        } else if (app.TITLE || app.title) {
            return app.TITLE || app.title;
        } else {
            return '';
        }
    }
    function addMapping(obj) {
        this.urlResolver.addMapping(obj);
    }
    function openApplication(dispatcher, app, params, directives, applicationName){
        if (app.beforeOpen) {
            app.beforeOpen(params, directives);
        }
        dispatcher.fireEvent('beforeOpen', applicationName);
        if(app.container) {
            dispatcher.app.appendChild(app.container);
        }
        if (app.afterOpen) {
            app.afterOpen(params, directives);
        }
        dispatcher.fireEvent('afterOpen', applicationName);
    }

    return Dispatcher;
});