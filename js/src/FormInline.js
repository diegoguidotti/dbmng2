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
