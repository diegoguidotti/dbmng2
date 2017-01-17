DBMNG2
===============




Library Usage
---------------

``` php
#create a db connection
$db = DB::createDb($dsn, $user,$password );

#create an app object containing db and other parameters
$app=new App($db);

#define the form structure
$aForm=array(  
	'table_name' => 'test' ,
		'primary_key'=> array('id'), 
		'fields'     => array(
				'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
				'name' => array('label'   => 'Name', 'type' => 'varchar')
		),
);
#define a param array
$aParam=array();

#create a Dbmng object
$dbmng=new Dbmng($app, $aForm, $aParam);

#return the data
$ret = $dbmng->select();

```


Installation and Test
---------------

First install composer

	$ curl -sS https://getcomposer.org/installer | php
	$ sudo mv composer.phar /usr/local/bin/composer

Clone the repository from github

	$ git clone https://github.com/diegoguidotti/dbmng2.git
	$ cd dbmng2

Install the dbmng2 dependencies using composer

	$ composer update

Edit the file Router.php (vendor/respect/rest/library/Respect/Rest/Router.php) replacing the function sortRoutesByComplexity with the following one to allow a correct sort using PHP 7:

```php
    protected function sortRoutesByComplexity()
    {
        usort(
            $this->routes,
            function ($a, $b) {
                $elementsa = preg_split('#/#', $a->pattern, 0, PREG_SPLIT_NO_EMPTY);
                $elementsb = preg_split('#/#', $b->pattern, 0, PREG_SPLIT_NO_EMPTY);
                if(end($elementsa) == '**' && end($elementsb) == '**')
                   return count($elementsa) < count($elementsb);
                if(end($elementsa) == '**')
                   return 1;
                if(end($elementsb) == '**')
                   return -1;
                if(count($elementsa) < count($elementsb)){
                   return -1;
                }
                if(count($elementsa) > count($elementsb)){
                   return 1;
                }
                $keysa = array_keys($elementsa, '*');
                $keysb = array_keys($elementsb, '*');
                if(count($keysa) < count($keysb)){
                   return -1;
                }
                if(count($keysa) > count($keysb)){
                   return 1;
                }
                for($index=0; $index < count($keysa); $index++){
                   if($keysa[$index] == $keysb[$index])
                       continue;
                   return $keysa[$index]<$keysb[$index];
                }
                return $a->method>$b->method;
                /* 
		// Previous code - do not work correct with PHP 7
                $a = $a->pattern;
                $b = $b->pattern;
                $pi = AbstractRoute::PARAM_IDENTIFIER;

                //Compare similarity and ocurrences of "/"
                if (Router::compareRoutePatterns($a, $b, '/')) {
                    return 1;

                //Compare similarity and ocurrences of /*
                } elseif (Router::compareRoutePatterns($a, $b, $pi)) {
                    return -1;

                //Hard fallback for consistency
                } else {
                    return 1;
                }
                */
           }
        );
    }

```

Create a mySQL database and populate it using the file sql/dbmng2.sql and sql/test.sql (change root if you want to install using a different user) You can skip test.sql if you wan't run test unit

	$ mysql -u root -p -e "create database dbmng2"
	$ mysql -u root -p dbmng2 < sql/dbmng2.sql
	$ mysql -u root -p dbmng2 < sql/test.sql


Update the configuration file

	$ cp phpunit.xml.dist phpunit.xml
	$ edit the phpunit.xml entering db_name, user and password
	$ cp settings.default.php  settings.php
	$ edit the settings.php entering db_name, user and password


For the JS library you need to install grunt (nodejs required) and then with npm install load the nodel packages

	$ apt-get install libfontconfig1 fontconfig libfontconfig1-dev libfreetype6-dev #dipendenze per phantomJS per il test
	$ apt-get install nodejs-legacy 
	$ sudo npm install -g grunt-cli 
	$ cd dbmng2/js/
	$ npm install
	$ grunt #run the grunt manager on the project






To test the api you should link the folder in the apache folder

	$ ln -s ../dbmng2 /var/www/

Verify that the follow link respond 
	
	$ link: http://localhost/dbmng2/api/test_base
	$ {"0":{"id":"1","name":"Diego","sex":""},"1":{"id":"2","name":"Michele","sex":""},"test_get":1}

Apache needs some modules (for rest and file upload)

	$ sudo a2enmod rewrite
	$ sudo a2enmod headers
	$ sudo service apache2 restart

Create a file in apache2 conf-enabled with the following content:

	$ <Directory /var/www/dbmng2/> 
	$	FollowSymLinks 
	$	AllowOverride All 
	$ </Directory>

Running the test

    $ bin/phpunit





License
-------

DBMNG2 is released under the MIT License. See the bundled LICENSE file for details.
