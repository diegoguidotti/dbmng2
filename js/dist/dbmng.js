if(typeof window.console == 'undefined') { window.console = {log: function (msg) {msg="";} }; }

function exeExternalFunction (fnstring, params) {
  var fn = window[fnstring];
  if( typeof fn == 'function' ) {
    if( typeof params == 'undefined' ) {
      return fn();
    }
    else {
      return fn.apply(null, params);
    }
  }
  else{
      console.log('Function does not exists');
      return false;
  }
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(suffix) {
		  return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}


/*! DBMNG v0.0.1 
 * Date: 2015-11-02
 */

/**
 * See README.md for requirements and usage info
 */

(function() { 

/*jshint loopfunc: true */
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
var Class;
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){window.postMessage("xyz");}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
  
  return Class;
})();

 


/////////////////////////////////////////////////////////////////////////////
// Dbmng
// ====================
/// Dbmng object.
/**
\param aObject array that holds the aForm and aParam array and other attributes
\return html
*/
var Dbmng = function() {

};

Dbmng.defaults = {};

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

/////////////////////////////////////////////////////////////////////
// Table
// 28 October 2019
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.Table = Class.extend({
  //class constructor
  init: function( options ) {
    var self=this;

    this.prepare_cdata = options.prepare_cdata;

    if(!options.aParam){
      options.aParam={};
    }
    this.aParam = options.aParam;

    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = Dbmng.defaults.theme;
    }
    console.log(Dbmng.defaults.aParam);

    if(options.aForm){
			this.aForm  = options.aForm;
		  this.form=new Dbmng.Form({aForm:this.aForm, aParam:this.aParam, theme:this.theme});
		  this.pk=this.form.getPkField();

      if( typeof options.success=='function'){
        options.success(this);
      }
		}
  },

  generateTable: function(opt, data){

    //Prende il DIV
    var div_id = opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }
    var self=this;

    console.log(self);
    //prepara i dati
    if( data.ok ) {
      var aData=data.data;
      var header=[];
      for(var key in self.aForm.fields){
        var widget=self.form.getWidget(key);
        if( widget.isVisible() && !widget.skipInTable()){
          header.push(widget.getTextLabel());
        }
      }

      if( this.hasFunctions() ) {
        header.push("Func.");
      }

      var cData = self.form.convert2html(aData);
      console.log(aData,cData);
      if(typeof self.prepare_cdata=='function'){
        var pData = [];

        jQuery.each(aData, function(k,v){
          pData.push([v,cData[k]]);
        });

        // console.log(pData);

        var pcData = self.prepare_cdata(pData);

        if( pcData !== null ) {
          var aRData = [];
          var aCData = [];
          jQuery.each(pcData, function(k,v) {
            aRData.push(v[0]);
            aCData.push(v[1]);
          });
          aData = aRData;
          cData = aCData;
        }
      }

      var html=self.theme.getTable({data:cData, rawData:aData, header:header, aParam:self.aParam, options:{
        assignClass:true,
        setIDRow:function(aData){
          return "dbmng_row_id_"+aData[self.pk];
        },
        addColumn:function(opt){
          if( self.hasFunctions() ) {
            var cell=self.theme.getTableCell();



            if( self.aParam.custom_function ) {

              var aCF = self.aParam.custom_function;
              if( ! jQuery.isArray(self.aParam.custom_function) ) {
                aCF = [self.aParam.custom_function];
              }

              aCF = aCF.sort(function(a,b){
                  if(a.order < b.order) return -1;
                  if(a.order > b.order) return 1;
                  return 0;
              });
              
              jQuery.each(aCF, function(k,v) {
                var label_custom = v.label;
                var opt_custom = v;
                var button_custom=(self.theme.getButton(label_custom,opt_custom));

                if(typeof v.isAllowed=='function'){
                  if(! v.isAllowed(opt.rawData)){
                    button_custom.disabled=true;
                  }
                }
                // if(!self.isAllowed(opt.rawData,v.action)){
                // }

                if( v.action ) {
                  if( typeof v.action == 'string' ||  typeof v.action == 'function' ) {
                      button_custom.addEventListener("click",function(){
                        if(typeof v.action == 'string'){
                          var fnstring = v.action;
                          var fnparams = [opt.rawData[self.pk],opt.rawData, opt.data, aData];
                          exeExternalFunction(fnstring, fnparams);
                        }
                        else{
                          v.action(opt.rawData[self.pk],opt.rawData, opt.data, aData);
                        }
                      });
                    jQuery(cell).append(button_custom);
                  }
                }
              });
            }

            return cell;
          }
          else {
            return null;
          }
        }
      }});
      jQuery(div_id).html(html);
      //Ho generato la tabella





      //
    }
    else {
      jQuery(div_id).html(self.theme.alertMessage(data.message));
    }
  },

  hasFunctions: function() {
    var ret = false;

    // if( this.aParam.user_function && this.aParam.user_function.upd && this.aParam.user_function.upd == 1 )
    //   ret = true;
    //
    // if( this.aParam.user_function && this.aParam.user_function.inline && this.aParam.user_function.inline == 1 )
    //   ret = true;
    //
    // if( this.aParam.user_function && this.aParam.user_function.del && this.aParam.user_function.del == 1 )
    //   ret = true;
    //
    // if( this.aParam.user_function && this.aParam.user_function.ins && this.aParam.user_function.ins == 1 )
    //   ret = true;

    if( this.aParam.custom_function ){
      ret = true;
    }

    return ret;
  },

  // isAllowed: function (data, method){
  //   if(this.aParam.user_function && typeof this.aParam.user_function.custom_user_function=='function'){
  //     return this.aParam.user_function.custom_user_function(data, method);
  //   }
  //   else{
  //     return true;
  //   }
  // },
});

/////////////////////////////////////////////////////////////////////
// FormInline
// 12 Dicember 2015
//
// Create an Inline form to edit multiple record on the same table
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.FormInline = Class.extend({
  //class constructor
  init: function( options ) {
    this.aForm  = options.aForm;
    if(! options.aParam ) {
	    options.aParam={};
		}
    this.aParam = jQuery.extend(true, {}, Dbmng.defaults.aParam, options.aParam);

    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = Dbmng.defaults.theme;
    }
		if(options.onChange){
			this.onChange=options.onChange;
		}
    if(options.onChangeRow){
			this.onChangeRow=options.onChangeRow;
		}
    if(options.addEachRow){
			this.addEachRow=options.addEachRow;
		}
  },
	getTransaction: function() {
		var val=[];



		for(var i=0; i<this.forms.length; i++){
			var k=this.forms[i].getPkValue();
			var t={"mode":"update", "key":k, "body":this.forms[i].getValue()};
			val.push(t);
		}
		return val;
	},
	getValue: function() {
		var val=[];
		for(var i=0; i<this.forms.length; i++){
			val.push(this.forms[i].getValue());
		}
		return val;
	},
  isValid: function(){
    var self=this;
    var val=true;
    var messages=[];
    for(var i=0; i<this.forms.length; i++){
      var v=this.forms[i].isValid();
        if(!v.ok){
          val=false;
          messages.push({"message": v.message, "record": i});
        }
    }
    return {"ok": val, "messages": messages};
  },
	createForm: function(aData) {
    var self=this;

    var div = document.createElement('div');
    self.main_node=div;

		//create an empty table
		var tab=this.theme.getTable({data:[],header:[], aParam:this.aParam});

		this.forms=[];

    var form_base=new Dbmng.Form({"aForm":this.aForm, "aParam":this.aParam, "theme":this.theme});
		//create the headers
		for(var keyf in this.aForm.fields){
      var widget=form_base.getWidget(keyf);
      if(widget.isVisible()){
  			var field=this.aForm.fields[keyf];
  			jQuery(tab).find('thead tr').append(this.theme.getTableHCell({"content":field.label}));
      }
		}

    jQuery.each(aData, function(i,val){
		//for(var i=0; i<.length; i++){

      var current_record=i;
			var form=new Dbmng.Form({"aForm":self.aForm, "aParam":self.aParam, "theme":self.theme});
			self.forms.push(form);
			var fields=form.getFields(aData[i]);

			var r=jQuery("<tr></tr>").appendTo(jQuery(tab).find('tbody'));

				for(var key in fields){
          var wdg=form.getWidget(key);
          if(wdg.isVisible()){
  					var c=jQuery('<td></td>').appendTo(r);
  					c.append(fields[key]);
          }
          else{
            var ff=jQuery(fields[key]).hide()[0];
            r.append(ff);
          }
					wdg.pk_value=form.getPkValue();
          wdg.form=form;
					if(self.onChange){
						wdg.onChange=self.onChange;
					}
					else{
					}

          if(self.onChangeRow){
						wdg.onFocus=self.onChangeRow;
          }

				}

        if(self.aParam.do_delete){
          var col=jQuery('<td></td>').appendTo(r);
          var del_label='Del';
          if (self.aParam.del_label) {
            del_label=self.aParam.del_label;
          }
          // debugger
          var button_delete=jQuery('<button data-record="'+current_record+'">'+del_label+'</button>')[0];
          col[0].appendChild(button_delete);

          jQuery(button_delete).click(function(){
            var records=self.getValue();
            var record=jQuery(this).attr('data-record');
            records.splice(record,1);
            //self.main_node.removeChild(self.main_node.childNodes[0]);
            self.main_node.innerHTML = '';
            self.main_node.appendChild(self.createForm(records));
          });

          // button_delete.addEventListener("click",function(){
          //   console.log(aData[current_record]);
          //   // records=self.getValue();
          //   // records.push({});
          //   // console.log(records);
          //   // //self.main_node.removeChild(self.main_node.childNodes[0]);
          //   // self.main_node.innerHTML = '';
          //   // self.main_node.appendChild(self.createForm(records));
          // });

        }

        if(this.addEachRow){
          this.addEachRow(r,aData[i]);
        }
  });
    div.appendChild(tab);
    if(self.aParam.do_insert===true){
      var button = self.theme.getButton("Insert",{'class':'insert_button'});
      div.appendChild(button);

      button.addEventListener("click",function(){
        var records=self.getValue();
        records.push({});
        //self.main_node.removeChild(self.main_node.childNodes[0]);
        self.main_node.innerHTML = '';
        self.main_node.appendChild(self.createForm(records));
      });
    }


		//console.log(this.forms);
		return div;
	}
});

