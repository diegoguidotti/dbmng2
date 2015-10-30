<?php

	use Dbmng\Db;
	use Dbmng\Dbmng;
	use Dbmng\Api;

	require_once 'vendor/autoload.php';	
	require_once 'settings.php';	

	
	$db = DB::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );
	$aForm=array(  
		'table_name' => 'test' ,
			'primary_key'=> array('id'), 
			'fields'     => array(
					'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
					'name' => array('label'   => 'Name', 'type' => 'varchar')
			),
	);

	$aParam=array();


	$dbmng=new Dbmng($db, $aForm, $aParam);
	$api=new Api($dbmng);
	$api->exeRest();

?>
