var fs = require('fs');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
            ' * <%= pkg.title || pkg.name %>\n' +
            ' * <%= pkg.description %>\n' +
            ' * \n' +
            ' * @author <%= pkg.author %> \n' +
            ' * @since <%= grunt.template.today(\"yyyy-mm-dd\") %>\n' +
            ' * @version v<%= pkg.version %>\n' +
            ' */\n',
        // Task configuration.
        clean: {
            pre: {
                src: ['build']
            },
            post: {
                src: ['build/main.js']
            }
        },
        copy: {
            build: {
                files: [{
                    src: 'template.html',
                    dest: 'build/index.html'
                }, {
                    expand: true,
                    src: 'css/**',
                    dest: 'build/',
                    flatten: true,
                    filter: 'isFile'
                }, {
                    expand: true,
                    src: 'js/**',
                    dest: 'build/',
                    flatten: true,
                    filter: 'isFile'
                }, {
                    expand: true,
                    src: 'images/**',
                    dest: 'build/',
                    flatten: true,
                    filter: 'isFile'
                }, {
                    expand: true,
                    src: 'media/**',
                    dest: 'build/',
                    flatten: true,
                    filter: 'isFile'
                }]
            }
        },
        uglify: {
            build: {
                src: 'build/main.js',
                dest: 'build/main.min.js'
            }
        },
        browserify: {
            build: {
                files: {
                    'build/main.js': ['lib/**/*.js']
                },
                options: {
                    require: ['ad-utils'],
                }
            }
        },
        watch: {
            files: ['lib/**', 'css/**', 'images/**', 'js/**', 'template.html'],
            tasks: ['clean:pre', 'browserify', 'uglify', 'copy']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Default task.
    grunt.registerTask('default', ['clean:pre', 'browserify', 'uglify', 'copy', 'clean:post']);
};
