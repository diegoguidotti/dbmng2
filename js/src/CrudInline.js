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
        w=this;
				console.log("Field:"+w.field);
				console.log("Value:"+w.getValue());
				console.log("Key:"+w.pk_value);
        var obj={};
        obj[w.field]=w.getValue();
        //var obj={w.field:w.getValue()};
        self.api.update({"key":w.pk_value, "data": obj ,
          success:function(data){
            jQuery(jQuery(w.widget).parents('td')[0]).removeClass('danger').addClass('success');
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
