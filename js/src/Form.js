/////////////////////////////////////////////////////////////////////
// Form
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.Form = Class.extend({
  //class constructor
  init: function( options ) {
    this.aForm  = options.aForm;
    if(!options.aParam){
      options.aParam={};
    }
    this.aParam = jQuery.extend(true, {}, Dbmng.defaults.aParam,options.aParam);
    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = Dbmng.defaults.theme;
    }
    // var w1=new Dbmng.AbstractWidget({field:'id', aField:aForm.fields.id, value:obj.id, theme:theme_boot});
    // for(var key in this.aForm.fields){
    //   var aField=this.aForm.fields[key];
    //
    //   var wt = '';
    //   if(aField.widget){
    //     wt=aField.widget;
    //   }
    //
    //   if( wt == 'select' ) {
    //     var sortable = [];
    //     for (var voc in aField.voc_val) {
    //         sortable.push([voc, aField.voc_val[voc]]);
    //     }
    //
    //     sortable.sort(function(a, b) {
    //         return a[1] > b[1];
    //     });
    //     aField.voc_val = sortable;
    //   }
    // }
    //console.log(this.aForm.fields);
		this.createWidgets();

  },
  createWidgets: function(){
    this.widgets={};
    for(var key in this.aForm.fields){
      var aField=this.aForm.fields[key];

      var wt = '';
      if(aField.widget){
        wt=aField.widget;
      }

      var widget_opt={field:key, aField:aField, theme:this.theme, aParam:this.aParam};
      var w;
      if( typeof aField.external_widget == 'undefined' ){
        if( wt == 'select' ) {
          w = new Dbmng.SelectWidget(widget_opt);
        }
        else if( wt == 'radio' ) {
          w = new Dbmng.RadioWidget(widget_opt);
        }
        else if( wt == 'select_nm' ) {
          w = new Dbmng.SelectNMWidget(widget_opt);
        }
        else if( wt == 'password' ) {
          w = new Dbmng.PasswordWidget(widget_opt);
        }
        else if( wt == 'hidden' ) {
          w = new Dbmng.HiddenWidget(widget_opt);
        }
        else if( wt == 'checkbox' ) {
          w = new Dbmng.CheckboxWidget(widget_opt);
        }
        else if( wt == 'numeric' ) {
          w = new Dbmng.NumericWidget(widget_opt);
        }
        else if( wt == 'autocomplete' ) {
          w = new Dbmng.AutocompleteWidget(widget_opt);
        }
        else if( wt == 'date' ) {
          w = new Dbmng.DateWidget(widget_opt);
        }
        else if( wt == 'textarea' ) {
          w = new Dbmng.TextareaWidget(widget_opt);
        }
        else if( wt == 'file' ) {
          w = new Dbmng.FileWidget(widget_opt);
        }
        else{
          w = new Dbmng.AbstractWidget(widget_opt);
        }
      }
      else {
        if( typeof aField.external_widget == 'function' ){
          w= new aField.external_widget(widget_opt);
        }
      }
      /* missing widget
      datetime
time
html
picture
multiselect
geo
*/

      this.widgets[key]=w;
    }
	},
	getPkField: function(){
		if(this.aForm.primary_key){
			if(this.aForm.primary_key.length>1)
					throw "There are more primary keys field";
			else
				return this.aForm.primary_key[0];
		}
		else{
			throw "Missing primary key in aForm";
		}
	},
  getWidget: function(key) {
		return this.widgets[key];
	},
	getPkValue: function() {
		return this.widgets[this.getPkField()].getValue();
  },
  getValue: function() {
    var ret={};
    for(var key in this.aForm.fields){
      ret[key]=this.widgets[key].getValue();
    }
    return ret;
  },
  convert2html: function(aData) {
    var cData = [];
    for( var i= 0; i < aData.length; i++ ){
      var ret = {};
      for(var key in this.aForm.fields){
        if(this.widgets[key].isVisible() && !this.widgets[key].skipInTable()){
          ret[key]=this.widgets[key].convert2html(aData[i][key], aData[i]);
        }
//         if( !this.widgets[key].skipInTable() ){
//           ret[key]=this.widgets[key].convert2html(aData[i][key]);
//         }
      }
      cData.push(ret);
    }
    return cData;
  },
  getFields: function(aData) {
		var fields={};

    this.createWidgets();
    // console.log(aData);

    console.log(this.aForm.fields);
    for(var key in this.aForm.fields){
      //var aField=this.aForm.fields[key];

        var field;

        if(aData){
          field = this.widgets[key].createField(aData[key]);
        }
        else{
          field = this.widgets[key].createField();
        }

      if( this.aForm.fields[key].skip_in_form === undefined ){
        fields[key]=(field);
      }
      else if( ! this.aForm.fields[key].skip_in_form ){
        fields[key]=(field);
      }
    }
		return fields;
	},

  isValid: function(){
    var ok=true;
    var message='';
    for(var key in this.widgets){
      var wr=this.widgets[key].isValid();
      if(wr.ok===false){
        ok=false;
        message+="Field "+this.widgets[key].field+": "+wr.message+"<br/>";
      }
    }
    return {'ok':ok,'message':message};
  },

  createForm: function(aData, template) {
    console.log(aData);
    var fields=this.getFields(aData);
    var normal=true;
    var form;
    if(typeof template!=='undefined'){
      if(jQuery(template).length>0){
        form=jQuery(template);
        normal=false;
      }
    }

    if(normal){

      //get an empty form
      form = this.theme.getForm();

      //the form can be single or with a children; use the children if exists
      var appendTo=form;
      if(form.firstChild){
        appendTo=form.firstChild;
      }

  		for(var key in fields){
        appendTo.appendChild(fields[key]);
  		}
    }
    else{
      for(var key2 in fields){
        var el=form.find('[data-content='+key2+']');
        if(el.length===0){
          form.append(fields[key2]);
        }
        else{
          el.append(fields[key2]);
        }
  		}
    }
    return form;
  }
});


