/////////////////////////////////////////////////////////////////////
// Framework7Theme
// 05 February 2020
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
// Klean Hoxha
/////////////////////////////////////////////////////////////////////

Dbmng.Framework7Theme = Dbmng.AbstractTheme.extend({
  getForm: function(opt) {
    var el = document.createElement('form');
    this.addClass(el, "list");

    var ul = document.createElement('ul');
    el.appendChild(ul);

    return el;
  },
  getFieldContainer: function(aField) {
    // console.log(aField);
    var el = document.createElement('li');

    var div1=document.createElement('div');
    div1.className="item-content item-input";
    el.appendChild(div1);

    var div2=document.createElement('div');
    div2.className="item-inner";
    div1.appendChild(div2);


    // el.className = 'dbmng_form_row';
    // el.className = el.className + ' dbmng_form_field_' + aField.field;

    return el;
  },
  getLabel: function(aField) {
    var el=document.createElement('div');
    el.className='item-title item-label';

    // if set assign the label long in form mode
    var label = aField.label;
    if( aField.label_long ) {
      label = aField.label_long;
    }
    el.innerHTML= label;

    return el;
  },
  getInput: function(aField) {
    var el= document.createElement('div');
    el.className='item-input-wrap';


    var input=document.createElement('input');
    el.appendChild(input);
    this.assignAttributes(input, aField);

    if(typeof aField.value !== 'undefined' ) {
      input.value=aField.value;
    }
    if( aField.placeholder ) {
      input.placeholder = aField.placeholder;
    }
    input.type = "text";
    // if (aField.type) {
    //   input.type=aField.type;
    // }

    //if in the option there is a field_type value it will be override the previous one (if the widget is hidden and the type is int it should be hidden)
    if(aField.field_type){
      input.type = aField.field_type;
    }

    return el;
  },
  getCheckbox: function(aField) {
    // var el=document.createElement('input');


    var el= document.createElement('div');
    el.className='item-after';

    var label=document.createElement('label');
    label.className='toggle toggle-init color-green';
    el.appendChild(label);

    var input=document.createElement('input');
    label.appendChild(input);

    var i=document.createElement('i');
    i.className='toggle-icon';
    label.appendChild(i);


    if(! aField.exclude_attribute) {
      this.assignAttributes(input, aField);
    }

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
    var el= document.createElement('div');
    el.className='item-input-wrap input-dropdown-wrap';


    var select=document.createElement('select');
    el.appendChild(select);

    // var el=document.createElement('select');
    // console.log(Object.prototype.toString.call(aField.voc_val));
    this.assignAttributes(select, aField);
    if(aField.voc_val) {
      var o=document.createElement('option');

      if( aField.placeholder ) {
        o.text=aField.label;
        o.disabled = 'disabled';
      }

      select.options.add(o);

      if(Object.prototype.toString.call(aField.voc_val) === '[object Object]') {
        for (var opt in aField.voc_val) {
          o=document.createElement('option');
          o.value = opt;
          o.text=aField.voc_val[opt];
          // console.log(aField);
          // console.log(aField.label + "= out: aFval[" + aField.value+"] opt: ["+ opt+"]");
          if( typeof aField.value !== 'undefined' ) {
            // console.log(aField.label + "= in: aFval[" + aField.value+"] opt: ["+ opt+"]");
            if( aField.value == opt ) {
              o.selected = true;
            }
          }
          select.options.add(o);
        }
      }
      else if(Object.prototype.toString.call(aField.voc_val) === '[object Array]') {
        // console.log(aField.voc_val);
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
          else {
            o=document.createElement('option');
            o.value = opt;
            o.text=aField.voc_val[opt];
            if( typeof aField.value !== 'undefined' ) {
              if( aField.value == opt ) {
                o.selected = true;
              }
            }
          }
          select.options.add(o);
        });
      }
    }
    return el;
  },
  getSelectNM: function(aField) {
    //console.log(aField);
    var out_type = "select";
    var el, o, opt;
    if( aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }
    if( out_type == 'select' ) {

      el = document.createElement('a');
      el.className='item-link smart-select smart-select-init';
      el['data-open-in']='popover';


      var select = document.createElement('select');
      select.multiple = true;
      el.appendChild(select);

      this.assignAttributes(select, aField);

      if(aField.voc_val) {
        o = document.createElement('option');

        if( aField.placeholder ) {
          o.text = aField.label;
          o.disabled = 'disabled';
        }

        select.options.add(o);
        for (opt in aField.voc_val) {
          o = document.createElement('option');
          o.value = opt;
          o.text = aField.voc_val[opt];
          if( aField.value ) {
            if( typeof aField.value[0] == 'number') {
              opt = parseInt(opt);
            }
            if( aField.value.indexOf(opt) > -1 ) {
              o.selected = true;
            }
          }
          select.options.add(o);
        }
      }
    }
    else if( out_type == 'checkbox' ) {
      //console.log(options);
      el = document.createElement('ul');
      this.addClass(el, 'dbmng_checkbox_ul');
      this.assignAttributes(el, aField);

      for (opt in aField.voc_val) {
        var li = document.createElement('li');

        var aCB = {type: 'int', widget:'checkbox', theme:this}; // , theme:theme_boot ??
        o = new Dbmng.CheckboxWidget({field:aField.field, aField:aCB});
        o.createField(opt);

        li.appendChild(o.widget);

        var txt = document.createTextNode(aField.voc_val[opt]);
        li.appendChild(txt);
        el.appendChild(li);
      }
    }
    return el;
  },


  assignAttributes: function(el, aField) {
    console.log(el);
    console.log(aField.widget);

    // this._super(el, aField);
    // this.addClass(el, 'form-control');
  },
  alertMessage: function(text) {
    var el = this._super(text);
    this.addClass(el, 'alert alert-block alert-danger');
    return el;
  },
  getTable: function(opt) {
    var div = this._super(opt);
    this.addClass(div.firstChild, 'data-table card');
    return div;
  },
  getButton: function(text, opt) {
    var el = this._super(text, opt);
    this.addClass(el, 'button button-raised');
    return el;
  },
  createFileUploadField: function(elv, label, opt){
    var el = this._super(elv, label, opt);
    var btn=jQuery(el).find('.fileinput-button');
    btn.css('width','');
    btn.addClass('col-50');

    var prg=jQuery(el).find('.progress');
    prg.css('width','');
    prg[0].style.cssText="";
    prg.wrap('<div class="col-50" style="padding-top: 7px;"></div>');
    prg.find('.progress-bar')[0].style.cssText="";

    return el;
  },
  getDeleteButton: function(label,btn_icon){

    var icn = document.createElement('i');
    this.addClass(icn,btn_icon);
    this.addTitle(icn, label);
    return icn;
  }
});