/////////////////////////////////////////////////////////////////////
// Api The class manage the http call to the DBMNG web services
// 21 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.Api = Class.extend({
  //class constructor
  init: function( options ) {
		this.url=options.url;
		this.user=options.user;
		this.password=options.password;
    this.search=options.search;

    if( this.url.slice(-1) != '/' ) this.url = this.url + '/';
  },
	getHeaders: function(){
		return {
				"Authorization": "Basic " + btoa(this.user + ":" + this.password)
			};
	},
  select: function(options) {
    var url_select= this.url;
    if(options.search){
      url_select+="?"+ options.search;
    }
		jQuery.ajax({
			url: url_select,
			dataType:'json',
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
    //var ret={};
    //return ret;
  },
  transaction: function(options) {
		jQuery.ajax({
			url: this.url+"transaction",
			dataType:'json',
			method:'POST',
			data: JSON.stringify(options.data),
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
  },
  insert: function(options) {
		jQuery.ajax({
			url: this.url,
			dataType:'json',
			method:'POST',
			data: JSON.stringify(options.data),
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
  },
  update: function(options) {
    console.log(options.data);
    console.log(this.url+options.key);
		jQuery.ajax({
			url: this.url+options.key,
			dataType:'json',
			method:'POST',
			data: JSON.stringify(options.data),
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});

  },
  delete: function(options) {
		jQuery.ajax({
			url: this.url+options.key,
			dataType:'json',
			method:'DELETE',
			headers: this.getHeaders(),
			success: function(data){
				if(typeof options.success=='function'){
					options.success(data);
				}
				else{
					console.log(data);
				}
			},
			error: function(exc){
				if(typeof options.error=='function'){
					options.error(exc);
				}
				console.log(exc);
			}
		});
  }

});

/////////////////////////////////////////////////////////////////////
// CRUD The class manage all the CRUD functions
// 2 December 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.Crud = Class.extend({
  //class constructor
  init: function( options ) {
    var self=this;

		//the ready variable can be used to check if it is ready the Crud to create the table)
    this.ready=true;
    this.crud_success = options.crud_success;
    this.form_ready = options.form_ready;
    this.table_ready = options.table_ready;
    this.table_success = options.table_success;
    this.prepare_cdata = options.prepare_cdata;
    this.form_validation = options.form_validation;

    // function/method used to personalize the error message to the user
    this.crud_delete = options.crud_delete;
    this.crud_insert = options.crud_insert;
    this.crud_update = options.crud_update;

    if(!options.aParam){
      options.aParam={};
    }

    console.log(Dbmng.defaults.aParam);
    console.log(options.aParam);

    this.aParam = jQuery.extend(true, {}, Dbmng.defaults.aParam, options.aParam);
    console.log(this.aParam);


    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = Dbmng.defaults.theme;
    }

    if( options.url ) {
      this.url = options.url;
    }
    else {
      this.url='?';
    }
    if( this.url.slice(-1) != '/' ) this.url = this.url + '/';

    this.aParam.url=this.url;

    var api_opt={url:self.url, user:options.user, password:options.password};
    if(typeof this.offline!=='undefined'){
      api_opt.offline=this.offline;
    }
    self.api = new Dbmng.Api(api_opt);

    if(options.aForm){
			this.aForm  = options.aForm;
		  this.form=new Dbmng.Form({aForm:this.aForm, aParam:this.aParam, theme:this.theme});
		  this.pk=this.form.getPkField();

      if( typeof options.success=='function'){
        options.success(this);
      }
		}
		else{
			//there are no aForm; call the api to get the aForm
			this.ready=false;

      var heads={};
      if(options.user){
        heads={
          "Authorization": "Basic " + btoa(options.user + ":" + options.password)
        };
      }

      var search="?";
      if(this.aParam.search){
        jQuery.each(this.aParam.search,function(k,v){
            search+='&'+k+"="+v;
        });
      }

      jQuery.ajax({
				url: this.url+"schema"+search,
				dataType:'json',
				headers: heads,
				success: function(data){

					self.aForm  = data;
					self.ready=true;
					console.log("aForm loaded");
					console.log(this.aForm);

					self.form=new Dbmng.Form({aForm:self.aForm, aParam:self.aParam, theme:self.theme});

					self.pk=self.form.getPkField();

					if(typeof options.success=='function'){
						console.log("call success");
						options.success(self);
					}
					else{
						console.log(this.aForm);
					}
				},
				error: function(exc){
					if(typeof options.error=='function'){
						options.error(exc);
					}
          else {
            window.alert("API ["+this.url+"schema"+search+"] not found");
          }
					console.log(exc);
          console.log(options);

				}
			});

		}
  },
  hasFunctions: function() {
    var ret = false;

    if( this.aParam.user_function.upd && this.aParam.user_function.upd == 1 )
      ret = true;

    if( this.aParam.user_function.inline && this.aParam.user_function.inline == 1 )
      ret = true;

    if( this.aParam.user_function.del && this.aParam.user_function.del == 1 )
      ret = true;

    if( this.aParam.user_function.ins && this.aParam.user_function.ins == 1 )
      ret = true;

    if( this.aParam.custom_function )
      ret = true;

    return ret;
  },
  createTable: function( opt ){

    var div_id=opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }

		if(this.ready){
		  var self=this;

      var sel_opt={
		    success:function(data){
          console.log(data);
          self.generateTable(opt, data);
		    },
		    error: function(error) {
					try{
				    var objError = JSON.parse(error.responseText);
				    jQuery(div_id).html(self.theme.alertMessage(objError.message));
					}
					catch(e){
						if(error.statusText){
							jQuery(div_id).html(self.theme.alertMessage(error.statusText));
						}
						else{
					    jQuery(div_id).html(self.theme.alertMessage(e+" "+error.responseText));
						}
					}
		    }
		  };

      //if exists a filter create the search text to be added to the GET call
      if(this.aParam.search){
        var search="";
        jQuery.each(this.aParam.search,function(k,v){
            search+='&'+k+"="+v;
        });
        sel_opt.search=search;
      }

      console.log(sel_opt);
		  this.api.select(sel_opt);
		}
		else{
			console.log('Table not ready (need to load the a Form)');

		}
  },
  generateTable: function(opt, data){
    var div_id = opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }

    var self=this;

    //verifico se ho delle custom_function chiamate da fuori
    var custom_function=[];
    if( self.aParam.custom_function ) {
      //se esiste e non è un aray ma un oggetto creo un arrai con l'oggetto
      if( !Array.isArray(self.aParam.custom_function) ){
        custom_function =self.aParam.custom_function;

        // aggiungo la proprietà order = 10
        if( ! custom_function.order )
          custom_function.order = 10;

        self.aParam.custom_function=[];
        self.aParam.custom_function.push(custom_function);
      }
      else {
        // nel caso di più custom_function assegno un order a multipli di 10
        jQuery.each(self.aParam.custom_function, function(k,v){
          if( ! v.order ) {
            v.order = (k+1)*10;
          }
        });
      }
    }
    else { //se non esiste si crea
      self.aParam.custom_function=[];
    }

    if( self.aParam.user_function && self.aParam.user_function.upd && ! self.aParam.user_function.added_upd ) {

      var update_function = self.aParam.ui.btn_edit;

      update_function.action = function(primary_key, rawData, cData, aData){
        self.createForm(div_id, primary_key, aData);
      };

      update_function.isAllowed = function(rawData){
        return self.isAllowed(rawData,'update');
      };

      // l'edit ha sempre ordine 1 (il primo bottone che viene mostrato per ogni riga)
      update_function.order = 1;

      self.aParam.custom_function.push(update_function);
      self.aParam.user_function.added_upd=true;
    }

    if( self.aParam.user_function && self.aParam.user_function.inline && ! self.aParam.user_function.added_inline ) {

      var inline_function = self.aParam.ui.btn_edit_inline;

      inline_function.action = function(primary_key, rawData, cData, aData){
        self.createFormInline(div_id, primary_key, aData, true);
      };

      inline_function.isAllowed = function(rawData){
        return self.isAllowed(rawData,'update');
      };

      // l'edit inline ha sempre ordine 2
      inline_function.order = 2;

      self.aParam.custom_function.push(inline_function);
      self.aParam.user_function.added_inline=true;
    }



    if( self.aParam.user_function && self.aParam.user_function.del && ! self.aParam.user_function.added_delete ) {

      var delete_function = self.aParam.ui.btn_delete;

      delete_function.action = function(primary_key, rawData, cData, aData){
        var confirm_message = "Are you sure?";
        if( self.aParam.ui.btn_delete.confirm_message ) {
          confirm_message = self.aParam.ui.btn_delete.confirm_message;
        }
        if( window.confirm(confirm_message) ) {
          self.deleteRecord(div_id, primary_key);
        }
      };

      delete_function.isAllowed = function(rawData){
        return self.isAllowed(rawData,'delete');
      };

      // l'eliminazione di un record ha sempre ordine 100 (ultimo bottone)
      delete_function.order = 100;

      self.aParam.custom_function.push(delete_function);
      self.aParam.user_function.added_delete=true;
    }




    var table = new Dbmng.Table({
      theme:self.theme,
      aForm: self.aForm,
      aParam: self.aParam,
      prepare_cdata: self.prepare_cdata
      // ,table_ready: self.table_ready,
      // table_success: self.table_success,
      // createForm: self.createForm,
      // createFormInline: self.createFormInline,
      // deleteRecord: self.deleteRecord,
      // createInsertForm: self.createInsertForm,
    });

    table.generateTable(opt, data);

    var aData = data.data;
    //Dopo aver generato la tabella aggiungo le funzioni di hook e il pulsante di inserisci
    if( typeof self.table_success == 'function' ){
      self.table_success(aData);
    }

    //TODO: verificare che fa l'inserimento in mnaiera corretta
    if( self.aParam.user_function && self.aParam.user_function.ins ) {
      var label_insert=self.aParam.ui.btn_insert.label;
      var opt_insert=self.aParam.ui.btn_insert;

      var button_insert=jQuery(self.theme.getButton(label_insert,opt_insert));
      button_insert.click(function(){
        self.createInsertForm(div_id);
      });

      var btns_l = "<div id='dbmng_buttons_row' class='row' style='margin-top: 20px;margin-bottom: 100px;'><div class='dbmng_form_button_message col-md-12'></div><div id='dbmng_button_left' class='dbmng_form_button_left col-md-4 col-xs-12 '></div><div id='dbmng_button_center' class='col-md-4 col-xs-12 '></div><div id='dbmng_button_right' class='dbmng_form_button_right col-md-4 col-xs-12 '></div></div>";
      var btns_f = "<div id='dbmng_buttons_row' class='row' style='margin-top: 0px;margin-bottom: 0px;'><div class='dbmng_form_button_message col-md-12'></div>   <div id='dbmng_button_left' class='dbmng_form_button_left col-md-4 col-xs-12 '></div><div id='dbmng_button_center' class='col-md-4 col-xs-12 '></div><div id='dbmng_button_right' class='dbmng_form_button_right col-md-4 col-xs-12 '></div></div>";
      var position = 'last';
      if( self.aParam.ui.btn_insert.position ) {
        position = self.aParam.ui.btn_insert.position;
      }

      if( position == 'first' ) {
        jQuery(div_id).prepend(btns_f);
      }
      else if ( position == 'both' ) {
        jQuery(div_id).append(btns_l);
        jQuery(div_id).prepend(btns_f);
      }
      else {
        jQuery(div_id).append(btns_l);
      }
      jQuery(div_id).find('.dbmng_form_button_left').append(button_insert);
    }

    if(typeof self.table_ready=='function'){
      self.table_ready(self.form);
    }



  //   var div_id=opt.div_id;
  //   if( div_id.substring(0, 1) != '#') {
  //     div_id = '#' + div_id;
  //   }
  //   var self=this;
  //
  //   //console.log(data);
  //   if( data.ok ) {
  //     var aData=data.data;
  //     var header=[];
  //     for(var key in self.aForm.fields){
  //       var widget=self.form.getWidget(key);
  //       if( widget.isVisible() && !widget.skipInTable()){
  //         header.push(widget.getTextLabel());
  //       }
  //     }
  //     // header.push("Calc.");
  //     if( this.hasFunctions() ) {
  //       header.push("Func.");
  //     }
  //
  //     var cData = self.form.convert2html(aData);
  //     console.log(aData,cData);
  //     if(typeof self.prepare_cdata=='function'){
  //       var pData = [];
  //
  //       jQuery.each(aData, function(k,v){
  //         pData.push([v,cData[k]]);
  //       });
  //
  //       // console.log(pData);
  //
  //       var pcData = self.prepare_cdata(pData);
  //
  //       if( pcData !== null ) {
  //         var aRData = [];
  //         var aCData = [];
  //         jQuery.each(pcData, function(k,v) {
  //           aRData.push(v[0]);
  //           aCData.push(v[1]);
  //         });
  //         aData = aRData;
  //         cData = aCData;
  //       }
  //     }
  //
  //     console.log(cData);
  //     var html=self.theme.getTable({data:cData, rawData:aData, header:header, aParam:self.aParam, options:{
  //       assignClass:true,
  //       setIDRow:function(aData){
  //         return "dbmng_row_id_"+aData[self.pk];
  //       },
  //       addColumn:function(opt){
  //         if( self.hasFunctions() ) {
  //           var cell=self.theme.getTableCell();
  //
  //           if( self.aParam.user_function.upd  ) {
  //             var label_edit=self.aParam.ui.btn_edit.label;
  //             var opt_edit=self.aParam.ui.btn_edit;
  //
  //             var button_edit=(self.theme.getButton(label_edit,opt_edit));
  //             if(!self.isAllowed(opt.rawData,'update')){
  //               button_edit.disabled=true;
  //             }
  //
  //             button_edit.addEventListener("click",function(){
  //               self.createForm(div_id, opt.rawData[self.pk], aData);
  //               // MM aggiungere funzione per history
  //             });
  //             jQuery(cell).append(button_edit);
  //           }
  //
  //           if( self.aParam.user_function.inline ) {
  //             var label_editi=self.aParam.ui.btn_edit_inline.label;
  //             var opt_editi=self.aParam.ui.btn_edit_inline;
  //             var button_editi=self.theme.getButton(label_editi,opt_editi);
  //             if(!self.isAllowed(opt.rawData,'update')){
  //               button_editi.disabled=true;
  //             }
  //             button_editi.addEventListener("click",function(){
  //               self.createFormInline(div_id, opt.rawData[self.pk], aData, true);
  //               // MM aggiungere funzione per history
  //             });
  //             jQuery(cell).append(button_editi);
  //           }
  //
  //           if( self.aParam.user_function.del ) {
  //             var label_delete=self.aParam.ui.btn_delete.label;
  //             var opt_delete=self.aParam.ui.btn_delete;
  //
  //             var button_delete=(self.theme.getButton(label_delete,opt_delete));
  //             if(!self.isAllowed(opt.rawData,'delete')){
  //               button_delete.disabled=true;
  //             }
  //             button_delete.addEventListener("click",function(){
  //               var confirm_message = "Are you sure?";
  //               if( self.aParam.ui.btn_delete.confirm_message ) {
  //                 confirm_message = self.aParam.ui.btn_delete.confirm_message;
  //               }
  //               if( window.confirm(confirm_message) ) {
  //                 self.deleteRecord(div_id, opt.rawData[self.pk]);
  //               }
  //               // MM aggiungere funzione per history
  //
  //             });
  //             jQuery(cell).append(button_delete);
  //           }
  //
  //           if( self.aParam.custom_function ) {
  //
  //             var aCF = self.aParam.custom_function;
  //             if( ! jQuery.isArray(self.aParam.custom_function) ) {
  //               aCF = [self.aParam.custom_function];
  //             }
  //
  //             jQuery.each(aCF, function(k,v) {
  //               var label_custom = v.label;
  //               var opt_custom = v;
  //               //console.log(opt_custom);
  //               var button_custom=(self.theme.getButton(label_custom,opt_custom));
  //               if(!self.isAllowed(opt.rawData,v.action)){
  //                 button_custom.disabled=true;
  //               }
  //
  //               if( v.action ) {
  //                 if( typeof v.action == 'string' ) {
  //                   button_custom.addEventListener("click",function(){
  //                     var fnstring = v.action;
  //                     var fnparams = [opt.rawData[self.pk],opt.rawData, opt.data];
  //
  //                     exeExternalFunction(fnstring, fnparams);
  //                     // MM aggiungere funzione per history
  //                   });
  //                   jQuery(cell).append(button_custom);
  //                 }
  //               }
  //             });
  // //             var label_custom = self.aParam.custom_function.label;
  // //             var opt_custom = self.aParam.custom_function;
  // //             //console.log(opt_custom);
  // //             var button_custom=(self.theme.getButton(label_custom,opt_custom));
  // //             if(!self.isAllowed(opt.rawData,self.aParam.custom_function.action)){
  // //               button_custom.disabled=true;
  // //             }
  // //
  // //             if( self.aParam.custom_function.action ) {
  // //               if( typeof self.aParam.custom_function.action == 'string' ) {
  // //                 button_custom.addEventListener("click",function(){
  // //                   var fnstring = self.aParam.custom_function.action;
  // //                   var fnparams = [opt.rawData[self.pk],opt.rawData];
  // //
  // //                   exeExternalFunction(fnstring, fnparams);
  // //                 });
  // //                 jQuery(cell).append(button_custom);
  // //               }
  // //             }
  //           }
  //
  //           return cell;
  //         }
  //         else {
  //           return null;
  //         }
  //       }
  //     }});
  //     jQuery(div_id).html(html);
  //     if( typeof self.table_success == 'function' ){
  //       self.table_success(aData);
  //     }
  //
  //     if( self.aParam.user_function.ins ) {
  //       var label_insert=self.aParam.ui.btn_insert.label;
  //       var opt_insert=self.aParam.ui.btn_insert;
  //
  //       var button_insert=jQuery(self.theme.getButton(label_insert,opt_insert));
  //       button_insert.click(function(){
  //         self.createInsertForm(div_id);
  //         // MM aggiungere funzione per history
  //       });
  //
  //       var btns_l = "<div id='dbmng_buttons_row' class='row' style='margin-top: 20px;margin-bottom: 100px;'><div class='dbmng_form_button_message col-md-12'></div><div id='dbmng_button_left' class='dbmng_form_button_left col-md-4 col-xs-12 '></div><div id='dbmng_button_center' class='col-md-4 col-xs-12 '></div><div id='dbmng_button_right' class='dbmng_form_button_right col-md-4 col-xs-12 '></div></div>";
  //       var btns_f = "<div id='dbmng_buttons_row' class='row' style='margin-top: 0px;margin-bottom: 0px;'><div class='dbmng_form_button_message col-md-12'></div>   <div id='dbmng_button_left' class='dbmng_form_button_left col-md-4 col-xs-12 '></div><div id='dbmng_button_center' class='col-md-4 col-xs-12 '></div><div id='dbmng_button_right' class='dbmng_form_button_right col-md-4 col-xs-12 '></div></div>";
  //       var position = 'last';
  //       if( self.aParam.ui.btn_insert.position ) {
  //         position = self.aParam.ui.btn_insert.position;
  //       }
  //
  //       if( position == 'first' ) {
  //         jQuery(div_id).prepend(btns_f);
  //       }
  //       else if ( position == 'both' ) {
  //         jQuery(div_id).append(btns_l);
  //         jQuery(div_id).prepend(btns_f);
  //       }
  //       else {
  //         jQuery(div_id).append(btns_l);
  //       }
  //       jQuery(div_id).find('.dbmng_form_button_left').append(button_insert);
  //
  //       // jQuery(div_id).append(button_insert);
  //     }
  //
  //     if(typeof self.table_ready=='function'){
  //       self.table_ready(self.form);
  //     }
  //   }
  //   else {
  //     jQuery(div_id).html(self.theme.alertMessage(data.message));
  //   }
  },
  isAllowed: function (data, method){

    if(typeof this.aParam.user_function.custom_user_function=='function'){
      return this.aParam.user_function.custom_user_function(data, method);
    }
    else{
      return true;
    }
  },
  deleteRecord: function (div_id, key){
    var self=this;
    this.api.delete({
      key:key,
      success:function(data){
        console.log(data);
        if( data.ok ) {
          if(typeof self.crud_success=='function'){
            self.crud_success('delete', data);
          }
          self.createTable({div_id:div_id});
        }
        else {
          if(typeof self.crud_delete=='function'){
            self.crud_delete('delete', data);
          }
          else {
            var msg=self.theme.alertMessage(data.message);
            jQuery(div_id).find(".dbmng_form_button_message").html(msg);
            window.scrollTo(0,document.body.scrollHeight);
          }
        }
      },
      error: function(){
        var msg=self.theme.alertMessage('Connection error');
        jQuery(div_id).find(".dbmng_form_button_message").html(msg);
      }
    });
  },
  createInsertForm: function (div_id){

    return this.createForm(div_id);
    /*
    var self = this;
    var aRecord = {};

    if(this.aParam.filter){
      jQuery.each(this.aParam.filter,function(k,v){
        aRecord[k] = v;
      });
    }

    jQuery(div_id).html(self.form.createForm(aRecord, self.aParam.template_form));

    if(typeof self.form_ready=='function'){
      self.form_ready('insert', this.form);
    }

    var label_save=self.aParam.ui.btn_save.label;
    var opt_save=self.aParam.ui.btn_save;
    if(self.aParam.ui.btn_cancel){
      var label_cancel=self.aParam.ui.btn_cancel.label;
      var opt_cancel=self.aParam.ui.btn_cancel;
    }
    else{
      var label_cancel='Cancel';
      var opt_cancel={};
    }

    var button = self.theme.getButton(label_save, opt_save);
    jQuery(button).click(function(){
      self.api.insert({data:self.form.getValue(),success:function(data){
        console.log(self);
        if(typeof self.crud_success=='function'){
          self.crud_success('insert', data);
        }

        jQuery(div_id).html('');
        self.createTable({div_id:div_id});
      }});
    });
    jQuery(div_id).append(button);

    var button_cancel = self.theme.getButton(label_cancel, opt_cancel);
    jQuery(button_cancel).click(function(){
        jQuery(div_id).html('');
        self.createTable({div_id:div_id});
    });
    jQuery(div_id).append(button_cancel);
    */
  },
  createForm: function (div_id, key, aData){
    var self=this;
    var type='update';
    if(typeof key==='undefined'){
        type='insert';
    }

    var aRecord;
    if(type==='update'){
       aRecord = self.getARecord(key,aData);
     }
    else{
      aRecord = {};
      if(this.aParam.search){
        jQuery.each(this.aParam.search,function(k,v){
          aRecord[k] = v;
        });
      }
    }

    jQuery(div_id).html(this.form.createForm(aRecord,self.aParam.template_form));

    if(typeof self.form_ready=='function'){
      self.form_ready(type, this.form);
    }

    var label_save=self.aParam.ui.btn_save.label;
    var opt_save=self.aParam.ui.btn_save;
    var label_cancel='Cancel';
    var opt_cancel={};

    if(self.aParam.ui.btn_cancel){
      label_cancel=self.aParam.ui.btn_cancel.label;
      opt_cancel=self.aParam.ui.btn_cancel;
    }

    var button = self.theme.getButton(label_save, opt_save);
    jQuery(button).click(function(){
      var valid=self.form.isValid();

      var aData = self.form.getValue();
      console.log(aData, self.aForm);

      // se ho un external_widget non lo devo inserire nell'api di insert/update
      jQuery.each(self.aForm.fields, function(k,v){
        if( v.skip_in_form !== undefined && v.skip_in_form ) {
          delete aData[k];
        }
      });

      var validation = true;
      if(typeof self.form_validation=='function'){
        validation = self.form_validation();
      }
      if( validation.ok === false ) {
        var msg=self.theme.alertMessage(validation.msg);
        jQuery('#'+self.div_id).find(".dbmng_form_button_message").html(msg);
      }
      else {
        if(valid.ok===false){
          jQuery(div_id).find(".dbmng_form_button_message").html(valid.message);
        }
        else if(type=='update'){
          self.api.update({
            key:key,
            data:aData, // self.form.getValue(),
            success:function(data){
              if(!data.ok){
                if(typeof self.crud_update=='function'){
                  self.crud_update('update', data);
                }
                else {
                  var msg=self.theme.alertMessage(data.message);
                  jQuery(div_id).find(".dbmng_form_button_message").html(msg);
                  window.scrollTo(0,document.body.scrollHeight);
                }
              }
              else{
                console.log(data);
                if(typeof self.crud_success=='function'){
                  self.crud_success('update', data);
                }
                jQuery(div_id).html('');
                self.createTable({div_id:div_id});
              }
            }
        });
        }
        else{
          self.api.insert({
            data:aData, // self.form.getValue(),
            success:function(data){
              console.log(self,data);
              console.log(self.form.getValue());
              if( !data.ok ) {
                if(typeof self.crud_insert=='function'){
                  self.crud_insert('insert', data);
                }
                else {
                  var msg=self.theme.alertMessage(data.message);
                  jQuery(div_id).find(".dbmng_form_button_message").html(msg);
                  window.scrollTo(0,document.body.scrollHeight);
                }
              }
              else {
                if(typeof self.crud_success=='function'){
                  self.crud_success('insert', data);
                }
                jQuery(div_id).html('');
                self.createTable({div_id:div_id});
              }
            }
          });
        }
      }
    });

    var button_cancel = self.theme.getButton(label_cancel, opt_cancel);
    jQuery(button_cancel).click(function(){
      jQuery(div_id).html('');
      self.createTable({div_id:div_id});
    });
    jQuery(div_id).append("<div id='dbmng_buttons_row' class='row' style='margin-top: 20px;margin-bottom: 100px;'><div class='dbmng_form_button_message col-md-12'></div><div class='dbmng_form_button_left col-md-4 col-xs-12 '></div><div class='col-md-4 col-xs-12 '></div><div class='dbmng_form_button_right col-md-4 col-xs-12 '></div></div>");
    jQuery(div_id).find('.dbmng_form_button_left').append(button_cancel);
    jQuery(div_id).find('.dbmng_form_button_right').append(button);
  },

  getARecord: function (key,aData) {
    var aRecord=null;
    for(var i=0; i<aData.length; i++){
      if(aData[i][this.pk]==key){
        aRecord=aData[i];
        break;
      }
    }
    return aRecord;
  },

  createFormInline: function (div_id, key, aData){
    var self = this;
    var aRecord=this.getARecord(key,aData);
    jQuery('button').attr('disabled','true');

    //define the row_id
    var row_id= div_id + ' table #dbmng_row_id_'+key;

    //get the original dimension of the table
    var listWidth = [];
    jQuery(row_id+" td").each(function() {
        listWidth.push(jQuery(this).width());
    });

    var row=jQuery(row_id)[0];//document.getElementById('dbmng_row_id_'+key);
    while (row.firstChild) {
        row.removeChild(row.firstChild);
    }

    var fields=this.form.getFields(aRecord);
    for(var k2 in fields){
      if(this.form.getWidget(k2).isVisible()){
        var td=document.createElement('td');
        td.className='dbmng_cell_inline';
        td.appendChild(fields[k2]);
        row.appendChild(td);
      }
    }

    /*old version
    //get the form
    var html=this.form.createForm(aRecord);
    //Complicato metodo per eliminare il form senza eliminare i value degli input
    var fields=html.childNodes;

    //delete all cells
    while (row.firstChild) {
        row.removeChild(row.firstChild);
    }
    while (fields.length > 0) {

        var td=document.createElement('td');
        td.className='dbmng_cell_inline';
        td.appendChild(fields[0]);
        row.appendChild(td);
    }
    */
    jQuery(row_id).find('label').hide();

      //change the field dimension using the td width
      jQuery(row_id+" td.dbmng_cell_inline").each(function(k,v){
        jQuery(v).width(listWidth[k]);
        if(!(self.theme instanceof Dbmng.BootstrapTheme)){
          jQuery(v).find('input').width(listWidth[k]);
          jQuery(v).find('select').width(listWidth[k]);
        }
      });

    if(typeof self.form_ready=='function'){
      self.form_ready('update_inline', this.form);
    }


    var label_save=self.aParam.ui.btn_save.label;
    var opt_save=self.aParam.ui.btn_save;

    var button=self.theme.getButton(label_save, opt_save);
    jQuery(button).click(function(){
      self.api.update({key:key,data:self.form.getValue(),success:function(data){
        if(typeof self.crud_success=='function'){
          self.crud_success('update', data);
        }
        jQuery('button').removeAttr('disabled');
        jQuery(div_id).html('');
        self.createTable({div_id:div_id});
      }});
    });
    jQuery(row_id).append("<td class='dbmng_buttons'></td>");
    jQuery(row_id+' td.dbmng_buttons').html(button);
  }
});

