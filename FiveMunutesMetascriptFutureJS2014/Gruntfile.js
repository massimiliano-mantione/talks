/*global module:false, require:false*/
module.exports = function(grunt) {

    "use strict";

    var path = require('path'),
        lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
        folderMount = function folderMount(connect, point) {
            return connect.static(path.resolve(point));
        };

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

        reveal: {

            slideshow: {
                options: {
                    slides: "slides",
                    build: "build",
                    temp: "temp",
                    assets: "assets",
                    cleanBuild: true,
                    title: "Metascript: Going Beyond Javascript Limitations",
                    description: "Metascript: Going Beyond Javascript Limitations",
                    author: "Massimiliano Mantione",
                    theme: "default",
                    syntax: "zenburn",
                    controls: true,
                    progress: true,
                    history: true,
                    center: true,
                    // default/cube/page/concave/zoom/linear/none
                    transition: "default"
                }
            }
        },

        watch: {
            options: {
                // Start a live reload server on the default port: 35729
                livereload: true
            },
            jade: {
                files: ['slides/*.jade'],
                tasks: ["reveal:slideshow"]
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ["reveal:slideshow", "open"]
            }
        },

        connect: {
            livereload : {
                options : {
                    port       : 9001,
                    hostname: 'localhost',
                    base       : './build',
                    middleware : function (connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)]
                    }
                }
            }
        },

        open : {
            reload : {
                path : 'http://localhost:9001/'
            }
        },

        build_gh_pages: {
            ghPages: {
                options: {
                    build_branch: "gh-pages",
                    dist: "build",
                }
            }
        }

    });

    // To start editing your slideshow using livereload, run "grunt server"
    grunt.registerTask("server", "Build and watch task", ["reveal:slideshow", "connect", "open", "watch"]);

    // To create a build without livereload, run "grunt build"
    grunt.registerTask("build", "Build task", ["reveal:slideshow"]);

    // This task is for internal use with watch
    grunt.registerTask("refresh", "Build and watch task", ["reveal:slideshow", "open"]);

    // To deploy your slideshow to gh-pages, run "grunt deploy"
    grunt.registerTask("deploy", "Deploy to gh-pages", ["reveal:slideshow", "build_gh_pages:ghPages"]);
};
