var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send(project);
});

router.get('/task_state', function (req, res, next) {
    res.send(task_state);
});

router.get('/prize_state', function (req, res, next) {
    res.send(prize_state);
});

const project = {
    code: 0,
    msg: 'success',
    project: [
        {
            id: '111',
            name: '每日任务',
            memo: '每日任务',
            image_url: null,
            task: [
                {
                    id: '111aaa',
                    name: '签到送云钻',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '111aaa',
                    name: '签到送云钻',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '111aaa',
                    name: '签到送云钻',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '111aaa',
                    name: '签到送云钻',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '111aaa',
                    name: '签到送云钻',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '111aaa',
                    name: '签到送云钻',
                    memo: '2云钻',
                    image_url: null
                }
            ]
        },
        {
            id: '222',
            name: '凉生',
            memo: '凉生',
            image_url: null,
            task: [
                {
                    id: '222aaa',
                    name: '第一集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '222bbb',
                    name: '第二集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '333ccc',
                    name: '第三集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '222bbb',
                    name: '第二集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '333ccc',
                    name: '第三集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '222bbb',
                    name: '第二集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '333ccc',
                    name: '第三集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '222bbb',
                    name: '第二集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '333ccc',
                    name: '第三集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '222bbb',
                    name: '第二集',
                    memo: '2云钻',
                    image_url: null
                },
                {
                    id: '333ccc',
                    name: '第三集',
                    memo: '2云钻',
                    image_url: null
                }
            ]
        }
    ]
};

const task_state = {
    code: 0,
    msg: 'success',
    state: [
        {
            task_id: '111aaa',
            state: 0
        },
        {
            task_id: '222aaa',
            state: 1
        },
        {
            task_id: '222bbb',
            state: 0
        },
        {
            task_id: '222ccc',
            state: 1
        }
    ]
};

const prize_state = {
    code: 0,
    msg: 'success',
    state: [
        {
            task_id: '111aaa',
            state: 0
        },
        {
            task_id: '222aaa',
            state: 1
        },
        {
            task_id: '222bbb',
            state: 0
        },
        {
            task_id: '222ccc',
            state: 1
        }
    ]
};

module.exports = router;
