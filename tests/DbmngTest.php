<?php

namespace Dbmng\Tests;
use Dbmng\App;
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


		public function getApp(){
				$db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD'] );
					$app=new App($db);
				return $app;

		}

		public function testTest() {

					$app=$this->getApp();
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

					$dbmng=new Dbmng($app, $aForm, $aParam);

					$ret = $dbmng->select();
			  	$this->assertEquals(
				      array(
				          array("id" => 1, "name" => "Diego")
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
					$app=$this->getApp();
			$aForm=array(
				'table_name' => 'test' ,
					'primary_key'=> array('id'),
					'fields'     => array(
							'id' => array('label'   => 'ID', 'type' => 'int' ) ,
							'name' => array('label'   => 'Name', 'type' => 'varchar')
					),
			);

			$aParam=array();

			$dbmng=new Dbmng($app, $aForm, $aParam);

			$ret = $dbmng->delete(array('id'=>1));
			$this->assertEquals(false, $ret['ok']);
			//the delete should fail (no field is a primary key)

			//add the key and re-create the dbmng object
			$aForm['fields']['id']['key']=1;
			$dbmng=new Dbmng($app, $aForm, $aParam);

			$ret2 = $dbmng->delete(array('id'=>1));
			$this->assertEquals(true, $ret2['ok']);
			//Now the delete should works (a PK has been defined)

			//fwrite(STDERR, print_r($ret2));
		}

 		function testUpdate()
 		{

			$app=$this->getApp();

 			$aForm=array(
 				'table_name' => 'test' ,
 					'primary_key'=> array('id'),
 					'fields'     => array(
 							'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
 							'name' => array('label'   => 'Name', 'type' => 'varchar')
 					),
 			);

 			$aParam=array();

 			$dbmng=new Dbmng($app, $aForm, $aParam);

 			$ret = $dbmng->update(array('id'=>1, 'name'=> 'pippo'));
 			$this->assertEquals(true, $ret['ok']);


 			$ret2 = $app->getDb()->select('select id, name from test where id = 1', array(), \PDO::FETCH_BOTH);
 			$this->assertEquals('pippo',$ret2['data'][0][1]);

 		}

    function testOrderBy()
    {

      $app=$this->getApp();

      $aForm=array(
        'table_name' => 'test' ,
          'primary_key'=> array('id'),
          'fields'     => array(
              'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
              'name' => array('label'   => 'Name', 'type' => 'varchar')
          ),
      );

      $aParam=array('tbl_order'=>'id desc');

      $dbmng=new Dbmng($app, $aForm, $aParam);

      $ret = $dbmng->select();
      $this->assertEquals('2', $ret['data'][0]['id']);

      $aParam=array('tbl_order'=>'id');

      $dbmng=new Dbmng($app, $aForm, $aParam);

      $ret = $dbmng->select();
      $this->assertEquals('1', $ret['data'][0]['id']);

    }

 		function testPrepare()
 		{
 							$app=$this->getApp();

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
 			$dbmng=new Dbmng($app, $aForm, $aParam);
			$request=array('id_father'=>1,'date_field'=>'');

			$array= $dbmng->processRequest($request);

 			$ret = $dbmng->update($array);
 			$this->assertEquals(true, $ret['ok']);


 			$ret2 = $app->getDb()->select('select check_field, date_field from test_father where id_father = 1', array(), \PDO::FETCH_BOTH);
 			$this->assertEquals('0',$ret2['data'][0][0]);
 			$this->assertEquals(null,$ret2['data'][0][1]);

			$request=array('varchar_field'=>'foo');
			$array= $dbmng->processRequest($request);

 			$ret3 = $dbmng->insert($array);
 			$this->assertEquals(true, $ret3['ok']);
 			$ret4 = $app->getDb()->select('select varchar_field from test_father where id_father = :id', array(':id' => $ret3['inserted_id']), \PDO::FETCH_ASSOC);
 			$this->assertEquals('foo',$ret4['data'][0]['varchar_field']);
 			//fwrite(STDERR, print_r($ret4));
//  			$this->assertEquals(null,$ret4['data'][0][1]);
 		}

 		function testNM()
 		{
			$app=$this->getApp();
			$db=$app->getDb();

 			$aForm=array(
 				'table_name' => 'test_father' ,
 					'primary_key'=> array('id_father'),
 					'fields'     => array(
 							'id_father' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
 							'varchar_field' => array('label'   => 'Name', 'type' => 'varchar'),
 							'check_field' => array('label'   => 'Si/NO', 'type' => 'int', 'widget' => 'checkbox'),
 							'date_field' => array('label'   => 'Date', 'type' => 'date', 'widget' => 'date'),
 							'id_father_child' => array('label' => 'link to child', 'type' => 'int', 'widget' => 'select_nm', 'table_nm' => 'test_father_child', 'field_nm' => 'id_child' )
 					),
 			);
 			$aParam=array();
 			$dbmng=new Dbmng($app, $aForm, $aParam);


			//try the simple select of a nm table
			$ret0=($dbmng->select());
 			$this->assertEquals(true, $ret0['ok']);


 			$request = array('check_field' => 1, 'varchar_field' => 'abra', 'id_father_child' => array(1,3,4));
			$array = $dbmng->processRequest($request);
			$ret = $dbmng->insert($array);
 			$this->assertEquals(true, $ret['ok']);

 			$sql = "select count(*) from test_father_child where id_father = :id";
 			$var = array(":id" => $ret['inserted_id']);
 			$ret2 = $db->select($sql, $var, \PDO::FETCH_BOTH );
 			$this->assertEquals(3, $ret2['data'][0][0]);


			$request=array('id_father'=>3,'varchar_field'=>'foo', 'id_father_child' => array(9,8));
			$array= $dbmng->processRequest($request);

 			$ret3 = $dbmng->update($array);

 			$this->assertEquals(true, $ret3['ok']);




 			$ret4 = $db->select('select varchar_field from test_father where id_father = 3', array(), \PDO::FETCH_BOTH);
 			$this->assertEquals('foo',$ret4['data'][0][0]);

 			$ret5 = $db->select('select * from test_father_child where id_father = :father and id_child = :child', array(':father' => 3, ':child' =>9), \PDO::FETCH_BOTH);
 			$this->assertEquals(1,$ret5['rowCount']);

 			$ret6 = $db->select('select * from test_father_child where id_father = :father and id_child = :child', array(':father' => 4, ':child' =>9), \PDO::FETCH_BOTH);
 			$this->assertEquals(0,$ret6['rowCount']);
 		}

 		function testFilters()
 		{

			$app=$this->getApp();
			$db=$app->getDb();

 			$aForm = array(
 				'table_name' => 'test_father' ,
 					'primary_key'=> array('id_father'),
 					'fields'     => array(
 							'id_father' => array('label' => 'ID', 'type' => 'int', 'key' => 1 ) ,
 							'varchar_field' => array('label' => 'Name', 'type' => 'varchar'),
 							'check_field' => array('label' => 'Si/NO', 'type' => 'int', 'widget' => 'checkbox'),
 							'date_field' => array('label' => 'Date', 'type' => 'date', 'widget' => 'date')
 					),
 			);

 			$aParam=array();
 			$aParam['filters']['check_field'] = 1;

			//We will test the request. usually the checkbox unchecked does not produce a field in the $_REQUEST array. an empty data field should be consdered as a null value
 			$dbmng=new Dbmng($app, $aForm, $aParam);

 			$aValid = $dbmng->isValid();
 			$this->assertEquals(false,$aValid['ok']);

			$request=array('varchar_field'=>'testa aParam');

			$array= $dbmng->processRequest($request);

 			$ret = $dbmng->insert($array);
 			//fwrite(STDERR, print_r($ret));
 			$this->assertEquals(false, $ret['ok']);

 			// we remove the check_field. re-test insert
 			unset($aForm['fields']['check_field']);
			$dbmng=new Dbmng($app, $aForm, $aParam);
			$ret = $dbmng->insert($array);
 			//fwrite(STDERR, print_r($ret));
 			$this->assertEquals(true, $ret['ok']);

 			$ret2 = $db->select('select * from test_father where id_father = :id', array(':id' => $ret['inserted_id']), \PDO::FETCH_ASSOC);
 			$this->assertEquals(1,$ret2['data'][0]['check_field']);
 			$this->assertEquals('testa aParam',$ret2['data'][0]['varchar_field']);
 			//fwrite(STDERR, print_r($ret4));

			// the system doesn't allow to update the a non filtered record
			$ret3 = $dbmng->update(array('id_father'=> 1, 'varchar_field' => 'Pippo'));
 			$ret4 = $db->select('select * from test_father where id_father = :id', array(':id' => 1), \PDO::FETCH_ASSOC);
 			$this->assertEquals('Diego',$ret4['data'][0]['varchar_field']);

			// the system doesn't allow to delete a non filtered record
			$ret5 = $dbmng->delete(array('id_father'=> 1));
 			$ret6 = $db->select('select * from test_father where id_father = :id', array(':id' => 1), \PDO::FETCH_ASSOC);
 			$this->assertEquals('Diego',$ret6['data'][0]['varchar_field']);

 		}



}
