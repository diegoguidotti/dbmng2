<?php

namespace Dbmng\Tests;
use Dbmng\Db;

class DbTest extends \PHPUnit_Extensions_Database_TestCase
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

		public function testDrupal() {

				//Simulate a pdo connection in drupal
				$pdo = new \PDO($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
				$pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
				$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
				$pdo->exec("set names utf8");

		    $db = new Db($pdo);
		    
		    $result = $db->select("SELECT a.id, a.name FROM test a", array());
		    $articles = $result['data'];
		    $this->assertEquals(
		        array(
		            array("id" => 1, "name" => "Diego"),
		            array("id" => 2, "name" => "Michele")
						),
		        $articles);
		}


		public function testSelect() {

		    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
		    $ret = $db->select('select id, name from test', array());
			
		    $this->assertEquals(
		        array(
		            array("id" => 1, "name" => "Diego"),
		            array("id" => 2, "name" => "Michele")
						),
		        $ret['data']
				);

		    $this->assertEquals(true,$ret['ok']);

		    $ret2 = $db->select('select id, name from test WHERE id=:id', array(':id'=>1));			
		    $this->assertEquals(
		        array(
		            array("id" => 1, "name" => "Diego")
						),
		        $ret2['data']
				);

		    $ret3 = $db->select('select id, name from test_no_exist WHERE id=:id', array(':id'=>1));			
		    $this->assertEquals(false,$ret3['ok']);

		    $ret4 = $db->select('select id, name from test', array(), \PDO::FETCH_BOTH);
		    $this->assertEquals('Diego',$ret4['data'][0][1]);
			
		}
}

