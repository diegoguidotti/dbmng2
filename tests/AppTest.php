<?php

namespace Dbmng\Tests;
use Dbmng\Db;
use Dbmng\App;

class AppTest extends \PHPUnit_Extensions_Database_TestCase
{

		// only instantiate pdo once for test clean-up/fixture load
    static private $pdo = null;

		// only instantiate PHPUnit_Extensions_Database_DB_IDatabaseConnection once per test
    private $conn = null;

    public function getConnection() {

				if ($this->conn === null) {
            if (self::$pdo == null) {
                self::$pdo = new \PDO( $GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD'] );
								self::$pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
								self::$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
								self::$pdo->exec("set names utf8");								
            }
            $this->conn = $this->createDefaultDBConnection(self::$pdo, "dbmng2");
        }
        return $this->conn;
    }

    public function getDataSet() {
        return $this->createFlatXMLDataSet(dirname(__FILE__).'/seed.xml'); 
    }
		

		public function testAppSelect() {

		    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
			 $app = new App($db, Array());
 
		    $ret = $app->getDb()->select('select id, name from test', array());
			
		    $this->assertEquals(
		        array(
		            array("id" => 1, "name" => "Diego"),
		            array("id" => 2, "name" => "Michele")
						),
		        $ret['data']
				);

		    $this->assertEquals(true,$ret['ok']);

			 //test an empty user 
		    $this->assertEquals(0,$app->getUser()['uid']);
	}	
  
  public function testNull() {
    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
    $app = new App($db, Array());

    $ret = $app->getDb()->select('select id, name, true_false from test', array());
  
    $this->assertEquals(
        array(
            array("id" => 1, "name" => "Diego", "true_false" => 0),
            array("id" => 2, "name" => "Michele", "true_false" => 0)
        ),
        $ret['data']
    );

    $this->assertEquals(true,$ret['ok']);

    //test an empty user 
    $this->assertEquals(0,$app->getUser()['uid']);
    
    $ret2 = $app->getDb()->insert('insert into test (id, name,true_false) values(:id, :name, :true_false )', array(':id'=>4, ':name'=>'Cinzia', ':true_false' => null));
    $this->assertEquals(true,$ret2['ok']);
    $this->assertEquals(4,$ret2['inserted_id']);
    
    $ret3 = $db->select('select true_false from test where id = :id', array(':id' => 4));
    $this->assertEquals(true,$ret3['ok']);
    $this->assertEquals(null,$ret3['data'][0]['true_false']);
  } 

}

