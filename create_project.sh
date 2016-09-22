#!/bin/bash
clear

function USAGE()
{
  echo "Crea un nuovo progetto...."
  
  echo ""
  echo "USAGE:"
  echo "------"
  echo "    create_project.sh <project_name>  "
  exit $E_OPTERROR    # Exit and explain usage, if no argument(s) given.
}

if [ $# -ne 2 ]; then
    USAGE
    exit 0
fi

# GLOBAL VARIABLE
base_path=$1
project_name=$2

fullpath=$base_path$project_name

while true; do
    read -p "Enter Databse Engine (1: mysql - 2: pgsql): " mysql_engine
    case $mysql_engine in
        1 ) break;;
        2 ) break;;
    esac
done

echo ""

read -p "Enter MySQL User: " mysql_user
read -s -p "Enter MySQL Password: " mysql_password
while true; do
  if ! mysql -u $mysql_user -p$mysql_password -e"quit" 2> /dev/null; then
    echo ""
    echo "Utente e/o password errate!"
    read -p "Enter MySQL User: " mysql_user
    read -s -p "Enter MySQL Password: " mysql_password
  else
    break
  fi
done
echo ""
read -p "Enter Database Name: " mysql_database

# CREATE THE FOLDER AND FILES
mkdir $fullpath

cp -r skeleton_project/* $fullpath

cd $fullpath
mkdir src tests js

touch css/$project_name.css
touch js/$project_name.js

if [ $mysql_engine == 1 ]; then
  cp settings.default.mysql.php settings.php
fi
if [ $mysql_engine == 2 ]; then
  cp settings.default.pgsql.php settings.php
fi

sed -i -- 's/aegest/'$project_name'/g' composer.json
composer update

mysql -u $mysql_user -p$mysql_password -e "create database $mysql_database DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci";
mysql -u $mysql_user -p$mysql_password $mysql_database < sql/dbmng2.sql

sed -i -- 's/xxx_user/'$mysql_user'/g' settings.php
sed -i -- 's/xxx_dbname/'$mysql_database'/g' settings.php
sed -i -- 's/xxx_password/'$mysql_password'/g' settings.php
sed -i -- 's/xxx_project_name/'$project_name'/g' index.php

tree -L 2