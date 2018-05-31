var host = 'http://mkserver.cnsuning.com/umss/mock/ppms/1/';

var config = {
    url: {
        query_task_by_user: 'http://ppmspre.cnsuning.com/task/user.do',
        query_task_state_by_user: 'http://ppmspre.cnsuning.com/task/state.do',
        query_prize_state_by_user: 'http://ppmspre.cnsuning.com/prize/state.do',
        receive_my_reward: 'http://ppmspre.cnsuning.com/prize/receive.do',
        query_my_reward_yunzuan: 'http://ppmspre.cnsuning.com/prizerecord/yunzuan.do',
        query_my_reward_coupon: 'http://ppmspre.cnsuning.com/prizerecord/coupon.do',
        query_my_reward_starcard: 'http://ppmspre.cnsuning.com/prizerecord/starcard.do'
    }
};

var TIMEOUT = 15 * 1000;

function _http(method, url, data, err, success) {
    var options = {
        type: method,
        data: data,
        error: err,
        success: success,
        timeout: TIMEOUT,
        dataType: 'jsonp',
        jsonp: 'cb'
    };

    url = config.url[url];

    return $.ajax(url, options);
}

var api = {
    get: function(url, data, err, success) {
        return _http('GET', url, data, err, success);
    },
    post: function(url, data, err, success) {
        return _http('POST', url, data, err, success);
    }
};
