<?php

/**
 * generate images for print
 *
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 * @author Michele Mammini <mamminim@gmail.com>
 */
namespace Dbmng;

class PrintUtil {

  //echo an image
  public function echo_image($image){
      header('Content-type: image/png');
      imagepng($image);
  }


  // [
  //   {'type': 'title','value':'This is  a map'},
  //   {'type': 'osm'},
  // ]
  // generateImage($layers){}

  //determina la scala della mappa (in funzione delle dimensioni e dei pixel)
  public function get_scale($real_dim, $pixel, $dpi=96){
      $map_dim= ($pixel/$dpi)*0.0254;
      $scale=$real_dim/$map_dim;
      return $scale;
  }


	//determina la dimensione in pixel data la scala e la dimensione in metri
  public function get_pixel($real_dim, $scale, $dpi=96){
			$map_dim=$real_dim/$scale;

			$pixel=$dpi*$map_dim/0.0254;

			return intval($pixel);
	}

	//determina la dimensione in metri data la scala e la dimensione in pixel
  public function get_meter($pixel, $scale, $dpi=96){
			$real_dim=$scale*((0.0254*$pixel)/$dpi);
			return intval($real_dim);
	}


  //create a transparent image
	 public function create_image_transparent($width, $height){
  		$image = imagecreatetruecolor($width, $height);
  		imagesavealpha($image, true);
  		if (function_exists('imageantialias')){
  			imageantialias($image, true);
  		}
  	  $trans_colour = imagecolorallocatealpha($image, 0,222, 0, 127);
  		imagefill($image, 0, 0, $trans_colour);
  		return $image;
  	}

  //generate a transparent image with a title
	 public function get_image_title($width, $height, $title){
 		$im=PrintUtil::create_image_transparent($width, $height);

		$black = imagecolorallocate($im, 0, 0, 0);

		$font_size=16;
		$font = 'arial.ttf';

		//per centrare l'immagine calcola ill box
		$tb = imagettfbbox($font_size, 0, $font, $title);
		$move_x = ceil(($width - $tb[2]) / 2);
		//print_r($tb);
		imagettftext($im, $font_size, 0, $move_x, 20, $black, $font, $title);

		return $im;
	}



  //merge a set of images
	public function merge_images($a, $debug=false){
		if(count($a)>0){
			// Get new dimensions

			if($debug){
				echo '<li><a href="'.$a[0]['file'].'" />'.$a[0]['file'].'</a></li>';
			}
			list($width, $height) = getimagesize($a[0]['file']);
			$background = imagecreatefrompng($a[0]['file']);
			imagealphablending($background, true);
			imagesavealpha($background, true);


			for($n=1; $n<count($a); $n++){

				//nell'array ci puà essere il nome del file oppure una immagine
				if(array_key_exists('image', $a[$n])){
					$image2=$a[$n]['image'];
				}
				else{
					$fn=$a[$n]['file'];
					if($debug){
						echo '<li><a href="'.$fn.'" />'.$fn.'</a></li>';
					}
					$image2 = imagecreatefrompng($fn);
				}

				if(array_key_exists('opacity', $a[$n])){
					$res= imagecopymerge($background, $image2,  0, 0, 0, 0,$width, $height, $a[$n]['opacity'] );
				}
				else{
					$res= imagecopy($background, $image2,  0, 0, 0, 0,$width, $height );
				}
				imagedestroy($image2);
			}
			return $background;
		}
		else{
			return null;
		}
	}

  //generate a map with dottet points according with $points array and $coords extension
	function get_image_points($width, $height, $points, $coords){

		$x1=$coords['x1'];
		$x2=$coords['x2'];
		$y1=$coords['y1'];
		$y2=$coords['y2'];

		$image = imagecreatetruecolor($width, $height);
		imagesavealpha($image, true);
		if (function_exists('imageantialias')){
			imageantialias($image, true);
		}

	  $trans_colour = imagecolorallocatealpha($image, 0,222, 0, 127);
		imagefill($image, 0, 0, $trans_colour);

		$red = imagecolorallocate($image,255,0,0);
		$yellow = imagecolorallocate($image,255,255,0);
		$lgreen = imagecolorallocate($image,193,251,159);
		$green = imagecolorallocate($image,0,255,0);
		$black = imagecolorallocate($image,0,0,0);


		for($n=0; $n<count($points); $n++){
			$p=$points[$n];

			$lat=$p->lat;
			$lon=$p->lon;
			$col=$p->color;

			$c=$black;
			if($col=='red'){$c=$red;}
			else if($col=='yellow'){$c=$yellow;}
			else if($col=='green'){$c=$green;}
			else if($col=='lgreen'){$c=$lgreen;}

			$x=round($width*($this->lon2x($lon)-$this->lon2x($x1))/($this->lon2x($x2)-$this->lon2x($x1)));
			$y=round($height*(1-($this->lat2y($lat)-$this->lat2y($y1))/($this->lat2y($y2)-$this->lat2y($y1))));

			imagefilledellipse ( $image, $x , $y, 17, 17 , $black );
			imagefilledellipse ( $image, $x , $y, 15, 15 , $c );

		}

		return $image;
	}

  //convert a zoom to a scale
	public function zoom2scale($zoom) {
		return 256 * pow(1.5, $zoom);
	}

  //convert a zoom to a leaflet scale
	public function zoom2scaleLeaflet($zoom) {
     return 591657550.500000 / pow( 2, $zoom);

	}

	public function lon2x($lon) { return deg2rad($lon) * 6378137.0; }
	public function lat2y($lat) { return log(tan(M_PI_4 + deg2rad($lat) / 2.0)) * 6378137.0; }
	public function x2lon($x) { return rad2deg($x / 6378137.0); }
	public function y2lat($y) { return rad2deg(2.0 * atan(exp($y / 6378137.0)) - M_PI_2); }

}
