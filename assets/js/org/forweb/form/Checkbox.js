Engine.define('Checkbox', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Checkbox(params) {
        AbstractInput.apply(this, arguments);
        Dom.append(this.container, [this.input, this.label]);
        this.input.checked = this._checked;
        delete(this._checked);
    }
    Checkbox.prototype = Object.create(AbstractInput.prototype);
    
    Checkbox.prototype.getElementType = function() {
        return 'input'
    };
    Checkbox.prototype.getInputType = function() {
        return 'checkbox';
    };

    Checkbox.prototype.getValue = function() {
        return this.input.checked;
    };
    Checkbox.prototype.setValue = function(value) {
        this.input.checked = value;
    };
    Checkbox.prototype.prepareAttributes = function(params) {
        var out = AbstractInput.prototype.prepareAttributes.apply(this, arguments);
        this._checked = !!params.value;
        delete out.value;
        return out;
    };
    Checkbox.prototype.toString = function() {
        return "Radio(" + this.input.name + ")";
    };
    Checkbox.toString = function() {
        return "Radio"
    };
    Checkbox.prototype.constructor = Checkbox;

    return Checkbox;
});