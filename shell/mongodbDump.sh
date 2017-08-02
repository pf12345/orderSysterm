#!/bin/bash

echo "dump start"

cd /root/mongodb/mongodb-linux-x86_64-3.2.0/bin/

./mongodump -h 127.0.0.1:27017 -d orderSysterm -o /data/backups

cd /data/backups

tar czvf db`date +%Y%m%d`.tar ./orderSysterm

cp -p /data/backups/db`date +%Y%m%d`.tar /root/www/orderSysterm/dist/backups

echo "dump end"
