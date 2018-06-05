var express = require('express');
var router = express.Router();

var path = require('path');

var originPath = path.join(path.resolve(__dirname, '..'), '/public/files/');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.download(originPath + req.query.fileName);
});

module.exports = router;