/////////////////////////////////////////////////////////////////////
// CRUD The class manage all the CRUD functions
// 2 December 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.CrudForm = Class.extend({
  init: function( options ) {
    var self = this;
    this.ready=true;
    this.div_id = options.div_id;
    this.aParam = jQuery.extend(true, {}, Dbmng.defaults.aParam, options.aParam);
    this.form_ready = options.form_ready;
    this.crud_success = options.crud_success;

    // add form validation [MICHELE]
    this.form_validation = options.form_validation;

    if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = Dbmng.defaults.theme;
    }

    if( options.url ) {
      this.url = options.url;
    }
    else {
      this.url = '?';
    }
    if( this.url.slice(-1) != '/' ) this.url = this.url + '/';

    this.aParam.url = this.url;

    var api_opt={url:self.url, user:options.user, password:options.password};
    if(typeof this.offline!=='undefined'){
      api_opt.offline=this.offline;
    }
    self.api = new Dbmng.Api(api_opt);


    if( options.aForm ) {
      this.aForm = options.aForm;
      this.form = new Dbmng.Form({aForm:this.aForm, aParam:this.aParam, theme:this.theme});
      this.pk=this.form.getPkField();

      if( typeof options.success=='function' ){
        options.success(this);
      }
    }
    else {
      //there are o aForm; call the api to get the aForm
      this.ready = false;


      var heads = {};
      if( options.user ){
        heads = {
          "Authorization": "Basic " + btoa(options.user + ":" + options.password)
        };
      }

      var search="?";
      if(this.aParam.search){
        jQuery.each(this.aParam.search,function(k,v){
            search+='&'+k+"="+v;
        });
      }

      jQuery.ajax({
        url: this.url+"schema"+search,
        dataType:'json',
        headers: heads,
        success: function(data){

          self.aForm = data;
          self.ready = true;
          // console.log("aForm loaded");
          // console.log(self.aForm);
          // console.log(this.aForm);

          self.form = new Dbmng.Form({aForm:self.aForm, aParam:self.aParam, theme:self.theme});

          self.pk=self.form.getPkField();

          if( typeof options.success=='function' ){
            // console.log("call success");
            options.success(self);
          }
          else{
            // console.log(this.aForm);
          }
        },
        error: function(exc){
          if( typeof options.error=='function' ){
            options.error(exc);
          }
          // console.log(exc);
          // console.log(options);
        }
      });
    }
  },

  createForm: function( id ){
    if( this.ready ) {
      var type='update';
      if(typeof id==='undefined'){
        type='insert';
      }
      var self = this;
      var key = this.aForm.primary_key[0];
      //console.log(this.aParam);
      if( type == 'update' ) {
        this.api.select({
          search:key+"="+id,
          success: function(data){
            self.generateForm(type,key,id,data);
          }
        });
      }
      else if( type == 'insert' ) {
        self.generateForm(type,key);
      }
    }
  },

  generateForm: function( type, key, id, data ) {
    var self = this;
    jQuery('#'+self.div_id).html("");
    // console.log(data);
    if( typeof data !== 'undefined' ) {
      console.log('generate form: update');
      jQuery('#'+self.div_id).append(self.form.createForm(data.data[0],self.aParam.template_form));
    }
    else {
      var aRecord = {};
      console.log('generate form: insert');
      if(this.aParam.search){
        jQuery.each(this.aParam.search,function(k,v){
          aRecord[k] = v;
        });
      }

      jQuery('#'+self.div_id).append(self.form.createForm(aRecord,self.aParam.template_form));
    }


    // Copiata e modificata a partire da Crud.createForm !!!
    var label_save=self.aParam.ui.btn_save.label;
    var opt_save=self.aParam.ui.btn_save;
    var label_cancel='Cancel';
    var opt_cancel={};

    if(self.aParam.ui.btn_cancel){
      label_cancel=self.aParam.ui.btn_cancel.label;
      opt_cancel=self.aParam.ui.btn_cancel;
    }

    var button = self.theme.getButton(label_save, opt_save);
    jQuery(button).click(function(){
      var valid=self.form.isValid();

      var validation = true;
      if(typeof self.form_validation=='function'){
        validation = self.form_validation();
      }

      var msg;
      if( validation.ok === false ) {
        msg=self.theme.alertMessage(validation.msg);
        jQuery('#'+self.div_id).find(".dbmng_form_button_message").html(msg);
      }
      else {
        if(valid.ok===false){
          jQuery('#'+self.div_id).find(".dbmng_form_button_message").html(valid.message);
        }
        else if(type=='update'){
          self.api.update({key:key,data:self.form.getValue(),success:function(data){
            if(!data.ok){
              msg=self.theme.alertMessage(data.message);
              jQuery('#'+self.div_id).find(".dbmng_form_button_message").html(msg);
            }
            else{
              if(typeof self.crud_success=='function'){
                self.crud_success('update', data);
              }
              self.createForm(id);
            }
          }});
        }
        else if(type=='insert'){
          self.api.insert({data:self.form.getValue(),success:function(data){
            // console.log(data);
            if(typeof self.crud_success=='function'){
              self.crud_success('insert', data);
            }
            jQuery(self.div_id).html('');
            self.createForm(data.inserted_id);
          }});
        }
      }

    });

    var button_cancel = self.theme.getButton(label_cancel, opt_cancel);
    jQuery(button_cancel).click(function(){
      if(typeof self.crud_success=='function'){
        self.crud_success('cancel');
      }
      jQuery(self.div_id).html('');
      //self.createTable({div_id:self.div_id});
    });
    jQuery('#'+self.div_id).append("<div id='dbmng_buttons_row' class='row' style='margin-top: 20px;margin-bottom: 100px;'><div class='dbmng_form_button_message col-xs-12'></div><div class='dbmng_form_button_left col-xs-4'></div><div class='col-xs-4'></div><div class='dbmng_form_button_right col-xs-4'></div></div>");
    jQuery('#'+self.div_id).find('.dbmng_form_button_left').append(button_cancel);
    jQuery('#'+self.div_id).find('.dbmng_form_button_right').append(button);

    if(typeof self.form_ready=='function'){
      self.form_ready(type, this.form);
    }
  }
});

