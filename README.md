# ordersysterm

> 订单管理系统

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## mongodb命令

``` bash
备份：  

./mongodump -h 127.0.0.1:27017 -d orderSysterm -o /data/backups

恢复：

./mongorestore -h 127.0.0.1:27017 -d orderSysterm /data/backups/orderSysterm

删除数据库：

show dbs
use orderSysterm
db.dropDatabase()

删除数据：
db.xxx.remove({created: {       
  $gte: '2017-08-24 12:00:00',       
  $lte: '2017-08-24 16:00:00'     
}})

```

## shell命令

```bash

发布：
>chmod +x ./deploy.sh
>./deploy.sh

登录服务器：
> ssh root@xxx.xxx.xx.xx

```
## 系统相关

```
git 安装
> yum install git

nodejs 安装
> curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
> yum install -y gcc-c++ make
> yum install -y nodejs npm
> npm install -g n
> n stable

```
## 相关链接

[pm2](http://pm2.keymetrics.io/docs/usage/quick-start/)
