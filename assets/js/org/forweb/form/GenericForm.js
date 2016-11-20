Engine.define('GenericForm', ['AbstractFieldsContainer', 'Dom'], function(){

    var Dom = Engine.require('Dom');
    var AbstractFieldsContainer = Engine.require('AbstractFieldsContainer');

    function GenericForm(data, fieldsMeta, formMeta) {
        AbstractFieldsContainer.apply(
            this,
            GenericForm.prepareArguments(data, fieldsMeta, formMeta)
        );
        if(!formMeta)formMeta = fieldsMeta;
        if(formMeta.submitButton === false) {
            this.submit = null;
        } else if(formMeta.submitButton) {
            this.submit = formMeta.submitButton;
        } else {
            this.submit = Dom.el('div', null, Dom.el('input', {type: 'submit', class: 'primary', value: 'Submit'}));
        }
        Dom.append(this.container, this.submit);
    }
    GenericForm.prototype = Object.create(AbstractFieldsContainer.prototype);

    GenericForm.prepareArguments = function(data, fieldsMeta, formMeta) {
        if(formMeta === undefined) {
            formMeta = fieldsMeta;
            fieldsMeta = null;
        }
        if(typeof formMeta === 'function') {
            formMeta = {onSubmit: formMeta};
        }
        if(!formMeta.onSubmit)throw 'onSubmit is required for generic form';
        return [data, fieldsMeta, formMeta];
    };

    GenericForm.prototype.createContainer = function(){
        var me = this;
        var attr = {onsubmit: function(e){
            me.onSubmit(e)
        }};
        var meta = this.containerMeta || {};
        if(meta.class)attr.class = meta.class;
        if(meta.id)attr.id = meta.id;
        var title = null;
        if(typeof meta.title === 'string') {
            title = Dom.el('h3', null, meta.title);
        } else if (meta.title) {
            title = meta.title;
        }
        return Dom.el('form', attr, title);
    };
    GenericForm.prototype.onSubmit = function(e){
        if(e)e.preventDefault();
        if(this.validate()) {
            this.containerMeta.onSubmit(this.model)
        }
    };

    return GenericForm;
});