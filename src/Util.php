<?php

namespace Dbmng;

class Util
{
	function test(){
		return 1;
	}
	
	function req_equal($array, $type_var, $val)
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
	
	
}