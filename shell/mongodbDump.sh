#!/bin/bash

cd /root/mongodb/mongodb-linux-i686-3.2.0/bin

./mongodump -h 127.0.0.1:27017 -d orderSysterm -o /data/dump

cd /data/dump

tar czvf db`date +%Y%m%d`.tar ./orderSysterm

cp -p /data/dump/db`date +%Y%m%d`.tar /root/www/orderSysterm/dist/backups
