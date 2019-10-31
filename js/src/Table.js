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
