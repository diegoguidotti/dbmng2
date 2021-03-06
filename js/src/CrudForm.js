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
