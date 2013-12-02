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
      var handler, promise,
        _this = this;
      this.socket.send('compile', {
        name: name,
        description: description
      });
      promise = new $.Deferred;
      handler = function(data) {
        return promise.notify(data.progress);
      };
      this.socket.on('compiled', function(data) {
        _this.socket.removeListener('progress', handler);
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZ2VyYWxkL21ha2VnYW1lc3dpdGh1cy9jbG91cHAuanMvc3JjL2Nsb3VwcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0NBQUEsS0FBQSxvQkFBQTs7Q0FBQSxDQUFBLENBQUEscUNBQUE7O0NBQUEsQ0FFTTtDQUNRLENBQVcsQ0FBWCxDQUFBLEVBQUEsQ0FBQSxPQUFFO0NBQ2QsRUFEYyxDQUFBLEVBQUQ7Q0FDYixFQUR1QixDQUFBLEVBQUQ7Q0FDdEIsR0FBQyxFQUFELENBQUE7Q0FERCxJQUFhOztDQUFiLEVBR1EsR0FBUixDQUFRLEVBQUM7Q0FDUCxDQUNBLEVBREEsRUFBTSxFQUFQLEtBQUE7Q0FDQyxDQUFNLEVBQU4sSUFBQTtDQUFBLENBQ00sRUFBTixHQURBLENBQ0E7Q0FITSxPQUNQO0NBSkQsSUFHUTs7Q0FIUjs7Q0FIRDs7Q0FBQSxDQVdNO0NBQ1EsRUFBQSxDQUFBLEVBQUEsV0FBRTtDQUFTLEVBQVQsQ0FBQSxFQUFEO0NBQWQsSUFBYTs7Q0FBYixDQUVtQixDQUFQLENBQUEsR0FBQSxFQUFDLENBQWI7Q0FDVSxDQUFTLEVBQWQsRUFBQSxDQUFBLE1BQUE7Q0FITCxJQUVZOztDQUZaLENBS2dCLENBQVAsQ0FBQSxHQUFULEVBQVUsRUFBRDtDQUNSLFNBQUEsTUFBQTtTQUFBLEdBQUE7Q0FBQSxDQUNDLEVBREEsRUFBRCxHQUFBO0NBQ0MsQ0FBYSxFQUFiLElBQUE7Q0FBQSxDQUNhLE1BQWIsR0FBQTtDQUZELE9BQUE7QUFJVSxDQUpWLEVBSVUsR0FBVixDQUFBLENBSkE7Q0FBQSxFQU1VLENBQUEsRUFBVixDQUFBLEVBQVc7Q0FDRixHQUFXLEVBQW5CLENBQU8sQ0FBUCxPQUFBO0NBUEQsTUFNVTtDQU5WLENBU0EsQ0FBdUIsQ0FBdEIsRUFBRCxHQUF3QixDQUF4QjtDQUNDLENBQW1DLEdBQWxDLENBQU0sQ0FBUCxDQUFBLEVBQUEsSUFBQTtDQUVBLENBQUEsRUFBRyxJQUFIO0NBQ1MsR0FBUixHQUFPLFVBQVA7TUFERCxJQUFBO0NBR1MsR0FBUixFQUFBLENBQU8sVUFBUDtVQU5xQjtDQUF2QixNQUF1QjtDQVR2QixDQWlCQSxFQUFDLEVBQUQsQ0FBQSxHQUFBO0NBQ1EsTUFBRCxNQUFQO0NBeEJELElBS1M7O0NBTFQ7O0NBWkQ7O0NBQUEsQ0FzQ007Q0FDTDs7Q0FBQSxFQUFnQixDQUFoQixDQUFnQixDQUFmLEdBQWdCLElBQWpCO0NBQ0MsU0FBQSx3QkFBQTtBQUFVLENBQVYsRUFBVSxHQUFWLENBQUEsQ0FBQTtDQUFBLENBRUMsQ0FEUyxHQUFWLENBQVU7Q0FDVCxDQUFVLE1BQVYsR0FBQTtDQUZELE9BQ1U7Q0FEVixFQUlvQixHQUFwQixHQUFvQixRQUFwQjtDQUNTLEtBQVIsQ0FBTyxRQUFQO0NBTEQsTUFJb0I7Q0FKcEIsQ0FPb0IsQ0FBQSxDQUFwQixFQUFBLEdBQW9CO0NBQ25CLE1BQUEsS0FBQTtDQUFBLENBQXVDLElBQWpDLEVBQU4sTUFBQSxDQUFBLEVBQUE7Q0FBQSxFQUVVLEVBQUEsQ0FBTSxDQUFoQixDQUFBO0NBRkEsQ0FHMkIsRUFBM0IsR0FBTyxDQUFQLElBQUE7Q0FBMkIsQ0FBUyxHQUFQLEtBQUE7Q0FIN0IsU0FHQTtDQUNRLENBQW9CLENBQUEsQ0FBNUIsR0FBTyxFQUFxQixJQUE1QixFQUFBO0NBQ1MsR0FBWSxHQUFiLFVBQVA7Q0FERCxRQUE0QjtDQUw3QixNQUFvQjtDQVBwQixDQWU2QixFQUE3QixFQUFBLFNBQUEsRUFBQTtDQUNRLE1BQUQsTUFBUDtDQWpCRCxJQUFnQjs7Q0FBaEI7O0NBdkNEOztDQUFBLENBMERBLENBQWlCLEdBQVgsQ0FBTjtDQTFEQSIsInNvdXJjZXNDb250ZW50IjpbIlVSTCA9IFwiaHR0cHM6Ly93YXJtLWdhcmRlbi0yODM3Lmhlcm9rdWFwcC5jb21cIlxuXG5jbGFzcyBGaWxlXG5cdGNvbnN0cnVjdG9yOiAoQHNvY2tldCwgQG5hbWUsIGNvbnRlbnQpIC0+XG5cdFx0QHVwZGF0ZSBjb250ZW50XG5cblx0dXBkYXRlOiAoY29udGVudCkgLT5cblx0XHRAc29ja2V0LnNlbmQgJ3VwZGF0ZScsXG5cdFx0XHRwYXRoOiBAbmFtZVxuXHRcdFx0ZGF0YTogY29udGVudFxuXG5jbGFzcyBTZXNzaW9uXG5cdGNvbnN0cnVjdG9yOiAoQHNvY2tldCkgLT5cblxuXHRjcmVhdGVGaWxlOiAobmFtZSwgY29udGVudCkgLT5cblx0XHRuZXcgRmlsZSBAc29ja2V0LCBuYW1lLCBjb250ZW50XG5cblx0Y29tcGlsZTogKG5hbWUsIGRlc2NyaXB0aW9uKSAtPlxuXHRcdEBzb2NrZXQuc2VuZCAnY29tcGlsZScsXG5cdFx0XHRuYW1lOiAgICAgICAgbmFtZVxuXHRcdFx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG5cblx0XHRwcm9taXNlID0gbmV3ICQuRGVmZXJyZWRcblxuXHRcdGhhbmRsZXIgPSAoZGF0YSkgLT5cblx0XHRcdHByb21pc2Uubm90aWZ5IGRhdGEucHJvZ3Jlc3NcblxuXHRcdEBzb2NrZXQub24gJ2NvbXBpbGVkJywgKGRhdGEpID0+XG5cdFx0XHRAc29ja2V0LnJlbW92ZUxpc3RlbmVyICdwcm9ncmVzcycsIGhhbmRsZXJcblx0XHRcdFxuXHRcdFx0aWYgZGF0YS5pZFxuXHRcdFx0XHRwcm9taXNlLnJlc29sdmUgZGF0YVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwcm9taXNlLnJlamVjdCBkYXRhXG5cblx0XHRAc29ja2V0Lm9uICdwcm9ncmVzcycsIGhhbmRsZXJcblx0XHRwcm9taXNlLnByb21pc2UoKVxuXG5jbGFzcyBDbG91cHBcblx0QGNyZWF0ZVNlc3Npb246ICh0b2tlbikgLT5cblx0XHRwcm9taXNlID0gbmV3ICQuRGVmZXJyZWRcblx0XHRzb2NrZXQgID0gUHJpbXVzLmNvbm5lY3QgVVJMLFxuXHRcdFx0cGF0aG5hbWU6ICd2MS9zb2NrZXQnXG5cblx0XHRkaXNjb25uZWN0SGFuZGxlciA9ICgpIC0+XG5cdFx0XHRwcm9taXNlLnJlamVjdCgpXG5cblx0XHRzb2NrZXQub25jZSAnb3BlbicsICgpIC0+XG5cdFx0XHRzb2NrZXQucmVtb3ZlTGlzdGVuZXIgJ2Rpc2Nvbm5lY3Rpb24nLCBkaXNjb25uZWN0SGFuZGxlclxuXG5cdFx0XHRjaGFubmVsID0gc29ja2V0LmNoYW5uZWwgJ2FwaSdcblx0XHRcdGNoYW5uZWwuc2VuZCAnaW5pdGlhbGl6ZScsIHsgdG9rZW46IHRva2VuIH1cblx0XHRcdGNoYW5uZWwub25jZSAnaW5pdGlhbGl6ZWQnLCAoKSAtPlxuXHRcdFx0XHRwcm9taXNlLnJlc29sdmUgbmV3IFNlc3Npb24gY2hhbm5lbFxuXG5cdFx0c29ja2V0Lm9uY2UgJ2Rpc2Nvbm5lY3Rpb24nLCBkaXNjb25uZWN0SGFuZGxlclxuXHRcdHByb21pc2UucHJvbWlzZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvdXBwXG4iXX0=(1)
});
;