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

Create a mySQL database and populate it using the file sql/test.sql (change root if you want to install using a different user)

	$ mysql -u root -p -e "create database dbmng2"
	$ mysql -u root -p dbmng2 < sql/test.sql  


Update the configuration file

	$ cp phpunit.xml.dist phpunit.xml
	$ edit the phpunit.xml entering db_name, user and password

Running the test

    $ bin/phpunit





License
-------

DBMNG2 is released under the MIT License. See the bundled LICENSE file for details.
