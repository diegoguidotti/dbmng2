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

		//the ready variable can be used to check if it is ready the Crud to create the table)   
    this.ready=true;

    aParamD = {ui: {btn_edit: {label:'Edit'},
                    btn_edit_inline: {label:'Edit inline'},
                    btn_delete: {label:'Delete'},
                    btn_insert: {label:'Insert'},
                    btn_save: {label:'Save'}},
              user_function: {inline:0, upd:1, del:1, ins:1}};
    
    this.aParam = jQuery.extend(true, aParamD,options.aParam);

    
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

		if(options.aForm){	
			this.aForm  = options.aForm;

		  this.form=new Dbmng.Form({aForm:this.aForm, aParam:this.aParam, theme:this.theme});
		  this.api=new  Dbmng.Api({aForm:this.aForm, url:this.url, user:options.user, password:options.password});

		  this.pk=this.form.getPkField();
		}
		else{
			//there are o aForm; call the api to get the aForm
			this.ready=false;
			var self=this;

			jQuery.ajax({
				url: this.url+"/schema",
				dataType:'json',
				headers: {
					"Authorization": "Basic " + btoa(this.user + ":" + this.password)
				},
				success: function(data){

					self.aForm  = data;
					self.ready=true;
					console.log("aForm loaded");
					console.log(this.aForm);

					self.form=new Dbmng.Form({aForm:self.aForm, aParam:self.aParam, theme:self.theme});
					self.api=new  Dbmng.Api({aForm:self.aForm, url:self.url, user:options.user, password:options.password});

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
				}
			});
			
		}
  },
  createTable: function( opt ){
		
    var div_id=opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }
		
		if(this.ready){
		  var self=this;

		  this.api.select({
		    success:function(data){
		      console.log(data);
		      if( data.ok ) {
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
		      
		        var html=self.theme.getTable({data:cData, header:header, aParam:self.aParam, options:{
		          assignClass:true,
		          setIDRow:function(aData){
		            return "dbmng_row_id_"+aData[self.pk];
		          },
		          addColumn:function(opt){
		            var cell=self.theme.getTableCell();
		            
		            if( self.aParam.user_function.upd == 1 ) {
		              var label_edit=self.aParam.ui.btn_edit.label; 
		              var opt_edit=self.aParam.ui.btn_edit;
		              
		              var button_edit=jQuery(self.theme.getButton(label_edit,opt_edit));
		              button_edit.click(function(){
		                self.createForm(div_id, opt.data[self.pk], aData);
		              });
		              jQuery(cell).append(button_edit);
		            }
		            
		            if( self.aParam.user_function.inline ) {
		              var label_editi=self.aParam.ui.btn_edit_inline.label; 
		              var opt_editi=self.aParam.ui.btn_edit_inline;
		              
		              var button_editi=jQuery(self.theme.getButton(label_editi,opt_editi));
		              button_editi.click(function(){
		                self.createFormInline(div_id, opt.data[self.pk], aData, true);
		              });		
		              jQuery(cell).append(button_editi);
		            }

		            if( self.aParam.user_function.upd ) {
		              var label_delete=self.aParam.ui.btn_delete.label; 
		              var opt_delete=self.aParam.ui.btn_delete;
		              
		              var button_delete=jQuery(self.theme.getButton(label_delete,opt_delete));
		              button_delete.click(function(){
		                  
		                self.deleteRecord(div_id, opt.data[self.pk]);
		              });		
		              jQuery(cell).append(button_delete);
		            }
		            
		            return cell;
		          }
		        }});
		        jQuery(div_id).html(html);
		        
		        if( self.aParam.user_function.ins ) {
		          var label_insert=self.aParam.ui.btn_insert.label; 
		          var opt_insert=self.aParam.ui.btn_insert;
		          
		          var button_insert=jQuery(self.theme.getButton(label_insert,opt_insert));
		          button_insert.click(function(){
		            self.createInsertForm(div_id);
		          });		
		          jQuery(div_id).append(button_insert);
		        }
		      }
		      else {
		        jQuery(div_id).html(self.theme.alertMessage(data.msg));
		      }
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
		  });
		}
		else{
			console.log('Table not ready (need to load the a Form)');
		}
  },
  deleteRecord: function (div_id, key){
    var self=this;
    this.api.delete({key:key, success:function(data){			
      self.createTable({div_id:div_id});
    }});
  },
  createInsertForm: function (div_id, key){
    var self = this; 
    jQuery(div_id).html(self.form.createForm());
    
    var label_save=self.aParam.ui.btn_save.label; 
    var opt_save=self.aParam.ui.btn_save;
    
    var button = self.theme.getButton(label_save, opt_save);
    jQuery(button).click(function(){
      self.api.insert({data:self.form.getValue(),success:function(data){
        jQuery(div_id).html('');
        self.createTable({div_id:div_id});
      }});
    });
    jQuery(div_id).append(button);
  },
  createForm: function (div_id, key, aData){
    var self=this;
    var aRecord = this.getARecord(key,aData);

    jQuery(div_id).html(this.form.createForm(aRecord));
    
    var label_save=self.aParam.ui.btn_save.label; 
    var opt_save=self.aParam.ui.btn_save;
    
//     var label_save='Salva'; var opt_save={};
//       if(self.aParam.btn_save) {
//         if(self.aParam.btn_save.label){
//           label_save=self.aParam.btn_save.label;
//       }
//       opt_save=self.aParam.btn_save;
//     }
    
    var button = self.theme.getButton(label_save, opt_save);
    jQuery(button).click(function(){
      self.api.update({key:key,data:self.form.getValue(),success:function(data){
        jQuery(div_id).html('');
        self.createTable({div_id:div_id});
      }});
    });
    jQuery(div_id).append(button);
  },
  getARecord: function (key,aData) {
    var aRecord=null;
    for(var i=0; i<aData.length; i++){
      if(aData[i]['id']==key){
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

    //get the form
    var html=this.form.createForm(aRecord);

    //define the row_id
    var row_id= div_id + ' table #dbmng_row_id_'+key;

    //get the original dimension of the table
    var listWidth = [];
    jQuery(row_id+" td").each(function() {
        listWidth.push($(this).width());
    });

    //Complicato metodo per eliminare il form senza eliminare i value degli input
    var fields=html.childNodes;
    var row=document.getElementById('dbmng_row_id_'+key);
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

    jQuery(row_id).find('label').hide();


    //change the field dimension using the td width
    jQuery(row_id+" td.dbmng_cell_inline").each(function(k,v){
      jQuery(v).width(listWidth[k]);
      jQuery(v).find('input').width(listWidth[k]);
      jQuery(v).find('select').width(listWidth[k]);
    });


    var label_save=self.aParam.ui.btn_save.label; 
    var opt_save=self.aParam.ui.btn_save;
    
    var button=self.theme.getButton(label_save, opt_save);
    jQuery(button).click(function(){
      self.api.update({key:key,data:self.form.getValue(),success:function(data){
        jQuery('button').removeAttr('disabled');
        jQuery(div_id).html('');
        self.createTable({div_id:div_id});
      }});
    });
    jQuery(row_id).append("<td class='dbmng_buttons'></td>");
    jQuery(row_id+' td.dbmng_buttons').html(button);
  }
});


