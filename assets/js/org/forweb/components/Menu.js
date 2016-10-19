Engine.define('Menu', ['Dom', 'StringUtils'], function(Dom, StringUtils){

    function Menu(defaultCallback, params){
        this.container = Dom.el('div', params || 'menu');
        this.defaultCallback = defaultCallback;
        this.menus = [];
    }

    Menu.prototype.hide = function() {
        Dom.addClass(this.container, 'hidden');
    };
    Menu.prototype.show = function() {
        Dom.removeClass(this.container, 'hidden');
    };
    Menu.prototype.deactivateAll = function() {
        for(var i = 0; i < this.menus.length; i++) {
            Dom.removeClass(this.menus[i], 'active');
        }
    };

    Menu.prototype.menu = function(url, label, callback, _parentActivate) {
        var me = this;
        if(typeof label === 'function' && !callback) {
            callback = label;
            label = null;
        }
        if(url && !label) {
            label = StringUtils.normalizeText(url);
        }
        if(!callback && this.defaultCallback) {
            callback = this.defaultCallback;
        }
        var link = null;
        var item = Dom.el('div', 'menu-item');
        this.menus.push(item);
        var activate = function(e){
            if(!_parentActivate) {
                e.preventDefault();
                me.deactivateAll();
            } else {
                _parentActivate(e);
            }
            Dom.addClass(item, 'active');
        };
        if(url) {
            var params = {href: '/' + url};
            params.onclick = function (e) {
                if(e)activate(e);
                if (callback) {
                    callback(url, e);
                }
            };
            link = Dom.el('a', params, label);
            item.appendChild(link);
            if(StringUtils.removeSlashes(url) === StringUtils.removeSlashes(document.location.pathname)) {
                activate();
            }
        }
        var subMenuHolder = null;

        this.container.appendChild(item);
        return {
            menu: function (url, l, c) {
                return me.menu(url, l, c, activate);
            },
            subMenu: function (url, l, c) {
                var out = me.menu(url, l, c, activate);
                if(subMenuHolder === null) {
                    subMenuHolder = Dom.el('ul');
                    item.appendChild(subMenuHolder);
                }
                var childActivate = out.activate;
                out.activate = function (e) {
                    activate(e);
                    childActivate(e);
                };
                if(out.link) {
                    // Dom.removeListeners(out.link, {onclick: oldActivate});
                    Dom.addListeners(out.link, {onclick: activate});
                }
                subMenuHolder.appendChild(Dom.el('li', 'submenu', out.item));
                return out;
            },
            item: item,
            link: link
        }
    };
    return Menu;
});