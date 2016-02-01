<?php
  include_once ("sites/all/libraries/dbmng2/src/Db.php");
  
  global $DBMNG;
  
  $dns = "mysql:host=localhost;dbname=climasouth15;user=root;password=wwwfito";
  $user="root";
  $password="wwwfito";
  
  $DBMNG = Dbmng\Db::createDb($dns, $user, $password);
  $DBMNG->setDebug(true);

?>
