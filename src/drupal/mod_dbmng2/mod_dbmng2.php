<?php
use Dbmng\Db;
use Dbmng\Dbmng;
use Dbmng\Api;
use Dbmng\App;
use Dbmng\Login;
use Respect\Rest\Router;
use Dbmng\DbmngHelper;
use Dbmng\Util;

function dbmng2_rest_response()
{
  
  
  global $base_path;
  
  $path = $base_path . "dbmng2/rest";
  $router = new \Respect\Rest\Router($path);

  $app=dbmng2_get_app();  
  $h = new DbmngHelper($app);
  $h->exeAllRest( $router );
}


function dbmng2_get_app(){

 global $user;
 global $databases;

  $dns = "mysql:host=".$databases['default']['default']['host'].";dbname=".$databases['default']['default']['database'].";user=".$databases['default']['default']['username'].";password=".$databases['default']['default']['password']."";
  $username=$databases['default']['default']['username'];
  $password=$databases['default']['default']['password'];
  
  $DB = Db::createDb($dns, $username, $password);

  $app = new App($DB, array('user'=>(array)$user, 'aParamDefault' => array('dbname' => $databases['default']['default']['database'])));
  return $app;
}

function dbmng2_ajax_response()
{
 
  
  $app=dbmng2_get_app();  
  $h = new DbmngHelper($app);

  if( isset($_REQUEST['fill_dbmng_fields']) )
    {
      $id_table = $_REQUEST['id_table'];
      $res = $h->getTableStructure($id_table);
      
      $result = json_encode($res);
    }
  elseif( isset($_REQUEST['delete_dbmng_fields']) )
    {
      if( isset($_REQUEST['id_table']) )
        {
          $sql = "delete from dbmng_fields where id_table = :id_table";
          $var = array(':id_table' => $_REQUEST['id_table']);
          $res = $app->getDb()->delete($sql, $var);
        }
      else
        {
          $res['ok'] = false;
          $res['message'] = "Something went wrong.";
        }
        
        $result = json_encode($res);
    }
  echo $result;
}

function dbmng2_manager() 
{
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.js', array('cache' => false));
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.iframe-transport.min.js', array('cache' => false));
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.fileupload.min.js', array('cache' => false));
  drupal_add_css( "https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/css/jquery.fileupload.min.css", "external" );
  
  drupal_add_js('sites/all/libraries/dbmng2/js/dist/dbmng.js',array('cache' => false));
  
  drupal_add_js('sites/all/modules/mod_dbmng2/mod_dbmng2.js',array('cache' => false));
  drupal_add_css('sites/all/modules/mod_dbmng2/mod_dbmng2.css',array('cache' => false));
  
  drupal_add_js('sites/all/libraries/utils/typeahead.bundle.min.js',array('cache' => false));
  drupal_add_js('sites/all/libraries/utils/hendlebars.js',array('cache' => false));
  
  //global $DBMNG;
  global $user;
  global $base_path;
  
  drupal_add_js("var base_path='$base_path'", "inline");
  drupal_add_js("jQuery(document).ready(function(){dbmng2_show_tables()})", "inline");
  
  $html = "";
  
  $html .= "<div id='dbmng2_table_list'></div>";
  $html .= "<div id='dbmng2_table_edit'></div>";
  return $html;
}

