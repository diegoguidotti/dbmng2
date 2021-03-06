<?php

/**
 * Class containing all the objects (Db, Auth, aParam, aPage) to be shared in a single application.
 *
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace Dbmng;

class App {

	private $db;
	private $aParam;


		/////////////////////////////////////////////////////////////////////////////
		// DB()
		// ======================
		/// DB Constructor. takes as an input a pdo object
		/**
		\param $db  a Db object
		\param $aParam  an array containing the project parameters
		*/
    public function __construct($db, $aParam=array())
    {
			$this->db=$db;
			$this->aParam=$aParam;
    }


		public function getDb(){
			return $this->db;
		}

		public function getParam(){
			return $this->aParam;
		}

		public function getUser(){
			if(isset($this->aParam['user']))      
				return $this->aParam['user'];
			else
				return $emptyUser=array('uid'=>0, 'mail'=>null, 'name'=>null, 'roles'=>array(0=>'anonymous')); ;
		}


}
