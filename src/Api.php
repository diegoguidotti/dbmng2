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


			$router->delete('/api/test', function() use ($dbmng) {
				return '{"test_delete":1}';
			});
			$router->put('/api/test', function() use ($dbmng) {
				$body = file_get_contents("php://input");
				//true return an associative array
				$input=json_decode($body,true);
				$input['test_put']=1;			
				return json_encode($input);
			});

			$router->any('/api/test', function() use ($dbmng) {				
				return json_encode($dbmng->select()['data']);
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
