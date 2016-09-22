Engine.define("Config", (function () {
    function Config(configName) {
        this.configName = configName;
        try {
            this.storage = JSON.parse(localStorage.getItem(configName));
        } catch (e) {
            this.storage = null;
        }
        if (this.storage == null) {
            this.storage = {};
        }
    }
    Config.prototype.get = function (name) {
        return this.storage[name];
    };
    Config.prototype.has = function(name) {
        return this.get(name) !== undefined;
    };
    Config.prototype.set = function (name, value) {
        this.storage[name] = value;
        localStorage.setItem(this.configName, JSON.stringify(this.storage));
    };
    Config.prototype.remove = function (name) {
        delete(this.storage[name]);
        localStorage.setItem(this.configName, JSON.stringify(this.storage));
    };
    Config.prototype.toString = function() {
        return 'Config instance';
    };
    return Config;
}));