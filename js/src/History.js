/////////////////////////////////////////////////////////////////////
// Api The class manage the http call to the DBMNG web services
// 13 February 2017
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.History = Class.extend({
  init: function( options ){
    self.hist_function = options;
  },

  bindStateChange: function(){
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var state = History.getState(); // Note: We are using History.getState() instead of event.state
        if(typeof self.hist_function[state.data.type]!=='undefined'){
          self.hist_function[state.data.type]['function'](state);
        }
        else{
          console.log("Error in history, type unknow!!!");
        }
    });
  },

  call: function (type, obj) {
    if(typeof self.hist_function[type] !== 'undefined'){
      var label='?';
      var title="";
      jQuery.each(obj, function(k){

        var value=obj[k];        
        if(typeof value=='object'){
          value='';
          jQuery.each(obj[k],function(k2){
            value+="&"+k2+"="+obj[k][k2];
          });
        }
        label+="&"+k+"="+value;
        title+=k+"="+value+" ";
      });
      History.pushState({'type':type, 'obj':obj },title,label);
    }
    else{
      console.log("Error in history, type unknow!!!");
    }

  }
});
