Engine.define('Dispatcher', ['Dom', 'UrlResolver', 'UrlUtils'], function () {

    var Dom = Engine.require('Dom');
    var UrlUtils = Engine.require('UrlUtils');
    var UrlResolver = Engine.require('UrlResolver');

    var Dispatcher = function(appNode, context, config, urlResolver){
        this.app = typeof appNode === 'string' ? Dom.id(appNode) : appNode;
        this.context = context || {};
        this.config = config || {};
        this.applications = {};
        this.applicationName = null;
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
        var me = this;
        var request = me.urlResolver.resolve(url);
        var applicationName;
        if(request.app) {
            applicationName = request.app;
        } else {
            applicationName = 'Page404';
        }
        var application = me.applications[applicationName];
        if(application) {
            explodeApplication(me, request, applicationName, directives);
        } else {
            Engine.load(applicationName, function() {
                me.applications[applicationName] = Engine.require(applicationName);
                explodeApplication(me, request, applicationName, directives);
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


    //private functions

    function explodeApplication(dispatcher, request, applicationName, directives) {
        var applicationClass = dispatcher.applications[applicationName];
        if (!applicationClass) {
            throw "Undefined application " + applicationName;
        }
        var contextUpdate = function(){
            if(dispatcher.context) {
                dispatcher.context.request = request
            }
        };
        var windowUpdate = function(app){
            var title = getTitle(app);
            var path = UrlUtils.getPath();
            if(request.url !== path) {
                var hash = document.location.hash;
                this.history.pushState({}, title, (request.url || '/') + (hash || ''));
            }
        };
        
        if(dispatcher.applicationName === applicationName && dispatcher.activeApplication.canStay) {
            contextUpdate();
            windowUpdate(dispatcher.activeApplication);
            var isCanStay = dispatcher.activeApplication.canStay();
            if(isCanStay !== false) {
                return;
            }
        }
        closeApplication(dispatcher, applicationName);
        contextUpdate();
        var app = initApplication(dispatcher, applicationClass);
        windowUpdate(app);
        openApplication(dispatcher, app, request.params, directives, applicationName);
    }

    function initApplication (dispatcher, contructor) {
        var application;
        if(dispatcher.applicationName)
        var placeApplication = function(applicationName, directives){
            dispatcher.placeApplication(applicationName, directives);
        };
        if(typeof contructor == "function") {
            application = new contructor(dispatcher.context, dispatcher.config, placeApplication);
        } else {
            application = contructor;
            if(application.init) {
                application.init(dispatcher.context, dispatcher.config, placeApplication);
            }
        }
        return application;
    }

    function closeApplication(dispatcher) {
        var app = dispatcher.activeApplication;
        if (app) {
            var appName = dispatcher.applicationName;
            dispatcher.fireEvent('beforeClose', appName);
            if (app.beforeClose) {
                app.beforeClose();
            }
            dispatcher.app.innerHTML = '';
            if (app.afterClose) {
                app.afterClose();
            }
            dispatcher.fireEvent('afterClose', appName);
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
    function openApplication(dispatcher, app, params, directives, applicationName){
        dispatcher.fireEvent('beforeOpen', applicationName);
        dispatcher.activeApplication = app;
        dispatcher.applicationName = applicationName;
        if (app.beforeOpen) {
            app.beforeOpen(params, directives);
        }
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