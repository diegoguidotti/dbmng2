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
    console.log(opt,data);
    var div_id = opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }
    var self=this;

    console.log(this.form);
    if( data.ok ) {
      var aData=data.data;
      var header=[];
      for(var key in self.aForm.fields){
        var widget=self.form.getWidget(key);
        if( widget.isVisible() && !widget.skipInTable()){
          header.push(widget.getTextLabel());
        }
      }
      if( opt.add_calc_fields ) {
        header.push(opt.add_calc_fields.label);
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

      if( opt.add_calc_fields ) {
        jQuery.each(opt.add_calc_fields.data, function(k,v){
          jQuery.each(aData, function(kk,vv){
            if( v.id_point == vv.id_point ) {
              cData[kk].cnt = v.cnt;
            }
          });
        });

      }

      var html=self.theme.getTable({data:cData, rawData:aData, header:header, aParam:self.aParam, options:{
        assignClass:true,
        setIDRow:function(aData){
          return "dbmng_row_id_"+aData[self.pk];
        },
        addColumn:function(opt){
          if( self.hasFunctions() ) {
            var cell=self.theme.getTableCell();

            if( self.aParam.user_function && self.aParam.user_function.upd  ) {
              var label_edit=self.aParam.ui.btn_edit.label;
              var opt_edit=self.aParam.ui.btn_edit;

              var button_edit=(self.theme.getButton(label_edit,opt_edit));
              if(!self.isAllowed(opt.rawData,'update')){
                button_edit.disabled=true;
              }

              button_edit.addEventListener("click",function(){
                self.createForm(div_id, opt.rawData[self.pk], aData);
              });
              jQuery(cell).append(button_edit);
            }

            if( self.aParam.user_function && self.aParam.user_function.inline ) {
              var label_editi=self.aParam.ui.btn_edit_inline.label;
              var opt_editi=self.aParam.ui.btn_edit_inline;
              var button_editi=self.theme.getButton(label_editi,opt_editi);
              if(!self.isAllowed(opt.rawData,'update')){
                button_editi.disabled=true;
              }
              button_editi.addEventListener("click",function(){
                self.createFormInline(div_id, opt.rawData[self.pk], aData, true);
              });
              jQuery(cell).append(button_editi);
            }

            if( self.aParam.user_function && self.aParam.user_function.del ) {
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
                var button_custom=(self.theme.getButton(label_custom,opt_custom));
                if(!self.isAllowed(opt.rawData,v.action)){
                  button_custom.disabled=true;
                }

                if( v.action ) {
                  if( typeof v.action == 'string' ||  typeof v.action == 'function' ) {
                      button_custom.addEventListener("click",function(){
                        if(typeof v.action == 'string'){
                          var fnstring = v.action;
                          var fnparams = [opt.rawData[self.pk],opt.rawData, opt.data, self.aParam];
                          exeExternalFunction(fnstring, fnparams);
                        }
                        else{
                          v.action(opt.rawData[self.pk],opt.rawData, opt.data, self.aParam);
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
      if( typeof self.table_success == 'function' ){
        self.table_success(aData);
      }

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
    }
    else {
      jQuery(div_id).html(self.theme.alertMessage(data.message));
    }
  },

  hasFunctions: function() {
    var ret = false;

    if( this.aParam.user_function && this.aParam.user_function.upd && this.aParam.user_function.upd == 1 )
      ret = true;

    if( this.aParam.user_function && this.aParam.user_function.inline && this.aParam.user_function.inline == 1 )
      ret = true;

    if( this.aParam.user_function && this.aParam.user_function.del && this.aParam.user_function.del == 1 )
      ret = true;

    if( this.aParam.user_function && this.aParam.user_function.ins && this.aParam.user_function.ins == 1 )
      ret = true;

    if( this.aParam.custom_function )
      ret = true;

    return ret;
  },

  isAllowed: function (data, method){
    if(this.aParam.user_function && typeof this.aParam.user_function.custom_user_function=='function'){
      return this.aParam.user_function.custom_user_function(data, method);
    }
    else{
      return true;
    }
  },
});
