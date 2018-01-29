#!/usr/bin/env bash

# TODO: Change project dir name

sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-available/filinvest_poc
sudo rm /etc/nginx/sites-enabled/filinvest_poc
sudo cp conf/local/nginx.conf /etc/nginx/sites-available/filinvest_poc
sudo ln -s /etc/nginx/sites-available/filinvest_poc /etc/nginx/sites-enabled/filinvest_poc
sudo /etc/init.d/nginx reload
