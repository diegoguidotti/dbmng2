/////////////////////////////////////////////////////////////////////
// BootstrapTheme
// 12 November 2015
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
    el.className=el.className+' form-control';
  }

});
