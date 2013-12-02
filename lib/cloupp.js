(function(e){if("function"==typeof bootstrap)bootstrap("cloupp",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeCloupp=e}else"undefined"!=typeof window?window.Cloupp=e():global.Cloupp=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var Cloupp, File, Session, URL;

  URL = "https://warm-garden-2837.herokuapp.com:443/v1/socket";

  File = (function() {
    function File(socket, name, content) {
      this.socket = socket;
      this.name = name;
      this.update(content);
    }

    File.prototype.update = function(content) {
      return this.socket.send('update', {
        path: this.name,
        data: content
      });
    };

    return File;

  })();

  Session = (function() {
    function Session(socket) {
      this.socket = socket;
    }

    Session.prototype.createFile = function(name, content) {
      return new File(this.socket, name, content);
    };

    Session.prototype.compile = function(name, description) {
      var handler, promise;
      this.socket.send('compile', {
        name: name,
        description: description
      });
      promise = new $.Deferred;
      handler = function(data) {
        return promise.notify(data.progress);
      };
      this.socket.send('compiled', function(data) {
        this.socket.removeListener('progress', handler);
        if (data.id) {
          return promise.resolve(data);
        } else {
          return promise.reject(data);
        }
      });
      this.socket.on('progress', handler);
      return promise.promise();
    };

    return Session;

  })();

  Cloupp = (function() {
    function Cloupp() {}

    Cloupp.createSession = function(token) {
      var disconnectHandler, promise, socket;
      promise = new $.Deferred;
      socket = Primus.connect(URL);
      disconnectHandler = function() {
        return promise.reject();
      };
      socket.once('connect', function() {
        socket.removeListener('disconnect', disconnectHandler);
        socket.send('initialize', {
          token: token
        });
        return socket.once('initialized', function() {
          return promise.resolve(new Session(socket));
        });
      });
      socket.once('disconnect', disconnectHandler);
      return promise.promise();
    };

    return Cloupp;

  })();

  module.exports = Cloupp;

}).call(this);


},{}]},{},[1])(1)
});
;