Engine.define('StringUtils', (function () {
    
    var NORMAL_TEXT_REGEXP = /([a-z])([A-Z])/g;
    var REMOVE_FIRST_LAST_SLASHES = /^(\/)|(\/)$/g;
    var LOW_DASH = /\_/g;
    var DASH = /\-/g;
    
    var StringUtils = {
        unique: function (l) {
            return Math.random().toString(36).substring(2, l ? l + 2 : 7);
        },
        removeSlashes: function (str){
            return str.replace(REMOVE_FIRST_LAST_SLASHES, '');
        },
        capitalize: function(str){
            if(!str)return str;
            return str[0].toUpperCase() + str.substring(1);
        },
        normalizeText: function(str, glue){
            if(glue === undefined) {
               glue = ' '; 
            }
            if(!str)str = '';
            if(str.indexOf('_') > -1) {
                str = str.replace(LOW_DASH, ' ');
            }
            if(str.indexOf('-') > -1) {
                str = str.replace(DASH, ' ');
            }
            if(str.match(NORMAL_TEXT_REGEXP)) {
                str = str.replace(NORMAL_TEXT_REGEXP, '$1 $2');
            }
            if(str.indexOf(' ') > -1) {
                var p = str.split(' ');
                var out = '';
                for (var i = 0; i < p.length; i++) {
                    if (!p[i])continue;
                    out += StringUtils.capitalize(p[i]) + (i !== p.length - 1 ? glue : '');
                }
                return out;
            } else {
                return StringUtils.capitalize(str);
            }
        }
    };
    
    return StringUtils;
}));