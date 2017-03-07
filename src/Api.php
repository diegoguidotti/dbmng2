<?php

/**
 * database helper class
 *
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */
namespace Dbmng;

//We add this function to allow the library to work with php<5.4
if (!function_exists('http_response_code')) {
        function http_response_code($code = NULL) {
            if ($code !== NULL) {

                switch ($code) {
                    case 100: $text = 'Continue'; break;
                    case 101: $text = 'Switching Protocols'; break;
                    case 200: $text = 'OK'; break;
                    case 201: $text = 'Created'; break;
                    case 202: $text = 'Accepted'; break;
                    case 203: $text = 'Non-Authoritative Information'; break;
                    case 204: $text = 'No Content'; break;
                    case 205: $text = 'Reset Content'; break;
                    case 206: $text = 'Partial Content'; break;
                    case 300: $text = 'Multiple Choices'; break;
                    case 301: $text = 'Moved Permanently'; break;
                    case 302: $text = 'Moved Temporarily'; break;
                    case 303: $text = 'See Other'; break;
                    case 304: $text = 'Not Modified'; break;
                    case 305: $text = 'Use Proxy'; break;
                    case 400: $text = 'Bad Request'; break;
                    case 401: $text = 'Unauthorized'; break;
                    case 402: $text = 'Payment Required'; break;
                    case 403: $text = 'Forbidden'; break;
                    case 404: $text = 'Not Found'; break;
                    case 405: $text = 'Method Not Allowed'; break;
                    case 406: $text = 'Not Acceptable'; break;
                    case 407: $text = 'Proxy Authentication Required'; break;
                    case 408: $text = 'Request Time-out'; break;
                    case 409: $text = 'Conflict'; break;
                    case 410: $text = 'Gone'; break;
                    case 411: $text = 'Length Required'; break;
                    case 412: $text = 'Precondition Failed'; break;
                    case 413: $text = 'Request Entity Too Large'; break;
                    case 414: $text = 'Request-URI Too Large'; break;
                    case 415: $text = 'Unsupported Media Type'; break;
                    case 500: $text = 'Internal Server Error'; break;
                    case 501: $text = 'Not Implemented'; break;
                    case 502: $text = 'Bad Gateway'; break;
                    case 503: $text = 'Service Unavailable'; break;
                    case 504: $text = 'Gateway Time-out'; break;
                    case 505: $text = 'HTTP Version not supported'; break;
                    default:
                        exit('Unknown http status code "' . htmlentities($code) . '"');
                    break;
                }

                $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');

                header($protocol . ' ' . $code . ' ' . $text);

                $GLOBALS['http_response_code'] = $code;

            } else {

                $code = (isset($GLOBALS['http_response_code']) ? $GLOBALS['http_response_code'] : 200);

            }

            return $code;

        }
    }

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
					$input_q = $dbmng->select();
          $input = $input_q['data'];
					$input['test_get'] = 1;
					return json_encode($input);
				});
	}

	public function exeRest($router){

			$dbmng=$this->dbmng;

      $api_self=$this;


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




			$router->post($api_base_path.$table_alias.'/transaction', function(  ) use($dbmng,$api_self){

				$dbmng->setPrepare(true);
				// get the form_params from the rest call
        $body = file_get_contents("php://input");

        $transactions = json_decode($body);
				$pqueries=array();
				foreach( $transactions as $k=>$transaction){
					if($transaction->mode == 'delete'){
						$ret=$api_self->doDelete($dbmng, $transaction->key);
						$pqueries[]=$ret;
					}
					else if($transaction->mode == 'insert'){
						$ret=$api_self->doInsert($dbmng, $transaction->body);
						$pqueries[]=$ret;
					}
					else if($transaction->mode == 'update'){
						$ret=$api_self->doUpdate($dbmng, $transaction->key, $transaction->body);
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

      $router->any($api_base_path.$table_alias.'/schema/*', function($id_value = null) use($dbmng,$api_self) {
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
                $ret = $api_self->fillDbmngFields($dbmng, $id_table);
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
			$router->get($api_base_path.$table_alias.'/*', function( $id_value=null) use($dbmng,$api_self){
				$allowed=$dbmng->isAllowed('select');

				if( $allowed['ok'] )
          {
            $aForm = $dbmng->getaForm();
            $aParam = $dbmng->getParam();
            $key = $aForm['primary_key'][0];

            $aVar = array();
            if( $id_value !== null )
              {
                if( $id_value == 'schema' )
                  {
                    $aForm = $dbmng->getaForm();
                    $aForm['aParam'] = $aParam;
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

			$router->put($api_base_path.$table_alias.'/*', function( $id_value=null ) use($dbmng, $api_self){
				$body = file_get_contents("php://input");
				return json_encode($api_self->doUpdate($dbmng,$id_value,json_decode($body)));
			} );

      $router->post($api_base_path.$table_alias.'/*', function( $id_value=null ) use($dbmng, $api_self){
        $body = file_get_contents("php://input");
        if( $id_value == null )
          {
            return json_encode($api_self->doInsert($dbmng,json_decode($body)));
          }
        else
          {
            return json_encode($api_self->doUpdate($dbmng,$id_value,json_decode($body)));
          }
      } );

      $router->delete($api_base_path.$table_alias.'/*', function(  $id_value=null ) use($dbmng,$api_self){
				return json_encode($api_self->doDelete($dbmng, $id_value));

      } );

//       $router->post('/api/'.$table_alias, function( ) use($dbmng){
//         $body = file_get_contents("php://input");
// 				return json_encode($this->doInsert($dbmng,json_decode($body)));
//
//       } );


			$router->post($api_base_path.$table_alias.'/file/*', function($field) use($dbmng,$api_self) {

				$files= $api_self->doUploadFile($dbmng,$field);
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
                    $input['aVar'] = $sanitize;
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
