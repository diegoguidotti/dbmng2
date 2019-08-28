<?php
namespace Drupal\mod_aedit_dbmng\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;

use Drupal\Core\Database\Database;

use Symfony\Component\HttpFoundation\Response;

use Dbmng\Db;
use Dbmng\Dbmng;
use Dbmng\Api;
use Dbmng\App;
use Dbmng\Login;
use Respect\Rest\Router;
use Dbmng\DbmngHelper;
use Dbmng\Util;

/**
 * Controller per la gestione delle API di progetto.
 */
class AeditDBMNGApiController extends ControllerBase {

  /**
   * metodo pubblico dove scrivere le proprie API.
   */
  public function api($token) {
    global $base_path;

    $user = \Drupal::currentUser();

    // imposta il Router
    $path = $base_path.'api_mod_aedit_dbmng';
    $router = new \Respect\Rest\Router($path);

    // inizializza app e db (dbmng2)
    $app = $this->_get_app();
    $db = $this->_get_db();

    // crea i router di tutte le tabelle configurate in dbmng_tables
    $h   = new DbmngHelper($app);
    $aForms = $h->getAllFormsArray();
    $h->exeAllRest( $router, $aForms );

    //
    // Da qui in avanti è possibile inserire le proprie API
    //
    $router->any('/ciao', function($tipo=null) use($DB, $user) {
      $json = array('ok'=> true, 'message' => 'Ciao');

      $json_string=json_encode($json);
      echo ($json_string);
    });

    $router->any('/**', function() use($DB, $user) {
      global $base_path;
      $req_uri = $_SERVER['REQUEST_URI'];
      $aUri = explode("/", $req_uri);
      $json = array('ok'=> true, 'message' => 'Ok. Funziona', 'aUri' => $aUri, 'root' => $base_path);

      $json_string=json_encode($json);
      echo ($json_string);
    });

    //Ritorna vuoto (fa il router)
    $response = new Response();
    $response->setContent('');
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }


  /**
   * metodo privato che ritorna un istanza dell'oggetto App.
   */
  protected function _get_app(){
    $user8 = \Drupal::currentUser();

    // oggetto user da passare alla classe App solo nel caso di Drupal8
    $user=array('uid'=> $user8->id(), 'mail'=>$user8->getEmail(), 'name'=>$user8->getAccountName(), 'roles'=>$user8->getRoles());
    $databases = Database::getConnectionInfo('default');

    if( $databases['default']['driver'] == 'mysql' )
      {
        $dns = "mysql:host=".$databases['default']['host'].";dbname=".$databases['default']['database'].";user=".$databases['default']['username'].";password=".$databases['default']['password']."";
      }
    else
      {
        $dns = "pgsql:host=".$databases['default']['host'].";dbname=".$databases['default']['database'].";user=".$databases['default']['username'].";password=".$databases['default']['password']."";
      }
    $username = $databases['default']['username'];
    $password = $databases['default']['password'];

    $DB = Db::createDb($dns, $username, $password);
    $DB->setDebug(true);

    $app = new App($DB, array('user'=>(array)$user, 'aParamDefault' => array('dbname' => $databases['default']['database'])));
    return $app;
  }

  /**
   * metodo privato che ritorna l'oggetto DB.
   */
  protected function _get_db(){
    $app = $this->_get_app();
    $DB  = $app->getDb();
    return $DB;
  }

}
