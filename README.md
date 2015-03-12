DBMNG2
===============


Requirements
------------

- PHP >= 5.3.3
- [Composer](http://getcomposer.org/).

Installation
---------------

First install composer

	$ curl -sS https://getcomposer.org/installer | php
	$ sudo mv composer.phar /usr/local/bin/composer

Clone the repository from github

	$ git clone https://github.com/diegoguidotti/dbmng2.git
	$ cd dbmng2

Install the dbmng2 dependencies using composer

	$ composer update


Contributing
------------

See CONTRIBUTING.md file.

Running Tests
-------------

Install the [Composer](http://getcomposer.org/) `dev` dependencies:

    $ composer install --dev

Then, run the test suite using [PHPUnit](http://phpunit.de/):

    $ phpunit

License
-------

DBMNG2 is released under the MIT License. See the bundled LICENSE file for details.
