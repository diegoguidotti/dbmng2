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
    this.addClass(el, 'form-control');
  },
  alertMessage: function(text) {
    var el = this._super(text);
    this.addClass(el, 'alert alert-block alert-danger');
    return el;
  },
  getTable: function(opt) {
    var div = this._super(opt);
    this.addClass(div, 'table-responsive registro_table_padding');
    this.addClass(div.firstChild, 'table');
    return div;
  },
  getButton: function(text, opt) {
    var el = this._super(text, opt);
    this.addClass(el, 'btn btn-default');
    return el;
  }

});
