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

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(suffix) {
		  return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}
