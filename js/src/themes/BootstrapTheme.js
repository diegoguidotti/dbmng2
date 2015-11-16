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
  
  getInput: function(aField) {
    var el = this._super(aField);
    el.className='form-control';
    return el;
  },
  
  getSelect: function(aField) {
    var el = this._super(aField);
    el.className='form-control';
    return el;
  },
  
  getPassword: function(aField) {
    var el = this._super(aField);
    el.className='form-control';
    return el;
  },
  
});
