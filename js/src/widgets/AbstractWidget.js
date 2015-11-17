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

    this.value='';
  },
  
  createWidget: function( options ) {
    // var aField = options.aField;
    options.aField.value = this.getFieldValue(options);
    var el=this.theme.getInput(options.aField);
    return el;
  },
  
  createField: function( options ) {
    var self=this;

    options.aField.field = options.field;
    var el = this.theme.getFieldContainer(options.aField);
    
    var bHideLabel = false;
    if( this.aParam.hide_label ) {
      if( this.aParam.hide_label === true ) {
        bHideLabel = true;
        options.aField.placeholder = options.aField.label;
      }
    }
    
    if( !bHideLabel ) {
      el.appendChild(this.theme.getLabel(options.aField));
    }
    var widget=this.createWidget(options);
    

    widget.onchange=function( evt ) {
      self.onChange(evt);
    };

    el.appendChild(widget);
    return el;
  },

  onChange: function(event){    
    console.log(event);
    this.value=event.srcElement.value;
  } , 

  getValue: function(){
    return this.value;
  },

  getDefaultValue: function( options ) {
    return '';
  },
  
  getFieldValue: function( options ) {
    var v;
    if(options.value){
      v = options.value;
    }
    else if( options.aField.default ) {
      v = options.aField.default;
    }
    else{
      v = this.getDefaultValue();
    }
    this.value=v;
    return v;
  }
});
