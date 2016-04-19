<?php

namespace Dbmng\Tests;
use Dbmng\Db;
use Dbmng\Login;
use GuzzleHttp\Client;


class LoginTest extends \PHPUnit_Extensions_Database_TestCase
{
  /* BEGIN needed for test class */
  static private $pdo = null;
  private $conn = null;
    
  public function getConnection() 
  {
    if ($this->conn === null) 
      {
        if (self::$pdo == null) 
          {
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
    
  public function getDataSet() 
  {
    return $this->createFlatXMLDataSet(dirname(__FILE__).'/seed.xml'); 
  }
	/* END needed for test class */

  public function getDB()
  {
    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD'] );
    
    return $db;
  }
  
  public function testLogin()
  {
    $db = $this->getDB();
    
    $login = new Login($db);
    $l1 = $login->auth();
    
    $this->assertEquals(0,$l1['ok']);
    $this->assertEquals(0,$l1['user']['uid']);
    //print_r($l1);
    
    $l2 = $login->check_authentication('test','test');
    $this->assertEquals(1,$l2['ok']);
    $this->assertEquals(1,$l2['user']['uid']);
    print_r($l2);
    
    $l3 = $login->check_authentication('testwrong','test');
    $this->assertEquals(0,$l3['ok']);
    $this->assertEquals(2,$l3['error_code']);
    // print_r($l3);
    
    $l4 = $login->check_authentication('test','testwrong');
    $this->assertEquals(0,$l4['ok']);
    $this->assertEquals(3,$l4['error_code']);
    // print_r($l4);
    
    $l5 = $login->check_authentication('admin','admin');
    $this->assertEquals(0,$l5['ok']);
    $this->assertEquals(2,$l5['error_code']);
    
    $sql = "insert into dbmng_users (name, pass) values (:name, :pass);";
    $var = array(':name' => 'admin', ':pass' => md5('admin'));
    $ret = $db->insert($sql, $var);
    if( $ret['ok'] )
      {
        $inserted_id = $ret['inserted_id'];
        
        $sql = "insert into dbmng_users_roles (uid,rid) values(:uid, :rid)";
        $var = array(':uid' => $inserted_id, ':rid' => 3);
        $retUR = $db->insert($sql, $var);
        $l6 = $login->check_authentication('admin','admin');

        $this->assertEquals(1,$l6['ok']);
        $this->assertEquals('administrator', $l6['user']['roles'][3]);
      }
    
    
    //print_r($l6);
  }
  
  public function testLoginRequest() 
  {
    $db=$this->getDB();

    $client = new \GuzzleHttp\Client([
       // Base URI is used with relative requests
       'base_uri' => 'http://localhost',
       // You can set any number of default request options.
       'timeout'  => 2.0,
    ]);
    
    $login=new Login($db, array('auth_type'=>'BASIC'));
    $l=$login->auth();
    
    $response = $client->request('GET', 'dbmng2/api/test/', ['auth' => ['test', 'test']]);
    $this->assertEquals(200,$response->getStatusCode());
    
//     $a = $response->getBody();
//     $o = json_decode($a);
//     print_r($o);
//     $login=new Login($db, array('auth_type'=>'BASIC'));
//     $l=$login->auth();
//     print_r($l);
  }
}

