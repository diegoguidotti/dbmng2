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

		function testDelete()
		{
			$db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD'] );

			$aForm=array(  
				'table_name' => 'test' ,
					'primary_key'=> array('id'), 
					'fields'     => array(
							'id' => array('label'   => 'ID', 'type' => 'int' ) ,
							'name' => array('label'   => 'Name', 'type' => 'varchar')
					),
			);

			$aParam=array();

			$dbmng=new Dbmng($db, $aForm, $aParam);
			
			$ret = $dbmng->delete(array('id'=>1));
			$this->assertEquals(false, $ret['ok']);
			//the delete should fail (no field is a primary key)

			//add the key and re-create the dbmng object	
			$aForm['fields']['id']['key']=1;
			$dbmng=new Dbmng($db, $aForm, $aParam);

			$ret2 = $dbmng->delete(array('id'=>1));
			$this->assertEquals(true, $ret2['ok']);
			//Now the delete should works (a PK has been defined)
			
			//fwrite(STDERR, print_r($ret2));
		}

 		function testUpdate()
 		{
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
 
 			$dbmng=new Dbmng($db, $aForm, $aParam);
 			
 			$ret = $dbmng->update(array('id'=>1, 'name'=> 'pippo'));
 			$this->assertEquals(true, $ret['ok']);
			
 
 			$ret2 = $db->select('select id, name from test where id = 1', array(), \PDO::FETCH_BOTH);
 			$this->assertEquals('pippo',$ret2['data'][0][1]);
 
 		}


 		function testPrepare()
 		{
 			$db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD'] );
 
 			$aForm=array(  
 				'table_name' => 'test_father' ,
 					'primary_key'=> array('id_father'), 
 					'fields'     => array(
 							'id_father' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
 							'varchar_field' => array('label'   => 'Name', 'type' => 'varchar'),
 							'check_field' => array('label'   => 'Si/NO', 'type' => 'int', 'widget' => 'checkbox'),
 							'date_field' => array('label'   => 'Date', 'type' => 'date', 'widget' => 'date')
 					),
 			);
 
 			$aParam=array();

			//We will test the request. usually the checkbox unchecked does not produce a field in the $_REQUEST array. an empty data field should be consdered as a null value 
 			$dbmng=new Dbmng($db, $aForm, $aParam);
			$request=array('id_father'=>1,'date_field'=>'');

			$array= $dbmng->processRequest($request);
 			
 			$ret = $dbmng->update($array);
 			$this->assertEquals(true, $ret['ok']);
			
 
 			$ret2 = $db->select('select check_field, date_field from test_father where id_father = 1', array(), \PDO::FETCH_BOTH);
 			$this->assertEquals('0',$ret2['data'][0][0]);
 			$this->assertEquals(null,$ret2['data'][0][1]);
 
 		}

}

