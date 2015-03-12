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

}
