Engine.define('FielsetMeta', function(){
    function FielsetMeta(params){
        if(!params)params = {};
        this.render = params.render || null;//Function for component render. Return type should have "AbstractInput" as parent.
        this.wrapper = params.wrapper || null;//if defined, all content will be putted inside of it. DOM node or function
    }
    return FielsetMeta;
});