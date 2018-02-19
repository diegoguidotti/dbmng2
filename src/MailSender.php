<?php

namespace Dbmng;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailSender
{

  static function send(&$message, $opt) {
  	// abilitare l'account per le app meno sicure
  	// https://myaccount.google.com/u/0/lesssecureapps
    // drupal_set_message("<pre>".print_r($message,true)."</pre>");

    $ok=false;
    $str_message="";
  	$message['send'] = FALSE;

  	$email = new PHPMailer;
  	try
  		{
  			$email->isSMTP();
  			$email->SMTPDebug = 2;
  			$debug = "";
  			$GLOBALS['debug'] = "";
  			$email->Debugoutput = function($str, $level) {
  					$GLOBALS['debug'] .= "$level: $str\n";
  			};
  			$email->Host = 'smtp.gmail.com';

  			$email->Port = 587;
  			$email->SMTPSecure = 'tls';
  			$email->SMTPAuth = true;

  			$addMe = true;
  			$mail = $opt['EMAIL'];

  			$email->Username = $mail;
  			$email->Password = $opt['EMAIL_PASSWORD'];

        $from_email=$mail;
        if(isset($opt['EMAIL_SENDER'])){
          $from_email=$opt['EMAIL_SENDER'];
        }

  			$email->setFrom($from_email , $from_email );
  			$email->AddReplyTo($from_email,$from_email);

  			$email->addAddress( $message['to'] );

  			$email->Subject = $message['subject'];
  			$email->Body = $message['body'];
  			$email->AltBody = 'This is a plain-text message body';

  			$email->send();
        $ok=true;
  		}
  	catch (Exception $e)
  		{
  			$str_message('The email message has not been send. Mailer Error: ', $email->ErrorInfo);
  		}

      return Array('ok'=>$ok, 'message'=>$str_message);
  }

}
