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
  createWidget: function(options){
      var aField=options.aField;
      var theme =options.theme;         
      var input={'value':this.getDefaultValue(), 'label':aField.label};
      return theme.getFormInput(input);
  },
  getDefaultValue: function(options){
    return 'vuoto';        
  }      
});
