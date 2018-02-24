<?php

/**
 *a Class to authenticate the http call
 *
 */

namespace Dbmng;
//


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
  public function __construct($app)
  {
    $this->db=$app->getDb();
    $this->aParam=$app->getParam();
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
		else if($this->aut_type=='Drupal'){
			global $user;
			$ret = $user;
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


  //register or reset the password (if $opt['reset_password']==true)
  public function register($email,$password, $opt){

    $register=true;
    if(isset($opt['reset_password'])){
      if($opt['reset_password']){
        $register=false;
      }
    }


    if(!isset($opt['subject'])){
      $opt['subject']="Confirmation message";
    }
    if(!isset($opt['web_message'])){
      if($register){
        $opt['web_message']="We have send you an email. Click on the email link to register the website";
      }
      else{
        $opt['web_message']="We have send you an email. Click on the email link to reset the password";
      }
    }


    $ok=false;
    $message="";
    $res=Array();

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
      $message="The email is not valid.";
    }
    else if($register && strlen($password)<6){
      $message="The password is too short.";
    }
    else{

      $exist=$this->db->select("select * from  dbmng_users WHERE name=:mail", Array(':mail'=>$email));
      if($register && count($exist['data'])>0){
        $message="The userID already exists. If you do not remember the password please contact us.";
      }
      else if(!$register && count($exist['data'])==0){
        $message="The user does not exists. You should <a href='?do_register'>register</a>.";
      }
      else{
        $ok=True;
        $token=Util::GUID();
        $op='register';
        if(!$register){
          $op='reset';
        }
        $res=$this->db->select(" insert into dbmng_users_register (mail, pass, token, op) values (:mail, md5(:pass), :token, :op) ", Array(':mail'=>$email,':pass'=>$password,':token'=>$token, ':op'=>$op));

        if($res['ok']){
          $body_message="";
          if(!isset($opt['body'])){
            $body_message.="To activate your registration you're requested to click on the confirmation link.";
          }
          else{
            $body_message.=$opt['body'];
          }
          $click_here="Click here to confirm";
          if(isset($opt['click_here'])){
            $click_here=$opt['click_here'];
          }
          $body_message.=" <a style='margin: 20px 50px;font-size: 20px;display: block;text-align: center;border: 1px solid black;padding: 30px;' href='".$this->aParam['WEBSITE']."?check_email=".$token."'>".$click_here."</a>";

          $mail_message=Array('to'=>$email,'subject'=>$opt['subject'],'body'=>$body_message);

          MailSender::send($mail_message,$this->aParam);
          $message=$opt['web_message'];
        }
        else{
          $ok=false;
          $message=$res['message'];
        }


      }
    }

    return Array('ok'=>$ok,'message'=>$message  );
  }

  public function check_email($token){
    $ok=false;
    $message='';
    $register=true;
    $res=$this->db->select("select * from dbmng_users_register WHERE token=:token AND used=0", Array(':token'=>$token));
    if(count($res['data'])>0){
      $u=$res['data'][0];
      if($u['op']=='reset'){
        $register=false;

        if(isset($_REQUEST['new_password']) && strlen($_REQUEST['new_password'])>6){
            $a=Array(':name'=>$u['mail'],':pass'=>$_REQUEST['new_password']);

            $ret=$this->db->update("UPDATE dbmng_users set pass=md5(:pass) WHERE name=:name", $a);
            if($ret['ok']){
              $this->db->select("UPDATE dbmng_users_register set used=1 WHERE token=:token", Array(':token'=>$token));
              //print_r( $ret['inserted_id']);
              $message.="The password has been reset. You can now <b><a href='?do_login=true'>login the website</a></b>";
              $ok=true;
            }

        }
        else{


          if(isset($_REQUEST['new_password'])){
            $message.="<div class='alert alert-danger'>Please, choose a longer password!</div>";
          }
          $message.="<h1>reset the password</h1>";
          $message.="<form action='?' method='POST'>";
          $message.="<input type='hidden' name='check_email' value='".$token."'/>";
          $message.="<input class='form-control' name='new_password' type='password' value=''/>";
          $message.="<input class='form-control' type='submit' value='Reset the password'/>";
          $message.="</form>";
        }

      }
      else{
        $a=Array(':name'=>$u['mail'],':pass'=>$u['pass'],':mail'=>$u['mail']);

        $ret=$this->db->insert("insert into dbmng_users (name, pass, mail) VALUES (:name, :pass, :mail)", $a,'dbmng_users_uid_seq');
        if($ret['ok']){
          $this->db->select("UPDATE dbmng_users_register set used=1 WHERE token=:token", Array(':token'=>$token));
          //print_r( $ret['inserted_id']);
          $message.="We have confirmed your email. You can now <b><a href='?do_login=true'>login the website</a></b>";
          $ok=true;
        }
        else{
          $message="There is a problem in creating the user. Probably the user already exists.";
        }
      }
    }
    else{
      $message="The token is wrong or expired.";
    }
    return Array('ok'=>$ok,'message'=>$message, 'register'=>$register  );


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
                    $ret['user']['roles'][] = 'authenticated user';


                  }
                else
                  {
                    $ret['user']['roles'][] = 'authenticated user';
                  }
                  $_SESSION['DBMNG_USER'] = json_encode($ret);
               }
            else
              {
                $ret=$this->returnEmptyUser(3,"The password provided is not correct. Click <a href='?do_reset_password=true'>here to reset the passowrd</a>" );
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
