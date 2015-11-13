'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    concat_sourcemap: {
      options: {
        sourcesContent: true
      },
      target: {
        files: { 
          'dist/dbmng.js': [
            
            // License & version info, start the containing closure
            'src/Intro.js',
            
            // Simple inheritance
            'src/Class.js',
            // IE9 polyfills
            'src/Ie9.js',
            // Utils like extend, each, and trigger
            'src/Utilities.js',
            'src/Dbmng.js',
            'src/Form.js',
            'src/themes/*.js',
            'src/widgets/*.js',
            
            // End the closure
            'src/Outro.js'
          ],
        }
      }
    },
    removelogging : {
      main : {
        src : 'dist/dbmng.js',
        dest : 'dist/dbmng.built.js'        
      }
    },
    uglify: {
      dist: {
        src: 'dist/dbmng.built.js',
        dest: 'dist/dbmng.min.js'
      },
      options: {
        preserveComments: 'some'
      }
    },
    watch: {
      scripts: {
        files: ["src/**/*.js"],
        tasks: ["concat_sourcemap"]
      }
    },
    qunit: {
        all: {
          options: {
            urls: [
              'http://localhost/dbmng2/js/tests/index.html',
            ]
          }
        }
    },
    jshint: {
      options: {
        browser: true,
        indent: 2,
        nonbsp: true,
        nonew: true,
        immed: true,
        latedef: true,
        globals: {
          'jQuery': true
        },
      },      
      beforeconcat: [
         // Simple inheritance
            'src/Class.js',
            // IE9 polyfills
            'src/Ie9.js',
            // Utils like extend, each, and trigger
            'src/Utilities.js',
            'src/Dbmng.js.js',
            'src/Form.js',
            'src/themes/*.js',
            'src/widgets/*.js',        
      ],
      afterconcat: {
        options: {
          undef: true
        },
      globals: {
        jQuery: true
      },
        files: {
          src: ['dist/dbmng.built.js']
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks("grunt-remove-logging");
  grunt.loadNpmTasks('grunt-contrib-qunit');
 



  // Default task.
  //grunt.registerTask('default', ['jshint:beforeconcat','concat_sourcemap','removelogging','uglify']);
  grunt.registerTask('default', ['jshint:beforeconcat','concat_sourcemap','removelogging','jshint:afterconcat','uglify']);
  grunt.registerTask('test', ['jshint:beforeconcat','concat_sourcemap','removelogging','jshint:afterconcat','uglify','qunit']);

};