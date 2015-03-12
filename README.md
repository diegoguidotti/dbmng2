DBMNG2
===============


Requirements
------------

- PHP >= 5.3.3
- [Composer](http://getcomposer.org/).

Installation and first Test
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

    $ composer install --dev

 



Contributing
------------

See CONTRIBUTING.md file.


    $ phpunit

License
-------

DBMNG2 is released under the MIT License. See the bundled LICENSE file for details.
