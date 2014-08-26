define(['require', 'underscore'],function(){
    return {
        specs: [
            "Tokenizer/Simple",
            // "Tokenizer/Hierarchical",
        ],

        /**
         * Count of last test files
         */
        notLoadedCounter: undefined,

        /**
         * Add test scope to x
         */
        mapFn: function (moduleId) {
            return "Jet/tests/" + moduleId
        },

        /**
         * Load all tests and run callback
         * @param callback
         */
        load: function(callback){
            this.notLoadedCounter = this.specs.length;
            this.cb = callback;
            require(_.map(this.specs, this.mapFn));
        },

        setLoaded: function(moduleId) {
            this.notLoadedCounter--;
            if (this.cb && this.notLoadedCounter <= 0) {
                this.cb();
                this.notLoadedCounter = this.cb = undefined;
            }
        }
    }
})