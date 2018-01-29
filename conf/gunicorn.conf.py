bind = '127.0.0.1:8071'
accesslog = '/var/www/filinvest_poc/logs/gunicorn-access.log'
errorlog = '/var/www/filinvest_poc/logs/gunicorn-error.log'
limit_request_line = 0
workers = 2
preload = True
timeout = 120
