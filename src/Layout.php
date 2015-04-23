<?php

namespace Dbmng;

class Layout
{
    private $aPage;

    public function __construct($aPage)
    {
        $this->aPage = $this->cleanPage($aPage);
    }
    
    public function cleanPage($aPage){

			if(!isset($aPage['title'])){
				$aPage['title']="";
			}

			if(!isset($aPage['project'])){
				$aPage['project']="";
			}

			if(!isset($aPage['bootstrap_path'])){
				$aPage['bootstrap_path']="";
			}

			if(!isset($aPage['nav'])){
				$aPage['nav']=Array();
			}
			if(!isset($aPage['navRight'])){
				$aPage['navRight']=Array();
			}

			if(!isset($aPage['content'])){
				$aPage['content']="";
			}

		if(!isset($aPage['script'])){
				$aPage['script']="";
			}

			return $aPage;
		}



    public function getLayout(){


			$aPage=$this->aPage;

			$page='
				<!DOCTYPE html>
				<html lang="en">
					
					'.$this->getHeader().'

					<body >

						';


				$page.=$this->getNavigation();

				$page.=$this->getContent();

				$page.='



						 <script>
						$("#menu-toggle").click(function(e) {
								e.preventDefault();
								$("#wrapper").toggleClass("toggled");
						});
						</script>

					</body>
				</html>';


			return $page;
		}



    public function getHeader(){
			$html='<head>
						<meta charset="utf-8" />
						<meta http-equiv="X-UA-Compatible" content="IE=edge" />
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<meta name="description" content="" />
						<meta name="author" content="" />
						<link rel="icon" href="favicon.ico" />

						<title>'.$this->aPage['title'].'</title>

						<!-- Bootstrap core CSS -->
						<link rel="stylesheet" href="'.$this->aPage['bootstrap_path'].'css/bootstrap.min.css" />

						<link href="'.$this->aPage['bootstrap_path'].'css/simple-sidebar.css" rel="stylesheet" />
						
						<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
						<!--[if lt IE 9]>
							<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
							<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
						<![endif]-->


						<!-- Bootstrap core JavaScript
						================================================== -->
						<!-- Placed at the end of the document so the pages load faster -->						
						<script src="'.$this->aPage['bootstrap_path'].'js/jquery.min.js"></script>
						<script src="'.$this->aPage['bootstrap_path'].'js/bootstrap.min.js"></script>
						<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
						<script src="'.$this->aPage['bootstrap_path'].'js/ie10-viewport-bug-workaround.js"></script>


								'.$this->aPage['script'].'


				


						<style>
							div.sidebar{
								background-color: whiteSmoke;
							}
							body {
								padding-top: 50px;
							}
						</style>
					</head>';

			return $html;
		}



   public function getNavigation(){

		$aPage=$this->aPage;
		$html="";
		if(count($aPage['nav'])==0){
			;
		}
		else{
			$html='<nav class="navbar navbar-inverse navbar-fixed-top">
								<div class="container">
									<div class="navbar-header">
										<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" >
										  <span class="sr-only">Toggle navigation</span>
										  <span class="icon-bar"></span>
										  <span class="icon-bar"></span>
										  <span class="icon-bar"></span>
										</button>
										<a class="navbar-brand" href="?">'.$aPage['project'].'</a>
									</div>
									<div id="navbar" class="collapse navbar-collapse">
										<ul class="nav navbar-nav">';
										foreach($aPage['nav'] as $nav){													
												$html.=$this->writeNav($nav);
										}		

					$html.='
										</ul>

					<ul class="nav navbar-nav navbar-right">';
					foreach($aPage['navRight'] as $nav){													
							$html.=$this->writeNav($nav);
					}		
					$html.='</ul>
									</div><!--/.nav-collapse -->
								</div>
							</nav>';
			}

			return $html;
	}


	public function getContent(){

		$html='';

		if(isset($this->aPage['sidebar'])){
				$html.='
				<div id="wrapper">

								<!-- Sidebar -->
								<div id="sidebar-wrapper">
									'.$this->aPage['sidebar'].'
								</div>
								<!-- /#sidebar-wrapper -->

								<!-- Page Content -->
								<div id="page-content-wrapper">
								    <div class="container-fluid">
								        <div class="row">
								            <div class="col-lg-12">';

																if($this->aPage['title']<>'')
																	$html.='<h1>'.$this->aPage['title'].'</h1>';

																	$html.=''.$this->aPage['content'].'
								                <!-- <a href="#menu-toggle" class="btn btn-default" id="menu-toggle">Toggle Menu</a>-->
								            </div>
								        </div>
								    </div>
								</div>
								<!-- /#page-content-wrapper -->

						</div>
						<!-- /#wrapper -->
				';

				}
				else{
				//Normal page without sidebar
				$html.='
						<div class="container">

							<div class="starter-template">';

								if($this->aPage['title']<>'')
									$html.='<h1>'.$this->aPage['title'].'</h1>';

								$html.=''.$this->aPage['content'].'
							</div>

						</div><!-- /.container -->';
				}

		return $html;
	}

	function writeNav($nav){
		$tit="";
		$link="";
		if(isset($nav['title'])){
			$tit=$nav['title'];
		}	
		if(isset($nav['link'])){
			$link=$nav['link'];
		}	
	
		$cl="";
		if(isset($nav['active'])){
			$cl='active';
		}
		$html='<li class="'.$cl.'"><a href="'.$link.'">'.$tit.'</a></li>';
		return $html;
	}
		
}
