<?php

namespace Dbmng\Tests;

use Dbmng\Util;

class UtilTest extends \PHPUnit_Framework_TestCase
{


	public function test_req_equal()
	{
		$aTest = array('a' => 1, 'b' => 2);
		$this->assertEquals(true,Util::var_equal($aTest, 'a', 1));	
		$this->assertEquals(false,Util::var_equal($aTest, 'a', 2));	
		$this->assertEquals(false,Util::var_equal($aTest, 'c', 1));	
	}


	public function test_get_val()
	{

		$aTest = array('a' => 1, 'b' => 2);

		$this->assertEquals(1,Util::get_val($aTest, 'a', 99));	
		$this->assertEquals(99,Util::get_val($aTest, 'c', 99));	
	}
	
}
