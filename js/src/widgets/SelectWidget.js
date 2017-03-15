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
  createWidget: function(){
    //var aField=this.aField;
    this.aField.value = this.getFieldValue();
    this.aField.field = this.field;

    return this.theme.getSelect(this.aField);
  },

  getValue: function(){
    var val;
    if( this.aField.type == 'int' ) {
      val = parseInt(jQuery(this.widget).val());
    }
    else {
      val = jQuery(this.widget).val();
    }
		// console.log('getValue '+val);
    return val;
  },
  convert2html: function(val) {
    return this.aField.voc_val[val];
  }
});
