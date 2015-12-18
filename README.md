DBMNG2
===============




Library Usage
---------------

``` php
#create a db connection
$db = DB::createDb($dsn, $user,$password );

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
$dbmng=new Dbmng($db, $aForm, $aParam);

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
	$ sudo npm install -g grunt-cli 
	$ cd dbmng2/js/
	$ npm install
	$ grunt #run the grunt manager on the project

 





To test the api you should link the folder in the apache folder

	$ ln -s ../dbmng2 /var/www/

Verify that the follow link respond 
	
	$ http://localhost/dbmng2/api/test_base
	


Running the test

    $ bin/phpunit





License
-------

DBMNG2 is released under the MIT License. See the bundled LICENSE file for details.
