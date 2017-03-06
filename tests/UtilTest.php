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


  public function test_template_var()
  {
        $txt="Ciao sono {{name}} io";
        $array=Array("name"=>"Diego");
        $this->assertEquals("Ciao sono Diego io",Util::template_var($txt,$array));

        $txt="Ciao sono {{name}} {{surname}} io";
        $array=Array("name"=>"Diego","surname"=>"Guidotti");
        $this->assertEquals("Ciao sono Diego Guidotti io",Util::template_var($txt,$array));

        $txt="Ciao sono {{name}} {{surname}} io";
        $array=Array("name"=>"Diego","surname"=>"Guidotti","age"=>"12");
        $this->assertEquals("Ciao sono Diego Guidotti io",Util::template_var($txt,$array));

        // Util::template_var($sql_var, JOIN(_$REQUEST,$aParam['filters']);

        // " WHERE id_azienda in(select id_azienda from aziedne WHERE uid={{system_uid}}) AND  uid={{filter_uid}} AND id_azienda={{request_id_azienda}} ";
        //
        // 'filter_uid' => $aParam['filters']['uid']
        // 'request_id_azienda' => $_REQUEST['id_azienda']


  }

}
