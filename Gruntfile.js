module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      mainJS: {
        options: {
          baseUrl: "public/js/",
          paths: {
            "desktop": "App/Init"
          },
          wrap: true,
          name: "libs/almond",
          preserveLicenseComments: false,
          optimize: "uglify",
          mainConfigFile: "public/js/App/Init.js",
          include: ["desktop"],
          out: "public/js/App/Init.min.js"
        }
      },
      mainCSS: {
        options: {
          optimizeCss: "standard",
          cssIn: "./public/css/App.css",
          out: "./public/css/App.min.css"
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'public/App/**/*.js', '!public/App/**/*min.js', 'public/Jet/**/*.js', '!public/Jet/**/*min.js'],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['requirejs:mainJS', 'requirejs:mainCSS']);
  grunt.registerTask('default', ['test', 'build']);

};