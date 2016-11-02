Engine.define('AbstractFieldsContainer', ['Dom', 'Text', 'Textarea', 'Radio', 'Select', 'Checkbox', 'Validation', 'Password', 'Word'], function(){

    var Dom = Engine.require('Dom');
    var Word = Engine.require('Word');
    var Text = Engine.require('Text');
    var Radio = Engine.require('Radio');
    var Select = Engine.require('Select');
    var Checkbox = Engine.require('Checkbox');
    var Password = Engine.require('Password');
    var Textarea = Engine.require('Textarea');
    var Validation = Engine.require('Validation');

    function AbstractFieldsContainer(data, fieldsMeta, containerMeta) {

        var html = [];
        this.fields = {};
        this.word = containerMeta.wordKey ? Word.create(containerMeta.wordKey) : null;
        this.model = data;
        this.containerMeta = containerMeta;

        if(!fieldsMeta) {
            fieldsMeta = {};
        }
        this.meta = fieldsMeta;
        for(var key in data) {
            if(!data.hasOwnProperty(key))continue;
            var value = data[key];
            var field;
            var fieldWordLabel = null;
            var fieldMeta = fieldsMeta[key];
            if(fieldMeta === false){
                continue;
            } else if(fieldMeta) {
                if(fieldMeta.ignore) {
                    continue
                }
                field = fieldMeta.render ?
                    (typeof fieldMeta.render === "function" ? fieldMeta.render(this.onChange, key, value) : fieldMeta.render) :
                    this.buildInput(key, value, fieldMeta);
                var content = [
                    typeof fieldMeta.contentBefore === 'function' ? fieldMeta.contentBefore(key, value) : fieldMeta.contentBefore,
                    field.container,
                    typeof fieldMeta.contentAfter === 'function' ? fieldMeta.contentAfter(key, value) : fieldMeta.contentAfter
                ];
                if(fieldMeta.wrapper) {
                    var wrapper = fieldMeta.wrapper;
                    if(typeof wrapper === 'function') {
                        html.push(wrapper(content, key, value));
                    } else {
                        Dom.append(wrapper, content);
                        if(html.indexOf(wrapper) === -1) {
                            html.push(wrapper);
                        }
                    }
                } else {
                    html = html.concat(content);
                }
                fieldWordLabel = fieldMeta.wordKey || null;
            } else {
                field = this.buildInput(key, value, null);
                html.push(field.container)
            }

            if(containerMeta.wordKey && field.label) {
                this.word(fieldWordLabel || "label_" + key, field.label)
            }
            this.fields[key] = field;
        }
        this.container = this.createContainer();
        Dom.append(this.container, html);
    }

    AbstractFieldsContainer.resolvers = [
        function(params, meta, metaType){
            return (metaType === 'select') || params.options && params.options.length > 3 ? new Select(params) : null;
        },
        function(params, meta, metaType) {
            return (metaType === 'radio') || params.options && params.options.length > 3 ? new Radio(params) : null;
        },
        function(params, meta, metaType) {
            return (metaType === 'checkbox') || typeof params.value === 'boolean' ? new Checkbox(params) : null;
        },
        function(params, meta, metaType) {
            return metaType === 'password' ||
            (typeof params.name === 'string' && params.name.toLowerCase().indexOf('pass') > -1) ?
                new Password(params) : null;
        },
        function(params, meta, metaType) {
            return metaType === 'textarea' ||
            (typeof params.value === 'string' && (params.value.indexOf('\n')  > -1 || params.value.length > 40)) ?
                new Textarea(params) : null;
        },
        function(params, meta, metaType) {
            return metaType === 'text' || typeof params.value !== 'object' ? new Text(params) : null
        }
    ];

    AbstractFieldsContainer.prototype.validateField = function(fieldName){
        var meta = this.meta[fieldName];
        var field = this.fields[fieldName];
        if(field instanceof AbstractFieldsContainer) {
            return field.validate();
        }
        if(!meta || meta.ignore === true) {
            return true;
        }
        var value = this.model[fieldName];

        if(meta.removeErrors) {
            meta.removeErrors()
        } else if(field.removeErrors) {
            field.removeErrors();
        }
        if(meta.validations) {
            var errorKeys = Validation.validate(value, meta.validations);

            if(errorKeys.length > 0) {
                var messages = this.findErrorMessages(meta, errorKeys);
                if(meta.addError) {
                    meta.addError(messages);
                } else if(field.addError){
                    var errorFields = field.addError(messages);
                    if(this.word) {
                        for(var errorKey in errorFields) {
                            if(!errorFields.hasOwnProperty(errorKey))continue;
                            var errorHtml = errorFields[errorKey];
                            var wordErrorKey;
                            if(meta.wordErrorKey) {
                                if(typeof meta.wordErrorKey === 'string') {
                                    wordErrorKey = meta.wordErrorKey;
                                } else {
                                    wordErrorKey = meta.wordErrorKey[errorKey];
                                }
                            }
                            this.word(wordErrorKey || "error_" + fieldName, errorHtml);
                        }
                    }
                }
                return false;
            } else {
                return true;
            }
        }
        return true;
    };
    AbstractFieldsContainer.prototype.validate = function(){
        if(this.meta) {
            var formValidation = true;
            for(var key in this.meta) {
                if(!this.meta.hasOwnProperty(key))continue;
                var fieldValidation = this.validateField(key);
                if(formValidation && !fieldValidation) {
                    formValidation = false;
                }
            }
            return formValidation;
        } else {
            return true;
        }
    };

    AbstractFieldsContainer.prototype.findErrorMessages = function(meta, errorKeys){
        var out = {};
        for(var i = 0; i < errorKeys.length; i++) {
            var key = errorKeys[i];
            if(meta && typeof meta.errorMessages === 'string') {
                out[key] = meta.errorMessages;
            } else if(meta && meta.errorMessages && meta.errorMessages[key] !== undefined ){
                out[key] = meta.errorMessages[key];
            } else if(Validation.messages[key] !== undefined) {
                out[key] = Validation.messages[key];
            } else {
                out[key] = Validation.messages['default'];
            }
        }
        return out;
    };
    AbstractFieldsContainer.prototype.onChange = function(key, value){
        this.model[key] = value;
        this.validateField(key);
    };
    AbstractFieldsContainer.prototype.buildInput = function(key, value, meta){
        var me = this;
        var out = null;
        var listeners = null;
        var params = {name: key, value: value};
        var metaType = null;

        if(meta) {
            listeners = meta.listeners;
            params.options = meta.options || null;
            params.label = meta.label || null;
            if(meta.label === false) {
                params.noLabel = true;
            }
            metaType = meta.type || null;
        }

        var onchange = null;
        var onkeyup = null;
        if(listeners) {
            if(typeof listeners === 'function') {
                listeners = {onchange: listeners};
            }
            for(var eventName in listeners) {
                if(listeners.hasOwnProperty(eventName)) {
                    var lc = eventName.toLowerCase();
                    var eventListener = listeners[eventName];
                    if(lc === 'onchange' || lc === 'change') {
                        onchange = eventListener;
                    } else if(lc === 'onkeyup' || lc === 'keyup') {
                        onkeyup = eventListener
                    } else {
                        params[eventName] = eventListener;
                    }
                }
            }
        }
        params.onchange = function(e){
            me.onChange(key, out.getValue());
            if(onchange){
                onchange(e);
            }
        };
        params.onkeyup = function(e){
            me.onChange(key, out.getValue());
            if(onkeyup){
                onkeyup(e);
            }
        };


        for(var i = 0; i < AbstractFieldsContainer.resolvers.length; i++) {
            out = AbstractFieldsContainer.resolvers[i](params, meta, metaType);
            if(out != null) {
                break;
            }
        }
        if(out != null) {
            return out;
        } else {
            throw "Can't instantiate field for " - params.value;
        }
    };

    return AbstractFieldsContainer;
});