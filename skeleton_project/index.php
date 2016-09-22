<?php
  require_once 'vendor/autoload.php';
  require_once 'settings.php';

	echo homePage($aSetting);



  function homePage($aSetting )
  {
    session_start();
    $db  = Dbmng\Db::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );
    $app = new Dbmng\App($db, $aSetting);

    $aPage = Array();

    $login = new Dbmng\Login($db);
    if( isset($_REQUEST['do_logout']) )
      {
        $login->doLogout();
      }
    $login_res = $login->auth();

    $aPage['project']        = "Project Name";
    $aPage['title']          = "";
    $aPage['bootstrap_path'] = "vendor/twbs/bootstrap/dist/";

    $logged_in = $login_res['ok'];
    $isAdmin = false;

    $body    = "";
    $sidebar = "";

    if( !$logged_in )
      {
        if( isset($_REQUEST['dbmng_user_id']) && isset($login_res['message']) )
          {
            $body .= '<div class="alert alert-warning">' . $login_res['message'] . '</div>';
          }

        $aPage['navRight'][0]['title'] = 'Login';
        $aPage['navRight'][0]['link']  = '?do_login=true';

        if( isset($_REQUEST['do_login']) )
          {
            $body .= '<form>';
            $body .= '<input class="form-control" name="dbmng_user_id" placeholder="user ID" />';
            $body .= '<input type="password" class="form-control" name="dbmng_password" placeholder="password" />';
            $body .= '<input class="form-control" type="submit" value="login"></form>';
          }
        else
          {
            ;
          }
      }
    else
      {
        $acc = $login_res['user'];

        if( $acc )
          {
            $aPage['navRight'][0]['title'] = 'Hi '.$acc['name'];
            if( isset($acc['roles']) )
              {
                if (in_array("administrator", $acc['roles']) ) 
                  {
                    $isAdmin = true;
                  }
              }
          }
        
        $aPage['navRight'][1]['title'] = 'Logout';
        $aPage['navRight'][1]['link']  = '?do_logout=true';
    }

    $body .= '<script>var global_opt={};';
    if( $logged_in )
      {
        $acc['pass'] = 'xxxxxxxxxxxxxxxxxxx';
        $body .= 'global_opt.user=' . json_encode($acc) . ';';
      }
    $body .= '</script>';


    /***************************************************************************
    START CUSTOM AREA  
    ****************************************************************************/

    $aPage['nav'][0]['title'] = 'Sezione1';
    $aPage['nav'][0]['link']  = '?sect=1';
    $aPage['nav'][1]['title'] = 'Sezione2';
    $aPage['nav'][1]['link']  = '?sect=2';

    if( isset($_REQUEST['sect']) )
      {
        $sect = $_REQUEST['sect'];
        if( $sect=="1" )
          {
            $body .= 'Sezione1';
            $sidebar .= "Sidebar1";
          }
        elseif( $sect=="2" )
          {
            $body .= 'Sezione2';
            $sidebar .= "Sidebar2";
          }
      }
    else
      {
        $body .= "Home";
        $sidebar = null;

        $sql = "select * from dbmng_users";
        $var = array();
        $l   = $app->getDb()->select($sql,$var);
        $body .= "<pre>a" . print_r($l, true) . "b</pre>";
      }

    /***************************************************************************
    END CUSTOM AREA  
    ****************************************************************************/
    $aPage['content'] = $body;
    $aPage['sidebar'] = $sidebar;

    $body .= '<pre>' . print_r($aPage,true) . '</pre>';

    $layout = new Dbmng\Layout($aPage);

    $html = $layout->getLayout();
    return $html;
  }

?>
