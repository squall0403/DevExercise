/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    LIVERELOAD_PORT: 35729,
    PORT: process.env.PORT || 5499,
    HOSTNAME: process.env.IP || 'localhost', // use 0.0.0.0 to publish over network(without live load)
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    source_dir: 'src',
    build_dir: 'build',
    compile_dir: 'bin',
  
    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
      js: [
        '**/*.js'
      ],
  
      jsunit: ['<%= source_dir %>/**/*.spec.js'],
      coffee: ['<%= source_dir %>/**/*.coffee', '!src/**/*.spec.coffee'],
      coffeeunit: ['<%= source_dir %>/**/*.spec.coffee'],
  
      html: [
        '*.html',
      ],
  
      less: '<%= source_dir %>/assets/less/styles.less',
  
      fonts: [],
  
      assets: [
        'assets/fonts/**',
        'assets/images/**',
        'assets/files/**'
      ]
    },
  
    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
      js: [
        'vendor/angular-mocks/angular-mocks.js'
      ]
    },
  
    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
      js: [
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
      ],
      css: [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/simple-line-icons/css/simple-line-icons.css'
      ],
      fonts: [
        'bower_components/bootstrap/dist/fonts/**',
        'node_modules/simple-line-icons/fonts/**'
      ],
      assets: []
    }
  };
  