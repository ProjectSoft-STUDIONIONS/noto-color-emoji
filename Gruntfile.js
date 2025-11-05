module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	const fs = require('fs'),
		SHA1 = require("crypto-js/sha1"),
		SHA = function(file) {
			let txt = fs.readFileSync(file, 'utf-8');
			let sh = SHA1(`${txt}`).toString();
			return sh;
		};
	grunt.initConfig({
		globalConfig : {},
		pkg : {},
		less: {
			main: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						fontpath: "../fonts"
					},
				},
				files : {
					'docs/css/main.css' : [
						'src/less/main.less'
					],
				}
			}
		},
		autoprefixer:{
			options: {
				browsers: [
					"last 4 version"
				],
				cascade: true
			},
			main: {
				files: {
					'docs/css/main.css' : [
						'docs/css/main.css'
					],
				}
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			main: {
				files: {
					'docs/css/main.min.css' : [
						'docs/css/main.css'
					],
				}
			}
		},
		uglify: {
			main: {
				options: {
					sourceMap: false,
					compress: {
						drop_console: false
					},
					output: {
						ascii_only: true
					}
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/js/main.js'
						],
						dest: 'docs/js',
						filter: 'isFile',
						rename: function (dst, src) {
							return dst + '/' + src.replace('.js', '.min.js');
						}
					}
				]
			},
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'src/fonts',
						src: ['*.*'],
						dest: 'docs/fonts/',
					},
					{
						expand: true,
						cwd: 'src/js',
						src: ['*.*'],
						dest: 'docs/js/',
					},
				]
			}
		},
		pug: {
			main: {
				options: {
					doctype: 'html',
					client: false,
					pretty: '\t',
					separator:  '\n',
					data: function(dest, src) {
						return {
							data: require(__dirname + '/src/pug/emoji.json'),
							hashcss: SHA(__dirname + '/docs/css/main.min.css'),
							hashjs: SHA(__dirname + '/docs/js/main.min.js'),
						}
					}
				},
				files: [
					{
						expand: true,
						cwd: __dirname + '/src/pug/',
						src: [ 'index.pug' ],
						dest: __dirname + '/docs',
						ext: '.html'
					},
				]
			},
		},
		watch: {
			main: {
				files: 'src/**/*.*',
				tasks: ["less",
					"autoprefixer",
					"cssmin",
					"uglify",
					"copy",
					"pug"
				],
				options: {
					livereload: true,
				},
			},
		},
		connect: {
			main: {
				options: {
					hostname: "localhost",
					port: 9001,
					base: 'docs'
				}
			}
		}
	});
	grunt.registerTask('default',	[
		"less",
		"autoprefixer",
		"cssmin",
		"uglify",
		"copy",
		"pug",
		"connect",
		"watch",
	]);
};
