'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var yeomanConfig = {
    app: require('./bower.json').appPath || 'src',
    dist: 'dist',
    test: 'test'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= yeoman.dist %>'
            ]
          }
        ]
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      target: ['<%= yeoman.app %>/logical.js']
    },
    add_comment: {
      options: {
        comments: [
          'LogicalJS - Logic for your JavaScript!',
          'Check all the features & usage at https://github.com/fgarci03/logicaljs',
          '@author: - Filipe Garcia (http://github.com/fgarci03)',
          '@copyright:  MIT (http://opensource.org/licenses/MIT)'
        ]
      },
      dist: {
        files: [{
          flatten: true,
          expand: true,
          src: ['<%= yeoman.dist %>/logical.min.js'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/logical.min.js': [
            '<%= yeoman.dist %>/logical.js'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: ['{,*/}*.js']
          }
        ]
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      dist: {
        singleRun: true,
        autoWatch: false
      },
      unit: {}
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'copy:dist',
    'uglify:dist',
    'add_comment:dist',
    'karma:dist'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
