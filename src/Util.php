<?php

namespace Dbmng;


class Util
{

	/////////////////////////////////////////////////////////////////////////////
	// var_equal
	// ======================
	/// This function return true if a key exist in one arrey and the value is equal to the val
	/**
	\param $array  		  array to be searched
	\param $type_var  	name of the key
	\param $val  				value
	\return $ret				boolean
	*/
	static function var_equal($array, $type_var, $val)
	{
		$ret=false;
		if(isset($array[$type_var]))
			{
				if($array[$type_var]==$val)
					{
						$ret=true;
					}
			}
		return $ret;
	}

	/////////////////////////////////////////////////////////////////////////////
	// get_val
	// ======================
	/// This function return the value if the key has been set, otherwise return a default value
	/**
	\param $array  		  array to be searched
	\param $type_var  	name of the key
	\param $defVal  		default value if value doess not exists
	\return $ret				the requested value
	*/
	static function get_val($array, $type_var, $defVal=null){
		if(isset($array[$type_var])){
			return $array[$type_var];
		}
		else{
			return $defVal;
		}

	}

	/////////////////////////////////////////////////////////////////////////////
	// print an array (with <pre> html tags)
	// ======================
	/**
	\param $array  		  array to be printed
	\return $ret			  the html version of the array
	*/
	static function print_r($array)
	{
		return "<pre class='dbmng_print_r'>".print_r($array,true)."<pre>";
	}

	static function toArray($obj)
  {
    if (is_object($obj)) $obj = (array)$obj;
    if (is_array($obj)) {
        $new = array();
        foreach ($obj as $key => $val) {
            $new[$key] = $this->toArray($val);
        }
    } else {
        $new = $obj;
    }

    return $new;
  }


  static function template_var($txt, $array){

    foreach($array as $k=>$v){
      // echo $k;
      // echo $v;
        $txt=str_replace("{{".$k."}}",$v,$txt);
    }
    return $txt;
  }

}
