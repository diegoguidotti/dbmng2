/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
// 
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AbstractWidget = Class.extend({
  //class constructor
  init: function( options ){
    if( !options ) {
      options={};
    }
    
    if( options.field ) {
      this.field = options.field;
    }
    if( options.aField ) {
      this.aField = options.aField;
    }
    
    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = new Dbmng.AbstractTheme();
    }
    if( options.aParam ) {
      this.aParam = options.aParam;
    }
    else {
      this.aParam = {};
    }
    this.widget=null;
    
  },
  
  createWidget: function() {
    this.aField.value = this.getFieldValue();
    var el=this.theme.getInput(this.aField);
    return el;
  },
  
  createField: function(data_val) {
    var self=this;

    this.aField.field = this.field;
    var el = this.theme.getFieldContainer(this.aField);
    
    var bHideLabel = false;
    if( this.aParam.hide_label ) {
      if( this.aParam.hide_label === true ) {
        bHideLabel = true;
        this.aField.placeholder = this.aField.label;
      }
    }
    
    if( !bHideLabel ) {
      el.appendChild(this.theme.getLabel(this.aField));
    }
    if( typeof data_val != 'undefined' ) {
      this.value = data_val;
    }
    var widget=this.createWidget();
    this.widget=widget;

    widget.onchange=function( evt ) {
      self.onChange(evt);
    };

    el.appendChild(widget);
    return el;
  },

  onChange: function(event){    
    console.log(event);    
  } , 

  getValue: function(){
    return this.widget.value;
  },

  getDefaultValue: function( options ) {
    return '';
  },
  
  getFieldValue: function() {
    var v;
    if(this.value){
      v = this.value;
    }
    else if( this.aField.default ) {
      v = this.aField.default;
    }
    else{
      v = this.getDefaultValue();
    }    
    return v;
  }
});
