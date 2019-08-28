function aedit_dbmng_manager(){
  var root = 'view';
  var useHash = true; // Defaults to: false
  var hash = '#'; // Defaults to: '#'
  var router = new Navigo(root, useHash, hash);

  router.on({
    'dbmng_test': function() {
      console.log("... dbmng_test ...");
    },
    '*': function () {
      console.log("HOME");
      aedit_dbmng_dbmng2_show_tables();
    },
  }).resolve();
}

function aedit_dbmng_dbmng2_show_tables() {
  var div_id = 'dbmng2_table_list';
  var path   = 'api_mod_aedit_dbmng/';
  var table  = 'dbmng_tables';
  var field  = 'dbmng_fields';
  var aParam = {};

  aParam = {};
  aParam.ui = {};
  aParam.ui.btn_edit = {label:'Edit', icon:'fa fa-pencil'};
  aParam.ui.btn_edit_inline = {label:'Edit inline', icon:'fa fa-pencil-square-o'};
  aParam.ui.btn_delete = {label:'Delete', icon:'fa fa-trash', confirm_message: 'Are you sure to delete the table?'};
  aParam.ui.btn_insert = {label:'Insert new tables', class:'btn-success btn-block'};
  aParam.ui.btn_save = {label:'Save table', class:'btn-success btn-block'};
  aParam.ui.btn_cancel = {label:'Cancel', class:'btn-danger btn-block'};
  aParam.ui.table_class = 'table-condensed table-hover';
  aParam.user_function = {upd:1, del:1, ins:1};


  jQuery('#dbmng2_table_edit').hide();
  jQuery('#dbmng2_table_list').show();

  var template="";
  template += "<div>";
    template += "<h3>Dbmng Table</h3>";
    template += "<table class='table'>";
      template += "<tr><td data-content='id_table' class='col-xs-6'></td><td data-content='table_name' class='col-xs-6'></tr>";
      template += "<tr><td data-content='table_label' class='col-xs-6'></td><td data-content='table_alias' class='col-xs-6'></tr>";
      template += "<tr><td colspan='2' data-content='table_desc' class='col-xs-12'></td></tr>";
      template += "<tr><td colspan='2' data-content='param' class='col-xs-12'></td></tr>";
    template += "</table>";
  template += "</div>";
  aParam.template_form = template;
  aParam.custom_function = {action: 'aedit_dbmng_dbmng2_show_fields', label: 'Show fields', icon: 'fa fa-th-list'};

  var theme_boot = new Dbmng.BootstrapTheme();
  new Dbmng.Crud({
    aParam:aParam, theme:theme_boot, url: path + 'api/' + table,
    success:function(self){
      console.log("success");
      console.log(self);
      self.createTable({div_id:'#'+div_id});
    },
    error:function(err){
      console.log(err);
      message = "<div class='error-message'>";
      message += "<b>Error</b><br/>API:" +path + 'api/' + table + "<br/>" + err.statusText+ "<br/><br/>";
      message += "Check the corrispondence from called API and the relative record in dbmng_tables";
      message += "</div>";
      jQuery('#'+div_id).html(js_set_message(message,'danger'));
    },
    crud_success: function(method, data){
      console.log(method, data);
      if( method == 'insert' ) {
        url = path + "api/dbmng_tables/schema/fill";
        if( data.ok ) {
          jQuery.ajax({
            type: 'POST',
            url: url,
            data: {id_table:data.inserted_id},
            success: function(msg){
              obj = JSON.parse(msg);
              console.log(obj);
              if( obj.ok ) {
                dbmng2_show_fields(obj.id_table);
              }
            }
          });
        }
      }
      else if( method == 'delete' ) {
        url = path + "api/dbmng_tables/schema/delete";
        jQuery.ajax({
          type: 'POST',
          url: url,
          data: {id_table:data.deleted_id},
          success: function(msg){
            obj = JSON.parse(msg);
            if( obj.ok ) {
              console.log(obj);
            }
          }
        });
      }
    }
  });
}

function aedit_dbmng_dbmng2_show_fields(id_table){
  console.log(id_table);
  var div_id = 'dbmng2_table_edit';
  var path   = 'api_mod_aedit_dbmng/';
  var table  = 'dbmng_tables';
  var field  = 'dbmng_fields';
  var aParam = {};


  jQuery('#dbmng2_table_list').hide();
  jQuery('#dbmng2_table_edit').show();

  var template="";
  template += "<div>";
    template += "<h3>Dbmng Fields</h3>";
    template += "<table class='table'>";
      template += "<tr><td data-content='id_field' class='col-xs-3'></td><td data-content='field_name' class='col-xs-3'></td><td data-content='id_field_type' class='col-xs-3'></td><td data-content='pk' class='col-xs-3'></td></tr>";
      template += "<tr><td data-content='field_label'></td><td data-content='field_widget'></td><td data-content='nullable'></td><td data-content='field_size'></td></tr>";
      template += "<tr><td data-content='field_order'></td><td data-content='readonly'></td><td data-content='skip_in_tbl'></td><td data-content='is_searchable'></td></tr>";

      template += "<tr><td colspan='4' data-content='voc_sql'></td></tr>";
      template += "<tr><td colspan='4' data-content='param'></td></tr>";
      template += "<tr><td colspan='2' data-content='field_note'></td><td data-content='default_value'></td><td data-content='field_label_long'></td></tr>";
    template += "</table>";
  template += "</div>";
  aParam.template_form = template;

  aParam.ui = {};

  aParam.ui.btn_edit = {label:'Edit', icon:'fa fa-pencil'};
  aParam.ui.btn_edit_inline = {label:'Edit inline', icon:'fa fa-pencil-square-o'};
  aParam.ui.btn_delete = {label:'Delete', icon:'fa fa-trash', confirm_message: 'Are you sure to delete the field?'};
  aParam.ui.btn_insert = {label:'Insert new field', class:'btn-success btn-block'};
  aParam.ui.btn_save = {label:'Save field', class:'btn-success btn-block'};
  aParam.ui.btn_cancel = {label:'Cancel', class:'btn-danger btn-block'};
  aParam.ui.table_class = 'table-condensed table-hover';
  aParam.user_function = {upd:1, del:1, ins:1};
  aParam.search = {id_table:id_table};

  var theme_boot = new Dbmng.BootstrapTheme();
  var crud = new Dbmng.Crud({
    aParam:aParam, theme:theme_boot, url: path + 'api/' + field,
    success:function(self){
      console.log(self);
      self.createTable({div_id:'#'+div_id});
    },
    error:function(err){
      console.log(err);
      message = "<div class='error-message'>";
      message += "<b>Error</b><br/>API:" +path + 'api/' + table + "<br/>" + err.statusText+ "<br/><br/>";
      message += "Check the corrispondence from called API and the relative record in dbmng_tables";
      message += "</div>";
      jQuery('#'+div_id).html(js_set_message(message,'danger'));
    },
  });

  var api = new Dbmng.Api({url:path + 'api/' + table});
  api.select({
    search: "id_table="+id_table,
    success: function(data){
      jQuery(document).ajaxStop(function(){
        jQuery("#table_name").html("");
        jQuery('#dbmng2_table_edit').prepend("<div id='table_name'>Tablename: <strong>"+data.data[0].table_name+"</strong> [id="+id_table+"]</div>");
        jQuery('#dbmng2_table_edit .dbmng_form_button_right').html('<button id="back2table" class="btn-block btn btn-default">Back to table</button>');

        jQuery('#back2table').click(function(){
          jQuery('#dbmng2_table_edit').hide();
          jQuery('#dbmng2_table_list').show();
        });
      });
    }
  });
}
