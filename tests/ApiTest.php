<?php

namespace Dbmng\Tests;
use Dbmng\Db;
use Dbmng\App;
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
						'id' => array('label' => 'ID', 'type' => 'int', 'key' => 1 ) ,
						'name' => array('label' => 'Name', 'type' => 'varchar')
				),
		);

		$aParam=array();


		$dbmng = new Dbmng($app, $aForm, $aParam);
		$api   = new Api($dbmng);


		$this->assertTrue($api->isValid()['ok']);

	}


/*
	public function testApiBasic() {

		$client = new \GuzzleHttp\Client([
			 // Base URI is used with relative requests
			 'base_uri' => 'http://localhost',
			 // You can set any number of default request options.
			 'timeout'  => 2.0,
		]);

		$response = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test_base/');
		$this->assertEquals(200,$response->getStatusCode());
		// $this->assertEquals('{"test_get":1}',$response->getBody());

		$response2 = $client->request('DELETE', $GLOBALS['SITE_FOLDER'].'/api/test_base/');
		$this->assertEquals('{"test_delete":1}',$response2->getBody());

		$response3 = $client->request('PUT', $GLOBALS['SITE_FOLDER'].'/api/test_base/', ['body' => '{"diego":1}']);
		$this->assertEquals('{"diego":1,"test_put":1}',$response3->getBody());

		$response4 = $client->request('POST', $GLOBALS['SITE_FOLDER'].'/api/test_base/', ['body' => '{"diego":1}']);
		$this->assertEquals('{"test_post":1}',$response4->getBody());

	}
  */

	public function testApi() {

		$client = new \GuzzleHttp\Client([
			 // Base URI is used with relative requests
			 'base_uri' => 'http://localhost',
			 // You can set any number of default request options.
			 'timeout'  => 2.0,
		]);

		$auth=[        'test', 'test'    ];
		$auths=[    'auth' => $auth];

    $response = $client->request('GET', 'http://localhost');
		$this->assertEquals(200,$response->getStatusCode());

    $response = $client->request('GET', 'http://localhost/dbmng2/README.md');
		$this->assertEquals(200,$response->getStatusCode());

		$response = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test/',$auths);
		$this->assertEquals(200,$response->getStatusCode());
		$a = $response->getBody();
		$o = json_decode($a);
    //check if it is true and returns two record
		$this->assertEquals(true,$o->ok);
    $this->assertEquals(2,$o->rowCount);
/*
		$response2 = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/testfake/',$auths);
		$a = $response2->getBody();
		$o = json_decode($a);
		$this->assertEquals(false,$o->ok);
*/

		$response3 = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test/1',$auths);
		$this->assertEquals(200,$response3->getStatusCode());
		$a = $response3->getBody();
		$o = json_decode($a);
		$this->assertEquals(true,$o->ok);
		$this->assertEquals(1,$o->rowCount);

    //search for records where name is equals to Michele
    $response = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test/?name=Michele',$auths);
    $this->assertEquals(200,$response->getStatusCode());
    $a = $response->getBody();
    $o = json_decode($a);
    $this->assertEquals(true,$o->ok);
    $this->assertEquals(1,$o->rowCount);

    //search for records where name is equals to Michele and id is equals 1 (no records)
    $response = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test/?name=Michele&id=1',$auths);
    $this->assertEquals(200,$response->getStatusCode());
    $a = $response->getBody();
    $o = json_decode($a);
    $this->assertEquals(true,$o->ok);
    $this->assertEquals(0,$o->rowCount);

		$response4 = $client->request('PUT', $GLOBALS['SITE_FOLDER'].'/api/test/1', ['body' => '{"name":"pluto"}','auth'=>$auth]);
		$a = $response4->getBody();
		$o = json_decode($a);
		$this->assertEquals(true,$o->ok);

		$response5 = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test/1',$auths);
		$a = $response5->getBody();
		$o = json_decode($a);
		$this->assertEquals('pluto',$o->data[0]->name);

		$response6 = $client->request('PUT', $GLOBALS['SITE_FOLDER'].'/api/test/1', ['body' => '{"nama":"pluto"}','auth'=>$auth]);
		$a = $response6->getBody();
		$o = json_decode($a);
		$this->assertEquals(false,$o->ok);

		$response7 = $client->request('PUT', $GLOBALS['SITE_FOLDER'].'/api/test/1', ['body' => '{"name":"pluto", "surname":"topolino"}','auth'=>$auth]);
		$a = $response6->getBody();
		$o = json_decode($a);
		$this->assertEquals(false,$o->ok);




	}




  	public function testApiFilter() {

  		$client = new \GuzzleHttp\Client([
  			 // Base URI is used with relative requests
  			 'base_uri' => 'http://localhost',
  			 // You can set any number of default request options.
  			 'timeout'  => 2.0,
  		]);

  		$auth=[        'test', 'test'    ];
  		$auths=[    'auth' => $auth];

      //the test_simple is an alias of test with a filters
  		$response3 = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test_simple/',$auths);
  		$this->assertEquals(200,$response3->getStatusCode());
  		$a = $response3->getBody();
  		$o = json_decode($a);
  		$this->assertEquals(true,$o->ok);
  		$this->assertEquals(0,$o->rowCount);

      //insert a new record
      $res1 = $client->request('POST', $GLOBALS['SITE_FOLDER'].'/api/test_simple/', ['body' => '{"name":"Susanna"}','auth'=>$auth]);

  		$o = json_decode($res1->getBody());
      //print_r($o);

  		$this->assertEquals(true,$o->ok);

      //check if the record has been added
      $response4 = $client->request('GET', $GLOBALS['SITE_FOLDER'].'/api/test_simple/',$auths);
  		$o2 = json_decode($response4->getBody(),true);
      $this->assertEquals(true,$o2['ok']);
    
  		$this->assertEquals(1,$o2['rowCount']);
      $this->assertEquals("Susanna",$o2['data'][0]['name']);


      $res=$this->getApp()->getDb()->select("select name from test WHERE sex='F' AND name='Susanna'",array());
      $this->assertEquals("Susanna",$res['data'][0]['name']);
    }

  public function testApiNullValue() {

    $app=$this->getApp();
		$client = new \GuzzleHttp\Client([
			 // Base URI is used with relative requests
			 'base_uri' => 'http://localhost',
			 // You can set any number of default request options.
			 'timeout'  => 2.0,
		]);

		$auth=[        'test', 'test'    ];
		$auths=[    'auth' => $auth];


    $res1 = $client->request('PUT', $GLOBALS['SITE_FOLDER'].'/api/test/1', ['body' => '{"true_false":13}','auth'=>$auth]);
		$o = json_decode($res1->getBody());
		$this->assertEquals(true,$o->ok);

    $res1=$app->getDb()->select('select true_false from test WHERE id=1',array());
    $this->assertEquals(13,$res1['data'][0]['true_false']);

    //return false if your are trying to add a text instead of a number
    $res1 = $client->request('PUT', $GLOBALS['SITE_FOLDER'].'/api/test/1', ['body' => '{"true_false":"aaaa"}','auth'=>$auth]);
		$o = json_decode($res1->getBody());
		$this->assertEquals(false,$o->ok);

    $res1 = $client->request('PUT', $GLOBALS['SITE_FOLDER'].'/api/test/1', ['body' => '{"true_false":""}','auth'=>$auth]);
		$o = json_decode($res1->getBody());
		$this->assertEquals(true,$o->ok);

    $res1=$app->getDb()->select('select true_false from test WHERE id=1',array());
    $this->assertEquals(null,$res1['data'][0]['true_false']);
  }

    public function testApiTransaction() {

      $client = new \GuzzleHttp\Client([
         // Base URI is used with relative requests
         'base_uri' => 'http://localhost',
         // You can set any number of default request options.
         'timeout'  => 2.0,
      ]);

      $auth=[        'test', 'test'    ];
      $auths=[    'auth' => $auth];

      //insert a new record
      $res1 = $client->request('POST', $GLOBALS['SITE_FOLDER'].'/api/test/transaction', [['body' => '{"name":"Susanna"}','mode' => 'insert'],'auth'=>$auth]);
      
      //insert a new record
      // $res1 = $client->request('POST', $GLOBALS['SITE_FOLDER'].'/api/test/', ['body' => '{"name":"Susanna"}','auth'=>$auth]);

//       $o = json_decode($res1->getBody());
//       print_r($o);
// 
//       $this->assertEquals(true,$o->ok);
// 
// 
//       $res=$this->getApp()->getDb()->select("select name from test WHERE name='Susanna'",array());
//       $this->assertEquals("Susanna",$res['data'][0]['name']);
    }
}
