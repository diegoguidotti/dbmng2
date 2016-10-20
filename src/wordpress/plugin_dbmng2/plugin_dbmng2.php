<?php 
/*
Plugin Name: plugin_dbmng2
Plugin URI: http://www.aedit.it/
Description: A plugin created to manage dbmng2 library
Version: 1.0
Author: Michele Mammini
Author URI: http://www.aedit.it
License: GPL
*/
include_once (WP_CONTENT_DIR."/libraries/dbmng2/src/Db.php");
include_once (WP_CONTENT_DIR."/libraries/dbmng2/src/Dbmng.php");
include_once (WP_CONTENT_DIR."/libraries/dbmng2/src/Api.php");
include_once (WP_CONTENT_DIR."/libraries/dbmng2/src/App.php");
include_once (WP_CONTENT_DIR."/libraries/dbmng2/src/Login.php");
include_once (WP_CONTENT_DIR."/libraries/dbmng2/src/DbmngHelper.php");

require_once (WP_CONTENT_DIR."/libraries/dbmng2/vendor/autoload.php");
require_once ("src/mod_dbmng2.php");

add_action( 'init', 'init_plugin_dbmng2' );
function init_plugin_dbmng2() {
  $wp_user = wp_get_current_user();
  
  if( count($wp_user->roles) > 0 )
    {
      $aRoles = $wp_user->roles;
      $uid=$wp_user->data->ID;
    }
  else
    {
      $aRoles[] = 'anonymous user';
      $uid=10; 
    }
    
  $user    = array('uid'=> $uid, 'mail'=>$wp_user->data->user_email, 'name'=>$wp_user->data->user_login, 'roles'=>$aRoles);
  $_SESSION['user'] = $user;
//   print_r($wp_user);
}

//
// Funzione per aggiungere il contenuto alla pagina
//
add_filter( 'the_content', 'plugin_dbmng2' );
function plugin_dbmng2($content) {
  global $post;
  $html = "";
  $html .= $content;
//   if(is_page() && $post->post_name == 'dbmng2')
//     {
//       $html .=  dbmng2_manager();
//     }
//   else
//     {
//       $html = $content;
//     }
  
  return $html;
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'aedit/v1', 'dbmng2/rest/(\S?)+', array(
    'methods' => WP_REST_Server::ALLMETHODS,
    'callback' => 'dbmng2_rest',
  ) );
  register_rest_route( 'aedit/v1', 'dbmng2/ajax/(\S?)+', array(
    'methods' => WP_REST_Server::ALLMETHODS,
    'callback' => 'dbmng2_ajax',
  ) );
} );


//
// Funzione per aggiungere css e js al sito
//
add_action( 'wp_enqueue_scripts', 'plugin_dbmng2_add_script' );
add_action( 'admin_enqueue_scripts', 'plugin_dbmng2_add_script' );
function plugin_dbmng2_add_script($hook)
{
  if( $hook == 'toplevel_page_plugin_dbmng2' || $hook == '' )
    {
      wp_register_script( 'jquery-ui-js', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.js' , array(), '', true );
      wp_enqueue_script( 'jquery-ui-js' );
      wp_register_script( 'jquery-iframe-transport-js', 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.iframe-transport.min.js' , array(), '', true );
      wp_enqueue_script( 'jquery-iframe-transport-js' );
      wp_register_script( 'jquery-fileupload-js', 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.fileupload.min.js' , array(), '', true );
      wp_enqueue_script( 'jquery-fileupload-js' );
      
      wp_register_style( 'jquery-fileupload-css', 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/css/jquery.fileupload.min.css' );
      wp_enqueue_style( 'jquery-fileupload-css' );
      
      wp_register_script( 'typeahead-bundle', 'https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/0.11.1/typeahead.bundle.min.js', array(), '', 'all' );
      wp_enqueue_script( 'typeahead-bundle' );
      wp_register_script( 'handlebars-js', 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.js', array(), '', 'all' );
      wp_enqueue_script( 'handlebars-js' );
      
      wp_register_script( 'dbmng-js', '/wp-content/libraries/dbmng2/js/dist/dbmng.js', array(), '', 'all' );
      wp_enqueue_script( 'dbmng-js' );

      // Registra il css per il plugin
      wp_register_style( 'plugin-dbmng2-style', plugins_url( '/css/plugin_dbmng2.css', __FILE__ ) );
      //enqueue css:
      wp_enqueue_style( 'plugin-dbmng2-style' );

      wp_register_script( 'plugin-dbmng2-script', plugins_url( '/js/plugin_dbmng2.js', __FILE__ ), array(), '', 'all' );
      wp_enqueue_script( 'plugin-dbmng2-script' );
    }
}

add_action( 'admin_enqueue_scripts', 'dbmng2_theme_style' );
function dbmng2_theme_style($hook)
{
  if( $hook == 'toplevel_page_plugin_dbmng2' )
    {
      wp_register_script( 'bootstrap-js', '/wp-content/themes/bootstrap-basic/js/vendor/bootstrap.min.js' , array(), '', true );
      wp_enqueue_script( 'bootstrap-js' );
      
      wp_register_style( 'bootstrap-css', '/wp-content/themes/bootstrap-basic/css/bootstrap.min.css' );
      wp_enqueue_style( 'bootstrap-css' );
      
      wp_register_style( 'font-awesome-css', '/wp-content/libraries/font-awesome/css/font-awesome.min.css' );
      wp_enqueue_style( 'font-awesome-css' );
    }
}

add_action( 'admin_menu', 'dbmng2_admin_menu' );
function dbmng2_admin_menu() {
  add_menu_page( 'Manage Dbmng2', 'Manage Dbmng2', 'manage_options', 'plugin_dbmng2', 'dbmng2_admin_page', 'dashicons-admin-generic', 6  );
  add_submenu_page( 'plugin_dbmng2', 'My Sub Level Menu Example', 'Sub Level Menu', 'manage_options', 'plugin_dbmng2/myplugin-admin-sub-page.php', 'myplguin_admin_sub_page' ); 
}

function dbmng2_admin_page()
{
  echo "<h1>Manage DBMNG tables</h1>";
  echo dbmng2_manager();
}




?>