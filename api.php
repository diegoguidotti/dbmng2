<?php

	use Dbmng\Db;
	use Dbmng\Dbmng;
	use Dbmng\Api;
	use Dbmng\App;
	use Dbmng\Login;
  use Respect\Rest\Router;
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
					'true_false' => array( 'vero/Falso' => 'Sex', 'type' => 'int')
			),
	);
	$aParam=array();
	//$aParam['filters']['true_false'] = 1;
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
	$aParam2=array(
		'table_extension'=> array(
			'sql'=>'SELECT c.id_child, id_father FROM test_child c, test_father_child fc WHERE c.id_child = fc.id_child',
			'field_name'=>'father_data'
		)
	);

	$dbmng2=new Dbmng($app, $aForm2, $aParam2);
	$api2=new Api($dbmng2);
	$api2->exeRest($router);

	$router->post('/api/file', function() {
		// Simple validation (max file size 2MB and only two allowed mime types)
    $validator = new FileUpload\Validator\Simple(1024 * 1024 * 2, ['image/png', 'image/jpg']);

    /**
    *   For more flexibility, the simple Validator has been broken down since the size validator might not always be needed..

        $mimeTypeValidator = new \FileUpload\Validator\MimeTypeValidator(["image/png", "image/jpeg"]);

        $sizeValidator = new \FileUpload\Validator\SizeValidator("3M", "1M"); //the 1st parameter is the max size while the 2nd id the min size

    **/

    // Simple path resolver, where uploads will be put
    $pathresolver = new FileUpload\PathResolver\Simple('/var/www/varie/files');

    // The machine's filesystem
    $filesystem = new FileUpload\FileSystem\Simple();

    // FileUploader itself
    $fileupload = new FileUpload\FileUpload($_FILES['files'], $_SERVER);

    // Adding it all together. Note that you can use multiple validators or none at all
    $fileupload->setPathResolver($pathresolver);
    $fileupload->setFileSystem($filesystem);
    $fileupload->addValidator($validator);

    // Doing the deed
    list($files, $headers) = $fileupload->processAll();

    // Outputting it, for example like this
    foreach($headers as $header => $value) {
      header($header . ': ' . $value);
    }

    return json_encode(array('files' => $files));
	});



?>
