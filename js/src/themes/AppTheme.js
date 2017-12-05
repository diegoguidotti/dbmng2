/////////////////////////////////////////////////////////////////////
// BootstrapTheme
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AppTheme = Dbmng.AbstractTheme.extend({
  getLabel: function(aField) {
    var el = this._super(aField);
    this.addClass(el, 'label-form');
    jQuery(el).css('font-weight','bold');
    return el;
  },
  assignAttributes: function(el, aField) {
    this._super(el, aField);
    this.addClass(el, 'input-form');
  },
  alertMessage: function(text) {
    var el = this._super(text);
    this.addClass(el, 'alert alert-block alert-danger');
    return el;
  },
  getTable: function(opt) {
    var div = this._super(opt);
    //this.addClass(div, 'table-responsive');
    this.addClass(div.firstChild, 'table');
    return div;
  },
  getButton: function(text, opt) {
    var el = this._super(text, opt);
    this.addClass(el, 'btn btn-default');
    return el;
  },
  createFileUploadField: function(elv, label, opt){
    var el = this._super(elv, label, opt);
    var btn=jQuery(el).find('.fileinput-button');
    btn.css('width','');
    btn.addClass('col-xs-6');
    //this.addClass(btn,'col-xs-6');

    var prg=jQuery(el).find('.progress');
    prg.css('width','');
    prg[0].style.cssText="";
    prg.wrap('<div class="col-xs-6" style="padding-top: 7px;"></div>');
    prg.find('.progress-bar')[0].style.cssText="";

    // console.log(el);

    return el;
  },
  getDeleteButton: function(label,btn_icon){

    var icn = document.createElement('i');
    this.addClass(icn,btn_icon);
    this.addTitle(icn, label);
    return icn;
  }

});
