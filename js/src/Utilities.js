if(typeof window.console == 'undefined') { window.console = {log: function (msg) {msg="";} }; }

function exeExternalFunction (fnstring, params) {
  var fn = window[fnstring];
  if( typeof fn == 'function' ) {
    if( typeof params == 'undefined' ) {
      return fn();
    }
    else {
      return fn.apply(null, params);
    }
  }
  else{
      console.log('Function does not exists');
      return false;
  }
}
