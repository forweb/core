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
        } else if (typeof rules.push !== 'function' && typeof rules.pop !== 'function') {
            for (var k in rules) {
                if (rules.hasOwnProperty(k) && !$.isArray(rules[k])) {
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
                if (rules.hasOwnProperty(rule) && Validation.Rules.hasOwnProperty(rule)) {
                    var isValid = Validation.Rules[rule].apply(Validation.Rules, [].concat(value, rules[rule]));
                    if (!isValid) {
                        errors.push(rule);
                    }
                } else {
                    throw "Unknown validation rule: " + rule + ". Please use one of the following: " + Object.keys(Validation.Rules);
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
            phone: 'Not valid phone format. Only "-" characters and numbers allowed.',
            zip: 'Not valid zip code format. Only "-" characters and numbers allowed.',
            time: 'Invalid time format',
            dateString: 'Invalid date format.',
            timeString: 'Invalid time format, must be hh:mm:ss.',
            'default': 'Something wrong.'
        },
        Rules: {
            required: function (v, flag) {
                if (flag === 'lazy') {
                    return ((v === '0' || v === ' ') ? false : !!v)
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
                if (!v)v = 0;
                return parseInt(v) <= limit;
            },
            min: function (v, limit) {
                if (!v)v = 0;
                return parseInt(v) >= limit;
            },
            length: function (v, min, max) {
                if (!v)v = "";
                return (max === undefined ? true : v.length <= max) && v.length >= min;
            },
            pattern: function (v, pattern) {
                return pattern.test(v);
            },
            number: function (v) {
                if (!v)return true;
                return Validation.Rules.pattern(v, /^(-?\d*)$/g);
            },
            positive: function (v) {
                return Validation.Rules.pattern(v, /^(\d*)$/g);
            },
            negative: function (v) {
                return Validation.Rules.pattern(v, /^(-\d*)$/g);
            },
            email: function (v) {
                return Validation.Rules.pattern(v, IS_EMAIL);
            },
            phone: function (v) {
                if (v) {
                    if (typeof v === 'string') {
                        var numbers = v.replace(/-/g, '');
                        return Validation.Rules.number(numbers);
                    }
                    return typeof v === 'number';
                }
                return true;
            },

            zip: function (v) {
                return Validation.Rules.phone(v);
            },
            time: function (v, separator, limit) {
                if (!v)return true;
                if (!separator)separator = ':';
                var parts = v.split(separator);
                if (parts.length == 2) {
                    if (!limit)limit = 13;
                    limit = parseInt(limit);
                    var hours = parseInt(parts[0]);
                    var minutes = parseInt(parts[1]);
                    if (hours < 0 || hours > limit) {
                        return false;
                    }
                    return !(minutes < 0 || minutes > 59);
                } else {
                    return false;
                }
            },
            dateString: function (v, format, separator) {
                if (!v)return true;
                var calendar = DateUtils.parseDate(v, separator, format);
                return calendar != null;
            },
            timeString: function (v) {
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