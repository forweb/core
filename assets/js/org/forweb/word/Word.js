Engine.define('Word', ['Ajax'], function(){
    var Ajax = Engine.require('Ajax');
    var onLoad = {};
    var enLaguageLoaded = false;
    
    var Word = function(key, module, container, strategy) {
        if(!strategy && typeof container === 'string') {
            strategy = container;
            container = module;
            module = 'default';
        }
        if(typeof module !== 'string' && !container) {
            container = module;
            module = 'default';
        }
        
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
            clb(Word.get(key, module));
        } else {
            Word.loadLanguage(Word.language, function(){
                clb(Word.get(key, module))
            });
        }
    };
    Word.dictionaries = {};
    Word.dictionariesPath = 'assets/js/word/';

    Word.get = function(key, module, language){
        if(!language) language = Word.language;
        if(!module)module = 'default';
        var lang = Word.dictionaries[language];
        if(lang) {
            var mod = lang[module] || lang['default'] || {};
            return mod[key];
        } else {
            return null;
        }
    };

    Word.languageLoaded = function(language){
        if(!language) language = Word.language;
        return Word.dictionaries[language] !== undefined;
    };

    Word.loadLanguage = function(language, clb){
        if(typeof language === 'function' && !clb) {
            clb = language;
            language = Word.language;
        } else if(!language) {
            language = Word.language;
        }
        if(!onLoad[language]) {
            if(typeof clb === 'function') {
                onLoad[language] = [clb];
            } else {
                onLoad[language] = clb;
            }
        } else {
            if(typeof clb === 'function') {
                onLoad[language].push(clb);
            } else {
                onLoad[language] = onLoad[language].concat(clb);
            }
            return;
        }
        if(Word.loader) {
            Word.loader(language, onLoad[language]);
        } else {
            Ajax.ajax(
                {
                    url: Word.dictionariesPath + language + '.json',
                    type: 'get'
                },
                function(dictionary){
                    var norm = {};
                    for(var k in dictionary) {
                        if(!dictionary.hasOwnProperty(k)) continue;
                        var value = dictionary[k];
                        if(typeof value === 'string') {
                            if(!norm.default) {
                                norm.default = {};
                            }
                            norm.default[k] = value;
                        } else {
                            norm[k] = value;
                        }
                    }
                    Word.dictionaries[language] = norm;
                    Word.language = language;
                    for(var i = 0; i < onLoad[language].length; i++) {
                        onLoad[language][i]();
                    }
                },
                function(){
                    if(!enLaguageLoaded) {
                        enLaguageLoaded = true;
                        Word.loadLanguage('en', onLoad[language]);
                        delete(onLoad[language]);
                    } else {
                        Engine.console("Can't load language - " + language, 'E');
                    }
                }
            );
            
        }
    };
    Word.translate = function(language, node) {
        if(!language) language = Word.language;
        if(!node)node = document.body;
        function clb() {
            var words = node.getElementsByClassName('word');
            for(var i = 0; i < words.length; i++) {
                var w = words[i];
                var key = w.getAttribute('data-w-key');
                var module = w.getAttribute('data-w-module');
                var strategy = w.getAttribute('data-w-strategy');
                if(key) {
                    Word(key, module, w, strategy);
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
    
    Word.create = function(defaultModule, defaultContainer) {
        var out = function(key, module, container, strategy){
            if(typeof module !== 'string') {
                container = module;
                module = null;
            }
            return Word(key, module || defaultModule, container || defaultContainer, strategy)
        };
        out.get = function(key, language){
            return Word.get(key, defaultModule, language);
        };
        out.languageLoaded = Word.languageLoaded;
        out.loadLanguage = Word.loadLanguage;
        out.translate = Word.translate;
        return out;
    };

    Word.language = navigator.language || navigator.userLanguage || 'en';
    return Word;
});