// function Dbmng( aObject ) {
//   //
//   // properties of the Dbmng object
//   //
//   this.aForm = aObject.aForm;
//   this.aParam = aObject.aParam;
//   this.div_element = aObject.div_element;
//
//   //
//   // methods of the Dbmng object
//   //
//
//   /**
//    * method: createForm
//    \brief this method create a html form starting from aForm & aParam
//    \return the html form
//    */
//   this.createForm = function() {
//     var obj = this;
//
//     var div_element = obj.div_element;
//     var aForm = obj.getForm();
//     var aParam = obj.getParam();
//
//     var html = "";
//     jQuery.each(aForm.fields, function(field_name, aField){
//       if( typeof aField.field_widget != 'undefined' ) {
//         console.log("create widget...");
//       }
//       else {
//         html += obj.layoutFormInput(field_name, aField);
//       }
//     });
//
//     return jQuery('#'+div_element).html(html);
//   };
//
//
//   /**
//    * method: layoutFormInput
//    \brief this method create a html with label and widget
//    \param field_name the field name
//    \param aField array containing field parameters
//    \return the html field
//    */
//   this.layoutFormInput = function(field_name, aField) {
//     var obj = this;
//     var table_name = this.getTableName();
//
//     var type = "text";
//     var more = "";
//     if( aField.type=='int' || aField.type=='double' ) {
//       more = "onkeypress='dbmng_validate_numeric(event)'";
//       type = "number";
//     }
//
//     var html = "";
//     html += "<div class='dbmng_form_row'>\n";
//       html += "<div class='dbmng_label_for'>\n";
//       html += obj.layoutGetLabel(field_name, aField);
//       html += "</div>\n";
//       html += "<input class='dbmng_form_field_"+field_name+"' type='"+type+"' name='"+field_name+"' id='dbmng_"+table_name+"_"+field_name+"' "+more+" value='' " + obj.layoutGetNullable(aField) + " />\n";
//     html += "</div>\n";
//
//     return html;
//   };
//
//
//   /**
//    * method: layoutGetLabel
//    \brief this method create a html with label
//    \param field_name the field name
//    \param aField array containing field parameters
//    \return the html label of the field
//    */
//   this.layoutGetLabel = function(field_name, aField) {
//     var table_name = this.getTableName();
//     var label = aField.label;
//
//     if( typeof aField.label_long != 'undefined' )
//       label = aField.label_long;
//
//     var sRequired = "";
//     if(typeof aField.nullable != 'undefined' && aField.nullable === 0 )
//       sRequired = "<span class='dbmng_required'>*</span>";
//
//     return "<label for='dbmng_"+table_name+"_"+field_name+"'>" + (label) + sRequired + "</label>\n";
//   };
//
//
//   /**
//    * method: layoutGetNullable
//    \brief this method determine if the field is required
//    \param aField array containing field parameters
//    \return the html attribute to identify the field required
//    */
//   this.layoutGetNullable = function(aField) {
//     var ht = "";
//     if( typeof aField.nullable != 'undefined' && aField.nullable === 0 )
//       ht += "required ='required' ";
//
//     return ht;
//   };
//
//
//   /**
//    * method: getParam
//     \brief this method get the aParam from the object
//     \return the aParam array
//    */
//   this.getParam = function() {
//     return this.aParam;
//   };
//
//
//   /**
//    * method: getForm
//     \brief this method get the aForm from the object
//    \return the aForm array
//    */
//   this.getForm = function() {
//     return this.aForm;
//   };
//
//   /**
//    * method: getTableName
//     \brief this method get the table name from the aForm array
//     \return the table name
//    */
//   this.getTableName = function() {
//     return this.aForm.table_name;
//   };
//
// }
