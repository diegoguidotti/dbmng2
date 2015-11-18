/////////////////////////////////////////////////////////////////////
// AbstractTheme
// 18 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AbstractTheme = Class.extend({
  test: function(input){
    return input+2;
  },
  
  getFieldContainer: function(aField) {
    // console.log(aField);
    var el = document.createElement('div');
    el.className = 'dbmng_form_row';
    el.className = el.className + ' dbmng_form_field_' + aField.field;
    return el;
  },
  
  getLabel: function(aField) {
    var el=document.createElement('div');
    el.className='dbmng_form_label';
    
    var lb = document.createElement('label');
    lb.setAttribute('for', 'dbmng_' + aField.field);
    
    var txt=document.createTextNode(aField.label);
    lb.appendChild(txt);
    
    if( aField.nullable === false ) {
      var sp = document.createElement('span');
      sp.className='dbmng_required';
      
      var star=document.createTextNode('*');
      sp.appendChild(star);
      lb.appendChild(sp);
    }
    
    el.appendChild(lb);
    return el;
  },
  
  getInput: function(aField) {
    var el=document.createElement('input');
    this.assignAttributes(el, aField);
    
    if(aField.value) {
      el.value=aField.value;
    }
    
    if( aField.placeholder ) {
      el.placeholder = aField.placeholder;
    }
    
    if( aField.type == 'int' || aField.type == 'bigint' || aField.type == 'float' || aField.type == 'double' ) {
      el.type = "number";
      el.onkeypress = function( evt ) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode( key );
        var regex = /[0-9]|\./;
        if( !regex.test(key) ) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
      };
    }
    else {
      if(aField.widget=='password'){
        el.type = "password";
      }
      else{
        el.type = "text";
      }
    }
    return el;
  },
/*  
  getPassword: function(aField) {
    var el=document.createElement('input');
    this.assignAttributes(el, aField);
    // console.log(aField);
    el.type = "password";
    if(aField.value) {
      el.value=aField.value;
    }
    
    if( aField.placeholder ) {
      el.placeholder = aField.label;
    }
    
    return el;
  },
  */
  getCheckbox: function(aField) {
    var el=document.createElement('input');
    this.assignAttributes(el, aField);
    // console.log(aField);
    el.type = "checkbox";
    if(aField.value) {
      el.value=aField.value;
    }
    
    if( aField.placeholder ) {
      el.placeholder = aField.label;
    }
    
    return el;
  },
  
  getSelect: function(aField) {
    //console.log(aField);
    var el=document.createElement('select');
    
    this.assignAttributes(el, aField);
    if(aField.voc_val) {
      var o=document.createElement('option');
      
      if( aField.placeholder ) {
        o.text=aField.label;
        o.disabled = 'disabled';
      }
      
      el.options.add(o);
      for (var opt in aField.voc_val) {
        o=document.createElement('option');
        o.value = opt;
        o.text=aField.voc_val[opt];
        if( aField.value ) {
          if( aField.value == opt ) {
            o.selected = true;
          }
        }
        el.options.add(o);
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
      el = document.createElement('select');
      el.multiple = true;
      
      this.assignAttributes(el, aField);
      
      if(aField.voc_val) {
        o = document.createElement('option');
        
        if( aField.placeholder ) {
          o.text = aField.label;
          o.disabled = 'disabled';
        }
        
        el.options.add(o);
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
          el.options.add(o);
        }
      }
    }
    else if( out_type == 'checkbox' ) {
      console.log(options);
      el = document.createElement('ul');

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
    //console.log(aField);
    el.setAttribute('id', 'dbmng_' + aField.field);
    if( aField.field ) {
      el.name = aField.field;
    }
    if( aField.nullable === false ) {
      el.required = true;
    }
    if( aField.readonly == 1 ) {
      el.disabled = 'disabled';
    }
    if( aField.classes ) {
      var space = "";
      if( el.className.lenght > 0 ) {
        space = " ";
      }
      el.className = el.className + space + aField.classes;
    }
    
  },

  getForm: function(opt) {
    var el = document.createElement('form');
    return el;
  },

});
