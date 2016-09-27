Engine.define('UrlResolver', ['StringUtils'], function(StringUtils) {
    /**
     *
     * @type {{app:string, data:[{dynamic:boolean,name:string}]}}
     */
    var mapping = [];
    return {
        regex: /(^\/)|(\/$)/,
        strategy: 'path',
        resolve: function (url) {
            url = StringUtils.removeSlashes(url);
            if(url === '') {
                url = 'home';
            }
            var parts = url.split('/');
            var params;
            var app = null;
            
            for(var k = 0; k < mapping.length; k++) {
                var compatible = false;
                params = {};
                var route = mapping[k];
                var data = route.data;
                if(data.length === parts.length || data[data.length - 1] === '*') {
                    compatible = true;
                    app = route.app;
                    params = {};
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if(item.dynamic) {
                            params[item.name] = parts[i];
                        } else if(item.name === parts[i] || item.name === '*'){
                        } else {
                            compatible = false;
                            break;
                        }
                    }
                }
                if(compatible) {
                    app = route.app;
                } else {
                    params = {};
                    app = '';
                }
            }
            return {params: params, app: app};
        },
        addMapping: function(className, url){
            if(typeof className !== 'string' || typeof url !== 'string') {
                throw 'Invalid arguments exception';
            }
            var urlData = this.parseUrl(url);
            for(var i = 0; i< mapping; i++) {
                var data = mapping[i].data;
                var same = data.length === urlData.length;
                if(same) {
                    for(var d = 0; d < data.length; d++) {
                        var oldItem = data[d];
                        var newItem = urlData[d];
                        if(!oldItem.dynamic && !newItem.dynamic) {
                            if(oldItem.name !== newItem.name) {
                                same = false;
                                break;
                            }
                        }
                    }
                }
                if(same) {
                    throw "Can't put two items with same request mapping: " + url;
                }
            }
            mapping.push({
                app: className,
                data: urlData
            });
        },
        parseUrl: function(url){
            url = StringUtils.removeSlashes(url);
            var parts = url.split("/");
            var out = [];
            for(var i = 0; i < parts.length; i++) {
                var name = parts[i];
                var dynamic = name[0] == ':';
                if(dynamic) {
                    name =  name.substring(1);
                }
                out.push({name: name, dynamic: dynamic});
            }
            return out;
        }
    }
});
