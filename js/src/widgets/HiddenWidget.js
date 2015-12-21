/////////////////////////////////////////////////////////////////////
// HiddenWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.HiddenWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='hidden';
    return this.theme.getInput(this.aField);
  },
  getLabel: function(){
    return null;
  },
  isVisible: function(){
    return false;
  }
});
