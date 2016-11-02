Engine.define('FormMeta', function(){
    function FormMeta(params){
        if(!params)params = {};
        this.submitButton = params.submitButton || null;//if false, submit button will not be added, if DOM node, will be used instead
        this.onSubmit = params.onSubmit || null;//Function to handle submit after validation
        this.title = params.title || null;//Form title. string or DOM node
        this.class = params.title || null;//if defined, class will be added to form
        this.id = params.title || null;//if defined, id will be added to form
        this.wordKey = params.wordKey || null;//if defined, word instance will be created for internationalization
    }
    return FormMeta;
});