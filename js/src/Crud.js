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
    
    aParamD = {ui: {btn_edit: {label:'Edit', class: 'btn-success'},
                    btn_edit_inline: {label:'Edit inline', class: 'btn-success'},
                    btn_delete: {label:'Delete', class: 'btn-danger'}, //<i class="fa fa-camera-retro fa-2x"></i>
                    btn_insert: {label:'Insert', class: 'btn-default btn-block'},
                    btn_save: {label:'Save', class: 'aaa btn-default btn-block'}},
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

    this.form=new Dbmng.Form({aForm:this.aForm, aParam:this.aParam, theme:this.theme});
    this.api=new  Dbmng.Api({aForm:this.aForm, url:this.url, user:options.user, password:options.password});

    this.pk=this.form.getPkField();
  },
  createTable: function( opt ){
    var div_id=opt.div_id;
    if( div_id.substring(0, 1) != '#') {
      div_id = '#' + div_id;
    }

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
        
          var html=self.theme.getTable({data:cData, header:header, options:{
            assignClass:true,
            setIDRow:function(aData){
              return "dbmng_row_id_"+aData[self.pk];
            },
            addColumn:function(opt){
              console.log(self.aParam);
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
                
                var button_edit=jQuery(self.theme.getButton(label_editi,opt_editi));
                button_edit.click(function(){
                  self.createFormInline(div_id, opt.data[self.pk], aData, true);
                });		
                jQuery(cell).append(button_edit);
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
          
          if( self.aParam.user_function.inline ) {
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
        var objError = JSON.parse(error.responseText);
        jQuery(div_id).html(self.theme.alertMessage(objError.message));
      }
    });
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
    
    var label_save='Salva'; var opt_save={};
      if(self.aParam.btn_save) {
        if(self.aParam.btn_save.label){
          label_save=self.aParam.btn_save.label;
      }
      opt_save=self.aParam.btn_save;
    }
    
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


