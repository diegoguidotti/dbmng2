/////////////////////////////////////////////////////////////////////
// TextareaWidget
// 21 January 2016
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.TextareaWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='password';


    

    return this.theme.getTextarea(this.aField);


  }
});
