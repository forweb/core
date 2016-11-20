Engine.define('PathBuilder', function(){
    
    function PathBuilder(version, defaultPath) {
        this.version = version;
        this.defaultPath = defaultPath || 'assets/js/org/forweb/';
    }
    PathBuilder.prototype.buildPath = function(module) {
        var path;
        switch (module) {
            case 'Word':
                path = 'word/' + module + '.js';
                break;
            case 'Dom':
            case 'Ajax':
            case 'Rest':
            case 'Config':
            case 'ScreenUtils':
            case 'StringUtils':
            case 'KeyboardUtils':
                path = 'utils/' + module + '.js';
                break;
            case 'Dispatcher':
            case 'UrlResolver':
                path = 'routing/' + module + '.js';
                break;
            case 'Pagination':
            case 'Menu':
            case 'Popup':
            case 'Tabs':
            case 'Grid':
                path = 'components/' + module + '.js';
                break;
            case 'Text':
            case 'Radio':
            case 'Select':
            case 'Password':
            case 'Checkbox':
            case 'Validation':
            case 'GenericForm':
            case 'AbstractInput':
                path = 'form/' + module + '.js';
                break;
            default:
                path = '';
        }
        return  (path ? this.defaultPath + path + (this.version ? '?seed=' + this.version : '') : '');
    };
    return PathBuilder;
});