/////////////////////////////////////////////////////////////////////
// CRUDInline The class manage all the CRUD functions for an inline forms
// 22 December 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.CrudInline = Dbmng.Crud.extend({
  generateTable: function( opt, aDati){
    var div_id=opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }
    var self=this;
    console.log(this.aForm);
    console.log(aDati);

    var aLocParam=jQuery.extend(true, {}, this.aParam);
    aLocParam.hide_label= true;
    aLocParam.hide_placeholder=true;

    var formin=new Dbmng.FormInline({"aForm":this.aForm,  "aParam":aLocParam,
			"onChange":function(){
        var w=this;
				console.log("Field:"+w.field);
				console.log("Value:"+w.getValue());
				console.log("Key:"+w.pk_value);
        var obj={};
        obj[w.field]=w.getValue();
        //var obj={w.field:w.getValue()};
        self.api.update({"key":w.pk_value, "data": obj ,
          success:function(data){

            w.setErrorState(data.ok, data.message);
            /*
            var par=jQuery(jQuery(w.widget).parents('td')[0]);
            par.find('span.error_message').remove();

            if(data.ok){
              par.removeClass('danger').addClass('success');
            }
            else{
              par.append('<span class="error_message">'+data.message+'</span>');
              par.removeClass('success').addClass('danger');
            }
            */
            //w.widget.parent();
          },
          error:function(data){
            jQuery(jQuery(w.widget).parents('td')[0]).removeClass('success').addClass('danger');
            console.log(data);            //w.widget.parent();
          }
        });
			} ,
    "onChangeRow":function(){
      /*
				var w=this;
        if(!old_form){
          console.log('First form');
        }
        else if(old_form==w.form){
          console.log('Same form');
        }
        else{
          console.log('Change form!!!');
          console.log(old_form.getValue());
        }
        old_form=w.form;
        */
			}
		});
		var tab=formin.createForm(aDati.data);

		jQuery(div_id).append(tab);

    /* Uncomment to allow formInline to save all the
		var button=Dbmng.defaults.theme.getButton("Get Value");
		jQuery(div_id).append(button);
		jQuery(button).click(function(){

			resData=formin.getValue()
			console.log(resData);

			trans=formin.getTransaction();
			console.log(trans);
		})
    */

  }
});

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

    // if set assign the label long in form mode
    var label = aField.label;
    if( aField.label_long ) {
        label = aField.label_long;
    }
    // var txt=document.createTextNode(jQuery("<div>"+label+"</div>")[0]);

    var wrapper= document.createElement('div');
    wrapper.innerHTML= "<span>"+label+"</span>";
    var txt = wrapper.firstChild;
    //var txt = jQuery("<span>"+label+"</span>")[0];
    lb.appendChild(txt);

