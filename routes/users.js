var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.send(userInfo);
});

router.post('/', function (req, res, next) {
    console.dir(req.body);
    res.send(userInfo);
});

router.get('/coupon', function (req, res, next) {
    res.send(coupon);
});

router.get('/yunzuan', function (req, res, next) {
    res.send(yunzuannum);
});

router.get('/starcard', function (req, res, next) {
    res.send(starCard);
});

router.post('/prize', function (req, res, next) {
    console.log(req.body);
    res.send('success');
});

const userInfo = {
    username: 'Jack',
    facePictureURL: 'http://img4.imgtn.bdimg.com/it/u=1373411777,3992091759&fm=27&gp=0.jpg'
};
const coupon = {
    code: 0,
    msg: 'success',
    prize_item: [
        {
            name: '影视VIP',
            memo: '会员影片无广告',
            prize_type: null,
            image1_url: null,
            ext: {}
        },
        {
            name: '苏宁易购易购券',
            memo: '礼券描述',
            prize_type: null,
            image1_url: null,
            ext: {}
        },
        {
            name: '世界杯球星卡',
            memo: '球星卡描述',
            prize_type: null,
            image1_url: null,
            ext: {}
        }
    ]
};
const yunzuannum = {
    code: 0,
    msg: 'success',
    yunzuan_number: 123
};
const starCard = {
    code: 0,
    msg: 'success',
    prize_item: [
        {
            name: '罗纳尔多',
            memo: '这是个足球运动员',
            prize_type: null,
            image1_url: null,
            ext: {}
        }
    ]
};

module.exports = router;