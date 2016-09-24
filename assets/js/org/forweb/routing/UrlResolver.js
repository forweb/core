Engine.define('UrlResolver', ['StringUtils'], function(StringUtils) {
    return {
        regex: /(^\/)|(\/$)/,
        wSregex: /\s/g,
        strategy: 'path',
        resolve: function () {
            var path;
            if(this.strategy === 'path'){
                path = document.location.pathname;
                path = path.replace(this.regex, '');
            } else {
                path = document.location.hash;
                if(path.indexOf('#') === 0) {
                    path = path.substring(1);
                }
            }
            var slashIndex = path.indexOf('/');
            if (slashIndex > -1) {
                path = path.substring(slashIndex);
            }
            if(!path) {
                path = 'Home';
            }
            return StringUtils.normalizeText(path, '-').replace(this.wSregex, '');
        }
    }
});