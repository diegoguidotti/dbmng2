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


	public function select($fetch_style = \PDO::FETCH_ASSOC){


		$var=implode(",", array_keys($this->aForm['fields']));

		$sQuery='SELECT '.$var.' from '.$this->aForm['table_name'];

		

		$aVar=array();
		return $this->db->select($sQuery,$aVar, $fetch_style);
	}



  public function filterInsert(&$sField, &$sVal, &$aVal){
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


	
	/////////////////////////////////////////////////////////////////////////////
	// delete
	// ======================
	/// This method delete the selected record
	/**
	\param $array  		$_REQUEST associative array
	\return $result	SQL result
	*/
	function delete($array) 
	{
		$aForm  = $this->aForm;
		$aParam = $this->aParam;
		
		$where = "";
		$var = array();
		foreach ( $aForm['fields'] as $fld => $fld_value )
			{
				if( Util::var_equal($fld_value,'key', 1) ||  Util::var_equal($fld_value,'key', 2) )
					{
						$where .= "$fld = :$fld and ";
						$var = array_merge($var, array(":".$fld => $array[$fld] ));
					}
			}

		if($where == "")
			{
				$result            = Array();
				$result['ok']      = false;
				$result['message'] = 'You cannot delete record in a table with no primary keys defined';
			}
		else
			{
				if( isset($aParam['filters']) )
						{
							foreach ( $aParam['filters'] as $fld => $fld_value )
								{
									//drupal_set_message("Add ".$fld." ".$fld_value);
									$where .= $fld . " = :$fld and ";
									$var = array_merge($var, array(":".$fld => $fld_value));
								}
						}

				$where = substr($where, 0, strlen($where)-4);

				$result = $this->db->delete("delete from " . $aForm['table_name'] . " WHERE $where ", $var);
			
				if($result['ok'])
					{
						foreach ( $aForm['fields'] as $fld => $fld_value )
							{
								if( Util::var_equal($fld_value, 'widget', 'select_nm') )
									{
										$table_nm=$fld_value['table_nm'];
										$field_nm=$fld_value['field_nm'];
				
										$sql = "delete from ".$table_nm." where ".$where;
										$res_nm = $this->db->delete( $sql, $var);
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
	\param $array  		$_REQUEST associative array
	\result $result	SQL result
	*/
	function update($array) 
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

				if( Util::var_equal($fld_value,'key', 1) ) 
					{
						if( !$readonly ) //$fld_value['readonly'] != 1 )
							{
								if( isset($fld_value['widget']) )
									{
										if($fld_value['widget']!='select_nm')
											{		
												$sSet .= $fld . " = :$fld, ";
					
												$var = array_merge($var, array(":".$fld => $array[$fld]));//dbmng_value_prepare($fld_value,$fld,$array,$aParam))); //$_POST
												//$sSet.=dbmng_value_prepare($x_value,$x,$_POST).", ";
											}
										else
											{
												$bSelectNM = true;
											}
									}
								else
									{
										$sSet .= $fld . " = :$fld, ";

										$var = array_merge($var, array(":".$fld => $array[$fld]));//dbmng_value_prepare($fld_value,$fld,$array,$aParam))); //$_POST
										//$sSet.=dbmng_value_prepare($x_value,$x,$_POST).", ";
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

		$where  = "";
		$whereFields  = "";
		$whereFieldsV  = "";
		$aWhere = array();

		foreach ( $aForm['fields'] as $fld => $fld_value )
			{
				if( Util::var_equal($fld_value,'key', 1) ||  Util::var_equal($fld_value,'key', 2) )
					{
						$where .= "$fld = :$fld and ";
						$whereFields .= "$fld, ";
						$whereFieldsV  .= ":$fld, ";

						$val=$array[$fld];	// $_REQUEST
						if($fld_value['type']=='date')
							{
								if($val=='')
									{
										$val=null;
									}
							}
						
						$aWhere = array_merge( $aWhere, array(":".$fld => $val) );
					}
			}

			if( isset($aParam['filters']) )
					{
						foreach ( $aParam['filters'] as $fld => $fld_value )
							{
									//drupal_set_message("Add ".$fld." ".$fld_value);
									$where .= $fld . " = :$fld and ";
									$aWhere = array_merge($aWhere, array(":".$fld => $fld_value));
							}					
					}


		$where = substr($where, 0, strlen($where)-4);		
		$var   = array_merge($var, $aWhere);

		//TODO: add also filter fields in delete/update
		
		$result = $this->db->update("update " . $aForm['table_name'] . " set $sSet where $where ", $var);
		//fwrite(STDERR, print_r($var) );
		//echo debug_sql_statement("update " . $aForm['table_name'] . " set $sSet where $where ", $var);
		if( $result['ok'] )
			{
				foreach ( $aForm['fields'] as $fld => $fld_value )
					{
						if( Util::var_equal($fld_value, 'widget', 'select_nm') )
							{
								$table_nm=$fld_value['table_nm'];
								$field_nm=$fld_value['field_nm'];
		
								$sql = "delete from ".$table_nm." where ".$where;
								$res_nm = $this->db->update( $sql, $var);
							}
					}
			}

	/*
		if( false && $bSelectNM )
			{
				foreach ( $aForm['fields'] as $fld => $fld_value )
					{
						if($fld_value['widget']=='select_nm')
							{		
								$table_nm=$fld_value['table_nm'];
								$field_nm=$fld_value['field_nm'];
				
								dbmng_query(" delete from ".$table_nm." WHERE ". $where, $aWhere);
				
								$vals= explode('|',dbmng_value_prepare($fld_value,$fld,$_POST,$aParam));
								foreach ( $vals as $k => $v )
									{	
										$aVals = array_merge( $aWhere, array(":".$field_nm => intval($v) ) );
										//echo debug_sql_statement(" insert into ".$table_nm." (".$whereFields." ".$field_nm.") VALUES (".$whereFieldsV." :".$field_nm.") ",$aVals).'<br/>';
					
										dbmng_query("insert into ".$table_nm." (".$whereFields." ".$field_nm.") values (".$whereFieldsV." :".$field_nm.") ",$aVals);
									}
							}
					}
			}
	*/


		return $result;

		//if(isset($result['error'])){
		//	print_r ($result['error']);
		//}

	}

	
	


}
