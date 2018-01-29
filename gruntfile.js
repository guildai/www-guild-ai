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

  const algoliasearch = require('algoliasearch');

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
          ]
        }
      },
      vendorJs: {
        files: {
          'src/assets/js/vendor.min.js': [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.min.js',
            'node_modules/clipboard/dist/clipboard.min.js',
            'node_modules/jquery-match-height/dist/jquery.matchHeight-min.js',
            'node_modules/algoliasearch/dist/algoliasearchLite.min.js',
            'node_modules/algoliasearch-helper/dist/algoliasearch.helper.min.js'
          ]
        }
      }
    },

    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap/dist/fonts',
            src: ['**'],
            dest: 'src/assets/fonts/'},
          {
            expand: true,
            cwd: 'node_modules/font-awesome/fonts',
            src: ['**'],
            dest: 'src/assets/fonts/'}
        ]
      }
    },

    clean: {
      options: {
        force: true
      },
      css: ['src/assets/css/*.css', 'src/assets/css/*.css.map'],
      js: ['src/assets/js/*.min.js'],
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
      }
    },

    postcss: {
      options: {
        processors: [
          autoprefixer
        ]
      },
      files: {
        src: ['src/assets/css/theDocs.min.css']
      }
    },

    exec: {
      site: 'PYTHONPATH=. mkdocs build',
      serve: 'PYTHONPATH=. mkdocs serve'
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

  grunt.registerTask('dist',
    [
      'dev',
      'sass:dist',
      'clean:before_copy',
      'copy:dist',
      'concat:dist',
      'replace:dist',
      'uglify:dist',
      'postcss:dist',
      'clean:after_copy',
      'file-creator'
    ]
  );

  grunt.registerTask('dev',
    [
      'sass',
      'concat:dev',
      'uglify:dev',
      'postcss:dev',
      'copy:dev',
      'index'
    ]
  );

  grunt.registerTask(
    'build', [
      'sass',
      'postcss',
      'uglify',
      'concat',
      'copy',
      'exec:site'
    ]
  );

  grunt.registerTask(
    'serve', [
      'build',
      'exec:serve'
    ]
  );

  var index = function() {
    const done = this.async();

    const client = algoliasearch(
      'I1IYALZNSK',
      'c80940c47c99d45b08a80a592345c43c');
    const index = client.initIndex('guild.ai');

    const initIndex = function() {
      const settings = {
        searchableAttributes: ['title', 'text'],
        attributesToRetrieve: ['location']
      };
      return index.setSettings(settings);
    };

    const clearIndex = function() {
      return index.clearIndex();
    };

    const addObjects = function() {
      const data = grunt.file.readJSON('./site/search/search_index.json');
      return index.addObjects(data.docs);
    };

    initIndex()
      .then(clearIndex)
      .then(addObjects)
      .then(done);
  };

  grunt.registerTask('index', index);

  grunt.registerTask('build-and-index', ['build', 'index']);
};
