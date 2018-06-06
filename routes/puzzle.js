const express = require('express');
const router = express.Router();
const fs = require('fs');

const path = require('path');

const originPath = path.join(path.resolve(__dirname, '..'), '/public/data/');

/* GET home page. */
router.put('/', function(req, res) {
    let steps = req.query.steps / 1;
    let time = req.query.time / 1;
    fs.readFile(originPath + 'puzzle.json', {encoding: 'utf8'}, (err, res1) => {
        if (err) {
            console.log(err);
            res.send({
                code: 1,
                statusText: 'Read rank failed.'
            });
        } else {
            let data = JSON.parse(res1);
            let text = '';
            if ((data.step_list.indexOf(steps) === -1) || (data.time_list.indexOf(time) === -1)) {
                if (steps < (data.max_step / 1)) {
                    data.max_step = steps;
                    data.step_list.unshift(steps);
                    text += '刷新步数记录';
                } else if (data.step_list.indexOf(steps) === -1) {
                    data.step_list.push(steps);
                    data.step_list.sort((a, b) => {
                        return (a - b);
                    });
                }
                if (time < (data.max_time / 1)) {
                    data.max_time = time;
                    data.time_list.unshift(time);
                    text += text ? '、刷新时长记录' : '刷新时长记录';
                } else if (data.time_list.indexOf(time) === -1) {
                    data.time_list.push(time);
                    data.time_list.sort((a, b) => {
                        return (a - b);
                    });
                }
            }

            fs.writeFile(originPath + 'puzzle.json', JSON.stringify(data), {encoding: 'utf8'}, (err, res2) => {
                if (err) {
                    console.log(err);
                    res.send({
                        code: 1,
                        statusText: 'Write rank failed.'
                    })
                } else {
                    res.send({
                        code: 0,
                        statusText: text ? '恭喜你：' + text : '完成挑战，请再接再厉！'
                    })
                }
            })
        }
    });
});

router.get('/', function (req, res) {
    fs.readFile(originPath + 'puzzle.json', {encoding: 'utf8'}, (err, res1) => {
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