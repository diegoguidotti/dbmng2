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

class AeditDBMNGController extends ControllerBase {

  public function content() {
    // l'oggetto currentUser di D8 non restituisce l'analogo di D7.
    // L'insieme minimo delle informazioni che servono a dbmng2 sono nell'array sottostante
    $user8 = \Drupal::currentUser();
    $user = array('uid'=> $user8->id(), 'mail'=>$user8->getEmail(), 'name'=>$user8->getAccountName(), 'roles'=>$user8->getRoles());
    $html = "";

    // aggiunge i js esterni al modulo
    $html .= "<script src='sites/all/libraries/dbmng2/js/dist/dbmng.js'></script>";
    $html .= "<script src='sites/all/libraries/navigo/navigo.js'></script>";

		$html .= "<div id='dbmng2_table_list'></div>";
    $html .= "<div id='dbmng2_table_edit'></div>"; 

    // chiamata di default
    $html .= "<script>jQuery(document).ready(function(){aedit_dbmng_manager()})</script>";

    // l'oggetto per non essere processato da drupal e deve avere cole type il valore 'inline_template'
    $aReturn['#type'] = 'inline_template';
    $aReturn['#template'] = $html;
    $aReturn['#attached']['library'] = array('mod_aedit_dbmng/mod_aedit_dbmng');

    // in questo modo possiamo passare delle variabili al js
		$aReturn['#attached']['drupalSettings']['mod_aedit_dbmng']['user'] = $user;

		return $aReturn;
  }

}
