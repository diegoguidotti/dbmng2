<?php

/**
 * database helper class
 *
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace Dbmng;

class Dbmng {

private $app;
private $db;
private $aForm;
private $aParam;
private $prepare;


	public function __construct($app, $aForm, $aParam)
	{
		$this->app=$app;
		$this->db=$app->getDb();
		$this->aForm=$aForm;
		$this->aParam=$aParam;
		$this->prepare=false;
	}

	public function setPrepare($p)
	{
		$this->prepare=$p;
	}


	public function getaForm()
	{
		return $this->aForm;
	}

	// TODO: add filter in the where clause
	public function select($aVar = array(), $fetch_style = \PDO::FETCH_ASSOC)
	{
		$var=""; //implode(",", array_keys($this->aForm['fields']));
		$first=true;
		foreach ( $this->aForm['fields'] as $fld => $fld_value ){
			if(!Util::var_equal($fld_value,'widget','select_nm')){
				if(!$first){$var.=',';}
				else{$first=false;}
				$var.=	$fld;
			}
		}

		$sWhere = "";
		$aWhere = array();


		$ret=$this->createWhere($aVar, $sWhere, $aWhere, false, true, true);
		//TODO the function createWhere works only for delete for insert does not work


		if($ret['ok'] && count($aWhere) >0)
			{
				$sQuery='SELECT '.$var.' from '.$this->aForm['table_name'] . " WHERE $sWhere ";
			}
		else
			{
				$sQuery='SELECT '.$var.' from '.$this->aForm['table_name'];
			}

		if(isset($this->aParam['tbl_order'])){
			$sQuery.=" ORDER BY ".$this->aParam['tbl_order'];
		}
		$ret = $this->db->select($sQuery, $aWhere, $fetch_style);
		if(isset($this->aParam['table_extension'])){

			if(isset($this->aParam['table_extension']['sql'])){
				$aParam_ext=array();
				if(isset($this->aParam['table_extension']['aParam'])){
					$aParam_ext=$this->aParam['table_extension']['aParam'];
				}
				$ret_ext=$this->db->select($this->aParam['table_extension']['sql'],$aParam_ext);
				if($ret_ext['ok']){
					$pk=$this->aForm['primary_key'][0];
					$field_name="more_data";
					if(isset($this->aParam['table_extension']['field_name'])){
						$field_name=$this->aParam['table_extension']['field_name'];
					}

					for($e=0; $e<count($ret_ext['data']); $e++){

						for($i=0; $i<count($ret['data']); $i++){

							if($ret['data'][$i][$pk]==$ret_ext['data'][$e][$pk]){
								if(!isset($ret['data'][$i]['more_data'])){
									$ret['data'][$i][$field_name]=array();
								}
								$ret['data'][$i][$field_name][]=$ret_ext['data'][$e];
							}
						}
					}
				}
			}
		}
    $ret['aParam'] = $this->aParam;
		return $ret;
	}

	// TODO: add new method selectDecode
	// output: the recordset decodec

  public function filterInsert(&$sField, &$sVal, &$aVal)
  {
		if( isset($this->aParam['filters']) )
			{
				$filter=$this->aParam['filters'];
				$sField.=implode(", ", array_keys($filter));
				$sVal.=implode(" ,:", array_keys($filter));

				foreach ( $filter as $fld => $fld_value )
					{
						$aVal = array_merge($aVal, array(":".$fld =>  $fld_value ));
					}
			}
	}

	/*extract the value of primary key from an array ($avars) */
	public function getPkValue($aVars){
		$pk_value="";
		foreach ( $this->aForm['fields'] as $fld => $fld_value )
			{
				if( Util::var_equal($fld_value,'key', 1) ||  Util::var_equal($fld_value,'key', 2) )
					{
						if(isset($aVars[$fld])){
							$pk_value=$aVars[$fld] ;
						}
					}
			}
		return $pk_value;
	}

  public function createWhere($aVars, &$sWhere, &$aWhere, $checkId=true, $useFilter=true, $selectCondition=false)
  {
		$result = Array();
		$hasPk=false;
		foreach ( $this->aForm['fields'] as $fld => $fld_value )
			{
				//if the were is caled by a select allow all the fields to be filtered
				$add_filter=false;
				if(!$selectCondition){
					if( Util::var_equal($fld_value,'key', 1) ||  Util::var_equal($fld_value,'key', 2) )
						{
							$add_filter=true;
						}
				}
				else{
					$add_filter=true;
				}
				if( $add_filter )
					{
						if(isset($aVars[$fld])){
							$hasPk = true;
							$sWhere .= "$fld = :$fld and ";
							$aWhere = array_merge($aWhere, array(":".$fld => $aVars[$fld] ));
						}
					}
			}

		if(!$hasPk &&  $checkId && !$selectCondition)
			{
				$result['ok']      = false;
				$result['message'] = 'You cannot delete record in a table with no primary keys defined';
			}
		else
			{
				if($useFilter)
					{

						//print_r($this->aParam['filters']);
						if( isset($this->aParam['filters']) )
								{
									foreach ( $this->aParam['filters'] as $fld => $fld_value )
										{
											//echo "|".$fld."|";
											$sWhere .= $fld . " = :$fld and ";
											$aWhere = array_merge($aWhere, array(":".$fld => $fld_value));
										}
								}
					}

					$sWhere = substr($sWhere, 0, strlen($sWhere)-4);
					$result['ok']      = true;
		 	}

		return $result;
	}

	/////////////////////////////////////////////////////////////////////////////
	// delete
	// ======================
	/// This method delete the selected record
	/**
	\param $aVars  		$_REQUEST associative array
	\param $prepare  	if true prepare the query without executing it
	\return $result	SQL result
	*/
	function delete($aVars)
	{
		$aForm  = $this->aForm;
		$aParam = $this->aParam;

		$sWhere = "";
		$aWhere = array();

		$ret=$this->createWhere($aVars, $sWhere, $aWhere);
		if(!$ret['ok'])
			{
				$result=$ret;
			}
		else
			{
				$sql="delete from " . $aForm['table_name'] . " WHERE $sWhere ";
				$var=$aWhere;


				if($this->prepare){
					$result[]=(object)array('sql'=>$sql, 'var'=>$var);
				}
				else{
					$result = $this->db->delete($sql, $var);
				}

				if($this->prepare || $result['ok'])
					{
						foreach ( $aForm['fields'] as $fld => $fld_value )
							{
								if( Util::var_equal($fld_value, 'widget', 'select_nm') )
									{
										$table_nm=$fld_value['table_nm'];
										$field_nm=$fld_value['field_nm'];

										$sWhere2 = "";
										$aWhere2 = array();

										$ret=$this->createWhere($aVars, $sWhere2, $aWhere2, true, false);

										$sql = "delete from ".$table_nm." where ".$sWhere2;
										if($this->prepare){
											$result[]=array('sql'=>$sql, 'var'=>$aWhere2);
										}
										else{
											$res_nm = $this->db->delete( $sql, $aWhere2);
										}
									}
							}
					}
			}
		$deleted_pk=$this->getPkValue($aVars);
		$result['deleted_id']=$deleted_pk;

		return $result;
	}



	/////////////////////////////////////////////////////////////////////////////
	// update
	// ======================
	/// This method update an existing record
	/**
	\param $aVars 		$_REQUEST associative array containing the primary key and the variable to be updated
	\result $result	SQL result
	*/
	function update($aVars)
	{
		$aForm  = $this->aForm;
		$aParam = $this->aParam;

		$sSet = "";
		$var = array();

		$bSelectNM = false;

		foreach ( $aForm['fields'] as $fld => $fld_value )
			{
				$readonly=false;
				if(isset($fld_value['readonly']))
					{
						$readonly=$fld_value['readonly'];
					}

				//if(isset($aVars[$fld])) //test if the field exist in array
				if( array_key_exists($fld, $aVars) )
					{
            if( $this::checkFieldValue($fld_value, $aVars[$fld]) )
              {
                if( ! Util::var_equal($fld_value,'key', 1) )
                  {
                    if( !$readonly ) //$fld_value['readonly'] != 1 )
                      {
                        if( isset($fld_value['widget']) )
                          {
                            if($fld_value['widget']!='select_nm')
                              {
                                $sSet .= $fld . " = :$fld, ";
                                $var = array_merge($var, array(":".$fld => $aVars[$fld]));
                              }
                            else
                              {
                                $bSelectNM = true;
                              }
                          }
                        else
                          {
                            $sSet .= $fld . " = :$fld, ";
                            $var = array_merge($var, array(":".$fld => $aVars[$fld]));
                          }
                      }
                  }
              }
          }
			}

		if( isset($aParam) )
			{
				if( isset($aParam['auto_field']) )
					{
						foreach ( $aParam['auto_field'] as $fld => $fld_value )
							{
								if( is_array($fld_value) )
									{
										foreach( $fld_value as $f => $v )
											{
												if( $f == "U" )
													{
														$sSet .= $fld . " = :$fld, ";
														$var = array_merge($var, array(":".$fld => $v));
													}
											}
									}
								else
									{
										$sSet .= $fld . " = :$fld, ";
										$var = array_merge($var, array(":".$fld => $v));
									}
							}
					}
			}
		$sSet = substr($sSet, 0, strlen($sSet)-2);

		$sWhere  = "";
		$aWhere = array();

		$ret=$this->createWhere($aVars, $sWhere, $aWhere);
		if(!$ret['ok'])
			{
				$result=$ret;
			}
		else
			{
				$var   = array_merge($var, $aWhere);

				$sql="update " . $aForm['table_name'] . " set $sSet where $sWhere ";

					if($this->prepare){
						$result[]=(object)array('sql'=>$sql, 'var'=>$var);
					}
					else{
						$result = $this->db->update($sql, $var);
						$result['sql'] = $this->db->getSQL($sql, $var);
					}

				if(  ( ($this->prepare  || $result['ok']) && $bSelectNM))
					{
						if($this->prepare){
							throw new \Exception('We need to implement the insert_nm prepared function');
						}
						else{
							$this->insert_nm($aVars, null);
						}
					}
		}
		$updated_pk=$this->getPkValue($aVars);
		$result['updated_id']=$updated_pk;

		return $result;
	}

	/////////////////////////////////////////////////////////////////////////////
	// insert
	// ======================
	/// This function insert a new record
	/**
	\param $aVars 		$_REQUEST associative array containing the primary key and the variable to be updated
	\result $result	SQL result
	*/
	function insert($aVars)
	{
		$aForm  = $this->aForm;
		$aParam = $this->aParam;

		$sWhat = "";
		$sVal  = "";

		$var = array();
		$bSelectNM = false;
		foreach ( $aForm['fields'] as $fld => $fld_value )
			{
				$readonly=false;
				if(isset($fld_value['readonly'])){
					$readonly=$fld_value['readonly'];
				}

				if( ! Util::var_equal($fld_value,'key', 1) && ! Util::var_equal($fld_value,'key', 2) )
					{
							if(! Util::var_equal($fld_value, 'widget','select_nm') && !$readonly )
								{
									if(isset($aVars[$fld])){
										$sWhat .= $fld . ", ";
										$sVal.=":$fld ,";
										$var = array_merge($var, array(":".$fld => $aVars[$fld]));
									}
								}
							else
								{
									$bSelectNM = true;
								}
					}
			}

		if( isset($aParam) )
			{
				if( isset($aParam['filters']) )
					{
						foreach ( $aParam['filters'] as $fld => $fld_value )
							{
								$sWhat.=$fld.", ";
								$sVal.=":$fld, ";

								$var = array_merge($var, array(":".$fld =>  $fld_value ));
							}
					}

				if( isset($aParam['auto_field']) )
					{
						foreach ( $aParam['auto_field'] as $fld => $fld_value )
							{
								if( is_array($fld_value) )
									{
										foreach( $fld_value as $f => $v )
											{
												$sWhat.=$fld.", ";
												$sVal.=":$fld, ";

												$var = array_merge($var, array(":".$fld =>  $fld_value ));
											}
									}
								else
									{
										$sWhat.=$fld.", ";
										$sVal.=":$fld, ";

										$var = array_merge($var, array(":".$fld =>  $fld_value ));
									}
							}
					}
			}

		$sWhat = substr($sWhat, 0, strlen($sWhat)-2);
		$sVal  = substr($sVal, 0, strlen($sVal)-2);


		$sql    = "insert into " . $aForm['table_name'] . " (" . $sWhat . ") values (" . $sVal . ")";
		if($this->prepare){
			$result[]=(object)array('sql'=>$sql, 'var'=>$var);
		}
		else{
			//echo debug_sql_statement($sql, $var);
			//fwrite(STDERR, $this->db->getSQL($sql, $var));
			$result = $this->db->insert($sql, $var);
			$result['sql'] = $this->db->getSQL($sql, $var);
		}




		if($this->prepare || $result['ok'])
			{
				if( $bSelectNM )
					{

						//throw new \Exception('We need to implement the insert into table nm');
						if($this->prepare){
								//TODO!!!!!!!!!!!!!!!!!!!!!!	if
								throw new \Exception('We need to implement the insertnm prepared statement (for transaction api)');
						}
						else{
							$res = $this->insert_nm($aVars, $result['inserted_id']);
						}
					}
			}

		return $result;

	}


