<?php

/**
 * database helper class
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace Dbmng;
 
class Dbmng {

private $db;
private $aForm;
private $aParam;


	public function __construct($db, $aForm, $aParam)
	{
		$this->db=$db;
		$this->aForm=$aForm;
		$this->aParam=$aParam;
	}
	
	public function getaForm()
	{
		return $this->aForm;
	}
	
	// TODO: add filter in the where clause
	public function select($aVar = array(), $fetch_style = \PDO::FETCH_ASSOC)
	{
		$var=implode(",", array_keys($this->aForm['fields']));

		$sWhere = "";
		$aWhere = array();
		
		if( count($aVar) > 0 )
			{
				$ret=$this->createWhere($aVar, $sWhere, $aWhere);
				if($ret['ok'] && count($aVar) >0)
					{
						$sQuery='SELECT '.$var.' from '.$this->aForm['table_name'] . " WHERE $sWhere ";
						$ret = $this->db->select($sQuery, $aWhere, $fetch_style);
					}
			}
		else
			{
				$sQuery='SELECT '.$var.' from '.$this->aForm['table_name'];
				$ret = $this->db->select($sQuery, $aWhere, $fetch_style);
			}
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

  public function createWhere($aVars, &$sWhere, &$aWhere, $useFilter=true)
  {
		$result = Array();
		$hasPk=false;
		foreach ( $this->aForm['fields'] as $fld => $fld_value )
			{
				if( Util::var_equal($fld_value,'key', 1) ||  Util::var_equal($fld_value,'key', 2) )
					{
						$hasPk = true;
						$sWhere .= "$fld = :$fld and ";
						$aWhere = array_merge($aWhere, array(":".$fld => $aVars[$fld] ));
					}
			}
		
		if(!$hasPk)
			{
				$result['ok']      = false;
				$result['message'] = 'You cannot delete record in a table with no primary keys defined';
			}
		else
			{
				if($useFilter)
					{
						if( isset($this->aParam['filters']) )
								{
									foreach ( $this->aParam['filters'] as $fld => $fld_value )
										{
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
				$result = $this->db->delete("delete from " . $aForm['table_name'] . " WHERE $sWhere ", $aWhere);
			
				if($result['ok'])
					{
						foreach ( $aForm['fields'] as $fld => $fld_value )
							{
								if( Util::var_equal($fld_value, 'widget', 'select_nm') )
									{
										$table_nm=$fld_value['table_nm'];
										$field_nm=$fld_value['field_nm'];

										$sWhere2 = "";
										$aWhere2 = array();

										$ret=$this->createWhere($aVars, $sWhere2, $aWhere2, false);
				
										$sql = "delete from ".$table_nm." where ".$sWhere2;
										$res_nm = $this->db->delete( $sql, $aWhere2);
									}
							}
					}
			}

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

				if(isset($aVars[$fld])) //test if the field exist in array
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
			
				$result = $this->db->update("update " . $aForm['table_name'] . " set $sSet where $sWhere ", $var);
				if( $result['ok'] && $bSelectNM)
					{
						//throw new \Exception('We need to implement the insert_nm function');
						$this->insert_nm($aVars, null);
					}
		}
		
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
									$sWhat .= $fld . ", ";
									$sVal.=":$fld ,";	
									$var = array_merge($var, array(":".$fld => $aVars[$fld]));
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

		//echo debug_sql_statement($sql, $var);
		//fwrite(STDERR, $this->db->getSQL($sql, $var));
		$result = $this->db->insert($sql, $var);


		if($result['ok'])
			{
				if( $bSelectNM )
					{
						//throw new \Exception('We need to implement the insert into table nm');
						$res = $this->insert_nm($aVars, $result['inserted_id']);
					}
			}

		return $result;
		
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

	
	


}
