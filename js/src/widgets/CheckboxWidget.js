/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 18 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.CheckboxWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    return this.theme.getCheckbox(this.aField);
  },
  
  getValue: function(){
    var ret;
    if( this.aField.type == 'int' ) {
      ret = (this.widget.checked ? 1 : 0);
    }
    else {
      ret = this.widget.checked;
    }
    return ret;
  },
	convert2html: function(val) {
		console.log(val);
		console.log(this.aField.voc_val);
		if(this.aField.voc_val){
	    return this.aField.voc_val[val];
		}
		else{
			return val;
		}
  }
});
