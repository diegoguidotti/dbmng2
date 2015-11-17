/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
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
    
    return this.theme.getSelectNM(this.aField);
  },
  
  getValue: function(){
    var aVal, aRet;
    if( this.aField.type == 'int' ) {
      aVal = jQuery(this.widget).val();
      
      aRet = [];
      aVal.forEach(function(entry) {
        aRet.push(parseInt(entry));
      });
    }
    else {
      aRet = jQuery(this.widget).val();
    }
    return aRet;
  }
});
