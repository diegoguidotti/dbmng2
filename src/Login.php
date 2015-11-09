<?php

/**
 *a Class to authenticate the http call
 * 
 */

namespace Dbmng;
 
class Login {

	private $db;
	private $aParam;
   private $users = array('test' => 'test','dbmng'  => 'dbmng');


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


	public function auth(){

		//print_r($_SERVER);
		
		if(empty($_SERVER['PHP_AUTH_USER']) || empty($_SERVER['PHP_AUTH_USER'])){
				
				return array('uid'=>0, 'mail'=>null, 'name'=>null, 'roles'=>array(0=>'anonymous'), 'message'=>'Enter login'); 
		}
		else{
			if(!$this->pc_validate($_SERVER['PHP_AUTH_USER'],$_SERVER['PHP_AUTH_PW'])){					
					return array('uid'=>0, 'mail'=>null, 'name'=>null, 'roles'=>array(0=>'anonymous'), 'message'=>'wrong login'); 
			}
			else{			
				return array('uid'=>1, 'mail'=>null, 'name'=>$_SERVER['PHP_AUTH_USER'], 'roles'=>array(0=>'authenticated')); 
			}
		}
	} 


	function pc_validate($user,$pass) {
		 /* replace with appropriate username and password checking,
		    such as checking a database */

		 if (isset($this->users[$user]) && ($this->users[$user] == $pass)) {
		     return true;
		 } else {
		     return false;
		 }
	}


}
