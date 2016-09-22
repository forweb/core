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
    Menu.prototype.diactivateAll = function() {
        for(var i = 0; i < this.menus.length; i++) {
            Dom.removeClass(this.menus[i], 'active');
        }
    };

    Menu.prototype.menu = function(className, label, callback, _parentActivate) {
        var me = this;
        if(typeof label === 'function' && !callback) {
            callback = label;
            label = null;
        }
        if(className && !label) {
            label = StringUtils.normalizeText(className);
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
                me.diactivateAll();
            } else {
                _parentActivate(e);
            }
            Dom.addClass(item, 'active');
        };
        if(className) {
            var params = {href: '/' + StringUtils.normalizeText(className, '-')};
            params.onclick = function (e) {
                activate(e);
                if (callback) {
                    callback(className, e);
                }
            };
            link = Dom.el('a', params, label);
            item.appendChild(link);
        }
        var subMenuHolder = null;

        this.container.appendChild(item);
        return {
            menu: function (cn, l, c) {
                return me.menu(cn, l, c, activate);
            },
            subMenu: function (cn, l, c) {
                var out = me.menu(cn, l, c, activate);
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