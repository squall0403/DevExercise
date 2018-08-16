module.exports = function (grunt) {
    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-connect');
    /*
     grunt.loadNpmTasks('grunt-ng-annotate');
     grunt.loadNpmTasks('grunt-html2js');
     */
  
    /**
     * Load in our build configuration file.
     */
    var userConfig = require('./build.config.js');
  
    var lrSnippet = require('connect-livereload')({
      port: userConfig.LIVERELOAD_PORT
    });
  
    var mountFolder = function (connect, dir) {
      return connect.static(require('path').resolve(dir));
    }
  
    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
      /**
       * We read in our `package.json` file so we can access the package name and
       * version. It's already there, so we don't repeat ourselves here.
       */
      pkg: grunt.file.readJSON("package.json"),
  
      /**
       * The banner is the comment that is placed at the top of our compiled
       * source files. It is first processed as a Grunt template, where the `<%=`
       * pairs are evaluated based on this very configuration object.
       */
      meta: {
        banner: '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
      },
  
      /**
       * Creates a changelog on a new version.
       */
      changelog: {
        options: {
          dest: 'CHANGELOG.md',
          template: 'changelog.tpl'
        }
      },
  
      /**
       * Increments the version number, etc.
       */
      bump: {
        options: {
          files: [
            "package.json",
            "bower.json"
          ],
          commit: false,
          commitMessage: 'chore(release): v%VERSION%',
          commitFiles: [
            "package.json",
            "client/bower.json"
          ],
          createTag: false,
          tagName: 'v%VERSION%',
          tagMessage: 'Version %VERSION%',
          push: false,
          pushTo: 'origin'
        }
      },
  
      /**
       * The directories to delete when `grunt clean` is executed.
       */
      clean: [
        '<%= build_dir %>',
        '<%= compile_dir %>'
      ],
  
      /**
       * The `copy` task just copies files from A to B. We use it here to copy
       * our project assets (images, fonts, etc.) and javascripts into
       * `build_dir`, and then to copy the assets to `compile_dir`.
       */
      copy: {
        build_app_assets: {
          files: [
            {
              src: ['<%= app_files.assets %>'],
              dest: '<%= build_dir %>',
              cwd: '<%=source_dir %>/',
              expand: true
            }
          ]
        },
        build_vendor_assets: {
          files: [
            {
              src: ['<%= vendor_files.assets %>'],
              dest: '<%= build_dir %>/assets/fonts', //review
              cwd: '.',
              flatten: true,
              expand: true
            }
          ]
        },
        build_app_js: {
          files: [
            {
              src: ['<%= app_files.js %>'],
              dest: '<%= build_dir %>',
              cwd: '<%= source_dir %>/',
              expand: true
            }
          ]
        },
        build_app_fonts: {
          files: [
            {
              src: ['<%= app_files.fonts %>'],
              dest: '<%= build_dir %>/assets/fonts',
              cwd: '<%= source_dir %>/',
              expand: true
            }
          ]
        },
        build_vendor_js: {
          files: [
            {
              src: ['<%= vendor_files.js %>'],
              dest: '<%= build_dir %>/',
              cwd: '.',
              expand: true
            }
          ]
        },
        build_vendor_css: {
          files: [
            {
              src: ['<%= vendor_files.css %>'],
              dest: '<%= build_dir %>/',
              cwd: '.',
              expand: true
            }
          ]
        },
        build_vendor_fonts: {
          files: [
            {
              src: ['<%= vendor_files.fonts %>'],
              dest: '<%= build_dir %>',
              cwd: '.',
              expand: true
            }
          ]
        },
        compile_assets: {
          files: [
            {
              src: ['**'],
              dest: '<%= compile_dir %>/assets',
              cwd: '<%= build_dir %>/assets',
              expand: true
            },
            {
              src: ['<%= vendor_files.css %>'],
              dest: '<%= compile_dir %>/',
              cwd: '.',
              expand: true
            }
          ]
        }
      },
  
      /**
       * `grunt concat` concatenates multiple source files into a single file.
       */
      concat: {
        /**
         * The `build_css` target concatenates compiled CSS and vendor CSS
         * together.
         */
        build_css: {
          src: [
            '<%= vendor_files.css %>',
            '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
          ],
          dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        },
        /**
         * The `compile_js` target is the concatenation of our application source
         * code and all specified vendor source code into a single file.
         */
        compile_js: {
          options: {
            banner: '<%= meta.banner %>'
          },
          src: [
            '<%= vendor_files.js %>',
            'module.prefix',
            '<%= build_dir %>/**/*.js',
            '<%= html2js.app.dest %>',
            '<%= html2js.common.dest %>',
            'module.suffix'
          ],
          dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
        }
      },
  
      /**
       * `grunt coffee` compiles the CoffeeScript sources. To work well with the
       * rest of the build, we have a separate compilation task for sources and
       * specs so they can go to different places. For example, we need the
       * sources to live with the rest of the copied JavaScript so we can include
       * it in the final build, but we don't want to include our specs there.
       */
      coffee: {
        source: {
          options: {
            bare: true
          },
          expand: true,
          cwd: '.',
          src: ['<%= app_files.coffee %>'],
          dest: '<%= build_dir %>',
          ext: '.js'
        }
      },
  
      /**
       * `ngAnnotate` annotates the sources before minifying. That is, it allows us
       * to code without the array syntax.
       */
      ngAnnotate: {
        compile: {
          files: [
            {
              src: ['<%= app_files.js %>'],
              cwd: '<%= build_dir %>',
              dest: '<%= build_dir %>',
              expand: true
            }
          ]
        }
      },
  
      /**
       * Minify the sources!
       */
      uglify: {
        compile: {
          options: {
            banner: '<%= meta.banner %>'
          },
          files: {
            '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
          }
        }
      },
  
      /**
       * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
       * Only our `main.less` file is included in compilation; all other files
       * must be imported from this file.
       */
      less: {
        build: {
          files: {
            '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
          }
        },
        compile: {
          files: {
            '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
          },
          options: {
            cleancss: true,
            compress: true
          }
        }
      },
  
      /**
       * `grunt-contrib-sass` handles our LESS compilation and uglification automatically.
       */
      sass: {
        build: {
          files: {
            '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.scss %>'
          }
        },
        compile: {
          files: {
            '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.scss %>'
          },
          options: {
            style: 'expanded'
          }
        }
      },
  
      autoprefixer: {
        dist: {
          src: '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
        }
      },
  
      /**
       * `jshint` defines the rules of our linter as well as which files we
       * should check. This file, all javascript sources, and all our unit tests
       * are linted based on the policies listed in `options`. But we can also
       * specify exclusionary patterns by prefixing them with an exclamation
       * point (!); this is useful when code comes from a third party but is
       * nonetheless inside `src/`.
       */
      jshint: {
        src: [
          '<%= app_files.js %>'
        ],
        test: [
          '<%= app_files.jsunit %>'
        ],
        gruntfile: [
          'Gruntfile.js'
        ],
        options: {
          curly: true,
          immed: true,
          newcap: true,
          noarg: true,
          sub: true,
          boss: true,
          eqnull: true
        },
        globals: {}
      },
  
      /**
       * `coffeelint` does the same as `jshint`, but for CoffeeScript.
       * CoffeeScript is not the default in ngBoilerplate, so we're just using
       * the defaults here.
       */
      coffeelint: {
        src: {
          files: {
            src: ['<%= app_files.coffee %>']
          }
        },
        test: {
          files: {
            src: ['<%= app_files.coffeeunit %>']
          }
        }
      },
  
      /**
       * HTML2JS is a Grunt plugin that takes all of your template files and
       * places them into JavaScript files as strings that are added to
       * AngularJS's template cache. This means that the templates too become
       * part of the initial payload as one JavaScript file. Neat!
       */
      html2js: {
        /**
         * These are the templates from `src/app`.
         */
        app: {
          options: {
            base: 'src/app'
          },
          src: ['<%= app_files.atpl %>'],
          dest: '<%= build_dir %>/templates-app.js'
        },
  
        /**
         * These are the templates from `src/common`.
         */
        common: {
          options: {
            base: 'src/common'
          },
          src: ['<%= app_files.ctpl %>'],
          dest: '<%= build_dir %>/templates-common.js'
        }
      },
  
      /**
       * The Karma configurations.
       */
      karma: {
        options: {
          configFile: '<%= build_dir %>/karma-unit.js'
        },
        unit: {
          port: userConfig.LIVERELOAD_PORT,
          background: true
        },
        continuous: {
          singleRun: true
        }
      },
  
      watch: {
        bower: {
          files: ['bower.json'],
          tasks: ['bowerInstall']
        },
        js: {
          files: ['<%= source_dir %>/**/*.js'],
          tasks: ['copy:build_app_js'],
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
        },
        styles: {
          files: ['<%= source_dir %>/assets/**/*.css'],
          tasks: ['copy:build_app_assets'],
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
        },
        less: {
          files: ['src/assets/**/*.less'],
          tasks: ['less'],
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
        },
        gruntfile: {
          files: [
            'Gruntfile.js',
            'build.config.js'
          ]
        },
        html: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          tasks: ['index:build'],
          files: [
            'src/**/*.html'
          ]
        }
      },
  
      connect: {
        options: {
          port: userConfig.PORT,
          hostname: userConfig.HOSTNAME,
          livereload: userConfig.LIVERELOAD_PORT, base: '<%= build_dir %>'
        },
        livereload: {
          options: {
            open: true,
          }
        }
      },
  
      // grunt-open will open your browser at the project's URL
      open: {
        all: {
          // Gets the port from the connect configuration
          //path: userConfig.LIVERELOAD_PORT + ':<%= connect.all.options.port%>'
          path: 'http://localhost:<%= connect.all.options.port%>'
        }
      },
  
      /**
       * The `index` task compiles the `index.html` file as a Grunt template. CSS
       * and JS files co-exist here but they get split apart later.
       */
      index: {
  
        /**
         * During development, we don't want to have wait for compilation,
         * concatenation, minification, etc. So to avoid these steps, we simply
         * add all script files directly to the `<head>` of `index.html`. The
         * `src` property contains the list of included files.
         */
        build: {
          dir: '<%= build_dir %>',
          src: [
            '<%= vendor_files.js %>',
            '<%= build_dir %>/assets/**/*.js',
  
            '<%= vendor_files.css %>',
  
            '<%= html2js.common.dest %>',
            '<%= html2js.app.dest %>',
  
            '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
            '<%= build_dir %>/assets/**/*.css', // app css
          ]
        },
  
        /**
         * When it is time to have a completely compiled application, we can
         * alter the above to include only a single JavaScript and a single CSS
         * file. Now we're back!
         */
        compile: {
          dir: '<%= compile_dir %>',
          src: [
            '<%= concat.compile_js.dest %>',
            '<%= vendor_files.css %>',
            '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
          ]
        }
      },
  
      /**
       * This task compiles the karma template so that changes to its file array
       * don't have to be managed manually.
       */
      karmaconfig: {
        unit: {
          dir: '<%= build_dir %>',
          src: [
            '<%= vendor_files.js %>',
            '<%= html2js.app.dest %>',
            '<%= html2js.common.dest %>',
            '<%= test_files.js %>'
          ]
        }
      }
    }
  
    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));
  
    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
      var jsFiles = filterForJS(this.filesSrc);
  
      grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
        process: function (contents, path) {
          return grunt.template.process(contents, {
            data: {
              scripts: jsFiles
            }
          });
        }
      });
    });
  
    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
      return files.filter(function (file) {
        return file.match(/\.js$/);
      });
    }
  
    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
      return files.filter(function (file) {
        return file.match(/\.css$/);
      });
    }
  
    /**
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
  
    grunt.registerMultiTask('index', 'Process html template', function () {
      var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');
      var jsFiles = filterForJS(this.filesSrc).map(function (file) {
        return file.replace(dirRE, '');
      });
      var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
        return file.replace(dirRE, '');
      });
      var data = this.data;
  
  
      //var templates = grunt.file.expand({filter: "isFile", cwd: "<%= source_dir >"},  userConfig.app_files.html);
      var htmlFiles = grunt.file.expand({filter: "isFile", cwd: userConfig.source_dir},  ["*.html"]);
  
      htmlFiles.forEach(function (file) {
        grunt.file.copy('src/' + file, data.dir + '/' + file, {
          process: function (contents, path) {
            return grunt.template.process(contents, {
              data: {
                scripts: jsFiles,
                styles: cssFiles,
                version: grunt.config('pkg.version')
              }
            });
          }
        });
      })
    });
  
    /**
     * The default task is to build and compile.
     */
    grunt.registerTask('default', ['build', 'compile']);
  
    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */
    grunt.registerTask('compile', [
      'clean',
      'sass:compile',
      'copy:compile_assets',
  
      'concat:compile_js',
  
      'uglify',
      'index:compile'
    ]);
  
    // The 'server' task
    grunt.registerTask('serve', [
      'build',
      'connect:livereload',
      'watch'
    ]);
  
    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask('build', [
      'clean',
      'less:build',
      'autoprefixer',
      'copy:build_app_assets',
      'copy:build_vendor_assets',
      'copy:build_app_js',
      'copy:build_app_fonts',
      'copy:build_vendor_js',
      'copy:build_vendor_css',
      'copy:build_vendor_fonts',
  
      'index:build',
    ]);
  };