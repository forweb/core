Engine.define("AbstractInput", ['Dom', 'StringUtils'], (function(Dom, StringUtils){
        
    function AbstractInput(params) {
        if(!params.name)throw "Name is reqired for input";
        this.input = Dom.el(this.getElementType(), this.prepareAttributes(params), this.prepareContent(params));
        this.label = this.buildLabel(params);
        this.container = Dom.el('div', 'formfield-holder ' + (params.class || ''), [this.label, this.input]);
        this.errors = null;
        this.errorsData = null;
    }

    /**
     * Remove errors from input.
     * If first argument is null or undefined, all errors will be removed
     * if first argument is string, only error of this type will be removed
     * if first argument is array, all errors from this array will be removed
     * @param errorKeys
     */
    AbstractInput.prototype.removeErrors = function(errorKeys) {
        var errorsToShow = {};
        if(this.errorsData && errorKeys) {
            if(typeof errorKeys === 'string') {
                errorKeys = [errorKeys];
            }

            for (var key in this.errorsData) {
                if (this.errorsData.hasOwnProperty(key)) {
                    if(errorKeys.indexOf(key) === -1) {
                        errorsToShow[key] = this.errorsData[key];
                    }
                }
            }
        }
        this.errorsData = {};
        this.addError(errorsToShow);
    };
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
        var out = {};
        for(var k in this.errorsData) {
            if(this.errorsData.hasOwnProperty(k) && this.errorsData[k]) {
                out[k] = Dom.el('div', 'err', this.errorsData[k]);
                this.errors.appendChild(out[k]);
            }
        }
        return out;
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
        var attr = {for: this.input.id};
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
            if(typeof params[k] === 'function') {
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