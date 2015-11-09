<?php

/**
 *a Class to authenticate the http call
 * 
 */

namespace Dbmng;
 
class Login {

	private $db;
	private $aParam;
   //private $users = array('test' => 'test','dbmng'  => 'dbmng');
	private $empty_user;
	private $aut_type;

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
    $this->emptyUser=array('uid'=>0, 'mail'=>null, 'name'=>null, 'roles'=>array(1=>'anonymous user'), 'message'=>'Enter login');
    if(isset($aParam['auth_type']))
      $this->aut_type=$aParam['auth_type'];
    else
      $this->aut_type='POST';
  }


  public function auth()
  {
    $ret=array();
    if(isset($_SESSION['DBMNG_USER']))
    {
      $ret=json_decode($_SESSION['DBMNG_USER'], true); ;
    }
    else{
      $provided_user=null;
      $provided_password=null;	
      if($this->aut_type=='BASIC')
        {
          if(!empty($_SERVER['PHP_AUTH_USER']) && !empty($_SERVER['PHP_AUTH_PW']))
            {
              $provided_user=$_SERVER['PHP_AUTH_USER'];
              $provided_password=$_SERVER['PHP_AUTH_PW'];
            }
        }
      else
        {
          $pref='dbmng_';
          if(isset($aParam['auth_var_prefix']))
            {
              $pref=$aParam['auth_var_prefix'];
            }
          $provided_user=Util::get_val($_REQUEST,$pref.'user_id');
          $provided_password=Util::get_val($_REQUEST,$pref.'password');
        }		
      $ret=$this->check_authentication($provided_user,$provided_password);
    }
    
    return $ret;
  } 

  public function doLogout()
  {
    unset($_SESSION['DBMNG_USER']);
  }

  function check_authentication( $user, $pass ) 
  {		 
    $ret=array();
    
    if($user==null || $pass==null)
      {
        $ret=$this->returnEmptyUser(0,"The user has not provided userID or password");	
      }
    else
      {
        $sql="select * from dbmng_users where name=:name";
        $l=$this->db->select($sql,Array(':name'=>$user));
        if( !$l['ok'] )
          {
            $ret=$this->returnEmptyUser(1,"The db does not contain the right table");
          }
        elseif( count($l['data']) == 0 ) 
          {
              $ret=$this->returnEmptyUser(2,"The user ".$user." does not exists.");
          }
        elseif( $l['data'] )
          {
            if( $l['data'][0]['pass'] == md5($pass) )
              {
                $ret['user']=$l['data'][0];
                $ret['ok']=true;
                $_SESSION['DBMNG_USER'] = json_encode($ret);
                
                // get the roles associated to the user
                $uid = $l['data'][0]['uid'];
                $sql = "select r.rid, r.name from dbmng_users_roles ur, dbmng_role r where r.rid = ur.rid and ur.uid = :uid";
                $r = $this->db->select($sql, array(':uid' => $uid));
                if( $r['rowCount'] > 0 )
                  {
                    $aRoles = array();
                    for( $nR = 0; $nR < $r['rowCount']; $nR++ )
                      {
                        $rid  = $r['data'][$nR]['rid'];
                        $name = $r['data'][$nR]['name'];
                        $aRoles[$rid] = $name;
                      }
                    $ret['user']['roles'] = $aRoles;
                  }
                else
                  {
                    $ret['user']['roles'] = array(1=>'anonymous user');
                  }
              } 
            else 
              {
                $ret=$this->returnEmptyUser(3,"The password provided is not correct.");
              }
          }
      }
    
    return $ret;
  }


	function returnEmptyUser( $code, $message )
  {
    $ret=array();
    $ret['user'] = $this->emptyUser; 
    $ret['error_code'] = $code; 
    $ret['message'] = $message;
    $ret['ok'] = false;
    
    return $ret;
  }


}
