/////////////////////////////////////////////////////////////////////
// DateWidget
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
    if(typeof jQuery.datepicker !== 'undefined'){
      this.aField.field_type='hidden';
    }
    else{
      if( this.aField.type == 'date' ) {
        this.aField.field_type='date';
      }
      else if( this.aField.type == 'time' ) {
        this.aField.field_type='time';
      }
      else if( this.aField.type == 'datetime-local' ) {
        this.aField.field_type='datetime-local';
      }
    }
    return this.theme.getInput(this.aField);
  },
  createField: function(data_val){

    var self=this;
    var date_format_view='dd-mm-yy';
    // console.log(self);
    if(self.aField.date_format_view){
      date_format_view=self.aField.date_format_view;
    }

    var el = this._super(data_val);
    if(typeof jQuery.datepicker !== 'undefined' ){
      var aVField = {};
      aVField.field = this.aField.field + '_view';

      var elv = this.theme.getInput(aVField);
      if(typeof data_val !== 'undefined' && data_val!=='' && data_val !==null ){
        elv.value=jQuery.datepicker.formatDate(date_format_view,jQuery.datepicker.parseDate( "yy-mm-dd", data_val ));
      }

      jQuery(elv).blur(function(){
        console.log(jQuery(elv).val());
        if( jQuery(elv).val() === '' ) {
          self.widget.value = "";
        }

      });
      jQuery(elv).datepicker({altField: jQuery(self.widget),
        dateFormat:date_format_view , altFormat:'yy-mm-dd'
      });

      el.appendChild(elv);
    }

    return el;
  },
  getValue: function() {
    var el = this._super();
		if(el===''){
			return null;
		}
		else{
				return el;
			}
		}
});
