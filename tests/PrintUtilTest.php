<?php

namespace Dbmng\Tests;

use Dbmng\PrintUtil;

class PrintUtilTest extends \PHPUnit_Framework_TestCase
{


	public function test_req_equal()
	{
    $real_dim=100;
    $pixel=100;
    $scale=PrintUtil::get_scale($real_dim, $pixel);
    //$this->assertEquals(1200,$scale);

    $image=PrintUtil::create_image_transparent(200,200);
    imagepng($image,'test.png' );

    $image=PrintUtil::get_image_title(200,200, "Ciao");
    imagepng($image,'test.png' );


	}


}
