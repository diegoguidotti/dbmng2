<?php

namespace Dbmng\Tests;
use Dbmng\Db;
use Dbmng\Dbmng;

class DbmngTest extends \PHPUnit_Extensions_Database_TestCase
{

		// only instantiate pdo once for test clean-up/fixture load
    static private $pdo = null;

		// only instantiate PHPUnit_Extensions_Database_DB_IDatabaseConnection once per test
    private $conn = null;

    public function getConnection() {

				if ($this->conn === null) {
            if (self::$pdo == null) {
                self::$pdo = new \PDO( $GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD'] );
								//self::$pdo = new \PDO("", "", "");
								self::$pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
								self::$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
								self::$pdo->exec("set names utf8");
								
            }
            $this->conn = $this->createDefaultDBConnection(self::$pdo, $GLOBALS['DB_NAME']);
        }
        return $this->conn;
    }

    public function getDataSet() {
        return $this->createFlatXMLDataSet(dirname(__FILE__).'/seed.xml'); 
    }


		public function testTest() {
				  $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD'] );

					$aForm=array(  
						'table_name' => 'test' ,
							'primary_key'=> array('id'), 
							'fields'     => array(
									'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
									'name' => array('label'   => 'Name', 'type' => 'varchar')
							),
					);


					$aParam=array();
					$aParam['filters']['id']=1;
					$aParam['filters']['name']='Diego';

					$dbmng=new Dbmng($db, $aForm, $aParam);
					
					$ret = $dbmng->select();
				  $this->assertEquals(
				      array(
				          array("id" => 1, "name" => "Diego"),
				          array("id" => 2, "name" => "Michele")
							),
				      $ret['data']
					);

					$sField='';
					$sVal='';
					$aVal=array();

					$dbmng->filterInsert($sField, $sVal, $aVal);
					$this->assertEquals('id, name', $sField);

					$this->assertEquals(array(":id"=>1, ":name"=>'Diego'), $aVal);
					
			}


}

