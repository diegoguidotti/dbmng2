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

    this.aForm  = options.aForm;
		if(options.aParam)
    	this.aParam  = options.aParam;
		else
			this.aParam={};

		if( options.theme ) {
      this.theme = options.theme;
    }
    else {
      this.theme = new Dbmng.AbstractTheme();
    }		

		if( options.url ) {
      this.url = options.url;
    }
    else {
      this.url='?';
    }		

		this.form=new Dbmng.Form({aForm:this.aForm, aParam:this.aParam, theme:this.theme});
    this.api=new  Dbmng.Api({aForm:this.aForm, url:this.url, user:options.user, password:options.password});

		this.pk=this.form.getPkField();

/*
		this.url=options.url;
		this.user=options.user;
		this.password=options.password;
*/
  },
	createTable: function(opt){
		var div_id=opt.div_id;
		if( div_id.substring(0, 1) != '#') {
		  div_id = '#' + div_id;
		}

		var self=this;
	
		this.api.select({
		  success:function(data){
				console.log(data);
		    var aData=data.data;
		    var header=[];
		    for(var key in self.aForm.fields){
		      if(self.aForm.fields[key].label)
		        header.push(self.aForm.fields[key].label);	
		      else{
		        header.push(key);	
		      }
		    }
		    header.push("Func.");      
		    
		    var cData = self.form.convert2html(aData);
			
		    var html=self.theme.getTable({data:cData, header:header, options:{
		      assignClass:true,
		      setIDRow:function(aData){
		        return "dbmng_row_id_"+aData[self.pk];
		      },
		      addColumn:function(opt){
		        //console.log(header);
		        var cell=self.theme.getTableCell();

		        var button_edit=jQuery(self.theme.getButton('Edit'));
		        button_edit.click(function(){
		          self.creaForm(div_id, opt.data[self.pk], aData);
		        });
		        jQuery(cell).append(button_edit);

		        var button_edit=jQuery(self.theme.getButton('Edit Inline'));
		        button_edit.click(function(){
		          self.creaFormInline(div_id, opt.data[self.pk], aData, true);
		        });		
		        jQuery(cell).append(button_edit);

		        var button_delete=jQuery(self.theme.getButton('Delete'));
		        button_delete.click(function(){
								
		          self.deleteRecord(div_id, opt.data[self.pk]);
		        });		
		        jQuery(cell).append(button_delete);

		        return cell;
		      }
		    }});
		    jQuery(div_id).html(html);			

		    var button_insert=jQuery(theme_boot.getButton('Inserisci'));
		    button_insert.click(function(){
		      creaInsertForm(api, div_id);
		    });		
		    jQuery(div_id).append(button_insert);
		  }
		});
	},
	deleteRecord: function (div_id, key){
		var self=this;
		this.api.delete({key:key, success:function(data){			
		  self.createTable({div_id:div_id});
		}});
	}

});


