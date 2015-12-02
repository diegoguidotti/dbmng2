<?php

	use Dbmng\Db;
	use Dbmng\Dbmng;
	use Dbmng\Api;
	use Dbmng\App;
	use Dbmng\Login;

	require_once 'vendor/autoload.php';	
	require_once 'settings.php';	

	
	$db = DB::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );

	$login=new Login($db, array('auth_type'=>'BASIC'));
	$l=$login->auth();
	$user=$l['user'];	
	
	$app=new App($db, array('user'=>$user));

	$aForm=array(  
		'table_name' => 'test' ,
			'primary_key'=> array('id'), 
			'fields'     => array(
					'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
					'name' => array('label'   => 'Name', 'type' => 'varchar'),
					'sex' => array( 'label' => 'Sex', 'type' => 'varchar',  'widget' => 'select', 'voc_val' => array('M' =>'Male', 'F' => 'Female')),
					'true_false' => array( 'vero/Falso' => 'Sex', 'type' => 'integer',  'widget' => 'checkbox')
			),
	);
	$aParam=array();

	$base_path="/dbmng2";
	$router = new \Respect\Rest\Router($base_path);
	
	$dbmng=new Dbmng($app, $aForm, $aParam);
	$api=new Api($dbmng);
	$api->exeRestTest($router);
	$api->exeRest($router);


	$aForm2=array(  
		'table_name' => 'test_child' ,
			'primary_key'=> array('id_child'), 
			'fields'     => array(
					'id_child' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
					'child_name' => array('label'   => 'Name', 'type' => 'varchar')
			),
	);
	$aParam2=array();
	
	$dbmng2=new Dbmng($app, $aForm2, $aParam2);
	$api2=new Api($dbmng2);
	$api2->exeRest($router);



?>
