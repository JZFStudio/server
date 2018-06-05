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

module.exports = router;
