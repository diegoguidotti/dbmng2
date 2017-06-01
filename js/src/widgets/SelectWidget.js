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
    return val;
  },
  convert2html: function(val) {
    var ret;
    if( Object.prototype.toString.call(this.aField.voc_val) == '[object Object]' ){
      ret = this.aField.voc_val[val];
    }
    else if( Object.prototype.toString.call(this.aField.voc_val) == '[object Array]' ) {
      // console.log(val);
      // console.log(this.aField.voc_val);
      jQuery.each(this.aField.voc_val, function(k,voc){
        // console.log(voc);
        // console.log(val);
        jQuery.each(voc, function(v,text){
          if( v == val ){
            ret = text;
          }
        });
      });
    }
    return ret;
  }
});