/*
    if(aField.nullable==0){
      var required=document.createElement('span');
      this.addClass(reqiured, 'dbmng_required');
      required.appendChild(document.createTextNode('*'));
      lb.appendChild(required);
    }
    */
    // console.log("Test [getLabel]");
    // console.log(aField.field + ": valore:" + aField.nullable + " typo: "+ typeof parseInt(aField.nullable));
    // console.log(typeof 0);
    if( parseInt(aField.nullable) === 0  ) {
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

    if(typeof aField.value !== 'undefined' ) {
      el.value=aField.value;
    }
    if( aField.placeholder ) {
      el.placeholder = aField.placeholder;
    }

//     if( aField.type == 'int' || aField.type == 'bigint' || aField.type == 'float' || aField.type == 'double' ) {
//       el.type = "number";
//       el.onkeypress = function( evt ) {
//         var theEvent = evt || window.event;
//         var key = theEvent.keyCode || theEvent.which;
//         key = String.fromCharCode( key );
//         var regex = /[0-9]|\./;
//         if( !regex.test(key) ) {
//           theEvent.returnValue = false;
//           if(theEvent.preventDefault) theEvent.preventDefault();
//         }
//       };
//     }
    else {
      el.type = "text";
    }

    //if in the option there is a field_type value it will be override the previous one (if the widget is hidden and the type is int it should be hidden)
    if(aField.field_type){
      el.type = aField.field_type;
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
    if(! aField.exclude_attribute) {
      this.assignAttributes(el, aField);
    }
    //console.log(aField);

    el.type = "checkbox";
    if(typeof aField.value !== 'undefined' ) {
      el.value=aField.value;
    }

    if(aField.checked) {
      el.checked = true;
    }

    //console.log(aField);
    if( aField.placeholder ) {
      el.placeholder = aField.label;
    }

    return el;
  },

  getSelect: function(aField) {
    var el=document.createElement('select');
    this.assignAttributes(el, aField);
    if(aField.voc_val) {
      var o=document.createElement('option');

      if( aField.placeholder ) {
        o.text=aField.label;
        o.disabled = 'disabled';
      }

      el.options.add(o);

      // if(Object.prototype.toString.call(aField.voc_val) === '[object Object]') {
      //   for (var opt in aField.voc_val) {
      //     o=document.createElement('option');
      //     o.value = opt;
      //     o.text=aField.voc_val[opt];
      //     // console.log(aField);
      //     // console.log(aField.label + "= out: aFval[" + aField.value+"] opt: ["+ opt+"]");
      //     if( typeof aField.value !== 'undefined' ) {
      //       // console.log(aField.label + "= in: aFval[" + aField.value+"] opt: ["+ opt+"]");
      //       if( aField.value == opt ) {
      //         o.selected = true;
      //       }
      //     }
      //     el.options.add(o);
      //   }
      // }
      // else if(Object.prototype.toString.call(aField.voc_val) === '[object Array]') {
      //   // console.log(aField.voc_val);
      //   jQuery.each(aField.voc_val, function(k,v){
      //     if(typeof v !== 'string') {
      //       jQuery.each(v, function(key,text){
      //         o=document.createElement('option');
      //         o.value = key; // v[0];
      //         o.text= text; // v[1];
      //         if( typeof aField.value !== 'undefined' ) {
      //           if( aField.value == key ) {
      //             o.selected = true;
      //           }
      //         }
      //       });
      //     }
      //     else {
      //       o=document.createElement('option');
      //       o.value = opt;
      //       o.text=aField.voc_val[opt];
      //       if( typeof aField.value !== 'undefined' ) {
      //         if( aField.value == opt ) {
      //           o.selected = true;
      //         }
      //       }
      //     }
      //     el.options.add(o);
      //   });
      // }



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
        // else {
        //   o=document.createElement('option');
        //   o.value = opt;
        //   o.text=aField.voc_val[opt];
        //   if( typeof aField.value !== 'undefined' ) {
        //     if( aField.value == opt ) {
        //       o.selected = true;
        //     }
        //   }
        // }
        el.options.add(o);
      });
    }
    return el;
  },

  getRadio: function(aField) {
    var el=document.createElement('div');
    var fieldname = aField.field;

    // creo il contenitore
    var radiodiv = document.createElement('div');

    // this.assignAttributes(el, aField);
    if(aField.voc_val) {
      var o;
      // if(Object.prototype.toString.call(aField.voc_val) === '[object Object]') {
      //   for (var opt in aField.voc_val) {
      //
      //     // creo l'input di tipo radio
      //     o=document.createElement('input');
      //     o.type = 'radio';
      //     o.name = fieldname;
      //     o.id = fieldname+'_'+opt;
      //     o.value = opt;
      //
      //     // creo la label
      //     var lb = document.createElement('label');
      //     lb.setAttribute('for', fieldname+'_'+opt);
      //     var wrapper= document.createElement('div');
      //     wrapper.innerHTML= "<span>"+aField.voc_val[opt]+"</span>";
      //     var txt = wrapper.firstChild;
      //     lb.appendChild(txt);
      //
      //     if( typeof aField.value !== 'undefined' ) {
      //       if( aField.value == opt ) {
      //         o.checked = true;
      //       }
      //     }
      //
      //     radiodiv.appendChild(o);
      //     radiodiv.appendChild(lb);
      //
      //     el.appendChild(radiodiv);
      //   }
      // }
      // else if(Object.prototype.toString.call(aField.voc_val) === '[object Array]') {
      //   console.log(aField);
      //   jQuery.each(aField.voc_val, function(k,v){
      //     if(typeof v !== 'string') {
      //       jQuery.each(v, function(key,text){
      //
      //         // creo l'input di tipo radio
      //         o=document.createElement('input');
      //         o.type = 'radio';
      //         o.name = fieldname;
      //         o.id = fieldname+'_'+key;
      //         o.value = key; // v[0];
      //
      //         // creo la label
      //         var lb = document.createElement('label');
      //         lb.setAttribute('for', fieldname+'_'+key);
      //         var wrapper= document.createElement('div');
      //         wrapper.innerHTML= "<span>"+text+"</span>";
      //         var txt = wrapper.firstChild;
      //         lb.appendChild(txt);
      //
      //         if( typeof aField.value !== 'undefined' ) {
      //           if( aField.value == key ) {
      //             o.checked = true;
      //           }
      //         }
      //
      //         radiodiv.appendChild(o);
      //         radiodiv.appendChild(lb);
      //       });
      //     }
      //     else {
      //       // TODO : A cosa serve questo else??
      //       o=document.createElement('option');
      //       o.value = opt;
      //       o.text=aField.voc_val[opt];
      //       if( typeof aField.value !== 'undefined' ) {
      //         if( aField.value == opt ) {
      //           o.selected = true;
      //         }
      //       }
      //     }
      //     el.appendChild(radiodiv);
      //   });
      // }
      //


      // NUOVO
      console.log(aField);
      jQuery.each(aField.voc_val, function(k,v){
        if(typeof v !== 'string') {
          jQuery.each(v, function(key,text){

            // creo l'input di tipo radio
            o=document.createElement('input');
            o.type = 'radio';
            o.name = fieldname;
            o.id = fieldname+'_'+key;
            o.value = key; // v[0];

            // creo la label
            var lb = document.createElement('label');
            lb.setAttribute('for', fieldname+'_'+key);
            var wrapper= document.createElement('div');
            wrapper.innerHTML= "<span>"+text+"</span>";
            var txt = wrapper.firstChild;
            lb.appendChild(txt);

            if( typeof aField.value !== 'undefined' ) {
              if( aField.value == key ) {
                o.checked = true;
              }
            }

            radiodiv.appendChild(o);
            radiodiv.appendChild(lb);
          });
        }
        // else {
        //   // TODO : A cosa serve questo else??
        //   o=document.createElement('option');
        //   o.value = opt;
        //   o.text=aField.voc_val[opt];
        //   if( typeof aField.value !== 'undefined' ) {
        //     if( aField.value == opt ) {
        //       o.selected = true;
        //     }
        //   }
        // }
        el.appendChild(radiodiv);
      });

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
    //console.log(aField);
    //el.setAttribute('id', 'dbmng_' + aField.field);
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
			this.addClass(el, aField.classes);
			/*
      var space = "";
      if( el.className.lenght > 0 ) {
        space = " ";
      }
      el.className = el.className + space + ;
			*/
    }

  },
	addClass: function(el, className){
      var space = "";
      if(el.className){
        if( el.className.length > 0 ) {
          space = " ";
        }
      }
      else{
        el.className ="";
      }
      el.className = el.className + space + className;
	},
  addTitle: function(el, title){
      el.title = title;
  },
  getForm: function(opt) {
    var el = document.createElement('form');
    return el;
  },
  getTextarea: function(aField) {
    var el = document.createElement('textarea');
    this.assignAttributes(el, aField);

    if(aField.value) {
      el.value=aField.value;
    }
    if( aField.placeholder ) {
      el.placeholder = aField.placeholder;
    }


    return el;
  },
  getTable: function(opt) {
    var div = document.createElement('div');
    var el = document.createElement('table');
		if( opt.aParam ) {
      if( opt.aParam.ui ) {
        if( opt.aParam.ui.table_class ) {
          this.addClass(el, opt.aParam.ui.table_class);
        }
      }
    }
    if(!opt.rawData){
      opt.rawData=opt.data;
    }
    if(opt.data){
			el.appendChild(this.getTableHeader(opt));
			var tbody=document.createElement('tbody');
			for(var i=0; i<opt.data.length; i++){
				var row=this.getTableRow({data: opt.data[i], rawData: opt.rawData[i], options:opt.options });
				if(opt.options){
					if(opt.options.assignClass){
						this.addClass(row, "dbmng_row dbmng_row_"+i);
					}
					if(typeof opt.options.addColumn=='function'){
            var cell = opt.options.addColumn({data: opt.data[i], rawData: opt.rawData[i], options:opt.options });
            if( cell !== null ) {
              row.appendChild(cell);
            }
					}
				}
				tbody.appendChild(row);
			}
			el.appendChild(tbody);
		}
		div.appendChild(el);
    return div;
  },
	getTableHeader: function(opt) {
    console.log(opt);
		var el = document.createElement('thead');
		var tr = document.createElement('tr');

    var keys=[];
    var cnt=0;
    if(opt.data){
      if(opt.data.length>0){
        for(var key in opt.data[0]){
          keys[cnt]=key;
          cnt++;
        }
      }
    }

		if(!opt.header){
      opt.header=keys;
		}

    for(var i=0; i<opt.header.length; i++){
      var th=this.getTableHCell({content: opt.header[i], options:opt.options});
      if(opt.options){
          if(opt.options.assignClass){
            this.addClass(th, "dbmng_cell dbmng_head dbmng_col_"+keys[i]);
          }
        }
      tr.appendChild(th);
    }
		el.appendChild(tr);
		return el;
	},
  getTableRow: function(opt) {
		var el = document.createElement('tr');
		if(opt.data){
			for (var key in opt.data) {
				var cell=this.getTableCell({content: opt.data[key], options:opt.options});
				if(opt.options){
					if(opt.options.assignClass){
						this.addClass(cell, "dbmng_cell dbmng_col_"+key);
					}
					if(typeof opt.options.setIDRow=='function'){
						el.id=opt.options.setIDRow(opt.rawData);
					}
				}
				el.appendChild(cell);
			}
		}
		return el;
	},
  getTableHCell: function(opt) {
		if(!opt){
			opt={};
		}
		var el = document.createElement('th');
		if(opt.content){
				el.appendChild(document.createTextNode(opt.content));
		}
		return el;
	},
  getTableCell: function(opt) {
		if(!opt){
			opt={};
		}
		var el = document.createElement('td');
		if(typeof opt.content!=='undefined' && opt.content!==null){
      if(typeof opt.content ==='object'){
        el.appendChild(opt.content);
      }
      else if((""+opt.content).startsWith('<')){
        try{
          el.appendChild(jQuery(opt.content)[0]);
        }
        catch(e){
          el.appendChild(document.createTextNode(opt.content));
        }
      }
      else{
        el.appendChild(document.createTextNode(opt.content));
      }
		}
		return el;
	},
	getButton: function(text, opt) {
    if( !opt ) {
      opt = {};
    }
    var type='button';
    if(opt.type){
      type=opt.type;
    }

		var el = document.createElement(type);
    if(opt.class){
      this.addClass(el, opt.class);
    }


    if(opt.icon){
      // if( jQuery('i.fa').css('font').indexOf('Awesome')>-1 ) { ... }
      var icn = document.createElement('i');
      this.addClass(icn,opt.icon);
      this.addTitle(icn, text);
      el.appendChild(icn);

      if(opt.label_file){
        var span=document.createElement('span');
        span.appendChild(document.createTextNode(" "+opt.label_file));
        el.appendChild(span);
      }
    }
    else{
      el.appendChild(document.createTextNode(text));
    }
		return el;
	},
  alertMessage: function(text) {
    var el = document.createElement('div');
    this.addClass(el, 'dbmng_alert');
    el.appendChild(document.createTextNode(text));
    return el;
  },
  createFileUploadField: function(elv, label, opt){

    var el=document.createElement('div');
    this.addClass(el, "dbmng_fileupload_meta_container");

    var el_info=document.createElement('div');
    this.addClass(el_info,"dbmng_fileupload_container");
    el.appendChild(el_info);

    el.appendChild(document.createElement('br'));

    var el_base=document.createElement('div');
    this.addClass(el_base, "dbmng_fileupload_button_progress");
    el.style.cssText="width:100%; float:left;";
    el_base.appendChild(this.createFormUpload(elv, label, opt));

    var el_progress=this.createProgressBar({class:"progress", width:'69'});
    el_base.appendChild(el_progress);

    el.appendChild(el_base);
    return el;
  },
  createFormUpload: function( elv, label, opt){

    //var el = document.createElement('button');
    //this.addClass(el,'fileinput-button');
    if(!opt){
      opt={};
    }
    if(!opt.class){
      opt.class="";
    }
    opt.type='a';

    var el=this.getButton(label,opt);
    this.addClass(el,"fileinput-button");
    el.style.cssText="float:left; width:30%";
    el.appendChild(elv);
    return el;

  },
  createProgressBar: function(opt){
    if(!opt){
      opt={};
    }
    if(!opt.class){
      opt.class="";
    }
    if(!opt.width){
      opt.width=100;
    }

    var el = document.createElement('div');
    this.addClass(el,opt.class);
    el.style.cssText="width:"+opt.width+"%; border:1px solid #CCC; height:20px; float:left;";

    var pr= document.createElement('div');
    this.addClass(pr,"progress-bar progress-bar-success");
    pr.style.cssText="background-color:#CCC; height:20px; width:0px;";
    el.appendChild(pr);

    return el;
  },
  getDeleteButton: function(label){
    var el = this.getButton("X",{type:'span'});
    return el;
  },
  setErrorState: function(element, ok, message){
    var par=jQuery(jQuery(element.widget).parents('.dbmng_form_row')[0]);
    par.find('span.error_message').remove();

    if(ok){
      par.removeClass('alert-danger').addClass('alert-success');
    }
    else{
      par.append('<span class="error_message">'+message+'</span>');
      par.removeClass('alert-success').addClass('alert-danger');
    }  
  }


});

