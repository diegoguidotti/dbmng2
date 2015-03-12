<?php

//https://github.com/wildantea/php-pdo-mysql-helper-class
/**
 * database helper class
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace Dbmng;
 
class Db {

private $pdo;
    

		/////////////////////////////////////////////////////////////////////////////
		// DB()
		// ======================
		/// DB Constructor. takes as an input a pdo object
		/**
		\param $pdo  a valid PDO object
		*/
    public function __construct($pdo)
    {
			$this->pdo=$pdo;
    }


		/////////////////////////////////////////////////////////////////////////////
		// createDb
		// ======================
		// Static function to creat a Db instance
		/**
		\param $dsn  dsn string
		\param $user  db user
		\param $password  db password
		*/
		public static function createDb($dsn, $user, $password) {
		
        try
        {
						$pdo = new \PDO($dsn, $user, $password);
						$pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
						$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
						$pdo->exec("set names utf8");

						$instance = new self($pdo);
			    	return $instance;

        } 
				catch (PDOException $e)
        {
            echo "error " . $e->getMessage();
						return null;
        }
		}


		/////////////////////////////////////////////////////////////////////////////
		// select
		// ======================
		// Query the db using a PDO Prepared Statements query string and an array of parametres
		/**
		\param $sQuery  the query with parameteres placeholders
		\param $aVars   associative array with placeholders and parameters. e.g. Array(':id'=>1, ':name'=>'Foo')
		*/
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
