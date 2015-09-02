
module.exports = function (grunt) {

    // Load tasks
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-mkdir");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.initConfig({

        watch: {

            // Js sources
            jsSources: {
                files: [
                    'client/js/**/*.js'
                ],
                tasks: ['uglify:sources', 'concat:js'],
                options: {spawn: false}
            },

            less : {
                files: [
                    'client/less/**/*.less'
                ],
                tasks: ['style'],
                options: {spawn: false}
            }
        },

        uglify: {

            /*
             options: {
             mangle : false
             },
             */
            options : {
                mangle : false,
                compress : {
                    global_defs : {
                        debug   : true
                    },
                    sequences       : false,
                    booleans        : false,
                    conditionals    : false,
                    loops           : false
                },
                beautify            : true,
                preserveComments    : "all"
            },

            sources : {
                files: {
                    "grunt/target/sources.js": [
                        "client/libs/**/*.js",
                        "client/js/**/*.js"
                    ]
                }
            }
        },

        // Concat
        concat: {
            // Global Options
            options: {
                separator: "\n"
            },

            js: {
                files: {
                    "client/dist/app.js": [
                        //"client/bower_components/angular/angular.min.js", TODO
                        "client/bower_components/angular/angular.js",
                        "client/bower_components/angular-route/angular-route.min.js",
                        "client/bower_components/angular-touch/angular-touch.min.js",
                        "client/bower_components/angular-animate/angular-animate.min.js",
                        "client/bower_components/angular-socket-io/socket.js",
                        "client/bower_components/jquery/dist/jquery.min.js",
                        "client/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js",
                        "grunt/target/sources.js"
                    ]
                }
            }
        },
        // LESS
        less: {
            app: {
                files: {
                    "client/dist/app.css": [
                        "client/less/**/*.less"
                    ]
                }
            }
        },

        // Make Directory
        mkdir: {
            folders: {
                create: [
                    "grunt/target",
                    "client/dist"
                ]
            }
        },

        // Autoprefixer
        autoprefixer: {
            options: {
                browsers: 'last 2 versions, > 5%'
            },
            no_dest_single: {
                src: 'client/dist/app.css'
            }
        }
    });

    // Default task
    grunt.registerTask("default", ["style", "js", "watch"]);

    // Custom task for JavaScript files
    grunt.registerTask("js", ["mkdir:folders", "uglify:sources", "concat:js"]);

    // Custom task for CSS files
    grunt.registerTask("style", ["mkdir:folders", "less:app", "autoprefixer"]);

};