/////////////////////////////////////////////////////////////////////
// BootstrapTheme
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AppTheme = Dbmng.AbstractTheme.extend({
  getLabel: function(aField) {
    var el = this._super(aField);
    jQuery(jQuery(el)[0]).find('label').addClass('label-form');
    jQuery(el).css('font-weight','bold');
    return el;
  },
  assignAttributes: function(el, aField) {
    this._super(el, aField);
    this.addClass(el, 'input-form');
  },
  alertMessage: function(text) {
    var el = this._super(text);
    this.addClass(el, 'alert alert-block alert-danger');
    return el;
  },
  getTable: function(opt) {
    var div = this._super(opt);
    //this.addClass(div, 'table-responsive');
    this.addClass(div.firstChild, 'table');
    return div;
  },
  getButton: function(text, opt) {
    var el = this._super(text, opt);
    this.addClass(el, 'btn btn-default');
    return el;
  },
  createFileUploadField: function(elv, label, opt){
    var el = this._super(elv, label, opt);
    var btn=jQuery(el).find('.fileinput-button');
    btn.css('width','');
    btn.addClass('col-xs-6');
    //this.addClass(btn,'col-xs-6');

    var prg=jQuery(el).find('.progress');
    prg.css('width','');
    prg[0].style.cssText="";
    prg.wrap('<div class="col-xs-6" style="padding-top: 7px;"></div>');
    prg.find('.progress-bar')[0].style.cssText="";

    // console.log(el);

    return el;
  },
  getDeleteButton: function(label,btn_icon){

    var icn = document.createElement('i');
    this.addClass(icn,btn_icon);
    this.addTitle(icn, label);
    return icn;
  }

});

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
    var div=document.createElement('div');
    if (aField.addButton) {
      div.className='input-group';
    }

    // debugger
    // el.parent
    var el=document.createElement('select');
    el.className='form-control aepy-select real_widget';
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

    div.appendChild(el);

    if (aField.addButton) {
      var addButtonDiv=document.createElement('div');
      addButtonDiv.className='input-group-append';

      // backtick non riconosciuto da grunt
      // var button=`<button style="background-color:#06c;" class="${aField.addButtonClass} btn btn-primary btn-icon">
      //               <svg class="icon icon-white">
      //               <use xlink:href="/bootstrap-italia/dist/svg/sprite.svg#it-plus"></use>
      //               </svg>
      //             </button>`;

      var button='<button style="background-color:#06c;" class="'+aField.addButtonClass+' btn btn-primary btn-icon">' +
                    '<svg class="icon icon-white">' +
                    '<use xlink:href="/bootstrap-italia/dist/svg/sprite.svg#it-plus"></use>' +
                    '</svg>' +
                  '</button>';

      var addButton=jQuery(button)[0];

      addButtonDiv.appendChild(addButton);

      div.appendChild(addButtonDiv);

    }

    return div;
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

