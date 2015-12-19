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

    var label=this.getLabel();
    if(label!=null){
      el.appendChild(label);
    }

    if( typeof data_val != 'undefined' ) {
      this.value = data_val;
    }
    var widget=this.createWidget();
    this.widget=widget;

    widget.onchange=function( evt ) {
      self.onChange(evt);
    };

    widget.onfocus=function( evt ) {
      self.onFocus(evt);
    };

    el.appendChild(widget);
    return el;
  },

  isVisible(){
    return true;
  },
  getTextLabel(){
    if(this.aField.label)
      return this.aField.label;
    else{
      return (this.field);
    }

  },
  getLabel(){
    var bHideLabel = false;
    if( this.aParam.hide_label ) {
      if( this.aParam.hide_label === true ) {
        bHideLabel = true;
				var show_placeholder=true;
				if( this.aParam.hide_placeholder ===true){
					show_placeholder=false;
				}
				if(show_placeholder)
        	this.aField.placeholder = this.aField.label;
      }
    }
    if( !bHideLabel ) {
      return this.theme.getLabel(this.aField);
    }
    else{
        return null;
    }
  },

  onChange: function(event){
    console.log(event);
  } ,

  onFocus: function(event){
    console.log('focus');
  } ,
  getValue: function(){
    if(this.widget){
      return this.widget.value;
    }
    else{
      console.log("the widget it has not been created");
      return null;
    }
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
  },

  convert2html: function(val) {
    return val;
  }
});
