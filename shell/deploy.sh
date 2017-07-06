#!/bin/bash

cd ../

echo "git pull starting....."
git pull
echo "git pull end"

pm2 restart 0
