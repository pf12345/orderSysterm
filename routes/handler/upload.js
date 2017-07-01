var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');


var UPLOAD = {
  _upload: function(req, res, folder) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      fs.readFile(files.file[0].path, (err, data) => {
        if (err) {
          res.send({
            'result': 'FALSE',
            data: null,
            message: 'fs read file error',
            error: err
          })
        } else {
          var save_path = folder ? '/uploadImage/' + folder + '/' + files.file[0].originalFilename : '/uploadImage/' + files.file[0].originalFilename;
          fs.writeFile(path.resolve(__dirname, '../../') + '/static' + save_path, data, function(err) {
            try {
              fs.unlinkSync(files.file[0].path);
            } catch (e) {
              console.log('remove file error');
            }

            if (err) {
              res.send({
                'result': 'FALSE',
                data: null,
                message: 'fs save file error',
                error: err
              })
            } else {
              res.send({
                'result': 'TRUE',
                data: {
                  url: save_path,
                  name: files.file[0].originalFilename
                },
                message: 'The file has been saved!'
              })
            }
          });
        }
      });
    })
  },
  //保存测试单记录表图片
  csdjlb: function(req, res) {
    this._upload(req, res, 'csdjlb');
  }
}


module.exports = UPLOAD;
