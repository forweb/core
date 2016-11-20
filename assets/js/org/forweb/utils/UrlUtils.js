Engine.define('UrlUtils', 'StringUtils', function(){
    var StringUtils = Engine.require('StringUtils');
    
    var UrlUtils = {
        /**
         * Get path from document.location without trailing slashes
         * example:
         * (without arguments)
         * http://mysite.com/some/path/here/
         * UrlUtils.getPath() => some/path/here
         *
         * (with argument)
         * http://mysite.com/some/path/here/
         * UrlUtils.getPath(1) => some
         * UrlUtils.getPath(2) => path
         *
         * @returns string
         */
        getPath: function (index) {
            var path = StringUtils.removeSlashes(document.location.pathname);
            if(index) {
                return path.split('/')[index - 1];
            } else {
                return path;
            }
        },
        /**
         * Fetch query value from document.location
         *
         * example:
         * http://mysite.com?param=argument
         * UrlUtils.getQuery('param') => argument  (decoded)
         *
         * @param paramName
         * @returns string|null
         */
        getQuery: function(paramName) {
            var queryString = document.location.search.replace(QUESTION_CHAR, '');
            var queryArray = queryString.split('&');
            if(queryArray.length > 0) {
                var eqParamName = paramName + "=";
                for(var i = 0; i < queryArray.length; i++) {
                    if(queryArray[i].indexOf(eqParamName) === 0) {
                        return decodeURIComponent(queryArray[i].substring(eqParamName.length));
                    } else if(queryArray[i] === eqParamName || queryArray[i] === paramName) {
                        return "";
                    }
                }
            }
            return null;
        },
    
        appendQuery: function(name, value) {
            var path = UrlUtils.getPath();
            var oldValue = UrlUtils.getQuery(name);
            name = encodeURIComponent(name);
            var eqName = name + "=";
            var append = value || value === 0 ? eqName + encodeURIComponent(value) : name;
    
            var search = document.location.search;
            if(oldValue === null && search === "") {
                search = "?" + append;
            } else {
                var parts = search.replace(/^\?/, '').split("&");
                var done = false;
                if(search.indexOf(name) > -1) {
                    for (var i = parts.length - 1; i >= 0; i--) {
                        if (parts[i].indexOf(eqName) === 0 || parts[i] === name) {
                            parts[i] = append;
                            done = true;
                            break;
                        }
    
                    }
                }
                if(!done) {
                    parts.push(append);
                }
                search = "?" + parts.join("&");
            }
            history.push(path + search);
        }, 
        removeQuery: function(paramName){
            if(paramName) {
                var queryString = document.location.search.replace(QUESTION_CHAR, '');
                var queryArray = queryString.split('&');
                if(queryArray.length > 0) {
                    var eqParamName = paramName + "=";
                    for(var i = 0; i < queryArray.length; i++) {
                        if(queryArray[i].indexOf(eqParamName) === 0 || queryArray[i] === paramName) {
                            queryArray.splice(i, 1);
                            var path = UrlUtils.getPath();
                            history.push(path + (queryArray.length ? "?" + queryArray.join("&") : ''));
                            break;
                        }
                    }
    
                }
            }
        }
    };
    return UrlUtils;
});