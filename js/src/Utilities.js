if(typeof window.console == 'undefined') { window.console = {log: function (msg) {msg="";} }; } 

function exeExternalFunction(fnstring) {
  var fn = window[fnstring];
  if( typeof(fn) == 'function' ) {
    fn();
  }
}