function uploadFile($field){

	$aForm  = $this->aForm;
	$aParam = $this->aParam;
	$ok=false;
	$message="";
	$ret=array();


	if(isset($aForm['fields'][$field])){
		$aField=$aForm['fields'][$field];
		if($aField['widget']=='file'){
			$ok=true;

		}
		else{
			$message="The widget is not file";
		}
	}
	else{
		$message="The field does not exist";
	}

	if($ok){

		$server_path='/var/www/dbmng2/files';
		if(isset($aField['server_path'])){
			$server_path=$aField['server_path'];
		}

		$mime_types=['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'text/plain','application/pdf'];
		if(isset($aField['mime_types'])){
			$mime_types=$aField['mime_types'];
		}

		$size_byte=1024 * 1024 * 20;
		if(isset($aField['size_bytes'])){
			$size_byte=$aField['size_bytes'];
		}


		// Simple validation (max file size 2MB and only two allowed mime types)
		$validator = new \FileUpload\Validator\Simple($size_byte, $mime_types);

		/**
		*   For more flexibility, the simple Validator has been broken down since the size validator might not always be needed..

				$mimeTypeValidator = new \FileUpload\Validator\MimeTypeValidator(["image/png", "image/jpeg"]);

				$sizeValidator = new \FileUpload\Validator\SizeValidator("3M", "1M"); //the 1st parameter is the max size while the 2nd id the min size

		**/

		// Simple path resolver, where uploads will be put
		$pathresolver = new \FileUpload\PathResolver\Simple($server_path);

		// The machine's filesystem
		$filesystem = new \FileUpload\FileSystem\Simple();

		// FileUploader itself
		$fileupload = new \FileUpload\FileUpload($_FILES['files'], $_SERVER);

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

		$ret['ok']=$ok;
		$ret['files']=$files;


	}
	else{
		$ret['ok']=$ok;
		$ret['message']=$message;
	}

	return $ret;
}

	/////////////////////////////////////////////////////////////////////////////
	// insert_nm
	// ======================
	/// This function insert a new record in one-to-many table
	/**
	\param $aVars 		$_REQUEST associative array containing the primary key and the variable to be updated
	\param $id_key  	primary key of "one" table
	\result $result	SQL result
	*/
	function insert_nm($aVars, $id_key)
	{
		$aForm = $this->aForm;
		$aParam = $this->aParam;

		$aWhere = array();
		$whereFields='';
		$whereFieldsV='';

		foreach ( $aForm['fields'] as $fld => $fld_value )
			{
				if( Util::var_equal($fld_value,'key', 1) || Util::var_equal($fld_value,'key', 2) )
					{
						$whereFields .= "$fld, ";
						$whereFieldsV  .= ":$fld, ";

						if( isset($id_key) )
							{
								$aWhere = array_merge( $aWhere, array(":".$fld => $id_key) );
							}
						else
							{
								$aWhere = array_merge( $aWhere, array(":".$fld => $aVars[$fld]) );
							}
					}
			}

		foreach ( $aForm['fields'] as $fld => $fld_value )
			{
				if( isset($fld_value['widget']) )
					{
						if($fld_value['widget']=='select_nm')
							{
								$table_nm=$fld_value['table_nm'];
								$field_nm=$fld_value['field_nm'];

								$where_del   = substr($whereFields,0,strlen($whereFields)-2);
								$where_del_v = substr($whereFieldsV,0,strlen($whereFieldsV)-2);

								$this->db->delete("delete from ".$table_nm." WHERE ". $where_del ."=".$where_del_v, $aWhere);
								//echo "<br/>".$this->db->getSQL("delete from ".$table_nm." WHERE ". $where_del ."=".$where_del_v, $aWhere);
								//print_r ($_POST);

								//echo ("<br/>!|".dbmng_value_prepare($fld_value,$fld,$_POST,$aParam)."|!</br>");

								$vals= explode('|',$aVars[$fld]);
								//print_r($vals);

								foreach ( $vals as $k => $v )
									{
										$aVals = array_merge( $aWhere, array(":".$field_nm => intval($v) ) );

										$sql = "insert into ".$table_nm." (".$whereFields." ".$field_nm.") values (".$whereFieldsV." :".$field_nm.")";
										//echo "<br/>".$sql." ".$k." ".$v;
										//fwrite(STDERR, $this->db->getSQL($sql, $aVals));
										$result = $this->db->insert( $sql, $aVals);

										// if(isset($result['error'])){
										// 	print_r ($result);
										// }
									}

							}
					}
			}
		return $result;
	}

	/////////////////////////////////////////////////////////////////////////////
	// processRequest
	// ======================
	/// This function prepare the value from the POST request creating a well formatted array to insert it in the database (former dbmng_value_prepare function)
	/**
	\param $aRequest  		The $_REQUEST array with the field meta-variables
	\param $aFiles  			The $_FILES array to grap the file data; can be skipped;
	\return               Associative array with the field to be inserted in the db
	*/
	function processRequest($aRequest, $aFiles=array())
	{
		$aVars=$aRequest;
		foreach ( $this->aForm['fields'] as $fld => $fld_value )
			{
				//type of the field
				$sType=$fld_value['type'];

				//default widget
				$widget=Util::get_val($fld_value, 'widget', 'input');

				//default value
				$sDefault=Util::get_val($fld_value, 'default', null);

				//default value (if exists) otherwise null
				$sValue=Util::get_val($aRequest, $fld, null);

				if($widget=='multiselect')
					{
						$sValue=Util::get_val($aRequest, $fld."_res3", null);
					}
				elseif($widget=='date')
					{

						if($sValue=='')
							$sValue=null;
					}
				elseif($widget=='select_nm')
					{
						$sValue='';

						if(isset($aRequest[$fld]))
							{
								foreach ( $aRequest[$fld] as $vocKey => $vocValue )
									{
										$sValue.=$vocValue.'|';
									}
							}
						if(strlen($sValue)>0)
							{
								$sValue = substr($sValue, 0, strlen($sValue)-1);
							}
					}
				elseif($widget=='checkbox')
					{
						if( is_null($sValue) )
							$sValue=0;
						else
							$sValue=1;
					}
				elseif( $widget=='file' )
					{
						$dir_upd_file=Util::get_val($fld_value, 'file', "docs/");

						if(isset($aFiles[$fld]))
							{
								$sValue = $dir_upd_file . $aFiles[$fld]['name'];

								//print_r($aFiles[$x]);
								//drupal_set_message ("Carica::::: ".$sValue." ". $aFiles[$x]["error"]);

								if( $aFiles[$fld]["error"] == 0 )
									{
										//$sValue = dbmng_uploadfile($aFiles[$fld]['name'], $dir_upd_file, $aFiles[$fld]["tmp_name"]);
										throw new \Exception('We need to implement dbmng_uploadfile');
										$sValue = $aFiles[$fld]['name'];
									}
								else
									{ //if the file is null use the text in the checkbox
										$sValue = $aRequest[$fld.'_tmp_choosebox'];
									}
							}

					}
				elseif( $widget=='picture' )
					{
						throw new \Exception('We need to implement the picture field management');
						/*
						$dir_upd_file = "docs";
						if( isset($aParam['picture']) )
							$dir_upd_file = $aParam['picture'];

						// echo "aParam dir:" . $dir_upd_file . "<br/>";
						// echo "File: " . $aFiles[$x]['name'] . "<br/>";
						$sValue = $dir_upd_file . $aFiles[$x]['name'];

						if( $aFiles[$x]["error"] == 0 )
							{
								$sValue = dbmng_uploadfile($aFiles[$x]['name'], $dir_upd_file, $aFiles[$x]["tmp_name"]);

								if( dbmng_is_picture($aFiles[$x]) )
									{
										//echo "picture:" . $sValue;
										if( isset($aParam['picture_version']['nrm']) )
											{
												$thumb=new thumbnail($sValue);
												$thumb->size_auto($aParam['picture_size']['nrm']);
												$thumb->save($aParam['picture_version']['nrm'] . $aFiles[$x]['name'] );
											}
										if( isset($aParam['picture_version']['big']) )
											{
												$thumb=new thumbnail($sValue);
												$thumb->size_auto($aParam['picture_size']['big']);
												$thumb->save($aParam['picture_version']['big'] . $aFiles[$x]['name'] );
											}
										if( isset($aParam['picture_version']['prw']) )
											{
												$thumb=new thumbnail($sValue);
												$thumb->size_auto($aParam['picture_size']['prw']);
												$thumb->save($aParam['picture_version']['prw'] . $aFiles[$x]['name'] );
											}
										if( isset($aParam['picture_version']['ext']) )
											{
												$thumb=new thumbnail($sValue);
												$thumb->size_auto($aParam['picture_size']['ext']);
												$thumb->save($aParam['picture_version']['ext'] . $aFiles[$x]['name'] );
											}
									}
								$sValue = $aFiles[$x]['name'];

							}
						else
							{ //if the file is null use the text in the checkbox
								$sValue = $post[$x.'_tmp_choosebox'];
							}
						*/
					}

				$sVal=null;

				//Fix: date widget can not have a default empty value
				if($widget=='date' && $sDefault=='')
					{
						$sDefault=null;
					}

				//if exists a default value use the default values instead of null
				if( strlen($sValue)==0 && is_null($sDefault) )
					{
						$sVal  = null;
					}
				else
					{
						if(strlen($sValue)==0)
							{
								$sValue=$sDefault;
							}
						if ($this::is_field_type_numeric($sType))
							{
								if ($widget=='select_nm')
									{
										$sVal  = ($sValue);
									}
								elseif($sType=="int" || $sType=="bigint")
									$sVal = intval($sValue);
								elseif($sType=="float" || $sType=="double")
									$sVal = doubleval($sValue);
								else
									$sVal = doubleval($sValue);
							}
						else
							{
								$sVal  = $sValue;
							}
					}

				if( strlen($sVal) == 0 )
					$sVal = null;

				$aVars[$fld] = $sVal;
		}

		return $aVars;
	}


	/////////////////////////////////////////////////////////////////////////////
	// dbmng_is_field_type_numeric
	// ======================
	/// This function return true if a type is numeric one
	/**
	\param $sType  		type of data: int, bigint, float, double
	\return           boolean
	*/
	static function is_field_type_numeric($sType)
	{
		return ($sType=="int" || $sType=="bigint" || $sType=="float"  || $sType=="double");
	}

	/////////////////////////////////////////////////////////////////////////////
	// isValid
	// ======================
	/// This function return true if the aForm is coherent with aParam
	/**
	\return           boolean
	*/
	function isValid()
	{
		$aForm = $this->aForm;
		$aParam = $this->aParam;

		$aCheck = array();
		$aCheck['ok'] = true;
		$aMessage = array();
		foreach ( $aForm['fields'] as $fld => $fld_value )
			{
				if(isset($aParam['filters'])){
					if( array_key_exists($fld, $aParam['filters']) )
						{
							$aCheck['ok'] = false;
							array_push( $aMessage, 'The field '.$fld.' is a filter and cannot be present in aForm. ');
						}
				}
			}
		$aCheck['message'] = $aMessage;
		return $aCheck;
	}



	public function transactions($aQuery){
		return $this->db->transactions($aQuery);
	}

   /////////////////////////////////////////////////////////////////////////////
	// isAlowed
	// ======================
	/// This function return true if the given method is allowerd by user and aParam
	/**
	\return           boolean
	*/
	function isAllowed($method){

		$auth=false;
		$code=401;
		$message="";

		$user=$this->app->getUser();
		if($user['uid']!=0){
      if(isset($this->aParam['access']))
        {
          if( isset($this->aParam['access'][$method]) )
            {
//               print_r($this->aParam['access'][$method]);
//               print_r($user,true);
              $interset = array_intersect($this->aParam['access'][$method], $user['roles']);
              if( count($interset) > 0 )
                {
                  $code=200;
                  $auth=true;
                }
              else
                {
                  $code=401;
                  $auth=false;
                  $message="Unauthenticated user cannot access the resource (role not allowed)";
                }
            }
          else
            {
              $code=200;
              $auth=true;
            }
        }
      else
        {
          $code=200;
          $auth=true;
        }
		}
		else
      {
        $code=401;
        $auth=false;
        $message="Unauthenticated user cannot access the resource (No user)";
      }
		return array('ok'=>$auth, 'message'=>$message, 'code'=>$code);
	}

   /////////////////////////////////////////////////////////////////////////////
  // sanitize
  // ======================
  /// This function check the data before insert or update
  /**
  \return           boolean
  */
  function sanitize($aFormParams)
  {
    $auth = true;
    $code = 200;
    $message = "";
    foreach( $this->aForm['fields'] as $fld => $fld_value )
      {
        foreach( $aFormParams as $k => $v )
          {
            // echo " |$k - $v| ";
            if( $fld == $k )
              {
                if( $fld_value['type'] == 'int' || $fld_value['type'] == 'double' )
                  {
                    if( strlen($v) == 0 ) // $v === "" )
                      {
                        //echo " setnull |$k - [$v]| ";
                        if( isset($aFormParams->$k) )
                          {
                            // echo " setnull |$k - $v| ";
                            $aFormParams->$k = null;
                          }
                      }
                    else
                      {
                        if( !is_numeric($v) )
                          {
                            $auth = false;
                            $code = 200;
														$fld_label=$fld;

														if(isset($fld_value['label'])){
															$fld_label=$fld_value['label'];
														}

                            $message = "[".$fld_label."] You are trying to add text value in a numeric field";
                          }
                      }
                  }
              }
          }
      }

    return array('ok'=>$auth, 'message'=>$message, 'code'=>$code, 'aFormParams' => $aFormParams);
  }
   /////////////////////////////////////////////////////////////////////////////
  // checkFieldValue
  // ======================
  /// This function return true if the given method is allowerd by user and aParam
  /**
  \return           boolean
  */
  function checkFieldValue($aField, $val)
  {
    $sType = $aField['type'];
    if( Util::var_equal($aField,'widget','select_nm') )
      {
        $ret=true;
      }
    else if( $sType == 'int' )
      {
        if( strlen($val) > 0 )
          {
            $nVal = (int)($val);
            $ret = ($val == strval($nVal) ? true : false);
          }
        else
          {
            $ret = true;
          }
      }
    elseif( $sType == 'double' )
      {
        if( strlen($val) > 0 )
          {
            $nVal = (float)($val);
            $ret = ($val == strval($nVal) ? true : false);
          }
        else
          {
            $ret = true;
          }
      }
    else
      {
        $ret = true;
      }

    return $ret;
	}



}
