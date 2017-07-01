var redisConfig = require(__dirname + '/config/redis.json');
var redis = require("redis"),
  client = redis.createClient(redisConfig.port, redisConfig.ip);

// redis 链接错误
client.on("error", function(error) {
  console.log(error);
});

redisHander = {
  setValue: function(key, value, cb) {
    //写入JavaScript(JSON)对象
    client.hmset(key, value, function(err,res) {
      if(err) {
        console.log(err);
      }
      if(cb && typeof cb == 'function') {
        cb(res);
      }
    })
  },
  getValue: function(key, cb) {
    //读取JavaScript(JSON)对象
    client.hgetall(key, function(err, object) {
      if(err) {
        console.log(err)
      }
      if(cb && typeof cb == 'function') {
        cb(object);
      }
    })
  }
}

module.exports = redisHander;
