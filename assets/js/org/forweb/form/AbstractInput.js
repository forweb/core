Engine.define("AbstractInput", ['Dom', 'StringUtils'], (function(Dom, StringUtils){
        
    function AbstractInput(params) {
        if(!params.name)throw "Name is reqired for input";
        this.input = Dom.el(this.getElementType(), this.prepareAttributes(params), this.prepareContent(params));
        this.label = this.buildLabel(params);
        this.container = Dom.el('div', 'formfield-holder ' + (params.class || ''), [this.label, this.input]);
        this.errors = null;
        this.errorsData = null;
    }
    
    AbstractInput.prototype.addError = function(errors) {
        if(this.errors === null) {
            this.errors = Dom.el('div', 'formfield-errors');
            this.container.appendChild(this.errors);
            this.errorsData = {};
        } else {
            this.errors.innerHTML = '';
        }
        if(typeof errors === 'string') {
            this.errorsData.custom = errors;
        } else {
            for(var ek in errors) {
                if(errors.hasOwnProperty(ek)) {
                    this.errorsData[ek] = errors[ek];
                }
            }
        }
        
        for(var k in this.errorsData) {
            if(this.errorsData.hasOwnProperty(k) && this.errorsData[k]) {
                this.errors.appendChild(Dom.el('div', 'err', this.errorsData[k]));
            }
        }
    };
    
    AbstractInput.prototype.buildLabel = function(params) {
        var content;
        if(params.noLabel === true) {
            content = null;
        } else if(params.label) {
            content = params.label;
        } else {
            content = StringUtils.normalizeText(params.name);
        }
        var attr = {};
        if(params.id) {
            attr.id = params.id;
        } else if(params.formId) {
            attr.id = params.formId + "_" + params.name;
        } else {
            attr.id = params.name;
        }
        return Dom.el('label', attr, content);
    };
    AbstractInput.prototype.getInputType = function() {
        throw "This function must be overrided";
    };
    AbstractInput.prototype.getElementType = function() {
        throw "This function must be overrided";
    };
    AbstractInput.prototype.prepareContent = function(params) {
        return null;
    };
    AbstractInput.prototype.prepareAttributes = function(params) {
        var out = {
            value: params.value || "",
            name: params.name,
            type: this.getInputType(),
            id: params.id || StringUtils.unique()
        };
        if(out.type === null) {
            delete out.type;
        }
        if(params.attr) {
            for(var key in params.attr) {
                if(params.attr.hasOwnProperty(key)) {
                    out[key] = params.attr[key];
                }
            } 
        }
        for(var k in params) {
            if(!params.hasOwnProperty(k))continue;
            if(k.indexOf('on') === 0) {
                out[k] = params[k];
            }
        }
        return out;
    };
    
    AbstractInput.prototype.getValue = function() {
        return this.input.value;
    };
    AbstractInput.prototype.setValue = function(value) {
        this.input.value = value;
    };
    return AbstractInput;
}));