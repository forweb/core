Engine.define('GenericFieldset', ['Dom', 'AbstractFieldsContainer'], function(){

    var Dom = Engine.require('Dom');
    var AbstractFieldsContainer = Engine.require('AbstractFieldsContainer');


    function GenericFieldset(data, fieldsMeta, formMeta) {
        AbstractFieldsContainer.apply(this, arguments);
    }
    GenericFieldset.prototype = Object.create(AbstractFieldsContainer.prototype);


    AbstractFieldsContainer.resolvers.unshift(function(params, meta, metaType) {
        return metaType === 'fieldset' || typeof params.value === 'object' ?
            new GenericFieldset(params.value, meta.metaData, meta) : null
    });

    GenericFieldset.prototype.createContainer = function(){
        var attr = {};
        var meta = this.containerMeta || {};
        if(meta.id)attr.id = meta.id;
        if(meta.class)attr.class = meta.class;
        var legend;

        if(meta.legend === false) {
            legend = null;
        } else if(typeof meta.legend === 'string') {
            legend = Dom.el('legend', null, meta.legend);
        }
        if(this.word && meta.wordLegend) {
            this.word(meta.wordLegend, legend);
        } else if(!legend && meta.legend) {
            legend = meta.legend;
        }
        return Dom.el('fieldset', attr, legend);
    };

    return GenericFieldset;
});