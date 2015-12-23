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

		    $ret4 = $db->select('select id, name from test', array(), \PDO::FETCH_BOTH);
		    $this->assertEquals(2,count($ret4['data']));

	}

	public function testInsert(){
		    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
		    $ret = $db->insert('insert into test (id, name) values(:id, :name )', array(':id'=>3, ':name'=>'Susanna'));

		    $this->assertEquals(true,$ret['ok']);
 		    $this->assertEquals(3,$ret['inserted_id']);

				// Get the rowCount
		    $ret2 = $db->select('select id, name from test', array(), \PDO::FETCH_BOTH);
		    $this->assertEquals(3,$ret2['rowCount']);

				// Get the colCount
		    $ret3 = $db->select('select id, name from test', array(), \PDO::FETCH_BOTH);
		    $this->assertEquals(2,$ret3['colCount']);

		    $ret4 = $db->select('select id, name from test', array(), \PDO::FETCH_BOTH);
		    $this->assertEquals('Susanna',$ret4['data'][2][1]);

		    $ret5 = $db->select('select id, name from test', array(), \PDO::FETCH_CLASS);
		    $nCnt = 0;
		    foreach( $ret5['data'] as $k => $v )
					{
						$nCnt++;
					}

				$this->assertEquals(3,$nCnt);
				
        $ret6 = $db->insert('insert into test (id, name,true_false) values(:id, :name, :true_false )', array(':id'=>4, ':name'=>'Cinzia', ':true_false' => null));
        $this->assertEquals(true,$ret6['ok']);
        $this->assertEquals(4,$ret6['inserted_id']);
        
        $ret7 = $db->select('select true_false from test where id = :id', array(':id' => 4));
        $this->assertEquals(true,$ret7['ok']);
        $this->assertEquals(null,$ret7['data'][0]['true_false']);
        // fwrite(STDERR, print_r($ret7));
        
        $ret8 = $db->insert('insert into test (id, name,true_false) values(:id, :name, :true_false )', array(':id'=>5, ':name'=>'Qwerty', ':true_false' => ''));
        $this->assertEquals(true,$ret8['ok']);
        $this->assertEquals(5,$ret8['inserted_id']);
        
        $ret9 = $db->select('select true_false from test where id = :id', array(':id' => 5));
        fwrite(STDERR, print_r($ret9));
        $this->assertEquals(true,$ret9['ok']);
        $this->assertEquals(null,$ret9['data'][0]['true_false']);
	}

	public function testUpdate(){
		    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
		    $ret = $db->insert('insert into test (id, name) values(:id, :name )', array(':id'=>3, ':name'=>'Susanna'));
				$ret2 = $db->update('update test set name = :name where id = :id', array(':id'=>3, ':name'=>'Cinzia'));

		    $ret4 = $db->select('select id, name from test', array(), \PDO::FETCH_BOTH);
		    $this->assertEquals('Cinzia',$ret4['data'][2][1]);
	}

	public function testDelete(){
		    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
				$ret = $db->update('delete from test where id = :id', array(':id'=>2));

				$this->assertEquals(true,$ret['ok']);

				// Get the rowCount
		    $ret2 = $db->select('select id, name from test', array(), \PDO::FETCH_BOTH);
		    $this->assertEquals(1,$ret2['rowCount']);

		    //fwrite(STDERR, print_r($ret2));
	}

	public function testGetSQL(){
		    $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);

		    $sql = $db->getSQL('select id, name from test WHERE id=:id AND nome=:nome', array(':id'=>1, ':nome'=>'Diego'));
		    $this->assertEquals("select id, name from test WHERE id='1' AND nome='Diego'",$sql);

		    $sql = $db->getSQL('select id, name from test WHERE id=:id AND nome=:nome', array(':id'=>1, ':nome'=>"Die'SQLInjection"));
		    $this->assertEquals("select id, name from test WHERE id='1' AND nome='Die\'SQLInjection'",$sql);

	}

	public function test_transactions() {
				$db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
				$aQueries[1]['sql'] = 'insert into test (id, name) values(:id, :name )';
				$aQueries[1]['var'] = array(':id'=>3, ':name'=>'Susanna');
				$ret = $db->transactions($aQueries);
				$this->assertEquals(true,$ret['ok']);

		    $ret2 = $db->select('select id, name from test where id = :id', array(':id'=>3), \PDO::FETCH_BOTH);
		    $this->assertEquals(1,$ret2['rowCount']);
	}


	public function testEmpty(){
	    $db = DB::createDb(null, null, null);
      $this->assertEquals(null,$db);
	}



}
