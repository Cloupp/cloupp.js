browserify = require 'browserify'
coffeeify  = require 'coffeeify'
uglify     = require 'uglify-js'
fs         = require 'fs'

bundle = browserify './src/cloupp.coffee'
bundle.transform coffeeify

task 'build:debug', 'Compile cloupp.js for debug', ->
	bundle.bundle
		standalone: 'Cloupp'
		debug:       true
	.pipe fs.createWriteStream './lib/cloupp.debug.js'

task 'build:main', 'Compile cloupp.js for general use', ->
	bundle.bundle
		standalone: 'Cloupp'
	, (err, src) ->
		fs.writeFileSync './lib/cloupp.js', src

task 'build:min', 'Compile cloupp.js for production', ->
	invoke 'build:main'
	fs.writeFileSync './lib/cloupp.min.js', uglify.minify('./lib/cloupp.js').code

task 'build', 'Compile cloupp.js', ->
	invoke 'build:min'
	invoke 'build:debug'