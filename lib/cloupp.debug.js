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


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZ2VyYWxkL21ha2VnYW1lc3dpdGh1cy9jbG91cHAuanMvc3JjL2Nsb3VwcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0NBQUEsS0FBQSxvQkFBQTs7Q0FBQSxDQUFBLENBQUEsbURBQUE7O0NBQUEsQ0FFTTtDQUNRLENBQVcsQ0FBWCxDQUFBLEVBQUEsQ0FBQSxPQUFFO0NBQ2QsRUFEYyxDQUFBLEVBQUQ7Q0FDYixFQUR1QixDQUFBLEVBQUQ7Q0FDdEIsR0FBQyxFQUFELENBQUE7Q0FERCxJQUFhOztDQUFiLEVBR1EsR0FBUixDQUFRLEVBQUM7Q0FDUCxDQUNBLEVBREEsRUFBTSxFQUFQLEtBQUE7Q0FDQyxDQUFNLEVBQU4sSUFBQTtDQUFBLENBQ00sRUFBTixHQURBLENBQ0E7Q0FITSxPQUNQO0NBSkQsSUFHUTs7Q0FIUjs7Q0FIRDs7Q0FBQSxDQVdNO0NBQ1EsRUFBQSxDQUFBLEVBQUEsV0FBRTtDQUFTLEVBQVQsQ0FBQSxFQUFEO0NBQWQsSUFBYTs7Q0FBYixDQUVtQixDQUFQLENBQUEsR0FBQSxFQUFDLENBQWI7Q0FDVSxDQUFTLEVBQWQsRUFBQSxDQUFBLE1BQUE7Q0FITCxJQUVZOztDQUZaLENBS2dCLENBQVAsQ0FBQSxHQUFULEVBQVUsRUFBRDtDQUNSLFNBQUEsTUFBQTtDQUFBLENBQ0MsRUFEQSxFQUFELEdBQUE7Q0FDQyxDQUFhLEVBQWIsSUFBQTtDQUFBLENBQ2EsTUFBYixHQUFBO0NBRkQsT0FBQTtBQUlVLENBSlYsRUFJVSxHQUFWLENBQUEsQ0FKQTtDQUFBLEVBTVUsQ0FBQSxFQUFWLENBQUEsRUFBVztDQUNGLEdBQVcsRUFBbkIsQ0FBTyxDQUFQLE9BQUE7Q0FQRCxNQU1VO0NBTlYsQ0FTeUIsQ0FBQSxDQUF4QixFQUFELEdBQTBCLENBQTFCO0NBQ0MsQ0FBbUMsRUFBbEMsRUFBTSxDQUFQLENBQUEsRUFBQSxJQUFBO0NBRUEsQ0FBQSxFQUFHLElBQUg7Q0FDUyxHQUFSLEdBQU8sVUFBUDtNQURELElBQUE7Q0FHUyxHQUFSLEVBQUEsQ0FBTyxVQUFQO1VBTnVCO0NBQXpCLE1BQXlCO0NBVHpCLENBaUJBLEVBQUMsRUFBRCxDQUFBLEdBQUE7Q0FDUSxNQUFELE1BQVA7Q0F4QkQsSUFLUzs7Q0FMVDs7Q0FaRDs7Q0FBQSxDQXNDTTtDQUNMOztDQUFBLEVBQWdCLENBQWhCLENBQWdCLENBQWYsR0FBZ0IsSUFBakI7Q0FDQyxTQUFBLHdCQUFBO0FBQVUsQ0FBVixFQUFVLEdBQVYsQ0FBQSxDQUFBO0NBQUEsRUFDVSxHQUFWLENBQVU7Q0FEVixFQUdvQixHQUFwQixHQUFvQixRQUFwQjtDQUNTLEtBQVIsQ0FBTyxRQUFQO0NBSkQsTUFHb0I7Q0FIcEIsQ0FNdUIsQ0FBQSxDQUF2QixFQUFBLEdBQUE7Q0FDQyxDQUFvQyxJQUE5QixFQUFOLElBQUEsRUFBQSxHQUFBO0NBQUEsQ0FFMEIsRUFBMUIsRUFBTSxFQUFOLElBQUE7Q0FBMEIsQ0FBUyxHQUFQLEtBQUE7Q0FGNUIsU0FFQTtDQUNPLENBQW9CLENBQUEsQ0FBM0IsRUFBTSxHQUFxQixJQUEzQixFQUFBO0NBQ1MsR0FBWSxFQUFBLENBQWIsVUFBUDtDQURELFFBQTJCO0NBSjVCLE1BQXVCO0NBTnZCLENBYTBCLEVBQTFCLEVBQUEsTUFBQSxLQUFBO0NBQ1EsTUFBRCxNQUFQO0NBZkQsSUFBZ0I7O0NBQWhCOztDQXZDRDs7Q0FBQSxDQXdEQSxDQUFpQixHQUFYLENBQU47Q0F4REEiLCJzb3VyY2VzQ29udGVudCI6WyJVUkwgPSBcImh0dHBzOi8vd2FybS1nYXJkZW4tMjgzNy5oZXJva3VhcHAuY29tOjQ0My92MS9zb2NrZXRcIlxuXG5jbGFzcyBGaWxlXG5cdGNvbnN0cnVjdG9yOiAoQHNvY2tldCwgQG5hbWUsIGNvbnRlbnQpIC0+XG5cdFx0QHVwZGF0ZSBjb250ZW50XG5cblx0dXBkYXRlOiAoY29udGVudCkgLT5cblx0XHRAc29ja2V0LnNlbmQgJ3VwZGF0ZScsXG5cdFx0XHRwYXRoOiBAbmFtZVxuXHRcdFx0ZGF0YTogY29udGVudFxuXG5jbGFzcyBTZXNzaW9uXG5cdGNvbnN0cnVjdG9yOiAoQHNvY2tldCkgLT5cblxuXHRjcmVhdGVGaWxlOiAobmFtZSwgY29udGVudCkgLT5cblx0XHRuZXcgRmlsZSBAc29ja2V0LCBuYW1lLCBjb250ZW50XG5cblx0Y29tcGlsZTogKG5hbWUsIGRlc2NyaXB0aW9uKSAtPlxuXHRcdEBzb2NrZXQuc2VuZCAnY29tcGlsZScsXG5cdFx0XHRuYW1lOiAgICAgICAgbmFtZVxuXHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG5cblx0XHRwcm9taXNlID0gbmV3ICQuRGVmZXJyZWRcblxuXHRcdGhhbmRsZXIgPSAoZGF0YSkgLT5cblx0XHRcdHByb21pc2Uubm90aWZ5IGRhdGEucHJvZ3Jlc3NcblxuXHRcdEBzb2NrZXQuc2VuZCAnY29tcGlsZWQnLCAoZGF0YSkgLT5cblx0XHRcdEBzb2NrZXQucmVtb3ZlTGlzdGVuZXIgJ3Byb2dyZXNzJywgaGFuZGxlclxuXHRcdFx0XG5cdFx0XHRpZiBkYXRhLmlkXG5cdFx0XHRcdHByb21pc2UucmVzb2x2ZSBkYXRhXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHByb21pc2UucmVqZWN0IGRhdGFcblxuXHRcdEBzb2NrZXQub24gJ3Byb2dyZXNzJywgaGFuZGxlclxuXHRcdHByb21pc2UucHJvbWlzZSgpXG5cbmNsYXNzIENsb3VwcFxuXHRAY3JlYXRlU2Vzc2lvbjogKHRva2VuKSAtPlxuXHRcdHByb21pc2UgPSBuZXcgJC5EZWZlcnJlZFxuXHRcdHNvY2tldCAgPSBQcmltdXMuY29ubmVjdCBVUkxcblxuXHRcdGRpc2Nvbm5lY3RIYW5kbGVyID0gKCkgLT5cblx0XHRcdHByb21pc2UucmVqZWN0KClcblxuXHRcdHNvY2tldC5vbmNlICdjb25uZWN0JywgKCkgLT5cblx0XHRcdHNvY2tldC5yZW1vdmVMaXN0ZW5lciAnZGlzY29ubmVjdCcsIGRpc2Nvbm5lY3RIYW5kbGVyXG5cblx0XHRcdHNvY2tldC5zZW5kICdpbml0aWFsaXplJywgeyB0b2tlbjogdG9rZW4gfVxuXHRcdFx0c29ja2V0Lm9uY2UgJ2luaXRpYWxpemVkJywgKCkgLT5cblx0XHRcdFx0cHJvbWlzZS5yZXNvbHZlIG5ldyBTZXNzaW9uIHNvY2tldFxuXG5cdFx0c29ja2V0Lm9uY2UgJ2Rpc2Nvbm5lY3QnLCBkaXNjb25uZWN0SGFuZGxlclxuXHRcdHByb21pc2UucHJvbWlzZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvdXBwXG4iXX0=(1)
});
;