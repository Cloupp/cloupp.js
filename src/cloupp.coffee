URL = "https://warm-garden-2837.herokuapp.com:443/v1/socket"

class File
	constructor: (@socket, @name, content) ->
		@update content

	update: (content) ->
		@socket.send 'update',
			path: @name
			data: content

class Session
	constructor: (@socket) ->

	createFile: (name, content) ->
		new File @socket, name, content

	compile: (name, description) ->
		@socket.send 'compile',
			name:        name
			description: description

		promise = new $.Deferred

		handler = (data) ->
			promise.notify data.progress

		@socket.send 'compiled', (data) ->
			@socket.removeListener 'progress', handler
			
			if data.id
				promise.resolve data
			else
				promise.reject data

		@socket.on 'progress', handler
		promise.promise()

class Cloupp
	@createSession: (token) ->
		promise = new $.Deferred
		socket  = Primus.connect URL

		disconnectHandler = () ->
			promise.reject()

		socket.once 'open', () ->
			socket.removeListener 'disconnection', disconnectHandler

			socket.send 'initialize', { token: token }
			socket.once 'initialized', () ->
				promise.resolve new Session socket

		socket.once 'disconnection', disconnectHandler
		promise.promise()

module.exports = Cloupp
