io             = require 'socket.io-client'

HOST           = "http://api.cloupp.com:80"
VERSION        = "v1"
ENDPOINT       = "#{HOST}"

SOCKET_IO_RES  = "#{VERSION}/socket.io"
SOCKET_IO_EP   = "#{HOST}/api"

class File
	constructor: (@socket, @name, content) ->
		@update content

	update: (content) ->
		@socket.emit 'update',
			path: @name
			data: content

class Session
	constructor: (@socket) ->

	createFile: (name, content) ->
		new File @socket, name, content

	compile: () ->
		@socket.emit 'compile'
		promise = new $.Deferred

		@socket.once 'compiled', (data) ->
			if data.id
				promise.resolve data
			else
				promise.reject data

		promise.promise()

class Cloupp
	@createSession: (token) ->
		promise = new $.Deferred

		socket = io.connect SOCKET_IO_EP,
			resource: SOCKET_IO_RES

		disconnectHandler = () ->
			promise.reject()

		socket.once 'connect', () ->
			socket.removeListener 'disconnect', disconnectHandler

			socket.emit 'initialize', { token: token }
			socket.once 'initialized', () ->
				promise.resolve new Session socket

		socket.once 'disconnect', disconnectHandler

		promise.promise()

module.exports = Cloupp