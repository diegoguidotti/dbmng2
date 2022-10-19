/////////////////////////////////////////////////////////////////////
// FileWidget
// 13 January 2016
//
//
// Developed by :
// Diego Guidotti
// Michele Mammini
/////////////////////////////////////////////////////////////////////

Dbmng.FileWidget = Dbmng.AbstractWidget.extend({
  createWidget: function () {
    this.aField.value = this.getFieldValue();
    if (typeof jQuery().fileupload !== 'undefined') {
      this.aField.field_type = 'hidden';
    }
    else {
      this.aField.field_type = 'file';
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


  getValue: function () {

    var standard_value = this._super();

    var self = this;

    if (self.aField.multiple) {
      return self.files;
    }
    else {
      return standard_value;
    }
  },

  createField: function (data_val) {


    var self = this;
    // console.log(self);

    var url = 'server/php/';
    if (self.aParam.url) {
      url = self.aParam.url + "file/" + self.field + "/";
    }
    if (self.aField.url) {
      url = self.aField.url;
    }
    var weburl_file = url + "files/";
    if (self.aField.weburl_file) {
      weburl_file = self.aField.weburl_file;
    }

    var el = this._super(data_val);

    if (typeof jQuery().fileupload !== 'undefined') {

      var aVField = {};
      aVField.field = this.aField.field + '_file';

      var elv = this.theme.getInput(aVField);
      elv.type = 'file';
      elv.name = "files[]";

      if (self.aField.multiple) {
        elv.multiple = "multiple";
      }

      var opt = {};
      var btn_class = "btn btn-success";
      var btn_icon = "glyphicon glyphicon-plus";
      var btn_label = "Select file...";
      var uploading_text = "Uploading...";

      if (self.aField.class) {
        btn_class = self.aField.class;
      }
      if (self.aField.add_icon) {
        btn_icon = self.aField.add_icon;
      }
      if (self.aField.label_file) {
        btn_label = self.aField.label_file;
      }
      if (self.aField.uploading_text) {
        uploading_text = self.aField.uploading_text;
      }

      opt.class = btn_class;
      opt.icon = btn_icon;
      opt.label_file = btn_label;

      el.appendChild(this.theme.createFileUploadField(elv, btn_label, opt));

      var info = jQuery(el).find('.dbmng_fileupload_container');

      var el_progress = jQuery(el).find('.progress');

      // var info=jQuery(el).find('.dbmng_fileupload_container');
      if (typeof data_val !== 'undefined' && data_val !== '' && data_val !== null) {
        if (self.aField.multiple) {
          self.files = data_val;

          jQuery.each(data_val, function (k, i) {
            self.addFile(info, weburl_file, i);
          });
        }
        else {
          self.addFile(info, weburl_file, data_val);
        }
      }

      jQuery(elv).fileupload({
        url: url,
        dataType: 'json',
        add: function (e, data) {
          console.log(data);
          info.append(uploading_text);
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
        fail: function (e, data) {
          console.log(data);
          info.append(self.theme.alertMessage("Error"));
        },
        done: function (e, data) {
          console.log(data);
          if (data.result.files) {
            if (data.result.files.length > 0) {
              // info.html("");
              jQuery.each(data.result.files, function (index, file) {
                if (file.error) {
                  info.append(self.theme.alertMessage(file.error));
                }
                else if (!file.completed) {
                  info.append(self.theme.alertMessage("Not Completed!!!!"));
                }
                else {
                  var url = weburl_file;
                  if (file.relative_folder) {
                    url = file.relative_folder;
                  }

                  self.addFile(info, url, file.name);

                  var fileValue = "";
                  if (self.aField.multiple) {


                    if (!self.files) {
                      self.files = [];
                    }

                    fileValue = file.name;
                    if (file.relative_path) {
                      fileValue = file.relative_path;
                    }

                    self.files.push(fileValue);

                  }
                  else {
                    fileValue = file.name;
                    if (file.relative_path) {
                      fileValue = file.relative_path;
                    }
                    self.setValue(fileValue);
                  }
                }
              });
            }
            else {
              info.html("");
              jQuery.each(data.messages, function (k, v) {
                info.append(self.theme.alertMessage(v));
              });
            }
          }
          else {
            info.append(self.theme.alertMessage(data.result.message));
          }
        }
      });
    }
    else {
      jQuery(el).append(self.theme.alertMessage("Resources missing! Please load the following files: jquery-ui.js, jquery.iframe-transport and jquery.fileupload"));
    }

    return el;
  },

  addFile: function (info, weburl_file, file) {
    var self = this;
    var btn_icon = "glyphicon glyphicon-remove";
    if (self.aField.remove_icon) {
      btn_icon = self.aField.remove_icon;
    }
    var btn_title = "Delete";
    if (self.aField.remove_title_icon) {
      btn_title = self.aField.remove_title_icon;
    }
    var guid = (parseInt(Math.random() * 32001212121)).toString(16);

    var file_link = "";

    if (self.aField.hide_link) {
      file_link = ("" + this.assignFileTypeIcon(file) + " " + file);
    }
    else {
      file_link = ("<a target='_NEW'  class='dbmng_fileupload_filelink' href='" + weburl_file + file + "'>" + this.assignFileTypeIcon(file) + " " + file + "</a>&nbsp;");
    }
    var del = this.theme.getDeleteButton(btn_title, btn_icon);
    info.append("<br/><span id='" + guid + "'>" + file_link + "&nbsp</span>");

    info.find("#" + guid).append(del);

    jQuery(del).click(function () {
      jQuery("#" + guid).html("");
      // info.html("");
      if (self.aField.multiple) {
        console.log(file);
        console.log(self.files);


        var index = self.files.indexOf(file);
        if (index > -1) { // only splice array when item is found
          self.files.splice(index, 1); // 2nd parameter means remove one item only
        }
        else {
          console.log("File not found");
        }

      }
      else {
        self.setValue("");
      }
    });
  },

  assignFileTypeIcon: function (file) {
    console.log(typeof file);
    var aFile = file.split('.');
    var file_type_icon = "";
    if (aFile[1] == 'pdf') {
      file_type_icon = '<i class="fa fa-file-pdf-o"></i>';
    }
    return file_type_icon;
  }
});
