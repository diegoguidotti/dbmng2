<?php

/**
 * database helper class
 *
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */
namespace Dbmng;

class Api {

	private $dbmng;

	public function __construct($dbmng)
	{
		$this->dbmng=$dbmng;
	}

	public function exeRestTest($router){

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
	}

	public function exeRest($router){

			$dbmng=$this->dbmng;


      $aForm = $dbmng->getaForm();
			$table_alias = $aForm['table_name'];
			if(isset($aForm['table_alias'])){
				$table_alias = $aForm['table_alias'];
			}

			$router->get('/api/'.$table_alias.'/schema', function( $id_value=null ) use($dbmng){
        $allowed=$dbmng->isAllowed('select');

				//print_r(   $allowed);

        if($allowed['ok'])
          {
            return json_encode($dbmng->getaForm());
          }
        else
          {
            http_response_code($allowed['code']);
            return json_encode($allowed);
          }
			});

			$router->post('/api/'.$table_alias.'/transaction', function( $id_value=null ) use($dbmng){

				$dbmng->setPrepare(true);
				// get the form_params from the rest call
        $body = file_get_contents("php://input");

        $transactions = json_decode($body);
				$pqueries=array();
				foreach( $transactions as $k=>$transaction){
					if($transaction->mode == 'delete'){
						$ret=$this->doDelete($dbmng, $transaction->key);
						$pqueries[]=$ret;
					}
					else if($transaction->mode == 'insert'){
						$ret=$this->doInsert($dbmng, $transaction->body);
						$pqueries[]=$ret;
					}
					else if($transaction->mode == 'update'){
						$ret=$this->doUpdate($dbmng, $transaction->key, $transaction->body);
						$pqueries[]=$ret;
					}
				}
				print_r($pqueries);
				$queries=array();
				$all_ok=true;
				$mesages;
				foreach( $pqueries as $k=>$q1){
					foreach( $q1 as $k2=>$q){
						if(isset($q->sql)){
							$queries[]=(array)$q;
							$messages[]=array("ok"=>true, "message"=>"");
						}
						else if(isset($q->ok)){
							$all_ok=false;
							$messages[]=array("ok"=>$q->ok, "message"=>$q->message);
						}
					}
				}

				//print_r($queries);
				if($all_ok){
				 	$ret=$dbmng->transactions($queries);
				}
				else{
					$ret=$messages;
				}
				return json_encode(	$ret);

			});

			// select
			$router->get('/api/'.$table_alias.'/*', function( $id_value=null ) use($dbmng){

				$allowed=$dbmng->isAllowed('select');

				if($allowed['ok'])
          {
            $aForm = $dbmng->getaForm();
            $key = $aForm['primary_key'][0];

            $aVar = array();
            if( !is_null($id_value) )
              $aVar = array($key => $id_value);

            //if exists some _REQUEST get variable try to filter them (dbmng will check if aForm can accept them)
            $aVar=array_merge($aVar,$_REQUEST);

            $input = $dbmng->select($aVar);
            return json_encode($input);
          }
				else
          {
            http_response_code($allowed['code']);
            return json_encode($allowed);
          }
			} );

			$router->put('/api/'.$table_alias.'/*', function( $id_value=null ) use($dbmng){
				$body = file_get_contents("php://input");
				return json_encode($this->doUpdate($dbmng,$id_value,json_decode($body)));

			} );

      $router->delete('/api/'.$table_alias.'/*', function(  $id_value=null ) use($dbmng){
				return json_encode($this->doDelete($dbmng, $id_value));

      } );

      $router->post('/api/'.$table_alias, function( ) use($dbmng){
        $body = file_get_contents("php://input");
				return json_encode($this->doInsert($dbmng,json_decode($body)));

      } );


			$router->post('/api/'.$table_alias.'/file/*', function($field) use($dbmng) {

				$files= $this->doUploadFile($dbmng,$field);
				if($files['ok']){
					return json_encode(array('files' => $files['files']));
				}
				else{
						return json_encode($files);
				}

			});

	}


	function doUploadFile($dbmng,$field){

		$allowed=$dbmng->isAllowed('update');
		$allowed2=$dbmng->isAllowed('insert');

		//if($allowed['ok'] || $allowed2['ok'])
		if(true)
			{
				return $dbmng->uploadFile($field);
			}
		else
			{
				http_response_code($allowed['code']);
				return ($allowed);
			}
	}

	function doDelete($dbmng, $id_value){
		    $allowed=$dbmng->isAllowed('delete');

        if($allowed['ok'])
          {
            $aForm = $dbmng->getaForm();

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
                    $input['message'] = "The id value doesn't exist";
                  }

            return ($input);
          }
        else
          {
            http_response_code($allowed['code']);
            return ($allowed);
          }
	}

	function doInsert($dbmng, $body)
	{
    $allowed=$dbmng->isAllowed('insert');
    if($allowed['ok'])
      {
        $aBody = ($body);
        $sanitize = $dbmng->sanitize($aBody);
        if( $sanitize['ok'] )
          {
            $aFormParams = $sanitize['aFormParams'];
            // get the form_params from the rest call

            $ret=array();

            $aForm = $dbmng->getaForm();

            // get the info from aForm array
            $primary_key = $aForm['primary_key'][0];
            $aFields = array_keys($aForm['fields']);

            //echo "AAAA";
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
                $input['message'] = "Some fields are wrong";
                $input['wrong_field'] = $aFldError;
              }

            $input['body'] = $body;
            return ($input);
          }
        else
          {
            http_response_code($sanitize['code']);
            return ($sanitize);
          }
      }
    else
      {
        http_response_code($allowed['code']);
        return ($allowed);
      }
	}

	function doUpdate($dbmng, $id_value, $body){

    $aFormParams=$body;
    $allowed=$dbmng->isAllowed('update');

    if($allowed['ok'])
      {
        $aBody = ($body);
        $sanitize = $dbmng->sanitize($aBody);
        if( $sanitize['ok'] )
          {
            $aForm = $dbmng->getaForm();
            $aFormParams = $sanitize['aFormParams'];

            if( !is_null($id_value) )
              {
                // get the info from aForm array
                $primary_key = $aForm['primary_key'][0];
                $aFields = array_keys($aForm['fields']);

                // get the form_params from the rest call


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
                    // $input['form_params'] = $aFormParams;
                    // $input['fields'] = $aFields;
                    // $input['aForm'] = $aForm;

                    $input['ok'] = false;
                    $input['message'] = "Some fields are wrong";
                    $input['wrong_field'] = $aFldError;
                  }
              }
            else
              {
                $input['ok'] = false;
                $input['message'] = "The id value doesn't exist";
              }

            //$input['body'] = $body;
            return ($input);
          }
        else
          {
            http_response_code($sanitize['code']);
            return ($sanitize);
          }
      }
    else
      {
        http_response_code($allowed['code']);
        return ($allowed);
      }
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
