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

			
			// DELETE Method - 200 (OK). 404 (Not Found), if ID not found or invalid.
			$router->delete('/api/test_base', function() use ($dbmng) {
				return '{"test_delete":1}';
			});
			
			// UPDATE Method - 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid.
			$router->put('/api/test_base', function() use ($dbmng) {
				$body = file_get_contents("php://input");
				//true return an associative array
				$input=json_decode($body,true);
				$input['test_put']=1;			
				return json_encode($input);
			});

			// POST Method - 201 (Created), 404 (Not Found), 409 (Conflict) if resource already exists.
			$router->post('/api/test_base', function() use ($dbmng) {
				$input['test_post'] = 1;
				return json_encode($input);
			});
			
			// READ Method - 200 (OK), single customer. 404 (Not Found), if ID not found or invalid.
			$router->any('/api/test_base', function() use ($dbmng) {
				$input = $dbmng->select()['data'];
				$input['test_get'] = 1;
				return json_encode($input);
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
