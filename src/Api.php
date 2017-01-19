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
				$router->delete($api_base_path.'test_base', function() use ($dbmng) {
					return '{"test_delete":1}';
				});

				// UPDATE Method - 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid.
				$router->put($api_base_path.'test_base', function() use ($dbmng) {
					$body = file_get_contents("php://input");
					//true return an associative array
					$input=json_decode($body,true);
					$input['test_put']=1;
					return json_encode($input);
				});

				// POST Method - 201 (Created), 404 (Not Found), 409 (Conflict) if resource already exists.
				$router->post($api_base_path.'test_base', function() use ($dbmng) {
					$input['test_post'] = 1;
					return json_encode($input);
				});

				// READ Method - 200 (OK), single customer. 404 (Not Found), if ID not found or invalid.
				$router->get($api_base_path.'test_base', function() use ($dbmng) {
					$input = $dbmng->select()['data'];
					$input['test_get'] = 1;
					return json_encode($input);
				});
	}

	public function exeRest($router){

			$dbmng=$this->dbmng;


      $aForm = $dbmng->getaForm();
			$aParam = $dbmng->getParam();

			$api_base_path = "/api/";
			if( isset($aParam['api_prefix']) )
				{
					$api_base_path = $aParam['api_prefix'];
				}

			$table_alias = $aForm['table_name'];
			if(isset($aForm['table_alias']))
				{
					$table_alias = $aForm['table_alias'];
				}

			/*
			echo "<h1>".'/api/'.$table_alias.'/schema'."</h1>";
			$router->get('/api/'.$table_alias.'/schema/', function( ) use($dbmng){
        $allowed=$dbmng->isAllowed('select');

        echo "<h3>schema: ".$dbmng->getaForm()['table_name']."</h3>";

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
			});*/

			$router->post($api_base_path.$table_alias.'/transaction', function(  ) use($dbmng){

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
				//print_r($pqueries);
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

      $router->any($api_base_path.$table_alias.'/schema/*', function($id_value = null) use($dbmng) {
        $bOk = false;
        $out = json_encode(array('ok' => false, 'msg' => "The function '$id_value' is not defined in the API"));
        $allowed=$dbmng->isAllowed('admin');

        if($allowed['ok'])
          {
            $id_table = $_REQUEST['id_table'];
            if( $id_value == 'delete' )
              {
                $db = $dbmng->getDb();
                $sql = "delete from dbmng_fields where id_table = :id_table";
                $var = array(':id_table' => $id_table);

                $ret = $db->delete($sql, $var);
                $out = json_encode(array("id"=>$id_value, "ret"=>$ret));
                $bOk = true;
              }
            elseif( $id_value == 'fill' )
              {
                $ret = $this->fillDbmngFields($dbmng, $id_table);
                $out = json_encode(array("id"=>$id_value, "ret"=>$ret));
                $bOk = true;
              }
            else
              {
                $out = json_encode(array('ok' => false, 'msg' => "The function '$id_value' is not defined in the API"));
              }
          }
        else
          {
            $out = json_encode($allowed);
          }

        $allowed=$dbmng->isAllowed('select');

        if($allowed['ok'])
          {
            if($id_value == '')
              {
                $aForm = $dbmng->getaForm();
                $out = json_encode($aForm);
                $bOk = true;
              }
          }
        else
          {
            $out = json_encode($allowed);
          }

        if( ! $bOk )
          {
            http_response_code(401);
          }

        return $out;
      });

			// select
			$router->get($api_base_path.$table_alias.'/*', function( $id_value=null) use($dbmng){
				$allowed=$dbmng->isAllowed('select');

				if( $allowed['ok'] )
          {
            $aForm = $dbmng->getaForm();

            $key = $aForm['primary_key'][0];

            $aVar = array();
            if( $id_value !== null )
              {
                if( $id_value == 'schema' )
                  {
                    $aForm = $dbmng->getaForm();
                    return json_encode($aForm);
                  }
                else
                  $aVar = array($key => $id_value);
              }

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

			$router->put($api_base_path.$table_alias.'/*', function( $id_value=null ) use($dbmng){
				$body = file_get_contents("php://input");
				return json_encode($this->doUpdate($dbmng,$id_value,json_decode($body)));
			} );

      $router->post($api_base_path.$table_alias.'/*', function( $id_value=null ) use($dbmng){
        $body = file_get_contents("php://input");
        if( $id_value == null )
          {
            return json_encode($this->doInsert($dbmng,json_decode($body)));
          }
        else
          {
            return json_encode($this->doUpdate($dbmng,$id_value,json_decode($body)));
          }
      } );

      $router->delete($api_base_path.$table_alias.'/*', function(  $id_value=null ) use($dbmng){
				return json_encode($this->doDelete($dbmng, $id_value));

      } );

//       $router->post('/api/'.$table_alias, function( ) use($dbmng){
//         $body = file_get_contents("php://input");
// 				return json_encode($this->doInsert($dbmng,json_decode($body)));
//
//       } );


			$router->post($api_base_path.$table_alias.'/file/*', function($field) use($dbmng) {

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


  function fillDbmngFields($dbmng, $id_table, $table_schema = null)
  {
    $bOk = true;
    $aQueries = array();
    $db = $dbmng->getDb();
    $dbtype = $db->getDbType();

    $aParam = $dbmng->getParam();
    if( $table_schema == null )
    {
      $table_schema = $aParam['dbname'];
    }

    $sql = "select table_name from dbmng_tables where id_table = :id_table";
    $var = array(':id_table' => $id_table);

    $aTable = $db->select($sql, $var);
    if( $aTable['rowCount'] > 0 )
      {
        $tn = $aTable['data'][0]['table_name'];

        if( $dbtype == 'mysql' )
          {
            $sql = "select * from information_schema.columns where table_name = :table_name and table_schema = :table_schema";
            $var = array(':table_name' => $tn, ':table_schema' => $table_schema);
          }
        elseif( $dbtype == 'pgsql' )
          {
            $aTn = explode('.', $tn);
            if( count($aTn) == 1 )
              {
                $sql = "select * from information_schema.columns where table_name = :table_name and table_catalog = :table_catalog";
                $var = array(':table_name' => $tn, ':table_catalog' => $table_schema);
              }
            elseif( count($aTn) == 2 )
              {
                $sql = "select * from information_schema.columns where table_name = :table_name and table_catalog = :table_catalog and table_schema = :table_schema";
                $var = array(':table_name' => $aTn[1], ':table_schema' => $aTn[0], ':table_catalog' => $table_schema);
              }
          }

        $aFields = $db->select($sql, $var);

        for( $nF = 0; $nF < $aFields['rowCount']; $nF++ )
          {
            /* identify the primary key */
            $pk = 0;

            // only for MySQL
            if( strlen($aFields['data'][$nF]['COLUMN_KEY']) != 0 )
              {
                if( strlen(trim($aFields['data'][$nF]['EXTRA'])) != 0 )
                  {
                    if( $aFields['data'][$nF]['EXTRA'] == 'auto_increment' )
                      $pk = 1;
                    else
                      $pk = 2;
                  }
              }

            $pos = strpos($aFields['data'][$nF]['column_default'], 'nextval');
            if( $pos !== false )
              {
                $pk = 1;
              }


            /* Map type into crud type */
            $sType ="";
            switch( $aFields['data'][$nF][($dbtype == 'mysql' ? 'DATA_TYPE' : 'data_type')] )
              {
                case "int":
                case "bigint":
                case "integer":
                  $sType = "int";
                  break;

                case "float":
                case "double":
                case "real":
                  $sType = "double";
                  break;

                case "date":
                  $sType = "date";
                  break;

                case "text":
                  $sType = "text";
                  break;

                default:
                  $sType = "varchar";
              }

            /* Assign the 'basic' widget */
            $widget = "";
            $voc_sql = null;
            switch( $sType )
              {
                case "int":
                  if( strpos($aFields['data'][$nF][($dbtype == 'mysql' ? 'COLUMN_NAME' : 'column_name')], "id_" ) !== false && $pk == 0 )
                    {
                      $widget = "select";
                    }
                  else
                    {
                      $widget = "input";
                      if( $pk == 1 )  // se chiave primaria si imposta ad hidden il campo
                        $widget = "hidden";
                    }
                  break;

                case "double":
                  $widget = "input";
                  break;

                case "text":
                  $widget = "textarea";
                  break;

                case "date":
                  $widget = "date";
                  break;

                default:
                  $widget = "input";
              }

            /* identify if a fields accept or no to be empty */
            $nullable = 0;
            if( $aFields['data'][$nF][($dbtype == 'mysql' ? 'IS_NULLABLE' : 'is_nullable')] == "YES" && $pk != 1 )
              $nullable = 1;


            $field_name  = $aFields['data'][$nF][($dbtype == 'mysql' ? 'COLUMN_NAME' : 'column_name')];
            $field_label = ucfirst(str_replace("_", " ", $aFields['data'][$nF][($dbtype == 'mysql' ? 'COLUMN_NAME' : 'column_name')]));
            if( $pk == 1 )  // se chiave primaria si imposta la label del campo
              $field_label = "ID";

            $field_order = $aFields['data'][$nF][($dbtype == 'mysql' ? 'ORDINAL_POSITION' : 'ordinal_position')]*10;

            /* Prepare insert sql command */
            $sql  = "insert into dbmng_fields( id_table, id_field_type, field_widget, field_name, nullable, field_label, field_order, pk, is_searchable ) ";
            $sql .= "values( :id_table, :id_field_type, :field_widget, :field_name, :nullable, :field_label, :field_order, :pk, :is_searchable );";
            $var = array(':id_table' => $id_table,
                        ':id_field_type' => $sType,
                        ':field_widget' => $widget,
                        ':field_name' => $field_name,
                        ':nullable' => $nullable,
                        ':field_label' => $field_label,
                        ':field_order' => $field_order,
                        ':pk' => $pk,
                        ':is_searchable' => 0);
            $aQueries[$nF]['sql'] = $sql;
            $aQueries[$nF]['var'] = $var;

          }
        $ret = $db->transactions($aQueries);
        $ret['aField'] = $aFields;
        $ret['aParam'] = $dbmng->getParam();
      }
    else
      {
        $ret['ok'] = false;
      }
    return array('ok' => $ret['ok'], 'id_table' => $id_table, 'ret' => $ret);
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
