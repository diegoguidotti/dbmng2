<?php

namespace Dbmng\Tests;

use Dbmng\Layout;

class LayoutTest extends \PHPUnit_Framework_TestCase
{
    

    public function testEmptyPage()
    {

				$aPage=Array();

        $layout = new Layout($aPage);
				
				$header=$layout->getHeader();
				$this->assertTrue($this->check($header));		

				$nav=$layout->getNavigation();
				$this->assertTrue($this->check($nav));		

				$content=$layout->getContent();
				$this->assertTrue($this->check($content));	

				$html=$layout->getLayout();
				$this->assertTrue($this->check($html));		

    }


    public function testEmptyNav()
    {

				$aPage=Array();

				$aPage['project']="smartIPM";
				$aPage['title']="Home Page";
				$aPage['content']="This is a content";

				$aPage['nav'][0]="";

        $layout = new Layout($aPage);

			
				$html=$layout->getLayout();
				$this->assertTrue($this->check($html));

				
    }

    public function testFullPage()
    {

				$aPage=Array();

				$aPage['project']="smartIPM";
				$aPage['title']="Home Page";
				$aPage['content']="This is a content";

				$aPage['nav'][0]['title']='Home';
				$aPage['nav'][0]['link']='?';
				$aPage['nav'][1]['title']='Section 1';
				$aPage['nav'][1]['link']='?section=1';

				$aPage['sidebar']="This is the sidebar";

        $layout = new Layout($aPage);

				$html=$layout->getLayout();
				$this->assertTrue($this->check($html));

				
    }


		/* Check if a string is xml valid */
		public function check($string) {
/*

			$start =strpos($string, '<');
			$end  =strrpos($string, '>',$start);
			if ($end !== false) {
				$string = substr($string, $start);
			} 
			else {
				$string = substr($string, $start, $len-$start);
			}
*/
			libxml_use_internal_errors(true);
			libxml_clear_errors();

			$xml = simplexml_load_string($string);
			$err=libxml_get_errors();
			if(count($err)==0){
				return true;
			}
			else{
				fwrite(STDERR, print_r($err, TRUE));
				fwrite(STDERR, print_r("|".$string."|", TRUE));
				return false;
			}
		}





}


