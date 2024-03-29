module.exports = function(grunt) {

  const autoprefixer = require('autoprefixer')({
    browsers: [
      'Chrome >= 35',
      'Firefox >= 31',
      'Edge >= 12',
      'Explorer >= 10',
      'iOS >= 8',
      'Safari >= 8',
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12'
    ]
  });

  grunt.initConfig({

    sass: {
      options: {
        sourceMap: true,
        outputStyle: 'compressed'
      },
      default: {
        files: {
          'src/assets/css/theDocs.min.css': 'src/assets/css/theDocs.scss'
        }
      }
    },

    uglify: {
      options: {
        mangle: true,
      },
      default: {
        files: {
          'src/assets/js/theDocs.min.js': ['src/assets/js/theDocs.js']
        }
      }
    },

    concat: {
      vendorCss: {
        files: {
          'src/assets/css/vendor.min.css': [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/font-awesome/css/font-awesome.min.css',
            'node_modules/perfect-scrollbar/css/perfect-scrollbar.min.css',
            'node_modules/featherlight/release/featherlight.min.css',
            'node_modules/jquery-fab/jquery-fab.css'
          ]
        }
      },
      vendorJs: {
        files: {
          'src/assets/js/vendor.min.js': [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/lozad/dist/lozad.min.js',
            'node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.min.js',
            'node_modules/jquery-match-height/dist/jquery.matchHeight-min.js',
            'node_modules/jquery-fab/jquery-fab.js',
            'node_modules/mousetrap/mousetrap.min.js',
            'node_modules/featherlight/release/featherlight.min.js',
            'node_modules/typed.js/lib/typed.min.js',
            'src/assets/js/prism.min.js'
          ]
        }
      }
    },

    copy: {
      cssmaps: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap/dist/css',
            src: ['bootstrap.min.css.map'],
            dest: 'src/assets/css/'
          }
        ]
      },

      fonts: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap/dist/fonts',
            src: ['**'],
            dest: 'src/assets/fonts/'
          },
          {
            expand: true,
            cwd: 'node_modules/font-awesome/fonts',
            src: ['**'],
            dest: 'src/assets/fonts/'
          }
        ]
      }
    },

    postcss: {
      options: {
        map: {
          inline: false
        },
        processors: [
          autoprefixer,
        ]
      },
      files: {
        src: [
          'src/assets/css/theDocs.min.css',
          'src/assets/css/vendor.min.css'
        ]
      }
    },

    clean: {
      options: {
        force: true
      },
      css: ['src/assets/css/*.css', 'src/assets/css/*.css.map'],
      js: [
        'src/assets/js/theDocs.min.js',
        'src/assets/js/vendor.min.js'
      ],
      fonts: ['src/assets/fonts'],
      site: ['site']
    },

    watch: {
      scss: {
        files: ['src/assets/css/**/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['src/assets/js/theDocs.js'],
        tasks: ['uglify'],
      },
      cmd_src: {
        files: ['./guild/guild/commands/*.py'],
        tasks: ['exec:site', 'exec:reload_devserver'],
      },
      model_src: {
        files: ['./packages/**/*'],
        tasks: ['exec:site', 'exec:reload_devserver']
      },
      includes: {
        files: ['./include/*'],
        tasks: ['exec:site', 'exec:reload_devserver']
      }
    },

    exec: {
      site: 'PYTHONPATH=.:./guild:./packages mkdocs build',
      serve: 'PYTHONPATH=.:./guild:./packages mkdocs serve',
      reload_devserver: 'touch pages/.reload && sleep 1 && rm pages/.reload'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask(
    'build', [
      'sass',
      'uglify',
      'concat',
      'copy',
      'postcss',
      'exec:site'
    ]
  );

  grunt.registerTask(
    'serve', [
      'build',
      'exec:serve'
    ]
  );
};
