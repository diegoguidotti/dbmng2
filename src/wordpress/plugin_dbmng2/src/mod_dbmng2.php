<?php
use Dbmng\Db;
use Dbmng\Dbmng;
use Dbmng\Api;
use Dbmng\App;
use Dbmng\Login;
use Respect\Rest\Router;
use Dbmng\DbmngHelper;
use Dbmng\Util;

//
// General function
//
function dbmng2_get_app(){

  $dns = "mysql:host=".DB_HOST.";dbname=".DB_NAME.";user=".DB_USER.";password=".DB_PASSWORD."";
  $username=DB_USER;
  $password=DB_PASSWORD;

  $DB = Db::createDb($dns, $username, $password);

  $user = $_SESSION['user'];
  $app  = new App($DB, array('user'=>$user, 'aParamDefault' => array('dbname' => DB_NAME)));
  return $app;
}

function dbmng2_get_db()
{
  $app = dbmng2_get_app();
  $DB  = $app->getDb();
  return $DB;
}

function dbmng2_rest( ) {
  $path = getPath();
  $base_path = "/$path/wp-json/";
  $path   = $base_path.'aedit/v1/dbmng2/rest';
  $router = new \Respect\Rest\Router($path);
  $router->isAutoDispatched = false;
  
  $app = dbmng2_get_app();
  $DB  = $app->getDb();
  
  $h = new DbmngHelper($app);
  $h->exeAllRest( $router );
  
  
  return json_decode($router->run());
}

function dbmng2_ajax( ) {
  $path = getPath();
  $base_path = "/$path/wp-json/";
  $path   = $base_path.'aedit/v1/dbmng2/ajax';
  $router = new \Respect\Rest\Router($path);
  $router->isAutoDispatched = false;
  
  $app=dbmng2_get_app();
  $h = new DbmngHelper($app);
  $h->exeOtherDbmngRest( $router );

  return json_decode($router->run());
}


function dbmng2_manager()
{ 
  $path = getPath();
  $base_path = "/$path/wp-json/";
  $html = "";
  $html .= "<script language='javascript'>";
    $html .= "var base_path='$base_path';";
    $html .= "jQuery(document).ready(function(){dbmng2_show_tables()})";
  $html .= "</script>";
  
  $html .= "<div id='dbmng2_table_list'></div>";
  $html .= "<div id='dbmng2_table_edit'></div>";
  return $html;
}

function getPath()
{
  $aPath = explode("/",ABSPATH);
  $nCnt  = count($aPath);
  
  return $aPath[$nCnt-2];
}
?>
