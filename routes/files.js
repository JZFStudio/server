var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');

const originPath = path.join(path.resolve(__dirname, '..'), '/public/files');

/* GET users listing. */
router.get('/', function (req, res, next) {
    fs.readdir(originPath, (err, result) => {
        res.send(result);
    });
});

router.delete('/', function (req, res, next) {
    console.log(req.query);
    console.log(req.query.fileName);
    let curPath = originPath + '/' + req.query.fileName;
    if(fs.existsSync(curPath)) {
        fs.unlinkSync(curPath);
        res.send({
            code: 0,
            statusText: 'Delete success.'
        });
    } else {
        res.send({
            code: 1,
            statusText: req.query.fileName + ' is not exist!'
        });
    }
});

module.exports = router;
