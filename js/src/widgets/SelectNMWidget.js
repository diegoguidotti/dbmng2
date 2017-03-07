/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.SelectNMWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field = this.field;
    debugger;
    return this.theme.getSelectNM(this.aField);
  },

  getValue: function(){
    var aVal, aRet;
    console.log(this.aField);
    var out_type = "select";
    if( this.aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }

    if( out_type == "select" ) {
      if( this.aField.type == 'int' ) {
        aVal = [].concat(jQuery(this.widget).val());

        aRet = [];
        aVal.forEach(function(entry) {
          aRet.push(parseInt(entry));
        });
      }
      else {
        aRet = jQuery(this.widget).val();
      }
    }
    else if( out_type == "checkbox" ) {
      var cb = jQuery(this.widget).children('li').children();
      aVal = [];
      cb.each(function(k,v){
        if( v.checked ) {
          console.log(v.value);
          aVal.push(parseInt(v.value));
        }
      });
      aRet = aVal;
    }
    console.log(aRet);
    return aRet;
  }
});
