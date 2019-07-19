<?php
use Dbmng\Db;
use Dbmng\Dbmng;
use Dbmng\Api;
use Dbmng\App;
use Dbmng\Login;
use Respect\Rest\Router;
use Dbmng\DbmngHelper;
use Dbmng\Util;

function dbmng2_get_app()
{
  global $user;
  global $databases;

  if( $databases['default']['default']['driver'] == 'mysql' )
    {
      $dns = "mysql:host=".$databases['default']['default']['host'].";dbname=".$databases['default']['default']['database'].";user=".$databases['default']['default']['username'].";password=".$databases['default']['default']['password']."";
    }
  else
    {
      $dns = "pgsql:host=".$databases['default']['default']['host'].";dbname=".$databases['default']['default']['database'].";user=".$databases['default']['default']['username'].";password=".$databases['default']['default']['password']."";
    }
  $username = $databases['default']['default']['username'];
  $password = $databases['default']['default']['password'];

  $DB = Db::createDb($dns, $username, $password);
  $DB->setDebug(true);

  $app = new App($DB, array('user'=>(array)$user, 'aParamDefault' => array('dbname' => $databases['default']['default']['database'])));
  return $app;
}

function dbmng2_get_db()
{
  $app = dbmng2_get_app();
  $DB  = $app->getDb();
  return $DB;
}

function dbmng2_rest_response()
{
  global $base_path;

  $path = $base_path . DBMNG2_API_PATH;
  $router = new \Respect\Rest\Router($path);

  $app=dbmng2_get_app();
  $h = new DbmngHelper($app);
  $h->exeAllRest( $router );
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

  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/0.11.1/typeahead.bundle.min.js',array('cache' => false));
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.js',array('cache' => false));

  global $user;
  global $base_path;

  drupal_add_js("var base_path='$base_path'", "inline");
  drupal_add_js("var dbmng2_api_path='".DBMNG2_API_PATH."/'", "inline");
  drupal_add_js("jQuery(document).ready(function(){dbmng2_show_tables()})", "inline");

  $html = "";

  $html .= "<div id='dbmng2_table_list'></div>";
  $html .= "<div id='dbmng2_table_edit'></div>";

  return $html;
}

function dbmng2_test(){
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.js', array('cache' => false));
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.iframe-transport.min.js', array('cache' => false));
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.fileupload.min.js', array('cache' => false));
  drupal_add_css( "https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/css/jquery.fileupload.min.css", "external" );

  drupal_add_js('sites/all/libraries/dbmng2/js/dist/dbmng.js',array('cache' => false));

  drupal_add_js('sites/all/modules/mod_dbmng2/mod_dbmng2.js',array('cache' => false));
  drupal_add_css('sites/all/modules/mod_dbmng2/mod_dbmng2.css',array('cache' => false));

  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/0.11.1/typeahead.bundle.min.js',array('cache' => false));
  drupal_add_js('https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.js',array('cache' => false));

  global $user;
  global $base_path;

  drupal_add_js("var base_path='$base_path'", "inline");
  drupal_add_js("var dbmng2_api_path='".DBMNG2_API_PATH."/'", "inline");
  drupal_add_js("jQuery(document).ready(function(){dbmng2_test()})", "inline");

  $html = "";

  $html .= "<div id='dbmng2_table_list'></div>";
  $html .= "<div id='dbmng2_table_edit'></div>";

  return $html;

}
