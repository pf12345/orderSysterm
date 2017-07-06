#!/bin/bash

cd /root/mongodb-linux-i686-3.2.0/bin

./mongodump -h 127.0.0.1:27017 -d carSchool -o /data/dump

cd /data/dump

tar czvf db`date +%Y%m%d`.tar ./carSchool

cp -p /data/dump/db`date +%Y%m%d`.tar /root/www/orderSysterm/dist/backups
