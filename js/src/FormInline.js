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
	createForm: function(aData) {

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


		for(var i=0; i<aData.length; i++){
			var form=new Dbmng.Form({"aForm":this.aForm, "aParam":this.aParam, "theme":this.theme});
			this.forms.push(form);
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
					if(this.onChange){
						wdg.onChange=this.onChange;
					}
					else{
					}

          if(this.onChangeRow){
						wdg.onFocus=this.onChangeRow;
          }

				}

        if(this.addEachRow){
          this.addEachRow(r,aData[i]);
        }
		}
		//console.log(this.forms);
		return tab;
	}
});
