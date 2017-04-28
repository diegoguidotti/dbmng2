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
    this.prepare_cdata = options.prepare_cdata;
    this.form_validation = options.form_validation;
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
  generateTable: function( opt, data){
    var div_id=opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }
    var self=this;

    //console.log(data);
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

            if( self.aParam.user_function.upd  ) {
              var label_edit=self.aParam.ui.btn_edit.label;
              var opt_edit=self.aParam.ui.btn_edit;

              var button_edit=(self.theme.getButton(label_edit,opt_edit));
              if(!self.isAllowed(opt.rawData,'update')){
                button_edit.disabled=true;
              }

              button_edit.addEventListener("click",function(){
                self.createForm(div_id, opt.rawData[self.pk], aData);
                // MM aggiungere funzione per history
              });
              jQuery(cell).append(button_edit);
            }

            if( self.aParam.user_function.inline ) {
              var label_editi=self.aParam.ui.btn_edit_inline.label;
              var opt_editi=self.aParam.ui.btn_edit_inline;
              var button_editi=self.theme.getButton(label_editi,opt_editi);
              if(!self.isAllowed(opt.rawData,'update')){
                button_editi.disabled=true;
              }
              button_editi.addEventListener("click",function(){
                self.createFormInline(div_id, opt.rawData[self.pk], aData, true);
                // MM aggiungere funzione per history
              });
              jQuery(cell).append(button_editi);
            }

            if( self.aParam.user_function.del ) {
              var label_delete=self.aParam.ui.btn_delete.label;
              var opt_delete=self.aParam.ui.btn_delete;

              var button_delete=(self.theme.getButton(label_delete,opt_delete));
              if(!self.isAllowed(opt.rawData,'delete')){
                button_delete.disabled=true;
              }
              button_delete.addEventListener("click",function(){
                var confirm_message = "Are you sure?";
                if( self.aParam.ui.btn_delete.confirm_message ) {
                  confirm_message = self.aParam.ui.btn_delete.confirm_message;
                }
                if( window.confirm(confirm_message) ) {
                  self.deleteRecord(div_id, opt.rawData[self.pk]);
                }
                // MM aggiungere funzione per history

              });
              jQuery(cell).append(button_delete);
            }

            if( self.aParam.custom_function ) {

              var aCF = self.aParam.custom_function;
              if( ! jQuery.isArray(self.aParam.custom_function) ) {
                aCF = [self.aParam.custom_function];
              }

              jQuery.each(aCF, function(k,v) {
                var label_custom = v.label;
                var opt_custom = v;
                //console.log(opt_custom);
                var button_custom=(self.theme.getButton(label_custom,opt_custom));
                if(!self.isAllowed(opt.rawData,v.action)){
                  button_custom.disabled=true;
                }

                if( v.action ) {
                  if( typeof v.action == 'string' ) {
                    button_custom.addEventListener("click",function(){
                      var fnstring = v.action;
                      var fnparams = [opt.rawData[self.pk],opt.rawData, opt.data];

                      exeExternalFunction(fnstring, fnparams);
                      // MM aggiungere funzione per history
                    });
                    jQuery(cell).append(button_custom);
                  }
                }
              });
  //             var label_custom = self.aParam.custom_function.label;
  //             var opt_custom = self.aParam.custom_function;
  //             //console.log(opt_custom);
  //             var button_custom=(self.theme.getButton(label_custom,opt_custom));
  //             if(!self.isAllowed(opt.rawData,self.aParam.custom_function.action)){
  //               button_custom.disabled=true;
  //             }
  //
  //             if( self.aParam.custom_function.action ) {
  //               if( typeof self.aParam.custom_function.action == 'string' ) {
  //                 button_custom.addEventListener("click",function(){
  //                   var fnstring = self.aParam.custom_function.action;
  //                   var fnparams = [opt.rawData[self.pk],opt.rawData];
  //
  //                   exeExternalFunction(fnstring, fnparams);
  //                 });
  //                 jQuery(cell).append(button_custom);
  //               }
  //             }
            }

            return cell;
          }
          else {
            return null;
          }
        }
      }});
      jQuery(div_id).html(html);

      if( self.aParam.user_function.ins ) {
        var label_insert=self.aParam.ui.btn_insert.label;
        var opt_insert=self.aParam.ui.btn_insert;

        var button_insert=jQuery(self.theme.getButton(label_insert,opt_insert));
        button_insert.click(function(){
          self.createInsertForm(div_id);
          // MM aggiungere funzione per history
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

        // jQuery(div_id).append(button_insert);
      }

      if(typeof self.table_ready=='function'){
        self.table_ready(self.form);
      }
    }
    else {
      jQuery(div_id).html(self.theme.alertMessage(data.message));
    }
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
    this.api.delete({key:key, success:function(data){
      if(typeof self.crud_success=='function'){
        self.crud_success('delete', data);
      }
      self.createTable({div_id:div_id});
    }});
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
       aRecord = this.getARecord(key,aData);
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
          self.api.update({key:key,data:self.form.getValue(),success:function(data){

            if(!data.ok){

              var msg=self.theme.alertMessage(data.message);
              jQuery(div_id).find(".dbmng_form_button_message").html(msg);

            }
            else{
              console.log(data);
              if(typeof self.crud_success=='function'){
                self.crud_success('update', data);
              }
              jQuery(div_id).html('');
              self.createTable({div_id:div_id});
            }
          }});
        }
        else{
          self.api.insert({data:self.form.getValue(),success:function(data){
            console.log(self);
            if(typeof self.crud_success=='function'){
              self.crud_success('insert', data);
            }
            jQuery(div_id).html('');
            self.createTable({div_id:div_id});
          }});
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
        if(!self.theme instanceof Dbmng.BootstrapTheme){
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
