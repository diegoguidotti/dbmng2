<?php

//https://github.com/wildantea/php-pdo-mysql-helper-class
/**
 * database helper class
 * 
 * @author Diego Guidotti <diegoo.guidotti@gmail.com>
 */

namespace Dbmng;
 
class Db {

private $pdo;
    
    public function __construct()
    {
        try
        {
						$this->pdo = new \PDO("mysql:host=localhost;dbname=dbmng2", "root", "wwwfito");
						$this->pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
						$this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
						$this->pdo->exec("set names utf8");

						/*
            $this->pdo = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES '" . DB_CHARACSET . "';"));
            $this->pdo->exec("SET CHARACTER SET " . DB_CHARACSET);
            //$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //$this->pdo->query("set names " . DB_CHARACSET);
						*/
        } 
				catch (PDOException $e)
        {
            echo "error " . $e->getMessage();
        }
    }

		public function select($sQuery, $aVars){
			$ret=array();
			try 
				{
					$res0 = $this->pdo->prepare($sQuery);	
					$res0->execute($aVars);	
					$records=$res0->fetchAll(\PDO::FETCH_ASSOC);
					$ret['ok']=true;
					$ret['ret']=$records;
				
        } 
				catch (\PDOException $e)
        {
						$ret['ok']=false;
						$ret['message']=$e->getMessage();
        }
			return $ret;
		}

		public function test(){
			  $result = $this->select("SELECT a.id, a.name FROM test a", array());
        return $result['ret'];
		}

}

?>
