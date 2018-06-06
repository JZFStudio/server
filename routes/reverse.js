const express = require('express');
const router = express.Router();
const fs = require('fs');

const path = require('path');

const originPath = path.join(path.resolve(__dirname, '..'), '/public/data/');

/* GET home page. */
router.put('/', function(req, res) {
    let steps = req.query.steps / 1;
    let type = req.query.type;
    fs.readFile(originPath + 'reverse.json', {encoding: 'utf8'}, (err, res1) => {
        if (err) {
            console.log(err);
            res.send({
                code: 1,
                statusText: 'Read rank failed.'
            });
        } else {
            res1 = JSON.parse(res1);
            let data = res1['type' + type];
            if (data.list.indexOf(steps) === -1) {
                let text = '记录已保存';
                if (steps < (data.max / 1)) {
                    data.max = steps;
                    data.list.unshift(steps);
                    text = '恭喜你，刷新记录';
                } else {
                    data.list.push(steps);
                    data.list.sort((a, b) => {
                        return (a - b);
                    });
                }
                fs.writeFile(originPath + 'reverse.json', JSON.stringify(res1), {encoding: 'utf8'}, (err, res2) => {
                    if (err) {
                        console.log(err);
                        res.send({
                            code: 1,
                            statusText: 'Write rank failed.'
                        })
                    } else {
                        res.send({
                            code: 0,
                            statusText: text
                        })
                    }
                })
            } else {
                res.send({
                    code: 0,
                    statusText: '恭喜完成，再接再厉！'
                })
            }
        }
    });
});

router.get('/', function (req, res) {
    fs.readFile(originPath + 'reverse.json', {encoding: 'utf8'}, (err, res1) => {
        if (err) {
            res.send({
                code: 1,
                statueText: '读取排名失败'
            })
        } else {
            res.send({
                code: 0,
                result: res1
            })
        }
    })
});

module.exports = router;