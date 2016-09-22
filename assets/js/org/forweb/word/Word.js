Engine.define('Word', ['Ajax'], function(){
    var Ajax = Engine.require('Ajax');

    var Word = function(key, container, strategy) {
        var clb = function(text){
            if(strategy && strategy != 'text') {
                if(strategy == 'append') {
                    container.appendChild(document.createTextNode(text));
                } else {
                    container.innerHTML = text;
                }
            } else {
                container.innerText = text;
            }
        };
        if(Word.languageLoaded(Word.language)) {
            clb(Word.get(key));
        } else {
            Word.loadLanguage(Word.language, function(){clb(Word.get(key))});
        }
    };
    Word.dictionaries = {};
    Word.dictionariesPath = 'assets/js/word/';

    Word.get = function(key, language){
        if(!language) language = Word.language;
        if(Word.dictionaries[language]) {
            return Word.dictionaries[language][key];
        } else {
            return null;
        }
    };

    Word.languageLoaded = function(language){
        return Word.dictionaries[language] !== undefined;
    };

    Word.loadLanguage = function(langauge, clb){
        if(Word.loader) {
            Word.loader(langauge, clb);
        } else {
            Ajax.ajax(
                {
                    url: Word.dictionariesPath + langauge + '.json',
                    type: 'get'
                },
                function(dictionary){
                    Word.dictionaries[langauge] = dictionary;
                    Word.language = langauge;
                    clb();
                },
                function(){
                    Engine.console("Can't load language - " + langauge, 'E');
                }
            );
            
        }
    };
    Word.translate = function(language, node) {
        if(!node)node = document.body;
        function clb() {
            var words = node.getElementsByClassName('word');
            for(var i = 0; i < words.length; i++) {
                var w = words[i];
                var key = w.getAttribute('data-w-key');
                var strategy = w.getAttribute('data-w-strategy');
                if(key) {
                    Word(key, w, strategy);
                }
            }
        }
        if(Word.languageLoaded(language)) {
            Word.language = language;
            clb();
        } else {
            Word.loadLanguage(language, clb);
        }
    };

    Word.language = navigator.language || navigator.userLanguage || 'en';

    return Word;
});