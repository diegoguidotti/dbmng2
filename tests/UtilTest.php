<?php

namespace Dbmng\Tests;

use Dbmng\Util;

class UtilTest extends \PHPUnit_Framework_TestCase
{

	public function testTest()
	{
		$this->assertEquals(1,Util::test());	
	}
	 
	public function test_req_equal()
	{
		$aTest = array('a' => 1, 'b' => 2);
		$this->assertEquals(true,Util::req_equal($aTest, 'a', 1));	
		$this->assertEquals(false,Util::req_equal($aTest, 'a', 2));	
		$this->assertEquals(false,Util::req_equal($aTest, 'c', 1));	
	}
	
}
