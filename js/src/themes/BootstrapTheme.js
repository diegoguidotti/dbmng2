/////////////////////////////////////////////////////////////////////
// BootstrapTheme
// 18 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.BootstrapTheme = Dbmng.AbstractTheme.extend({
  getLabel: function(aField) {
    var el = this._super(aField);
    jQuery(el).css('font-weight','bold');
    return el;
  },
  
  assignAttributes: function(el, aField) {
    this._super(el, aField);
    var space = "";
    if( el.className.lenght > 0 ) {
      space = " ";
    }
    el.className = el.className + space + "form-control";
  }

});
