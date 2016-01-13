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
    this.aField.value = this.getFieldValue();
    if(typeof jQuery().fileupload !== 'undefined'){
      this.aField.field_type='hidden';
    }
    else{
      this.aField.field_type='file';
    }
    return this.theme.getInput(this.aField);
    /*
    var self=this;


    var fld=this._super();
    fld.type='file';
    fld.name="files[]";
    //fld.setAttribute('data-url',url);
    fld.multiple=true;
    return fld;
    */
  },
  createField: function(data_val){

    var self=this;
    var url='server/php/';
    if(self.aField.url){
      url=self.aField.url;
    }
    var path_file=url+"files/";
    if(self.aField.path_file){
      path_file=self.aField.path_file;
    }


    var el = this._super(data_val);



    if(typeof jQuery().fileupload !== 'undefined'){

      var aVField = {};
      aVField.field = this.aField.field + '_file';

      var elv = this.theme.getInput(aVField);
      elv.type='file';
      elv.name="files[]";


      var opt={};
      var btn_class="btn btn-success";
      var btn_icon="glyphicon glyphicon-plus";
      var btn_label="Select file...";
      var uploading_text="Uploading...";

      opt.class=btn_class;
      opt.icon=btn_icon;
      opt.label=btn_label;

      el.appendChild(this.theme.createFormUpload(elv,btn_label, opt));

      el.appendChild(document.createElement('br'));
      el.appendChild(document.createElement('br'));

      var el_progress=this.theme.createProgressBar({class:"progress"});
      el.appendChild(el_progress);

      var el_info=document.createElement('div');
      this.theme.addClass(el_info,"dbmng_fileupload_container");
      el.appendChild(el_info);

      var info=jQuery(el_info);
      if(typeof data_val !== 'undefined' && data_val!=='' && data_val !==null ){
        self.addFile(info, path_file, data_val);
      }



      jQuery(elv).fileupload({
          url: url,
          dataType: 'json',
          add: function (e, data) {
            console.log(data);
            info.html(uploading_text);
            data.submit();
          },
          progressall: function (e, data) {
              var progress = parseInt(data.loaded / data.total * 100, 10);
              console.log(progress);
              jQuery(el_progress).find(".progress-bar").css(
                  'width',
                  progress + '%'
              );
          },
          fail:function (e, data) {
            console.log(data);
            info.html(self.theme.alertMessage("Error"));
          },
          done: function (e, data) {

            console.log(data);
            if(data.result.files.length>0){
              info.html("");
              jQuery.each(data.result.files, function (index, file) {
                if(file.error){
                  info.append(self.theme.alertMessage(file.error));
                }
                else{
                  self.addFile(info, path_file, file.name);



                  self.setValue(file.name);
                }
              });
            }
            else{
                info.html("");
                jQuery.each(data.messages, function(k,v){
                  info.append(self.theme.alertMessage(v));
                });

            }
          }
      });
    }

    return el;
  },
  addFile:function(info, path_file, file){
    info.append("<a target='_NEW' class='dbmng_fileupload_filelink' href='"+path_file+file+"'>"+file+"</a>");
    var del=this.theme.getButton("delete",{type:'span',icon:"glyphicon glyphicon-remove"});
    info.append(del);

    jQuery(del).click(function(){
      info.html("");
      self.setValue("");
    });
  }
});
