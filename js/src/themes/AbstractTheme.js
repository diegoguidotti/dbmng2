/////////////////////////////////////////////////////////////////////
// AbstractTheme
// 12 November 2015
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
      el.placeholder = aField.label;
    }
    
    if( aField.type == 'int' || aField.type == 'bigint' || aField.type == 'float' || aField.type == 'double' ) {
      el.onkeypress = function( evt ) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode( key );
        var regex = /[0-9]|\./;
        if( !regex.test(key) ) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
      }
    }
    return el;
  },
  
  getPassword: function(aField) {
    var el=document.createElement('input');
    this.assignAttributes(el, aField);
    console.log(aField);
    el.type = "password";
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
  
  assignAttributes: function(el, aField) {
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
  },

  getForm: function(opt) {
    var el = document.createElement('form');
    return el;
  },

});
