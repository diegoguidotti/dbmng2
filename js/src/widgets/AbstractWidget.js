/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AbstractWidget = Class.extend({
  //class constructor
  init:function(options){
    if(!options){
      options={};
    }
    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = new Dbmng.AbstractTheme();      
    }
  },
  createWidget: function( options ) {
    // var aField = options.aField;        
    options.aField.value = this.getFieldValue(options);    
    return this.theme.getInput(options.aField);
  },
  
  createField: function( options ) {
    
    
    options.aField.field = options.field;
    
    var el = this.theme.getFieldContainer(options.aField);
    el.appendChild(this.theme.getLabel(options.aField));
    el.appendChild(this.createWidget(options));
    return el;
  },
  
  getDefaultValue: function( options ) {
    return '';
  },
  
  getFieldValue: function( options ) {
    var v;
    if(options.value){
      v = options.value;
    }
    else if( options.aField.default ) {
      v = options.aField.default;
    }
    else{
      v = this.getDefaultValue();
    }
    return v;
  }
});
