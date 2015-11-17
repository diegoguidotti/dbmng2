
Dbmng.Form = Class.extend({
  //class constructor
  init: function( options ) {
    this.aForm  = options.aForm;
    this.aParam = options.aParam;
    
    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = new Dbmng.AbstractTheme();
    }
  },
  
  createForm: function() {
    var form = this.theme.getForm();

    for(var key in this.aForm.fields){
      var aField=this.aForm.fields[key];

      var wt = '';
      if(aField.widget){
        wt=aField.widget;
      }
      // console.log("Type "+wt);
      
      var widget_opt={theme:this.theme, aParam:this.aParam};
      var w;
      if( wt == 'select' ) {
        w = new Dbmng.SelectWidget(widget_opt);
      }
      else if( wt == 'password' ) {
        w = new Dbmng.PasswordWidget(widget_opt);
      }
      else if( wt == 'checkbox' ) {
        w = new Dbmng.CheckboxWidget(widget_opt);
      }
      else{
        w = new Dbmng.AbstractWidget(widget_opt);
      }
      
      var field=w.createField({field: key, aField:aField});
      form.appendChild(field);
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
