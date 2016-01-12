/////////////////////////////////////////////////////////////////////
// AbstractWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.DateWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    this.aField.value = this.getFieldValue();
    this.aField.field_type='text';
    return this.theme.getInput(this.aField);
  },
  createField: function(data_val){
    var self=this;
    var el = this._super(data_val);
    
    var aVField = {};
    aVField.field = this.aField.field + '_view';
    
    var elv = this.theme.getInput(aVField);
    
    jQuery(elv).blur(function(){
      console.log(jQuery(elv).val());
      if( jQuery(elv).val() == '' ) {
        self.widget.value = "";
      }
      
    });
    jQuery(elv).datepicker({altField: el, dateFormat:'dd-mm-yy' , altFormat:'yy-mm-dd'});  
    
    
  //$html .='<script>  jQuery("#dbmng_'.$fld.'_tmp").blur(function(){ if(jQuery("#dbmng_'.$fld.'_tmp").val()==""){  jQuery("#dbmng_'.$fld.'").val("");} }); jQuery(function() { jQuery( "#dbmng_'.$fld.'_tmp" ).datepicker({altField: \'#dbmng_'.$fld.'\', dateFormat:\'dd-mm-yy\' , altFormat: \'yy-mm-dd\'});  });  </script>';
    
    
    el.appendChild(elv);
    
    return el;
  }
});
