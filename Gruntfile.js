
module.exports = function (grunt) {

	// Load tasks
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-mkdir");
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({

		watch: {

			// Js sources
			jsSources: {
				files: [
					'public/js/**/*.js'
				],
				tasks: ['uglify:sources', 'concat:js'],
				options: {spawn: false}
			},

			less : {
				files: [
					'public/less/**/*.js'
				],
				tasks: ['less'],
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
						"public/js/**/*.js"
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
					"public/dist/app.js": [
						"public/bower_components/angular/angular.min.js",
						"public/bower_components/angular-route/angular-route.min.js",
						"public/bower_components/angular-socket-io/socket.js",
						"grunt/target/sources.js"
					]
				}
			}
		},
		// LESS
		less: {
			app: {
				files: {
					"public/dist/app.css": [
						"public/less/**/*.less"
					]
				}
			}
		},

		// Make Directory
		mkdir: {
			folders: {
				create: [
					"grunt/target",
					"public/dist"
				]
			}
		}
	});

	// Default task
	grunt.registerTask("default", ["style", "js", "watch"]);

	// Custom task for JavaScript files
	grunt.registerTask("js", ["mkdir:folders", "uglify:sources", "concat:js"]);

	// Custom task for CSS files
	grunt.registerTask("style", ["mkdir:folders", "less:app"]);

};
