/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.PasswordWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='password';
    return this.theme.getInput(this.aField);
  }
});
