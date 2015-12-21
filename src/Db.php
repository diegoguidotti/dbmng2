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

						if( strpos($dsn,'mysql') !== false )
							$pdo->exec("set names utf8");

						$instance = new self($pdo);
			    	return $instance;

        }
				catch (\PDOException $e)
        {
            //echo "error " . $e->getMessage();
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
		\param $fetch_style	style [default FETCH_ASSOC] reference -> http://php.net/manual/en/pdostatement.fetch.php
		*/
		public function select($sQuery, $aVars, $fetch_style = \PDO::FETCH_ASSOC ){
			$ret=array();
			try
				{
					$res0 = $this->pdo->prepare($sQuery);
					$res0->execute($aVars);
					$records=$res0->fetchAll($fetch_style);
					$ret['ok']=true;
					$ret['data']=$records;
					$ret['colCount'] = $res0->columnCount();
					$ret['rowCount'] = $res0->rowCount();

        }
				catch (\PDOException $e)
        {
						$ret['ok']=false;
						$ret['message']=$e->getMessage();
						$ret['sql'] = $sQuery;
            $ret['vars'] = $aVars;
        }
			return $ret;
		}

		/////////////////////////////////////////////////////////////////////////////
		// insert
		// ======================
		// Insert a record inside db using a PDO Prepared Statements
		/**
		\param $sQuery  the query with parameteres placeholders
		\param $aVars   associative array with placeholders and parameters. e.g. Array(':id'=>1, ':name'=>'Foo')
		*/
		public function insert($sQuery, $aVars){
			$ret=array();
			try
				{
					$dbh = $this->pdo;

					$res0 = $dbh->prepare($sQuery);

					$dbh->beginTransaction();
						$res0->execute($aVars);
						$id = $dbh->lastInsertId();
					$dbh->commit();

					$ret['ok']=true;
					$ret['inserted_id'] = $id;
        }
				catch (\PDOException $e)
        {
					$ret['ok']=false;
					$ret['message']=$e->getMessage();
        }
			return $ret;
		}

		/////////////////////////////////////////////////////////////////////////////
		// execute
		// ======================
		// Execute an SQL query (update or delete) inside db using a PDO Prepared Statements
		/**
		\param $sQuery  the query with parameteres placeholders
		\param $aVars   associative array with placeholders and parameters. e.g. Array(':id'=>1, ':name'=>'Foo')
		*/
		public function execute($sQuery, $aVars){
			$ret=array();
			try
				{
					$dbh = $this->pdo;

					$res0 = $dbh->prepare($sQuery);

					$dbh->beginTransaction();
						$res0->execute($aVars);
					$dbh->commit();

					$ret['ok']=true;
        }
				catch (\PDOException $e)
        {
					$ret['ok']=false;
					$ret['message']=$e->getMessage();
					$ret['sql']=$this->getSQL($sQuery, $aVars);
					//fwrite(STDERR, print_r($e));
					//$ret['sql']=$e->getMessage();

        }
			return $ret;
		}

		/////////////////////////////////////////////////////////////////////////////
		// transactions
		// ======================
		// Execute different SQL query (insert, update or delete) inside db using a PDO Prepared Statements
		/**
		\param $aQuery  associative array with sql statement and associative array with placeholders and parameters. e.g. array('insert into foo (id) values (:id)', array(':id'=>1) )
		*/
		public function transactions($aQuery){
			$ret=array();
			try
				{
					$dbh = $this->pdo;
					$ret=array();
					$dbh->beginTransaction();
					$all_ok=true;

					foreach( $aQuery as $a )
						{
							$prep0 = $dbh->prepare($a['sql']);
							$ok= $prep0->execute($a['var']);

							$id = $dbh->lastInsertId();
							if(!$ok){
								$all_ok=false;
							}

							$ret0=array();
							$ret0['ok']=$ok;
							$ret0['sql']=$a['sql'];

							if($id>0){
								$ret0['inserted_id']=$id;
							}
/*
							if(strpos($a['sql'],"insert")===false){
								;
							}
							else{
									$ret0['inserted_id']=$id;
							}
*/
							$ret[]=$ret0;

						}
						$dbh->commit();

						$ret['ok']=$all_ok;
        }
				catch (\PDOException $e)
        {
					$ret['ok']=false;
					$ret['message']=$e->getMessage();
					$ret['sql']=$this->getSQL($sQuery, $aVars);
					//fwrite(STDERR, print_r($e));
					//$ret['sql']=$e->getMessage();

        }
			return $ret;
		}

		/////////////////////////////////////////////////////////////////////////////
		// update
		// ======================
		// Update an SQL query (update or delete) inside db using a PDO Prepared Statements
		/**
		\param $sQuery  the query with parameteres placeholders
		\param $aVars   associative array with placeholders and parameters. e.g. Array(':id'=>1, ':name'=>'Foo')
		*/
		public function update($sQuery, $aVars){
			return $this->execute($sQuery, $aVars);
		}

		/////////////////////////////////////////////////////////////////////////////
		// delete
		// ======================
		// Delete an SQL query (update or delete) inside db using a PDO Prepared Statements
		/**
		\param $sQuery  the query with parameteres placeholders
		\param $aVars   associative array with placeholders and parameters. e.g. Array(':id'=>1, ':name'=>'Foo')
		*/
		public function delete($sQuery, $aVars){
			return $this->execute($sQuery, $aVars);
		}

		public function getSQL($sQuery, $aVars){
			$sql = $sQuery;
			if (sizeof($aVars) > 0)
				{
					foreach ($aVars as $key => $value)
						{
							$sql = str_replace($key, $this->pdo->quote($value), $sql);
						}
				}
			return $sql;
		}
}

?>
