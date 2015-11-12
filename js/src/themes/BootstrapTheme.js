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
  getInput: function(options) {
    var el = this._super(options);
    el.className='form-control';
    return el;
  },
  getLabel: function(options) {
    var el = this._super(options);
    jQuery(el).css('font-weight','bold');
    return el;
  }
});
