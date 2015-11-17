/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.CheckboxWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(options){
    options.aField.value = this.getFieldValue(options);
    return this.theme.getCheckbox(options.aField);
  },
  getValue: function(){
    return this.widget.checked;
  }
});
