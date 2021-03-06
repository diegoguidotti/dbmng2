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

    // to fix the bug if the select is an array of string
    // i.e.
    // input  : array ['foo', 'bar']
    // output : [{0:'foo'}, {1:'bar'}]
    if( typeof this.aField.voc_val !== "undefined" ){
      var aVoc = [];
      if( Object.prototype.toString.call(this.aField.voc_val) == '[object Array]' ) {
        if(Object.prototype.toString.call(this.aField.voc_val[0]) == '[object String]'){
          jQuery.each(this.aField.voc_val, function(k,v){
            var item = {};
            item[k]=v;
            aVoc.push(item);
          });
          this.aField.voc_val = aVoc;

        }
      }
      else if( Object.prototype.toString.call(this.aField.voc_val) == '[object Object]' ) {
        jQuery.each(this.aField.voc_val, function(k,v){
          var item = {};
          item[k]=v;
          aVoc.push(item);
        });
        this.aField.voc_val = aVoc;
      }
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
    var internalNode=el;
    if(internalNode.firstChild){
      internalNode=internalNode.firstChild;
    }
    if(internalNode.firstChild){
      internalNode=internalNode.firstChild;
    }

    var label=this.getLabel();


    if(label!==null){
      internalNode.appendChild(label);
    }

    if( typeof data_val != 'undefined' ) {
      this.value = data_val;
    }
    var widget_complex=this.createWidget();


    //a volte il widget è solo una parte del widget complex
    //se esiste un oggetto di classe real_widget usa questo come widget
    var widget=widget_complex;
    var get_val=jQuery(widget_complex).find(".real_widget");
     if(get_val.length>0){
         widget=(get_val[0]);
     }

    this.widget=widget;

    widget.onchange=function( evt ) {
      self.onChange(evt);
    };

    widget.onfocus=function( evt ) {
      self.onFocus(evt);
    };

    internalNode.appendChild(widget_complex);
    return el;
  },

  isVisible: function(){
    return true;
  },

  skipInTable: function() {
    return (this.aField.skip_in_tbl == 1 ? true : false);
  },

  getTextLabel: function(){
    if(this.aField.label)
      return this.aField.label;
    else{
      return (this.field);
    }

  },
  getLabel: function(){
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
    //console.log('onChange');
    this.isValid();

  } ,

  onFocus: function(event){
    //console.log('focus');
  } ,
  setValue: function(val){
    var ret=0;
    if(this.widget){
      this.widget.value=val;
      ret=1;
    }
    else{
      console.log("the widget it has not been created");
    }
    return ret;
  },
  getValue: function(){
    if(this.widget){

      var value=this.widget.value;
      return value;
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
    if(typeof this.value !== 'undefined'){
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
  },

  setErrorState: function(ok, message){

    //validate the fields and write the error messages if present
    this.theme.setErrorState(this, ok, message);


   

  },
  isValidCustom:function (){
    return {ok:true};
  },
  isValid:function (){
    var validated = false;
    var nullable = 0;

    if(typeof this.aField.nullable !== 'undefined'){
      nullable = parseInt(this.aField.nullable);
    }

    var ok=true;
    var message='';

    if( this.toValidate(nullable) ) { //( nullable === 0 && this.aField.field_type != 'hidden' && this.aField.key != 1 ) {
      validated = true;

      if( this.getValue()===null || this.getValue()==='' ) {
        console.log(this.aField);
        ok=false;
        message='Empty Field ['+this.aField.field+']';
      }
    }

    if(typeof this.aField.validator !== 'undefined'){
      validated = true;
      var regexp;
      var base_msg;
      if(typeof this.aField.validator=='object'){
        var exp = this.aField.validator.regexp;
        if( exp instanceof RegExp ) {
          regexp = exp;
        }
        else if( typeof exp == 'string' ) {
          if( exp.indexOf('/') === 0 ) {
            exp = exp.substr(1,exp.length);
          }
          if( exp.slice(-1) == '/' ) {
            exp = exp.substring(0,exp.length-1);
          }
          exp = new RegExp(exp, "");
        }
        regexp=exp; // eval(this.aField.validator.regexp);
        base_msg=this.aField.validator.message;
      }
      else if(this.aField.validator=='email'){
        regexp=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        base_msg="You need to enter a valid email";
      }
      else if(this.aField.validator=='url'){
        regexp=/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
        base_msg="You need to enter a valid URL";
      }
      else if(this.aField.validator=='ip'){
        regexp=/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
        base_msg="You need to enter a valid IP address";
      }
      var ok_r=regexp.test(this.getValue());
      if(!ok_r){
        ok=ok_r;
        message=base_msg;
      }
    }

    var valid_custom=this.isValidCustom();
    if(!valid_custom.ok){
      ok=!valid_custom.ok;
      message+=" "+valid_custom.message;
    }

    if( validated ) {
      this.setErrorState(ok,message);
    }

    return {'ok':ok, 'message':message};
  },

  toValidate: function( nullable ) {
    return (nullable === 0 && this.aField.field_type != 'hidden' && this.aField.key != 1 && (this.aField.skip_in_form === undefined));
  }
});
