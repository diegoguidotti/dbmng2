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
	static function get_val($array, $type_var, $defVal){
		if(isset($array[$type_var])){
			return $array[$type_var];
		}
		else{
			return $defVal;
		}

	}	
	
	/////////////////////////////////////////////////////////////////////////////
	// str2AssocArray
	// ======================
	/// This function return an associative array
	/**
	\param $string  		string (i.e. key1=val1&key2=val2&...)
	\return $newArray		the associative array
	*/
	static function str2AssocArray($string)
	{
		$aA = explode("&",$string);
		$newArray = array();
		foreach ($aA as $lineNum => $line)
		{
			list($key, $value) = explode("=", $line);
			$newArray[$key] = $value;
		}
	return $newArray;
	}

}
