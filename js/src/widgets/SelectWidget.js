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
    var val = '';
    if( jQuery(this.widget).val() !== '' ) {
      if( this.aField.type == 'int' ) {
        val = parseInt(jQuery(this.widget).val());
      }
      else {
        val = jQuery(this.widget).val();
      }
    }
    else{
      val=null;
    }
    return val;
  },
  convert2html: function(val) {
    var ret;
    // // console.log(this.aField);
    // if( Object.prototype.toString.call(this.aField.voc_val) == '[object Object]' ){
    //   ret = this.aField.voc_val[val];
    // }
    // else if( Object.prototype.toString.call(this.aField.voc_val) == '[object Array]' ) {
    //   // console.log(val);
    //   jQuery.each(this.aField.voc_val, function(k,voc){
    //     // console.log(voc);
    //     if(typeof voc !== 'string') {
    //       jQuery.each(voc, function(v,text){
    //         if( v == val ){
    //           ret = text;
    //         }
    //       });
    //     }
    //     else {
    //       ret = voc;
    //     }
    //   });
    // }

    jQuery.each(this.aField.voc_val, function(k,voc){
      // console.log(voc);
      if(typeof voc !== 'string') {
        jQuery.each(voc, function(v,text){
          if( v == val ){
            ret = text;
          }
        });
      }
      else {
        ret = voc;
      }
    });
    return ret;
  }
});
