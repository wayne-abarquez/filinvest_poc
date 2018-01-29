#!/usr/bin/env bash

sudo rm /etc/supervisor/conf.d/filinvest_poc.conf
sudo cp conf/supervisord.conf /etc/supervisor/conf.d/filinvest_poc.conf
sudo supervisorctl reread
sudo supervisorctl update
