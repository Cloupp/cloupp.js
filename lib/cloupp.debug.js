(function(e){if("function"==typeof bootstrap)bootstrap("cloupp",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeCloupp=e}else"undefined"!=typeof window?window.Cloupp=e():global.Cloupp=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var Cloupp, File, Session, URL;

  URL = "https://warm-garden-2837.herokuapp.com";

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
      socket = Primus.connect(URL, {
        pathname: 'v1/socket'
      });
      disconnectHandler = function() {
        return promise.reject();
      };
      socket.once('open', function() {
        var channel;
        socket.removeListener('disconnection', disconnectHandler);
        channel = socket.channel('api');
        channel.send('initialize', {
          token: token
        });
        return channel.once('initialized', function() {
          return promise.resolve(new Session(channel));
        });
      });
      socket.once('disconnection', disconnectHandler);
      return promise.promise();
    };

    return Cloupp;

  })();

  module.exports = Cloupp;

}).call(this);


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZ2VyYWxkL21ha2VnYW1lc3dpdGh1cy9jbG91cHAuanMvc3JjL2Nsb3VwcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0NBQUEsS0FBQSxvQkFBQTs7Q0FBQSxDQUFBLENBQUEscUNBQUE7O0NBQUEsQ0FFTTtDQUNRLENBQVcsQ0FBWCxDQUFBLEVBQUEsQ0FBQSxPQUFFO0NBQ2QsRUFEYyxDQUFBLEVBQUQ7Q0FDYixFQUR1QixDQUFBLEVBQUQ7Q0FDdEIsR0FBQyxFQUFELENBQUE7Q0FERCxJQUFhOztDQUFiLEVBR1EsR0FBUixDQUFRLEVBQUM7Q0FDUCxDQUNBLEVBREEsRUFBTSxFQUFQLEtBQUE7Q0FDQyxDQUFNLEVBQU4sSUFBQTtDQUFBLENBQ00sRUFBTixHQURBLENBQ0E7Q0FITSxPQUNQO0NBSkQsSUFHUTs7Q0FIUjs7Q0FIRDs7Q0FBQSxDQVdNO0NBQ1EsRUFBQSxDQUFBLEVBQUEsV0FBRTtDQUFTLEVBQVQsQ0FBQSxFQUFEO0NBQWQsSUFBYTs7Q0FBYixDQUVtQixDQUFQLENBQUEsR0FBQSxFQUFDLENBQWI7Q0FDVSxDQUFTLEVBQWQsRUFBQSxDQUFBLE1BQUE7Q0FITCxJQUVZOztDQUZaLENBS2dCLENBQVAsQ0FBQSxHQUFULEVBQVUsRUFBRDtDQUNSLFNBQUEsTUFBQTtDQUFBLENBQ0MsRUFEQSxFQUFELEdBQUE7Q0FDQyxDQUFhLEVBQWIsSUFBQTtDQUFBLENBQ2EsTUFBYixHQUFBO0NBRkQsT0FBQTtBQUlVLENBSlYsRUFJVSxHQUFWLENBQUEsQ0FKQTtDQUFBLEVBTVUsQ0FBQSxFQUFWLENBQUEsRUFBVztDQUNGLEdBQVcsRUFBbkIsQ0FBTyxDQUFQLE9BQUE7Q0FQRCxNQU1VO0NBTlYsQ0FTeUIsQ0FBQSxDQUF4QixFQUFELEdBQTBCLENBQTFCO0NBQ0MsQ0FBbUMsRUFBbEMsRUFBTSxDQUFQLENBQUEsRUFBQSxJQUFBO0NBRUEsQ0FBQSxFQUFHLElBQUg7Q0FDUyxHQUFSLEdBQU8sVUFBUDtNQURELElBQUE7Q0FHUyxHQUFSLEVBQUEsQ0FBTyxVQUFQO1VBTnVCO0NBQXpCLE1BQXlCO0NBVHpCLENBaUJBLEVBQUMsRUFBRCxDQUFBLEdBQUE7Q0FDUSxNQUFELE1BQVA7Q0F4QkQsSUFLUzs7Q0FMVDs7Q0FaRDs7Q0FBQSxDQXNDTTtDQUNMOztDQUFBLEVBQWdCLENBQWhCLENBQWdCLENBQWYsR0FBZ0IsSUFBakI7Q0FDQyxTQUFBLHdCQUFBO0FBQVUsQ0FBVixFQUFVLEdBQVYsQ0FBQSxDQUFBO0NBQUEsQ0FFQyxDQURTLEdBQVYsQ0FBVTtDQUNULENBQVUsTUFBVixHQUFBO0NBRkQsT0FDVTtDQURWLEVBSW9CLEdBQXBCLEdBQW9CLFFBQXBCO0NBQ1MsS0FBUixDQUFPLFFBQVA7Q0FMRCxNQUlvQjtDQUpwQixDQU9vQixDQUFBLENBQXBCLEVBQUEsR0FBb0I7Q0FDbkIsTUFBQSxLQUFBO0NBQUEsQ0FBdUMsSUFBakMsRUFBTixNQUFBLENBQUEsRUFBQTtDQUFBLEVBRVUsRUFBQSxDQUFNLENBQWhCLENBQUE7Q0FGQSxDQUcyQixFQUEzQixHQUFPLENBQVAsSUFBQTtDQUEyQixDQUFTLEdBQVAsS0FBQTtDQUg3QixTQUdBO0NBQ1EsQ0FBb0IsQ0FBQSxDQUE1QixHQUFPLEVBQXFCLElBQTVCLEVBQUE7Q0FDUyxHQUFZLEdBQWIsVUFBUDtDQURELFFBQTRCO0NBTDdCLE1BQW9CO0NBUHBCLENBZTZCLEVBQTdCLEVBQUEsU0FBQSxFQUFBO0NBQ1EsTUFBRCxNQUFQO0NBakJELElBQWdCOztDQUFoQjs7Q0F2Q0Q7O0NBQUEsQ0EwREEsQ0FBaUIsR0FBWCxDQUFOO0NBMURBIiwic291cmNlc0NvbnRlbnQiOlsiVVJMID0gXCJodHRwczovL3dhcm0tZ2FyZGVuLTI4MzcuaGVyb2t1YXBwLmNvbVwiXG5cbmNsYXNzIEZpbGVcblx0Y29uc3RydWN0b3I6IChAc29ja2V0LCBAbmFtZSwgY29udGVudCkgLT5cblx0XHRAdXBkYXRlIGNvbnRlbnRcblxuXHR1cGRhdGU6IChjb250ZW50KSAtPlxuXHRcdEBzb2NrZXQuc2VuZCAndXBkYXRlJyxcblx0XHRcdHBhdGg6IEBuYW1lXG5cdFx0XHRkYXRhOiBjb250ZW50XG5cbmNsYXNzIFNlc3Npb25cblx0Y29uc3RydWN0b3I6IChAc29ja2V0KSAtPlxuXG5cdGNyZWF0ZUZpbGU6IChuYW1lLCBjb250ZW50KSAtPlxuXHRcdG5ldyBGaWxlIEBzb2NrZXQsIG5hbWUsIGNvbnRlbnRcblxuXHRjb21waWxlOiAobmFtZSwgZGVzY3JpcHRpb24pIC0+XG5cdFx0QHNvY2tldC5zZW5kICdjb21waWxlJyxcblx0XHRcdG5hbWU6ICAgICAgICBuYW1lXG5cdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25cblxuXHRcdHByb21pc2UgPSBuZXcgJC5EZWZlcnJlZFxuXG5cdFx0aGFuZGxlciA9IChkYXRhKSAtPlxuXHRcdFx0cHJvbWlzZS5ub3RpZnkgZGF0YS5wcm9ncmVzc1xuXG5cdFx0QHNvY2tldC5zZW5kICdjb21waWxlZCcsIChkYXRhKSAtPlxuXHRcdFx0QHNvY2tldC5yZW1vdmVMaXN0ZW5lciAncHJvZ3Jlc3MnLCBoYW5kbGVyXG5cdFx0XHRcblx0XHRcdGlmIGRhdGEuaWRcblx0XHRcdFx0cHJvbWlzZS5yZXNvbHZlIGRhdGFcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHJvbWlzZS5yZWplY3QgZGF0YVxuXG5cdFx0QHNvY2tldC5vbiAncHJvZ3Jlc3MnLCBoYW5kbGVyXG5cdFx0cHJvbWlzZS5wcm9taXNlKClcblxuY2xhc3MgQ2xvdXBwXG5cdEBjcmVhdGVTZXNzaW9uOiAodG9rZW4pIC0+XG5cdFx0cHJvbWlzZSA9IG5ldyAkLkRlZmVycmVkXG5cdFx0c29ja2V0ICA9IFByaW11cy5jb25uZWN0IFVSTCxcblx0XHRcdHBhdGhuYW1lOiAndjEvc29ja2V0J1xuXG5cdFx0ZGlzY29ubmVjdEhhbmRsZXIgPSAoKSAtPlxuXHRcdFx0cHJvbWlzZS5yZWplY3QoKVxuXG5cdFx0c29ja2V0Lm9uY2UgJ29wZW4nLCAoKSAtPlxuXHRcdFx0c29ja2V0LnJlbW92ZUxpc3RlbmVyICdkaXNjb25uZWN0aW9uJywgZGlzY29ubmVjdEhhbmRsZXJcblxuXHRcdFx0Y2hhbm5lbCA9IHNvY2tldC5jaGFubmVsICdhcGknXG5cdFx0XHRjaGFubmVsLnNlbmQgJ2luaXRpYWxpemUnLCB7IHRva2VuOiB0b2tlbiB9XG5cdFx0XHRjaGFubmVsLm9uY2UgJ2luaXRpYWxpemVkJywgKCkgLT5cblx0XHRcdFx0cHJvbWlzZS5yZXNvbHZlIG5ldyBTZXNzaW9uIGNoYW5uZWxcblxuXHRcdHNvY2tldC5vbmNlICdkaXNjb25uZWN0aW9uJywgZGlzY29ubmVjdEhhbmRsZXJcblx0XHRwcm9taXNlLnByb21pc2UoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IENsb3VwcFxuIl19(1)
});
;