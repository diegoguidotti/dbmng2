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
			$router->get('/api/test_base', function() use ($dbmng) {
				$input = $dbmng->select()['data'];
				$input['test_get'] = 1;
				return json_encode($input);
			});
			
			
      // select
			$router->get('/api/*/*', function( $tablename, $id_value=null ) use($dbmng){
				$allowed=$dbmng->isAllowed('select');
				
				if($allowed['ok']){
					$aForm = $dbmng->getaForm();
					if( $aForm['table_name'] == $tablename )
						{
							$key = $aForm['primary_key'][0];
						
							$aVar = array();
							if( !is_null($id_value) )
								$aVar = array($key => $id_value);

							$input = $dbmng->select($aVar);
							// $input['table_name'] = $aForm['table_name'];
							// $input['key'] = $key;
						}
					else
						{
							$input['ok'] = false;
							$input['msg'] = "The tablename '$tablename' doesn't exist";
						}
					return json_encode($input);
				}
				else{
					http_response_code($allowed['code']);
					return json_encode($allowed);
					
				}
			} );
			
			$router->put('/api/*/*', function( $tablename, $id_value=null ) use($dbmng){
				$aForm = $dbmng->getaForm();
				if( $aForm['table_name'] == $tablename )
					{
						if( !is_null($id_value) )
							{
								// get the info from aForm array
								$primary_key = $aForm['primary_key'][0];
								$aFields = array_keys($aForm['fields']);
								
								// get the form_params from the rest call
								$body = file_get_contents("php://input");
								
								$aFormParams = json_decode($body);
								
								// prepare the array of vars for the update and 
								// check if the form_params passed are in the table structure
								$bContinue = true;
								$aVar[$primary_key] = $id_value;
								$aFldError = array();
								foreach($aFormParams as $k => $v)
									{
										if( in_array($k, $aFields) )
											{
												$aVar[$k] = $v;
												$bContinue = $bContinue && true;
											}
										else
											{
												array_push($aFldError,$k); 
												$bContinue = $bContinue && false;
											}
									}
								
								// execute the update only if all the form_params are in the table structure
								if( $bContinue )
									{
										$input = $dbmng->update($aVar);
										
										$input['form_params'] = $aFormParams;
										$input['fields'] = $aFields;
										$input['pk'] = $primary_key;
									}
								else
									{
										$input['ok'] = false;
										$input['msg'] = "Some fields are wrong";
										$input['wrong_field'] = $aFldError;
									}
							}
						else
							{
								$input['ok'] = false;
								$input['msg'] = "The id value doesn't exist";
							}
					}
				else
					{
						$input['ok'] = false;
						$input['msg'] = "The tablename '$tablename' doesn't exist";
					}
				$input['body'] = $body;
				return json_encode($input);
			} );
			
      $router->delete('/api/*/*', function( $tablename, $id_value=null ) use($dbmng){
        $aForm = $dbmng->getaForm();
        if( $aForm['table_name'] == $tablename )
          {
            if( !is_null($id_value) )
              {
                // get the info from aForm array
                $primary_key = $aForm['primary_key'][0];
                $aFields = array_keys($aForm['fields']);
                
                
                // prepare the array of vars for the update and 
                // check if the form_params passed are in the table structure
                $aVar[$primary_key] = $id_value;
                
                $input = $dbmng->delete($aVar);
                
                $input['fields'] = $aFields;
                $input['pk'] = $primary_key;
              }
            else
              {
                $input['ok'] = false;
                $input['msg'] = "The id value doesn't exist";
              }
          }
        else
          {
            $input['ok'] = false;
            $input['msg'] = "The tablename '$tablename' doesn't exist";
          }
        return json_encode($input);
      } );

      $router->post('/api/*', function( $tablename ) use($dbmng){
        $aForm = $dbmng->getaForm();
        if( $aForm['table_name'] == $tablename )
          {
            // get the info from aForm array
            $primary_key = $aForm['primary_key'][0];
            $aFields = array_keys($aForm['fields']);
            
            // get the form_params from the rest call
            $body = file_get_contents("php://input");
            
            $aFormParams = json_decode($body);
            print_r($aFormParams,true);
            // prepare the array of vars for the update and 
            // check if the form_params passed are in the table structure
            $bContinue = true;
            $aVar = array();
            $aFldError = array();
            foreach($aFormParams as $k => $v)
              {
                if( in_array($k, $aFields) )
                  {
                    $aVar[$k] = $v;
                    $bContinue = $bContinue && true;
                  }
                else
                  {
                    array_push($aFldError,$k); 
                    $bContinue = $bContinue && false;
                  }
              }
            
            // execute the update only if all the form_params are in the table structure
            if( $bContinue )
              {
                $input = $dbmng->insert($aVar);
                
                $input['form_params'] = $aFormParams;
                $input['fields'] = $aFields;
                $input['pk'] = $primary_key;
              }
            else
              {
                $input['ok'] = false;
                $input['msg'] = "Some fields are wrong";
                $input['wrong_field'] = $aFldError;
              }
          }
        else
          {
            $input['ok'] = false;
            $input['msg'] = "The tablename '$tablename' doesn't exist";
          }
        $input['body'] = $body;
        return json_encode($input);
      } );

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
