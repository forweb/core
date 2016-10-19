Engine.define('Text', ['Dom', 'AbstractInput'], function(Dom, AbstractInput) {
    function Text(params) {
        AbstractInput.apply(this, arguments);
    }
    Text.prototype = Object.create(AbstractInput.prototype);
    
    Text.prototype.getElementType = function() {
        return 'input'
    };
    Text.prototype.getInputType = function() {
        return 'text';
    };
    Text.prototype.toString = function() {
        return "Text(" + this.input.name + ")";
    };
    Text.toString = function() {
        return "Text"
    };
    Text.prototype.constructor = Text;
    return Text;
});