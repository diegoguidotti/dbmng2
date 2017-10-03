<?php
require_once 'settings.php';

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
  global $user;
  // global $base_path;
  global $aSetting;
  $html='';
  $html.=('<script src="vendor/components/jqueryui/jquery-ui.js"></script>');
  $html.=('<script src="vendor/blueimp/jquery-file-upload/js/jquery.iframe-transport.js"></script>');
  $html.=('<script src="vendor/blueimp/jquery-file-upload/js/jquery.fileupload.js"></script>');

  $html.=('<link rel="stylesheet" type="text/css" href="vendor/blueimp/jquery-file-upload/css/jquery.fileupload.css">');
  $html.=('<link rel="stylesheet" type="text/css" href="vendor/components/font-awesome/css/font-awesome.css">');
  $html .= "<script src='mod_dbmng2/mod_dbmng2.js'></script>";

  $html.=('<link rel="stylesheet" type="text/css" href="mod_dbmng2/mod_dbmng2.css">');

  $html.=('<script src="vendor/twitter/typeahead.js/dist/typeahead.bundle.min.js"></script>');
  $html.=('<script src="vendor/components/handlebars.js/handlebars.js"></script>');

  $html.=("<script>var base_path='".$aSetting['BASE_PATH']."'</script>");

  $html.=("<script>var dbmng2_api_path='".DBMNG2_API_PATH."/'</script>");
  $html.=("<script>jQuery(document).ready(function(){dbmng2_show_tables()})</script>");

  $html .= "<div id='dbmng2_table_list'></div>";
  $html .= "<div id='dbmng2_table_edit'></div>";

  return $html;
}

function exeAllRest( $db, $base_path, $user, $param )
{
  $router_dbmng = new \Respect\Rest\Router($base_path.DBMNG2_API_PATH);
  $app = new Dbmng\App($db, array('user'=>$user, 'aParamDefault' => $param));
  $h = new Dbmng\DbmngHelper($app);
  $h->exeAllRest( $router_dbmng );
}

?>
