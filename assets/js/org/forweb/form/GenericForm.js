Engine.define('GenericForm', ['Dom', 'Text', 'Textarea', 'Radio', 'Select', 'Checkbox', 'Validation', 'Password', 'Word'], function(){

    var Dom = Engine.require('Dom');
    var Word = Engine.require('Word');
    var Text = Engine.require('Text');
    var Radio = Engine.require('Radio');
    var Select = Engine.require('Select');
    var Checkbox = Engine.require('Checkbox');
    var Password = Engine.require('Password');
    var Textarea = Engine.require('Textarea');
    var Validation = Engine.require('Validation');

    function GenericForm(data, fieldsMeta, formMeta) {
        if(formMeta === undefined && typeof fieldsMeta === 'function') {
            formMeta = {onSubmit: fieldsMeta};
            fieldsMeta = null;
        }
        if(typeof formMeta === 'function') {
            formMeta = {onSubmit: formMeta};
        }
        if(!formMeta.onSubmit)throw 'onSubmit is required for generic form';
        var html = [];
        var me = this;
        this.fields = {};
        this.word = formMeta.wordKey ? Word.create(formMeta.wordKey) : null;
        this.model = data;
        this.onSubmitSuccess = formMeta.onSubmit;
        if(!fieldsMeta) {
            fieldsMeta = {};
        }
        this.meta = fieldsMeta;
        for(var key in data) {
            if(!data.hasOwnProperty(key))continue;
            var value = data[key];
            this.model[key] = value;
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

            if(formMeta.wordKey && field.label) {
                this.word(fieldWordLabel || "label_" + key, field.label)
            }
            this.fields[key] = field;
        }

        this.submit = Dom.el('div', null, Dom.el('input', {type: 'submit', class: 'primary', value: 'Submit'}));
        this.container = Dom.el('form', null, [html, this.submit]);
        this.container.onsubmit = function(e){
            me.onSubmit(e)
        }
    }

    GenericForm.inputs = {
        text: Text,
        textarea: Textarea,
        checkbox: Checkbox,
        radio: Radio,
        select: Select,
        password: Password
    };

    GenericForm.prototype.onSubmit = function(e){
        if(e)e.preventDefault();
        if(this.validate()) {
            this.onSubmitSuccess(this.model)
        }
    };
    GenericForm.prototype.validateField = function(fieldName){
        var meta = this.meta[fieldName];
        if(!meta || meta.ignore === false) {
            return true;
        }
        var value = this.model[fieldName];
        var field = this.fields[fieldName];

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
    GenericForm.prototype.validate = function(){
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

    GenericForm.prototype.findErrorMessages = function(meta, errorKeys){
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
    GenericForm.prototype.onChange = function(key, value){
        this.model[key] = value;
        this.validateField(key);
    };
    GenericForm.prototype.buildInput = function(key, value, meta){
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

        if(metaType) {
            var clazz = GenericForm.inputs[metaType.toLowerCase()];
            if(clazz === undefined) {
                throw "Unknown type for form component - " +metaType+". Use one of the following: [text, textarea, checkbox, radio, select, password]"
            }
        } else if(params.options) {
            if(params.options.length > 3) {
                clazz = Select
            } else {
                clazz = Radio;
            }
        } else if(typeof value === 'boolean') {
            clazz = Checkbox;
        } else {
            clazz = Text;
        }
        out = new clazz(params);
        return out;
    };

    return GenericForm;
});