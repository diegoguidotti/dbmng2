<?php

	use Dbmng\Db;
	use Dbmng\Dbmng;
	use Dbmng\Api;
	use Dbmng\App;
	use Dbmng\Login;
	use Dbmng\DbmngHelper;
  use Respect\Rest\Router;
	require_once 'vendor/autoload.php';
	require_once 'settings.php';


	$db = DB::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );
	$db->setDebug(true);
	$login=new Login($db, array('auth_type'=>'BASIC'));


	$l=$login->auth();

	
	$user=$l['user'];

	$app=new App($db, array('user'=>$user, 'roles' => array(1=>'authenticated user')));

	$helper=new DbmngHelper($app);
	$forms = $helper->getAllFormsArray();

	$base_path="/dbmng2";
	$router = new \Respect\Rest\Router($base_path);

	$helper->exeAllRest( $router,$forms);


	/*

	$aForm=array(
		'table_name' => 'test' ,
			'primary_key'=> array('id'),
			'fields'     => array(
					'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
					'name' => array('label'   => 'Name', 'type' => 'varchar', 'nullable'=>false, 'validator'=>'ip'),
					'sex' => array( 'label' => 'Sex', 'type' => 'varchar',  'widget' => 'select', 'voc_val' => array('M' =>'Male', 'F' => 'Female')),
					'true_false' => array( 'label' => 'True/false', 'type' => 'int', 'readonly'=>false),
					'file' => array('label'   => 'Image', 'type' => 'varchar','widget' => 'file',
						//'url'=>'/dbmng2/api/test/file/file',
						'weburl_file'=>'/varie/file_upload/server/php/files/',
						'server_path'=>'/var/www/varie/file_upload/server/php/files/' )
			),
	);
	$aParam=array();
	//$aParam['filters']['true_false'] = 1;


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
	$aParam2=array(
		'table_extension'=> array(
			'sql'=>'SELECT c.id_child, id_father FROM test_child c, test_father_child fc WHERE c.id_child = fc.id_child',
			'field_name'=>'father_data'
		)
	);

	$dbmng2=new Dbmng($app, $aForm2, $aParam2);
	$api2=new Api($dbmng2);
	$api2->exeRest($router);
	*/

?>
