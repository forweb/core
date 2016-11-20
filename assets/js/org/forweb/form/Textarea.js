Engine.define('Textarea', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Textarea(params) {
        AbstractInput.apply(this, arguments);
    }
    Textarea.prototype = Object.create(AbstractInput.prototype);
    
    Textarea.prototype.getElementType = function() {
        return 'textarea'
    };
    Textarea.prototype.getInputType = function() {
        return null;
    };
    Textarea.prototype.toString = function() {
        return "Textarea(" + this.input.name + ")";
    };
    Textarea.toString = function() {
        return "Textarea"
    };
    Textarea.prototype.constructor = Textarea;
    return Textarea;
});