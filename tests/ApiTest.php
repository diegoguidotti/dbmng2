<?php

namespace Dbmng\Tests;
use Dbmng\Db;
use Dbmng\Dbmng;
use Dbmng\Api;
use GuzzleHttp\Client;

class ApiTest extends \PHPUnit_Extensions_Database_TestCase
{


	/* BEGIN needed for test class */
    static private $pdo = null;
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
	/* END needed for test class */


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


		$dbmng=new Dbmng($db, $aForm, $aParam);
		$api=new Api($dbmng);
					
		
		$this->assertTrue($api->isValid()['ok']);
					
	}


	public function testApi() {

		$client = new \GuzzleHttp\Client([
			 // Base URI is used with relative requests
			 'base_uri' => 'http://localhost',
			 // You can set any number of default request options.
			 'timeout'  => 2.0,
		]);

		$response = $client->request('GET', 'dbmng2/api/test/');


		$this->assertEquals(200,$response->getStatusCode());
	
		$this->assertEquals('{"test":1}',$response->getBody());
;	
		
	}

}

