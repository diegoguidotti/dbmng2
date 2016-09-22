<?php
  require_once 'vendor/autoload.php';
  require_once 'settings.php';

  $db = Dbmng\DB::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );
  $db->setDebug($aSetting['DB']['DEBUG']);

  $login = new Dbmng\Login($db);
  $user = $login->auth();

  $base_path = $aSetting['BASE_PATH'];
  $router = new \Respect\Rest\Router($base_path);


  /***************************************************************************/
  /* S T A R T  C U S T O M  A R E A                                          /
  /***************************************************************************/
  $router->any('/api/test', function() use ($db, $user) {
    $ret['ok'] = true;
    $ret['message'] = 'test api';
    $ret['user'] = $user;
    $json_string=json_encode($ret);
    echo ($json_string);
  });

?>
