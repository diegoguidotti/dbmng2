<?php

/**
 * database helper class
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */
use Respect\Rest\Router;
namespace Dbmng;
 
class Api {

	private $dbmng;

	public function __construct($dbmng)
	{
		$this->dbmng=$dbmng;
	}


	public function exeRest(){

			$base_path="/dbmng2";

			$router = new \Respect\Rest\Router($base_path);
			$dbmng=$this->dbmng;

			$router->any('/api/test', function() use ($dbmng) {
				//$body = file_get_contents("php://input");
				//$input=json_decode($body);
			
				//$res = $dbmng->select();
				//return json_encode($res['data']);
				return '{"test":1}';
			});

		
	}

	function isValid(){
		return $this->dbmng->isValid();
	}
	
	function enableAccessControl(){
		if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
			header('Access-Control-Allow-Origin: *');
			header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
			header('Access-Control-Allow-Headers: X-Requested-With, Content-Type');
		}
		else {
			header('Access-Control-Allow-Origin: *');		
		}
	}

}
