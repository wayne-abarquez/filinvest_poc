#!/usr/bin/env bash

echo 'Running app...'
exec /var/www/filinvest_poc/venv/bin/gunicorn run:app -c /var/www/filinvest_poc/conf/gunicorn.conf.py
