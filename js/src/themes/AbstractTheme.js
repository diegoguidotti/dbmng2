/////////////////////////////////////////////////////////////////////
// AbstractTheme
// 12 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AbstractTheme = Class.extend({    
  test: function(input){
    return input+2;
  },  
  getInput: function(options) {
    var el=document.createElement('input');
    if(options.value)
      el.value=options.value;
    return el;
  },
  getLabel: function(options) {
    var el=document.createElement('div');
    el.classname='dbnmg_label';
    var txt=document.createTextNode(options.label);
    el.appendChild(txt);
    return el;
  },
  getFormInput: function(options){
    var el=document.createElement('div');
    el.appendChild(this.getLabel(options));
    el.appendChild(this.getInput(options));
    return el;
  }
});
