<?php

namespace Dbmng\Tests;
use Dbmng\Db;
use Dbmng\App;
use Dbmng\Dbmng;

class DbTest extends \PHPUnit_Extensions_Database_TestCase
{

		// only instantiate pdo once for test clean-up/fixture load
    static private $pdo = null;

		// only instantiate PHPUnit_Extensions_Database_DB_IDatabaseConnection once per test
    private $conn = null;

    public function getConnection() {

				if ($this->conn === null) {
            if (self::$pdo == null) {
                self::$pdo = new \PDO( $GLOBALS['PB_DSN'], $GLOBALS['PB_USER'], $GLOBALS['PB_PASSWD'] );
								self::$pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
								self::$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            }
            $this->conn = $this->createDefaultDBConnection(self::$pdo, "dbmng2");
        }
        return $this->conn;
    }

    public function getDataSet() {
        return $this->createFlatXMLDataSet(dirname(__FILE__).'/seed_pg.xml');
    }


	public function testInsert(){
        $db2 = DB::createDb($GLOBALS['PB_DSN'], $GLOBALS['PB_USER'], $GLOBALS['PB_PASSWD']);
        
        $s   = $db2->select("ALTER SEQUENCE test_id_seq RESTART WITH 3", array());
        
        $ret = $db2->insert('insert into test (name) values(:name )', array(':name'=>'Susanna'), 'test_id_seq');
        
        //print_r( $ret );
        
        $this->assertEquals(true,$ret['ok']);
        $this->assertEquals(3,$ret['inserted_id']);
        
        $aQ[0]['sql'] = "insert into test (name) values(:name)";
        $aQ[0]['var'] = array(':name'=>'Pippo');
        $aQ[1]['sql'] = "insert into test (name) values(:name)";
        $aQ[1]['var'] = array(':name'=>'Pluto');
        $aQ[2]['sql'] = "insert into test (name) values(:name)";
        $aQ[2]['var'] = array(':name'=>'Paperino');
        
        $ret = $db2->transactions($aQ);
        
        $ret2 = $db2->select("SELECT * FROM test WHERE name = :name", array(':name'=>'Pippo'));
        
        print_r($ret2);
	}

  public function getApp(){
      $db = DB::createDb($GLOBALS['PB_DSN'], $GLOBALS['PB_USER'], $GLOBALS['PB_PASSWD'] );
        $app=new App($db);
      return $app;

  }
  
  public function testInsertDbmng() {
      $app=$this->getApp();

      $aForm=array(
        'table_name' => 'test' ,
          'primary_key'=> array('id'),
          'fields'     => array(
              'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
              'name' => array('label'   => 'Name', 'type' => 'varchar'),
              'sex' => array('label'   => 'Sex', 'type' => 'varchar')
          ),
      );

      $aParam=array();

      $dbmng=new Dbmng($app, $aForm, $aParam);

      $array= $dbmng->processRequest(array('sex'=>'Male'));
      $ret = $dbmng->insert($array);
      
      $this->assertEquals('pgsql', $app->getDb()->getDbType());
      
      $this->assertEquals(true, $ret['ok']);  
  }


}
