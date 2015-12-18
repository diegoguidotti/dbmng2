#!/usr/bin/env bash

# Install everything
sudo apt-get update
sudo apt-get install apache2

# Configure Apache
WEBROOT="$(pwd)"
CGIROOT=`dirname "$(which php-cgi)"`
echo "WEBROOT: $WEBROOT"
echo "CGIROOT: $CGIROOT"
sudo echo "<VirtualHost *:80>
        Alias /dbmng2 $WEBROOT
        DocumentRoot $WEBROOT
        <Directory $WEBROOT >
                Options Indexes FollowSymLinks MultiViews ExecCGI
                AllowOverride All
                Order deny,allow
                allow from all
        </Directory>
        # Wire up Apache to use Travis CI's php-fpm.
      <IfModule mod_fastcgi.c>
        AddHandler php5-fcgi .php
        Action php5-fcgi /php5-fcgi
        Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
        FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -host 127.0.0.1:9000 -pass-header Authorization
      </IfModule>
</VirtualHost>" | sudo tee /etc/apache2/sites-available/default > /dev/null
cat /etc/apache2/sites-available/default

sudo a2enmod rewrite
sudo a2enmod actions
sudo service apache2 restart

# Configure custom domain
echo "127.0.0.1 mydomain.local" | sudo tee --append /etc/hosts

echo "TRAVIS_PHP_VERSION: $TRAVIS_PHP_VERSION"
