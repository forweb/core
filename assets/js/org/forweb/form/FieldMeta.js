Engine.define('FieldMeta', function(){
    function FieldMeta(params){
        if(!params)params = {};
        this.ignore = params.ignore || false;//this field will be ignored on form building
        this.render = params.render || null;//Function for component render. Return type should have "AbstractInput" as parent.
        this.wrapper = params.wrapper || null;//if defined, all content will be putted inside of it. DOM node or function
        this.contentBefore = params.contentBefore || null;
        this.contentAfter = params.contentAfter || null;
        this.listeners = params.listeners || null;//callback functions. If this is function, it will listen onchange
        this.validations = params.validations || null;//validation rules
        this.removeErrors = params.removeErrors || null;//custom remove errors function
        this.errorMessages = params.errorMessages || null;//error messages holder. Should be object with key-value pairs or string
        this.options = params.options || null;//required field for "select", "radio", "checkboxes" component
        this.type = params.type || "text";//if render method not specified, this type will be used for component rendering
        this.label = params.label || null;//alternative label value
        this.wordKey = params.wordKey || null;//if form use word integration, this key will be used for label
        this.wordErrorKey = params.wordErrorKey || null;//if form use word integration, this key will be used for error message. Can be object or string.
    }
    return FieldMeta;
});