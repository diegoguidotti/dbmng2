/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.SelectWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(options){
    var aField=options.aField;
    aField.value = this.getFieldValue(options);
    aField.field = options.field;
    
    return this.theme.getSelect(aField);
  }
});