/////////////////////////////////////////////////////////////////////
// BootstrapTheme
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.BootstrapTheme = Dbmng.AbstractTheme.extend({
  getLabel: function(aField) {
    var el = this._super(aField);
    jQuery(el).css('font-weight','bold');
    return el;
  },
  assignAttributes: function(el, aField) {
    this._super(el, aField);
    this.addClass(el, 'form-control');
  },
  alertMessage: function(text) {
    var el = this._super(text);
    this.addClass(el, 'alert alert-block alert-danger');
    return el;
  },
  getTable: function(opt) {
    var div = this._super(opt);
    //this.addClass(div, 'table-responsive');
    this.addClass(div.firstChild, 'table');
    return div;
  },
  getButton: function(text, opt) {
    var el = this._super(text, opt);
    this.addClass(el, 'btn btn-default');
    return el;
  },
  createFileUploadField: function(elv, label, opt){
    var el = this._super(elv, label, opt);
    var btn=jQuery(el).find('.fileinput-button');
    btn.css('width','');
    btn.addClass('col-xs-6');
    //this.addClass(btn,'col-xs-6');

    var prg=jQuery(el).find('.progress');
    prg.css('width','');
    prg[0].style.cssText="";
    prg.wrap('<div class="col-xs-6" style="padding-top: 7px;"></div>');
    prg.find('.progress-bar')[0].style.cssText="";

    // console.log(el);

    return el;
  },
  getDeleteButton: function(label,btn_icon){

    var icn = document.createElement('i');
    this.addClass(icn,btn_icon);
    this.addTitle(icn, label);
    return icn;
  }

});

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
    //TODO diego updated
    div1.className="item-content item-input ";
    div1.className = div1.className + ' dbmng_form_field_' + aField.field;
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

/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.AutocompleteWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='hidden';
    return this.theme.getInput(this.aField);
  },
  createField: function(data_val){
    var self=this;
    var el = this._super(data_val);

    var aVField = {};
    aVField.field = this.aField.field + '_view';
    aVField.classes = 'typeahead';

    var elv = this.theme.getInput(aVField);
    el.appendChild(elv);
    if( typeof Bloodhound !== 'undefined'){
      var provider = new Bloodhound({
        datumTokenizer: function (data) {
            // console.log('datumToken');
            //console.log(data);
              return Bloodhound.tokenizers.whitespace('<b>'+data[1]+"</b>: "+data[3]);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: self.aField.url,
          wildcard: '%QUERY',
          transform: function (data){
            var label=[];
            jQuery.each(data.data, function(k,v){
              label.push(v);
            });
            return (label);
          }
        }
      });

      if( data_val !== '' && typeof data_val !== 'undefined' ) {
        if( data_val !== '' ) {
          provider.search(data_val,function(d){self.autocomplete_get(d,elv);},function(d){self.autocomplete_get(d,elv);});
        }
        // console.log(data_val);
      }

      var fkey = "key";
      if( self.aField.autocomplete_key ) {
        fkey = self.aField.autocomplete_key;
      }

      var flabel = "label";
      if( self.aField.autocomplete_fieldname ) {
        flabel = self.aField.autocomplete_fieldname;
      }

      var not_found = "Not found ";
      if( self.aField.not_found ) {
        not_found = self.aField.not_found;
      }
      jQuery(elv).typeahead(
        {   hint: true,   highlight: true,   minLength: 0 },
        {
          name: self.aField.autocomplete_fieldname,
          source: provider,
          limit: 100,
          display: self.aField.autocomplete_fieldname,
          templates: {
            header: '',
            notFound: function(q){
              return not_found+' <b>'+q.query+"<b>";
            },
            suggestion: Handlebars.compile('<div>{{'+flabel+'}}</div>')
          }
        });

      jQuery(elv).bind('typeahead:select', function(ev, suggestion){
        // console.log(self);
        // console.log(suggestion);
        // console.log(fkey);
        // console.log(suggestion[fkey]);
        self.widget.value = suggestion[fkey];
      });
    }
    else {
      el.appendChild(jQuery("<div class='alert alert-danger'><strong>DBMNG2 Error!</strong><p>Bloodhound library is not loaded</p></div>")[0]);
    }
    return el;
  },

  autocomplete_get: function(val,elv){
    // console.log(val);
    if(val.length>0){
      var label= val[0][this.aField.autocomplete_fieldname];
      elv.value=label;
      // console.log(label);
    }
    // console.log(val[0][this.aField.autocomplete_fieldname]);
  }
});

/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.CheckboxWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    var checked=false;
    if(this.aField.value==1){
      checked=true;
    }

    this.aField.checked=checked;
    // return this.theme.getCheckbox({'value':this.aField.value,'checked':checked});
    return this.theme.getCheckbox(this.aField);
  },

  getValue: function(){
    var ret;
    if( this.aField.type == 'int' ) {
      ret = (this.widget.checked ? 1 : 0);
    }
    else {
      ret = this.widget.checked;
    }
    return ret;
  },
	convert2html: function(val) {
		if(this.aField.voc_val){
	    return this.aField.voc_val[val];
		}
		else{
			return val;
      // return '<input type="checkbox" value='+val+'/>';
    }
  }
});

/////////////////////////////////////////////////////////////////////
// DateWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.DateWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    if(typeof jQuery.datepicker !== 'undefined'){
      this.aField.field_type='hidden';
    }
    else{
      if( this.aField.type == 'date' ) {
        this.aField.field_type='date';
      }
      else if( this.aField.type == 'time' ) {
        this.aField.field_type='time';
      }
      else if( this.aField.type == 'datetime-local' ) {
        this.aField.field_type='datetime-local';
      }
    }
    return this.theme.getInput(this.aField);
  },
  createField: function(data_val){

    var self=this;
    var date_format_view='dd-mm-yy';
    // console.log(self);
    if(self.aField.date_format_view){
      date_format_view=self.aField.date_format_view;
    }

    var el = this._super(data_val);
    if(typeof jQuery.datepicker !== 'undefined' ){
      var aVField = {};
      aVField.field = this.aField.field + '_view';

      var elv = this.theme.getInput(aVField);
      if(typeof data_val !== 'undefined' && data_val!=='' && data_val !==null ){
        elv.value=jQuery.datepicker.formatDate(date_format_view,jQuery.datepicker.parseDate( "yy-mm-dd", data_val ));
      }

      jQuery(elv).blur(function(){
        console.log(jQuery(elv).val());
        if( jQuery(elv).val() === '' ) {
          self.widget.value = "";
        }

      });
      jQuery(elv).datepicker({altField: jQuery(self.widget),
        dateFormat:date_format_view , altFormat:'yy-mm-dd'
      });

      el.appendChild(elv);
    }

    return el;
  },
  getValue: function() {
    var el = this._super();
		if(el===''){
			return null;
		}
		else{
				return el;
			}
		}
});

/////////////////////////////////////////////////////////////////////
// FileWidget
// 13 January 2016
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.FileWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    if(typeof jQuery().fileupload !== 'undefined'){
      this.aField.field_type='hidden';
    }
    else{
      this.aField.field_type='file';
    }
    return this.theme.getInput(this.aField);
    /*
    var self=this;


    var fld=this._super();
    fld.type='file';
    fld.name="files[]";
    //fld.setAttribute('data-url',url);
    fld.multiple=true;
    return fld;
    */
  },

  createField: function(data_val){


    var self=this;
    // console.log(self);

    var url='server/php/';
    if(self.aParam.url){
      url=self.aParam.url+"file/"+self.field+"/";
    }
    if(self.aField.url){
      url=self.aField.url;
    }
    var weburl_file=url+"files/";
    if(self.aField.weburl_file){
      weburl_file=self.aField.weburl_file;
    }

    var el = this._super(data_val);

    if(typeof jQuery().fileupload !== 'undefined'){

      var aVField = {};
      aVField.field = this.aField.field + '_file';

      var elv = this.theme.getInput(aVField);
      elv.type='file';
      elv.name="files[]";

      var opt={};
      var btn_class="btn btn-success";
      var btn_icon="glyphicon glyphicon-plus";
      var btn_label="Select file...";
      var uploading_text="Uploading...";

      if( self.aField.class ) {
        btn_class = self.aField.class;
      }
      if( self.aField.add_icon ) {
        btn_icon = self.aField.add_icon;
      }
      if( self.aField.label_file ) {
        btn_label = self.aField.label_file;
      }
      if( self.aField.uploading_text ) {
        uploading_text = self.aField.uploading_text;
      }

      opt.class = btn_class;
      opt.icon  = btn_icon;
      opt.label_file = btn_label;

      el.appendChild(this.theme.createFileUploadField(elv,btn_label, opt));

      var info=jQuery(el).find('.dbmng_fileupload_container');

      var el_progress=jQuery(el).find('.progress');

      // var info=jQuery(el).find('.dbmng_fileupload_container');
      if(typeof data_val !== 'undefined' && data_val!=='' && data_val !==null ){
        self.addFile(info, weburl_file, data_val);
      }

      jQuery(elv).fileupload({
          url: url,
          dataType: 'json',
          add: function (e, data) {
            console.log(data);
            info.html(uploading_text);
            data.submit();
          },
          progressall: function (e, data) {
              var progress = parseInt(data.loaded / data.total * 100, 10);
              console.log(progress);
              jQuery(el_progress).find(".progress-bar").css(
                  'width',
                  progress + '%'
              );
          },
          fail:function (e, data) {
            console.log(data);
            info.html(self.theme.alertMessage("Error"));
          },
          done: function (e, data) {
            console.log(data);
            if(data.result.files){
              if(data.result.files.length>0){
                info.html("");
                jQuery.each(data.result.files, function (index, file) {
                  if(file.error){
                    info.append(self.theme.alertMessage(file.error));
                  }
                  else if (!file.completed){
                    info.append(self.theme.alertMessage("Not Completed!!!!"));
                  }
                  else{
                    var url=weburl_file;
                    if (file.relative_folder) {
                      url=file.relative_folder;
                    }

                    self.addFile(info, url, file.name);

                    var fileValue=file.name;
                    if (file.relative_path) {
                      fileValue=file.relative_path;
                    }
                    self.setValue(fileValue);
                  }
                });
              }
              else{
                  info.html("");
                  jQuery.each(data.messages, function(k,v){
                    info.append(self.theme.alertMessage(v));
                  });
              }
            }
            else{
              info.append(self.theme.alertMessage(data.result.message));
            }
          }
      });
    }
    else {
      jQuery(el).append(self.theme.alertMessage("Resources missing! Please load the following files: jquery-ui.js, jquery.iframe-transport and jquery.fileupload"));
    }

    return el;
  },

  addFile:function(info, weburl_file, file){
    var self=this;
    var btn_icon="glyphicon glyphicon-remove";
    if( self.aField.remove_icon ) {
      btn_icon = self.aField.remove_icon;
    }
    var btn_title = "Delete";
    if( self.aField.remove_title_icon ) {
      btn_title = self.aField.remove_title_icon;
    }

    if( self.aField.hide_link ){
      info.append(this.assignFileTypeIcon(file)+" "+file+" ");
    }
    else{
      info.append("<a target='_NEW' class='dbmng_fileupload_filelink' href='"+weburl_file+file+"'>"+this.assignFileTypeIcon(file)+" "+file+"</a>&nbsp;");
    }
    var del=this.theme.getDeleteButton(btn_title, btn_icon);
    info.append(del);
    console.log("addFile");console.log(weburl_file);console.log(file);

    jQuery(del).click(function(){
      info.html("");
      self.setValue("");
    });
  },

  assignFileTypeIcon: function( file ) {
    console.log(typeof file);
    var aFile = file.split('.');
    var file_type_icon = "";
    if( aFile[1] == 'pdf' ) {
      file_type_icon = '<i class="fa fa-file-pdf-o"></i>';
    }
    return file_type_icon;
  }
});

