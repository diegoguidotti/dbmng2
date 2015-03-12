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
	/// This function delete the selected record
	/**
	\param $aForm  		Associative array with all the characteristics
	\param $aParam  	Associative array with some custom variable used by the renderer
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
				if( dbmng_check_is_pk($fld_value) )
					{
						$where .= "$fld = :$fld and ";
						$var = array_merge($var, array(":".$fld => $array[$fld] ));
					}
			}

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
		//TODO: add also filter fields in delete/update
		$result = dbmng_query("delete from " . $aForm['table_name'] . " WHERE $where ", $var);
		
		if($result['ok']){
			foreach ( $aForm['fields'] as $fld => $fld_value )
				{
					if( isset($fld_value['widget']) )
						{
							if($fld_value['widget']=='select_nm')
								{		
									$table_nm=$fld_value['table_nm'];
									$field_nm=$fld_value['field_nm'];
				
									$sql = "delete from ".$table_nm." where ".$where;
									$res_nm = dbmng_query( $sql, $var);
								}
						}
				}
		}

		return $result;
						
	}


}
