Engine.define("Validation", function () {
    var IS_EMAIL = /^([a-zA-Z0-9_.+-])+\@(([cd a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var cache = {};

    function _normalizeRules(rules) {
        if (typeof rules === 'string') {
            if (cache[rules] === undefined) {
                var strRules = rules.split(' ');
                var object = {};
                for (var i = 0; i < strRules.length; i++) {
                    var args = strRules[i].split(':');
                    var name = args.shift();
                    object[name] = args;
                }
                cache[rules] = object;
            }
            rules = cache[rules];
        } else if (!Array.isArray(rules)) {
            for (var k in rules) {
                if (rules.hasOwnProperty(k) && !Array.isArray(rules[k])) {
                    rules[k] = [rules[k]]
                }
            }
        }
        return rules ? rules : {};
    }

    var Validation = {
        /**
         * @param value
         * @param rules (if string: 'min:6 max:4 require') (if object: {require: true, min:[1], max: 5, custom: function(v){return v === 4}}
         * @returns []
         */
        validate: function (value, rules) {
            rules = _normalizeRules(rules);
            var errors = [];
            for (var rule in rules) {
                if (rules.hasOwnProperty(rule) && Validation.rules.hasOwnProperty(rule)) {
                    var isValid = Validation.rules[rule].apply(Validation.rules, [].concat(value, rules[rule]));
                    if (!isValid) {
                        errors.push(rule);
                    }
                } else {
                    throw "Unknown validation rule: " + rule + ". Please use one of the following: " + Object.keys(Validation.rules);
                }
            }
            return errors;
        },
        messages: {
            required: 'Can\'t be empty.',
            max: 'Number is too large.',
            min: 'Number is too small.',
            length: 'This is not valid length.',
            email: 'Invalid email address',
            number: 'Value is not a number',
            positive: 'Value is not a positive number',
            negative: 'Value is not a negative number',
            time: 'Invalid time format',
            dateString: 'Invalid date format.',
            timeString: 'Invalid time format, must be hh:mm:ss.',
            'default': 'Something wrong.'
        },
        rules: {
            required: function (v, flag) {
                if(!v) return false;
                if (flag === 'lazy') {
                    return ((v === '0' || (v.trim && v.trim() === '')) ? false : !!v)
                } else if (flag === 'checkboxes') {
                    for (var value in v) {
                        if (v.hasOwnProperty(value) && v[value]) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return !!v;
                }
            },
            max: function (v, limit) {
                if(!v && v !== 0)return true;
                return parseInt(v) <= limit;
            },
            min: function (v, limit) {
                if(!v && v !== 0)return true;
                return parseInt(v) >= limit;
            },
            length: function (v, min, max) {
                if(!v && v !== 0)return true;
                return (max === undefined ? true : v.length <= max) && v.length >= min;
            },
            pattern: function (v, pattern) {
                return pattern.test(v);
            },
            number: function (v) {
                if (!v)return true;
                return Validation.rules.pattern(v, /^(-?\d*)$/g);
            },
            positive: function (v) {
                return Validation.rules.pattern(v, /^(\d*)$/g);
            },
            negative: function (v) {
                return Validation.rules.pattern(v, /^(-\d*)$/g);
            },
            email: function (v) {
                return Validation.rules.pattern(v, IS_EMAIL);
            },
            time: function (v) {
                if (!v)return true;
                var test = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
                return test.test(v);
            },
            custom: function (v, callback) {
                return callback(v);
            }
        }
    };
    return Validation;
});