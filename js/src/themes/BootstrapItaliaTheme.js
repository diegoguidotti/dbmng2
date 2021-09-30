/////////////////////////////////////////////////////////////////////
// BootstrapTheme
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.BootstrapItaliaTheme = Dbmng.AbstractTheme.extend({
  getFieldContainer: function(aField) {
    var el = document.createElement('div');
    el.className = 'dbmng_form_row';
    if (aField.widget!=='checkbox' && aField.widget!=='select') {
      el.className = 'form-group dbmng_bi_field';
    }
    if (aField.widget=='select') {
      el.className = 'bootstrap-select-wrapper';
    }
    el.className = el.className + ' dbmng_form_field_' + aField.field;

    return el;
  },
  getLabel: function(aField) {
    var el=document.createDocumentFragment();

    if (aField.widget!=='checkbox') {
      el=document.createElement('label');
      el.className='active';
      el.setAttribute('for', 'dbmng_' + aField.field);

      // if set assign the label long in form mode
      var label = aField.label;
      if( aField.label_long ) {
        label = aField.label_long;
      }
      el.innerHTML=label;

      if( parseInt(aField.nullable) === 0  ) {
        var sp = document.createElement('span');
        sp.className='dbmng_required';

        var star=document.createTextNode('*');
        sp.appendChild(star);
      }
    }

    return el;
  },
  getInput: function(aField) {
    var el=document.createElement('input');
    el.className='form-control';

    if (aField.type=='varchar' || aField.type=='text') {
      el.setAttribute('type', 'text');
    }
    else if(aField.type=='date') {
      el.setAttribute('type', 'date');
    }

    if(typeof aField.value !== 'undefined' ) {
      el.value=aField.value;
    }
    if( aField.placeholder ) {
      el.placeholder = aField.placeholder;
    }

    else {
      el.type = "text";
    }

    //if in the option there is a field_type value it will be override the previous one (if the widget is hidden and the type is int it should be hidden)
    if(aField.field_type){
      el.type = aField.field_type;
    }

    return el;
  },
  getCheckbox: function(aField) {



    var el=document.createElement('div');

    var fc=document.createElement('div');
    fc.className='form-check';
    el.appendChild(fc);


    var input=document.createElement('input');
    input.className='real_widget';
    fc.appendChild(input);

    var label=document.createElement('label');
    fc.appendChild(label);
    // this.assignAttributes(input, aField);
    var label_text = aField.label;
    if( aField.label_long ) {
      label_text = aField.label_long;
    }

    label.innerHTML= label_text;

    input.setAttribute('id', 'dbmng_' + aField.field);
    label.setAttribute('for', 'dbmng_' + aField.field);


    if(! aField.exclude_attribute) {
      this.assignAttributes(input, aField);
    }
    //console.log(aField);

    input.type = "checkbox";
    if(typeof aField.value !== 'undefined' ) {
      input.value=aField.value;
    }

    if(aField.checked) {
      input.checked = true;
    }

    //console.log(aField);
    if( aField.placeholder ) {
      input.placeholder = aField.label;
    }

    return el;
  },

  getSelect: function(aField) {
    var el=document.createElement('select');
    el.className='form-control aepy-select';
    this.assignAttributes(el, aField);

    if (aField.searchable) {
      el.setAttribute('data-live-search', aField.searchable);
    }
    if (aField.searchable_placeholder) {
      el.setAttribute('data-live-search-placeholder', aField.searchable_placeholder);
    }

    if(aField.voc_val) {
      var o=document.createElement('option');

      if( aField.placeholder ) {
        o.text=aField.label;
        o.disabled = 'disabled';
      }

      el.options.add(o);

      jQuery.each(aField.voc_val, function(k,v){
        if(typeof v !== 'string') {
          jQuery.each(v, function(key,text){
            o=document.createElement('option');
            o.value = key; // v[0];
            o.text= text; // v[1];
            if( typeof aField.value !== 'undefined' ) {
              if( aField.value == key ) {
                o.selected = true;
              }
            }
          });
        }
        el.options.add(o);
      });
    }
    return el;
  },
  setErrorState: function(element, ok, message){

    var par=jQuery(element.widget);

    par.parent().find(".invalid-feedback").remove();

    if(ok){
      par.removeClass('is-invalid').addClass('is-valid');
    }
    else{
      par.parent().append('<div class="invalid-feedback">'+message+'</div>');
      par.removeClass('is-valid').addClass('is-invalid');
    }

  },
  createFileUploadField: function(elv, label, opt){
    var el = this._super(elv, label, opt);
    var btn=jQuery(el).find('.fileinput-button');
    btn.css('width','');
    btn.addClass('col-xs-6');
    // this.addClass(btn,'col-xs-6');

    var prg=jQuery(el).find('.progress');
    prg.css('width','');
    prg[0].style.cssText="";
    prg.wrap('<div class="col-xs-6" style="padding-top: 7px;"></div>');
    prg.find('.progress-bar')[0].style.cssText="";

    return el;
  },
  // assignAttributes: function(el, aField) {
  //   this._super(el, aField);
  //   this.addClass(el, 'form-control');
  // },
  // alertMessage: function(text) {
  //   var el = this._super(text);
  //   this.addClass(el, 'alert alert-block alert-danger');
  //   return el;
  // },
  // getTable: function(opt) {
  //   var div = this._super(opt);
  //   //this.addClass(div, 'table-responsive');
  //   this.addClass(div.firstChild, 'table');
  //   return div;
  // },
  // getButton: function(text, opt) {
  //   var el = this._super(text, opt);
  //   this.addClass(el, 'btn btn-default');
  //   return el;
  // },

  // getDeleteButton: function(label,btn_icon){
  //
  //   var icn = document.createElement('i');
  //   this.addClass(icn,btn_icon);
  //   this.addTitle(icn, label);
  //   return icn;
  // }

});
