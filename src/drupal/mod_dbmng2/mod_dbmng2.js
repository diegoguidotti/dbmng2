Dbmng.defaults.aParam = {};
Dbmng.defaults.aParam.ui = {};
Dbmng.defaults.aParam.ui.btn_edit = {label:'Edit', icon:'fa fa-pencil'};
Dbmng.defaults.aParam.ui.btn_edit_inline = {label:'Edit inline', icon:'fa fa-pencil-square-o'};
Dbmng.defaults.aParam.ui.btn_delete = {label:'Delete', icon:'fa fa-trash', confirm_message: 'Are you sure to delete the table?'};
Dbmng.defaults.aParam.ui.btn_insert = {label:'Insert new tables', class:'btn-success btn-block'};
Dbmng.defaults.aParam.ui.btn_save = {label:'Save table', class:'btn-success btn-block'};
Dbmng.defaults.aParam.ui.btn_cancel = {label:'Cancel', class:'btn-danger btn-block'};
Dbmng.defaults.aParam.ui.table_class = 'table-condensed table-hover';
Dbmng.defaults.aParam.user_function = {upd:1, del:1, ins:1};

function dbmng2_show_tables() {
  var div_id = 'dbmng2_table_list';
  var path   = base_path + dbmng2_api_path; // + '/rest/';
  var table  = 'dbmng_tables';
  var field  = 'dbmng_fields';
  var aParam = {};

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

  aParam.custom_function = {action: 'dbmng2_show_fields', label: 'Show fields', icon: 'fa fa-th-list'};

  var theme_boot = new Dbmng.BootstrapTheme();
  var url;
  var crud = new Dbmng.Crud({
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
      if( method == 'insert' ) {
        url = base_path + dbmng2_api_path + "api/dbmng_tables/schema/fill";
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
        url = base_path + dbmng2_api_path + "api/dbmng_tables/schema/delete";
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

function dbmng2_show_fields(id_table) {
  var div_id = 'dbmng2_table_edit';
  var path   = base_path + dbmng2_api_path; // + '/rest/';
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
  aParam.ui.btn_insert = {label:'Insert new fields'};
  aParam.ui.btn_save = {label:'Save field'};
  aParam.ui.btn_delete = {confirm_message: 'Are you sure to delete the field?'};
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

// funzione implementata per effettuare test sulla libreria dbmng2
function dbmng2_test() {
  console.log("Test...");
  var div_id = 'dbmng2_table_list';
  var path   = base_path + dbmng2_api_path; // + '/rest/';
  var table  = 'tabella_test';
  var aParam = {};
  aParam.ui = {};
  aParam.ui.btn_edit = {label:'Modifica', icon:'fa fa-pencil'};
  aParam.ui.btn_edit_inline = {label:'Modifica in linea', icon:'fa fa-pencil-square-o'};
  aParam.ui.btn_delete = {label:'Elimina', icon:'fa fa-trash', confirm_message: 'Sei sicuro di voler eliminare il record?'};
  aParam.ui.btn_insert = {label:'Inserisci nuovo record', class:'btn-success btn-block'};
  aParam.ui.btn_save = {label:'Salva record', class:'btn-success btn-block'};
  aParam.ui.btn_cancel = {label:'Cencella', class:'btn-danger btn-block'};
  aParam.ui.table_class = 'table-condensed table-hover';
  aParam.user_function = {upd:1, del:1, ins:1};

  jQuery('#dbmng2_table_edit').hide();
  jQuery('#dbmng2_table_list').show();

  var theme_boot = new Dbmng.BootstrapTheme();
  var crud = new Dbmng.Crud({
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
      // jQuery(".error-message").append(message);
      jQuery('#'+div_id).html(js_set_message(message,'danger'));
    },
    crud_success: function(method, data){
      console.log(method, data);
    },
    crud_delete: function(_method, data){
      var message = "";
      if( data.message.indexOf("Foreign") > -1 ) {
        message = "Non puoi eliminare il record in quanto presente un record in altra tabella collegata a questa";
      }
      var msg=crud.theme.alertMessage(message);
      jQuery('#'+div_id).find(".dbmng_form_button_message").html(msg);
    }
  });
  console.log(crud);
}

function js_set_message(message, type){
  // Valori possibili per il parametro type
  // "success" = verde
  // "warning" = arancio
  // "danger" = rosso
  var type_messages='success';
  if (typeof type!=='undefined') {
    var aType = ['success', 'warning', 'danger'];

    if( aType.indexOf(type) > -1 ) {
      type_messages=type;
    }
  }

  html = "<div class='alert alert-block alert-"+type_messages+" messages status gestraee-alert'>";
    html +=   "<a class='close' data-dismiss='alert' href='#'>×</a>";
    html +=   "<h4 class='element-invisible'>Status message</h4>";
    html += message;
  html += "</div>";

  return html;
}
