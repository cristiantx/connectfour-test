var SERVER_PORT = 3000;
var LIVERELOAD_PORT = 3100;
var DEV_HOST = 'localhost';

module.exports = function (grunt) {

	var target = grunt.option('target') || 'staging';
	var path = require('path');

	var config = {
		app: 'src',
		public: '../public',
		build: 'dist',
		root: process.cwd().replace('c:', 'c').replace(/\\/g, '/')
	};

	// Project configuration
	grunt.initConfig({
		config: config,
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					port: SERVER_PORT,
					base: '<%= config.public %>'
				}
			}
		},
		open: {
			dev: {
				path: 'http://'+DEV_HOST+':' + SERVER_PORT
			}
		},
		browserify: {
			dev: {
				files: {
					'<%= config.public %>/scripts/app.js': ["<%= config.app %>/scripts/libs/index.js", "<%= config.app %>/scripts/main.js"]
				},
				options: {
					browserifyOptions: {
         				debug: true
      				},
					watch: true
				}
			},
			dist: {
				files: {
					"<%= config.build %>/scripts/app.js": ["<%= config.app %>/scripts/libs/index.js", "<%= config.app %>/scripts/main.js"]
				},
				options: {
					debug: false
				}
			}
		},
		filerev: {
    		styles: { src: '<%= config.build %>/styles/*.css' },
    		scripts: { src: '<%= config.build %>/scripts/*.js' }
  		},
  		filerev_apply: {
  			options: {
  				prefix: 'dist/'
  			},
			files: {
				expand: true,
				cwd: '<%= config.build %>',
      			src: ['index.html'],
      			dest: '<%= config.build %>'
    		}
		},
		exorcise: {
			dev: {
				options: {},
				files: {
					'<%= config.public %>/scripts/app.js.map': ['<%= config.public %>/scripts/app.js'],
				}
			}
		},
		sass: {
			dev: {
				options: {
					includePaths: ['node_modules/bootstrap-sass/assets/stylesheets'],
					sourceMap: true
				},
				files: {
					'<%= config.public %>/styles/app.css': '<%= config.app %>/styles/app.scss'
				}
			},
			dist: {
				options: {
					includePaths: ['node_modules/bootstrap-sass/assets/stylesheets'],
					sourceMap: false
				},
				files: {
					'<%= config.build %>/styles/app.css': '<%= config.app %>/styles/app.scss'
				}
			}
		},
		uglify: {
			options: {
				mangle: false,
				sourceMap: false,
				compress: {
        			drop_console: false
      			}
			},
			dist: {
				files: {
					'<%= config.build %>/scripts/app.js': ['<%= config.build %>/scripts/app.js']
				}
			}
		},
		processhtml: {
			dev: {
				files: {
        			'public/index.html': ['<%= config.app %>/index.html']
      			}
			},
			dist: {
				process: true,
				files: {
        			'<%= config.build %>/index.html': ['<%= config.build %>/index.html']
      			}
			}
		},
		watch: {
			options: {
				livereload: {
					port: LIVERELOAD_PORT,
					spawn: false,
					interrupt: true
				}
			},
			livereload: {
				files: ['<%= config.public %>/scripts/**/*.js'],
				//tasks: ['exorcise:dev']
			},
			sass: {
				files: ['<%= config.app %>/styles/**/*.scss'],
				tasks: ['sass:dev']
			}
		},
		clean: {
			options: { force: true },
			dist: ['<%= config.build %>/**/*']
		},
		autoprefixer: {
			options: {
				browsers: [
					'Android 2.3',
					'Android >= 4',
					'Chrome >= 20',
					'Firefox >= 24', // Firefox 24 is the latest ESR
					'Explorer >= 8',
					'iOS >= 6',
					'Opera >= 12',
					'Safari >= 6'
				]
			},
			dist: {
				options: {
					map: false
				},
				src: '<%= config.build %>/styles/*.css'
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'public/',
					dest: '<%= config.build %>/',
					src: [
						'images/**',
						'scripts/modules/**',
						'styles/fonts/{,*/}*.{eot,svg,ttf,woff,woff2}',
						'index.html'
					]
				}]
			}
		},
		'gh-pages': {
			options: {
				base: './<%= config.build %>/'
			},
			src: ['**']
		}
	});

	grunt.registerTask('dist', [
			'clean',
			'browserify:dist',
			'uglify:dist',
			'sass:dist',
			//'autoprefixer:dist',
			//'replace:dist',
			'copy:dist',
			'processhtml:dist',
			'filerev',
			'filerev_apply'
		]);

	grunt.registerTask('build', function ( target ) {

		grunt.task.run([
			'browserify:dev',
			//'exorcise:dev',
			'sass:dev'
			//'processhtml:dev'
		]);

	});

	grunt.registerTask('deploy', function ( target ) {

		grunt.task.run([
			'dist',
			'gh-pages'
		]);

	});


	// Default task
	grunt.registerTask('dev', [
		'build',
		'watch'
	]);


	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
	require('time-grunt')(grunt);

};
