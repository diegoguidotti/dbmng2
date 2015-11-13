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
  createWidget: function( options ) {
    // var aField = options.aField;
    var theme  = options.theme;
    
    options.aField.value = this.getFieldValue(options);
    
    return theme.getInput(options.aField);
  },
  
  createField: function( options ) {
    var theme;
    if( options.theme ) {
      theme = options.theme;
    }
    else {
      theme = new Dbmng.AbstractTheme();
      options.theme  = theme;
    }
    
    options.aField.field = options.field;
    
    var el = theme.getFieldContainer(options.aField);
    el.appendChild(theme.getLabel(options.aField));
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