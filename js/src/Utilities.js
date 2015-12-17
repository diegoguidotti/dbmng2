if(typeof window.console == 'undefined') { window.console = {log: function (msg) {msg="";} }; } 

function exeExternalFunction(fnstring, params) {
  var fn = window[fnstring];
  if( typeof fn == 'function' ) {
    if( typeof param !== 'undefined' ) {
      fn();
    }
    else {
      fn.apply(null, params);
    }
  }
}