/////////////////////////////////////////////////////////////////////
// HiddenWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.HiddenWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='hidden';
    return this.theme.getInput(this.aField);
  },
  getLabel: function(){
    return null;
  },
  isVisible: function(){
    return false;
  }
});

/////////////////////////////////////////////////////////////////////
// NumericWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.NumericWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='number';
    return this.theme.getInput(this.aField);
  },
  getValue: function() {
    var el = this._super();
		if(el===''){
			return null;
		}
		else{
			var val=	el*1;
			if(isNaN(val)){
				console.log('entered a text ('+el+') in a numeric value');
				return null;
			}
			else{
				return val;
			}
		}
  }
});

/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.PasswordWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='password';
    return this.theme.getInput(this.aField);
  }
});

/////////////////////////////////////////////////////////////////////
// RadioWidget
// 2 February 2020
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
// Klean Hoxha
/////////////////////////////////////////////////////////////////////

Dbmng.RadioWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    //var aField=this.aField;
    this.aField.value = this.getFieldValue();
    this.aField.field = this.field;

    return this.theme.getRadio(this.aField);
  },

  getValue: function(){
    var val = '';
    if( jQuery("input[name='"+this.field+"']:checked").val() !== '' ) {
      if( this.aField.type == 'int' ) {
        val = parseInt(jQuery("input[name='"+this.field+"']:checked").val());
      }
      else {
        val = jQuery("input[name='"+this.field+"']:checked").val();
      }
    }
    else{
      val=null;
    }
    return val;
  },
  convert2html: function(val) {
    var ret;
    // // console.log(this.aField);
    // if( Object.prototype.toString.call(this.aField.voc_val) == '[object Object]' ){
    //   ret = this.aField.voc_val[val];
    // }
    // else if( Object.prototype.toString.call(this.aField.voc_val) == '[object Array]' ) {
    //   // console.log(val);
    //   jQuery.each(this.aField.voc_val, function(k,voc){
    //     // console.log(voc);
    //     if(typeof voc !== 'string') {
    //       jQuery.each(voc, function(v,text){
    //         if( v == val ){
    //           ret = text;
    //         }
    //       });
    //     }
    //     else {
    //       ret = voc;
    //     }
    //   });
    // }

    jQuery.each(this.aField.voc_val, function(k,voc){
      // console.log(voc);
      if(typeof voc !== 'string') {
        jQuery.each(voc, function(v,text){
          if( v == val ){
            ret = text;
          }
        });
      }
      else {
        ret = voc;
      }
    });
    return ret;
  }
});

/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 18 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.SelectNMWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    var self=this;

    this.aField.value = this.getFieldValue();
    this.aField.field = this.field;
    var el, fk;

    var out_type = "select";
    if( self.aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }

    if( out_type == 'select' ) {

      el = document.createElement('select');
      el.multiple = true;

      self.theme.assignAttributes(el, self.aField);

      if(self.aField.voc_val) {
        var o = document.createElement('option');

        if( self.aField.placeholder ) {
          o.text = self.aField.label;
          o.disabled = 'disabled';
        }

        el.options.add(o);
        for ( fk in self.aField.voc_val) {
          o = document.createElement('option');

          var text_label="";
          var foreign_key="";
          if( typeof self.aField.voc_val[0] == 'object' ) {
            var object=self.aField.voc_val[fk];
            for (var k in object) {
              foreign_key=k;
              text_label=object[k];
              break;
            }
          }
          else{
              foreign_key=fk;
              text_label=self.aField.voc_val[fk];
          }

          o.value = foreign_key;
          o.text = text_label;
          if( self.aField.value ) {
            if( typeof self.aField.value[0] == 'number') {
              foreign_key = parseInt(foreign_key);
            }
            if( self.aField.value.indexOf(foreign_key) > -1 ) {
              o.selected = true;
            }
          }
          el.options.add(o);
        }
      }
    }
    else if( out_type == 'checkbox' ) {
      el = document.createElement('div');
      var ul = document.createElement('ul');
      ul.id = "ul_"+self.aField.field;

      var search_nm = false;
      if( typeof self.aField.search_nm !== 'undefined' ) {
        var placeholder = "";
        if( typeof self.aField.search_nm_placeholder !== 'undefined' ) {
          placeholder = self.aField.search_nm_placeholder;
        }
        var s = document.createElement('input');
        self.theme.addClass(s, 'dbmng_search_nm');
        self.theme.assignAttributes(s, self.aField);
        s.placeholder = placeholder;

        s.onkeyup = function(txt_search){
          var aRow = jQuery('#ul_'+self.aField.field+' li');
          var txt = txt_search.target.value.toLowerCase();
          if( txt.length > 1){
            jQuery.each(aRow, function(k,row){
              var rowText = jQuery(row).text().toLowerCase();
              if( rowText.search(txt) > -1 ) {
                jQuery(row).show();
              }
              else {
                jQuery(row).hide();
              }
            });
          }
          else {
            jQuery(aRow).show();
          }
        };
        el.appendChild(s);

      }

      self.theme.addClass(ul, 'dbmng_checkbox_ul');
      //self.theme.assignAttributes(el, self.aField);
      if( typeof self.aField.voc_val[0] == 'object' ) {
        jQuery.each(self.aField.voc_val, function(k,v){
          jQuery.each(v, function(index, el) {
            fk = index;
            var li = document.createElement('li');

            var checked=false;
            if( self.aField.value ) {
              if( typeof self.aField.value[0] == 'number') {
                fk = parseInt(index);
              }
              if( self.aField.value.indexOf(fk) > -1 ) {
                checked=true;
              }
            }
            var fvalue=el;
            var opt_checkbox={'checked':checked, 'value':fk, 'label':fvalue, 'exclude_attribute':true};
            li.appendChild(self.theme.getCheckbox(opt_checkbox));

            var txt = document.createTextNode(fvalue);
            li.appendChild(txt);
            ul.appendChild(li);
          });
        });
      }
      else {
        for ( fk in self.aField.voc_val) {
          var li = document.createElement('li');

          var checked=false;
          if( self.aField.value ) {
            if( typeof self.aField.value[0] == 'number') {
              fk = parseInt(fk);
            }
            if( self.aField.value.indexOf(fk) > -1 ) {
              checked=true;
            }
          }
          var fvalue=self.aField.voc_val[fk];

          var opt_checkbox={'checked':checked, 'value':fk, 'label':fvalue, 'exclude_attribute':true};

          li.appendChild(this.theme.getCheckbox(opt_checkbox));

          var txt = document.createTextNode(fvalue);
          li.appendChild(txt);
          ul.appendChild(li);
        }

      }
      el.appendChild(ul);
    }



    // return this.theme.getSelectNM(this.aField);
    return el;
  },
  convert2html: function(val) {
    var self=this;
    var sep="<span class='dbmng_select_nm_sep'>,</span>&nbsp;";
    var ret="";
    var first=true;
    if( typeof val !== 'undefined' ) {
      jQuery.each(val,function(k,v){
        if(!first){
          ret+=sep;
        }
        else{
          first=false;
        }
        if( typeof self.aField.voc_val[0] == 'object' ) {
          jQuery.each(self.aField.voc_val, function(j, obj){
            if( typeof obj == 'object' ) {
              jQuery.each(obj, function(key, value){
                if( key == v ) {
                  ret+="<span class='dbmng_select_nm_item'>"+value+"</span>";
                }
              });
            }
          });
        }
        else {
          ret+="<span class='dbmng_select_nm_item'>"+self.aField.voc_val[v]+"</span>";
        }
      });
      return jQuery("<div>"+ret+"</div>")[0];
    }
  },
  getValue: function(){
    var aVal, aRet;
    var self=this;


    var out_type = "select";
    if( this.aField.out_type == 'checkbox' ) {
      out_type = "checkbox";
    }

    if( out_type == "select" ) {
      if( this.aField.type == 'int' ) {
        aVal = [].concat(jQuery(this.widget).val());

        aRet = [];
        aVal.forEach(function(entry) {
          aRet.push(parseInt(entry));
        });
      }
      else {
        aRet = jQuery(this.widget).val();
      }
    }
    else if( out_type == "checkbox" ) {
      var cb = jQuery(this.widget).find('input[type=checkbox]');
      aVal = [];
      cb.each(function(k,v){
        if( v.checked ) {
          console.log(v.value);
          if(self.aField.type == 'int'){
            aVal.push(parseInt(v.value));
          }
          else{
            aVal.push((v.value));
          }
        }
      });
      aRet = aVal;
    }
    console.log(aRet);
    return aRet;
  }
});

/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.SelectWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    //var aField=this.aField;
    this.aField.value = this.getFieldValue();
    this.aField.field = this.field;

    return this.theme.getSelect(this.aField);
  },

  getValue: function(){
    var val = '';
    if( jQuery(this.widget).val() !== '' ) {
      if( this.aField.type == 'int' ) {
        val = parseInt(jQuery(this.widget).val());
      }
      else {
        val = jQuery(this.widget).val();
      }
    }
    else{
      val=null;
    }
    return val;
  },
  convert2html: function(val) {
    var ret;
    // // console.log(this.aField);
    // if( Object.prototype.toString.call(this.aField.voc_val) == '[object Object]' ){
    //   ret = this.aField.voc_val[val];
    // }
    // else if( Object.prototype.toString.call(this.aField.voc_val) == '[object Array]' ) {
    //   // console.log(val);
    //   jQuery.each(this.aField.voc_val, function(k,voc){
    //     // console.log(voc);
    //     if(typeof voc !== 'string') {
    //       jQuery.each(voc, function(v,text){
    //         if( v == val ){
    //           ret = text;
    //         }
    //       });
    //     }
    //     else {
    //       ret = voc;
    //     }
    //   });
    // }

    jQuery.each(this.aField.voc_val, function(k,voc){
      // console.log(voc);
      if(typeof voc !== 'string') {
        jQuery.each(voc, function(v,text){
          if( v == val ){
            ret = text;
          }
        });
      }
      else {
        ret = voc;
      }
    });
    return ret;
  }
});

/////////////////////////////////////////////////////////////////////
// TextareaWidget
// 21 January 2016
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.TextareaWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='password';


    

    return this.theme.getTextarea(this.aField);


  }
});

//the default theme used by all class if not expressly defined
Dbmng.defaults.theme=new Dbmng.AbstractTheme();

//the default theme used by all class if not expressly defined
Dbmng.defaults.aParam = {
  ui: {
    btn_edit: {label:'Edit'},
    btn_edit_inline: {label:'Edit inline'},
    btn_delete: {label:'Delete'},
    btn_insert: {label:'Insert'},
    btn_save: {label:'Save'},
    btn_cancel: {label:'Cancel'}
  },
  user_function: {
    inline:0, upd:1, del:1, ins:1
  }
};

  window.Dbmng = Dbmng;
})(); 

//# sourceMappingURL=dbmng.js.map