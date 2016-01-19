<?php

namespace Dbmng\Tests;
use Dbmng\App;
use Dbmng\Db;
use Dbmng\DbmngHelper;

class DbmngHelperTest extends \PHPUnit_Extensions_Database_TestCase
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


		public function test_getFormArray() {
      $db = DB::createDb($GLOBALS['DB_DSN'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWD']);
      $app = new App($db, Array());

      $h = new DbmngHelper($app);
      $aDataID = $h->getFormArrayById(1);
      $aDataName = $h->getFormArrayByName('test');
      $aDataAlias = $h->getFormArrayByAlias('test');
      // print_r($aFormAlias);

      $this->assertEquals($aDataID, $aDataName);
      $this->assertEquals($aDataID, $aDataAlias);
      $this->assertEquals('test',$aDataID['aForm']['table_alias']);


		}
}
