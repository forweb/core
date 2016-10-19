Engine.define('GenericForm', ['Dom', 'Text', 'Textarea', 'Radio', 'Select', 'Checkbox', 'Validation', 'Password'], function(){

    var Dom = Engine.require('Dom');
    var Text = Engine.require('Text');
    var Radio = Engine.require('Radio');
    var Select = Engine.require('Select');
    var Checkbox = Engine.require('Checkbox');
    var Password = Engine.require('Password');
    var Textarea = Engine.require('Textarea');
    var Validation = Engine.require('Validation');

    function GenericForm(data, meta, onSubmit) {
        if(!onSubmit)throw 'onSubmit is required for generic form';
        var html = [];
        var me = this;
        this.fields = {};
        this.model = {};
        this.onSubmitSuccess = onSubmit;
        if(!meta) {
            meta = {};
        }
        this.meta = meta;
        for(var key in data) {
            if(!data.hasOwnProperty(key))continue;
            var value = data[key];
            this.model[key] = value;
            var field;
            if(meta[key]) {
                var m = meta[key];
                if(m.ignore)continue;
                field = m.render ?
                    (typeof m.render === "function" ? m.render(this.onChange, key, value) : m.render) :
                    this.buildInput(key, value, m.onchange);
                var content = [
                    typeof m.contentBefore === 'function' ? m.contentBefore(key, value) : m.contentBefore,
                    field.container,
                    typeof m.contentAfter === 'function' ? m.contentAfter(key, value) : m.contentAfter
                ];
                if(m.wrapper) {
                    if(typeof m.wrapper === 'function') {
                        html.push(m.wrapper(content, key, value));
                    } else {
                        Dom.append(m.wrapper, content);
                        html.push(m.wrapper);
                    }
                } else {
                    html = html.concat(content);
                }
            } else {
                field = this.buildInput(key, value);
                html.push(field.container)
            }
            this.fields[key] = field;
        }

        this.submit = Dom.el('div', null, Dom.el('input', {type: 'submit', class: 'primary', value: 'Submit'}));
        this.container = Dom.el('form', null, [html, this.submit]);
        this.container.onsubmit = function(e){
            me.onSubmit(e)
        }
    }

    GenericForm.prototype.onSubmit = function(e){
        if(e)e.preventDefault();
        if(this.validate) {
            this.onSubmitSuccess(this.model)
        }
    };
    GenericForm.prototype.validate = function(){
        if(this.meta) {
            var out = true;
            for(var key in this.meta) {
                if(!this.meta.hasOwnProperty(key))continue;
                var meta = this.meta[key];
                var value = this.model[key];
                var field = this.fields[key];

                if(meta.removeErrors) {
                    meta.removeErrors()
                } else if(field.removeErrors) {
                    field.removeErrors();
                }
                if(meta.validations) {
                    var errorKeys = Validation.validate(value, meta.validations);

                    if(errorKeys.length > 0) {
                        out = false;
                        var messages = this.findErrorMessages(meta, errorKeys);
                        if(meta.addError) {
                            meta.addError(messages);
                        } else if(field.addError){
                            field.addError(messages);
                        }
                    }
                }
            }
            return out;
        } else {
            return true;
        }
    };

    GenericForm.prototype.findErrorMessages = function(meta, errorKeys){
        var out = {};
        for(var key in errorKeys) {
            if(errorKeys.hasOwnProperty(key)) {
                if(meta.errorMessages && meta.errorMessages[key] !== undefined ){
                    out[key] = meta.errorMessages[key];
                } else if(Validation.messages[key] !== undefined) {
                    out[key] = Validation.messages[key];
                } else {
                    out[key] = Validation.messages['default'];
                }
            }
        }
        return {};
    };
    GenericForm.prototype.onChange = function(key, value){
        this.model[key] = value;
    };
    GenericForm.prototype.buildInput = function(key, value, onchange, meta){
        var me = this;
        var out = null;
        var params = {name: key, value: value, onchange: function(e){
            me.onChange(key, out.getValue());
            if(onchange){
                onchange(e);
            }
        }};
        if(meta && meta.options) {
            params.options = meta.options;
        }
        var metaType = meta && meta.type ? meta.type : null;
        if(metaType) {
            switch (metaType.toLowerCase()) {
                case 'text':
                    out = new Text(params);
                    break;
                case 'textarea':
                    out = new Textarea(params);
                    break;
                case 'checkbox':
                    out = new Checkbox(params);
                    break;
                case 'radio':
                    out = new Radio(params);
                    break;
                case 'select':
                    out = new Select(params);
                    break;
                case 'password':
                    out = new Password(params);
                    break;
                default:
                    throw "Unknown type for form component - " +metaType+". Use one of the following: [text, textarea, checkbox, radio, select, password]"
            }
        } else if(meta.options) {
            if(meta.options.length > 3) {
                out = new Select(params)
            } else {
                out = new Radio(params);
            }
        } else if(typeof value === 'boolean') {
            out = new Checkbox(params)
        } else {
            out = new Text(params);
        }
        return out;
    };

    return GenericForm;
});