/////////////////////////////////////////////////////////////////////
// FileWidget
// 12 November 2015
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.FileWidget = Dbmng.AbstractWidget.extend({
  createWidget: function(){
    var self=this;
    var url='server/php/';
    if(self.aField.url){
      url=self.aField.url;
    }

    var fld=this._super();
    fld.type='file';
    fld.name=fld.name+"[]";
    fld.setAttribute('data-url',url);
    fld.multiple=true;
    return fld;
  },
  createField: function(data_val){

    var self=this;
    var date_format_view='dd-mm-yy';
    if(self.aField.date_format_view){
      date_format_view=self.aField.date_format_view;
    }

    var el = this._super(data_val);
    if(typeof jQuery.datepicker !== 'undefined'){
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
  }
});

/*
<input id="fileupload" type="file" name="files[]" data-url="server/php/" multiple>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/vendor/jquery.ui.widget.js"></script>
<script src="js/jquery.iframe-transport.js"></script>
<script src="js/jquery.fileupload.js"></script>
<script>
$(function () {
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        }
    });
});
*/
