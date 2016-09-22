Engine.define('Select', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Select(params) {
        AbstractInput.apply(this, arguments);
        this.input.remove();
        delete this.input;
        
        this.params = params;
        this.options = params.options;
        this.update(params.value);
    }
    Select.prototype = Object.create(AbstractInput.prototype);
    Select.prototype.constructor = Select;
    
    Select.prototype.update = function(value) {
        this.input.innerHTML = '';
        for(var i = 0; i < this.options.length; i++) {
            var opt = this.options[i];
            var option = Dom.el('option', {value: opt.value}, opt.label);
            Dom.update(this.input, option);
        }
    };
    Select.prototype.getElementType = function() {
        return 'select'
    };
    Select.prototype.getInputType = function() {
        return null;
    };

    return Select;
});