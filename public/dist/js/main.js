function new_task_center() {
    document.title = '任务中心-PP视频';

    var devHost = 'http://ppmspre.cnsuning.com';

    var host = 'http://ppms.suning.com';

//host = devHost;

    var config = {
        url: {
            query_task_by_user: host + '/task/user.htm',
            query_task_state_by_user: host + '/task/state.htm',
            query_prize_state_by_user: host + '/prize/state.htm',
            receive_my_reward: host + '/prize/receive.htm',
            query_my_reward_yunzuan: host + '/prizerecord/yunzuan.htm',
            query_my_reward_coupon: host + '/prizerecord/coupon.htm',
            query_my_reward_starcard: host + '/prizerecord/starcard.htm',
            query_my_reward_realprize: host + '/prizerecord/realprize.htm',
            execute_task_by_task: host + '/task/execute.htm'
        }
    };

    function getUserAgent() {
        var sUserAgent = navigator.platform;
        var channel;
        if(sUserAgent == "Win32" || sUserAgent == "Windows"){
            channel = 208000103005;
        }else if(sUserAgent == "Mac68K" || sUserAgent == "MacPPC" || sUserAgent == "Macintosh" || sUserAgent == "MacIntel"){
            channel = 208000101005;
        }else if(sUserAgent == "X11"){
            channel = 208000104003;
        }else if(String(sUserAgent).indexOf("Linux") > -1){
            channel = 208000102003;
        }else{
            channel = 208000103005;
        }
        return channel;
    }

    var TIMEOUT = 1.5 * 1000;

    function _http(method, url, data, err, success) {
        var options = {
            type: method,
            error: err,
            success: success,
            timeout: TIMEOUT,
            dataType: 'jsonp',
            jsonp: 'cb',
            jsonpCallback: url,
            cache: true
        };

        url = url.replace(/\d+/g, '');

        url = config.url[url];

        url += '?' + data;

        return $.ajax(url, options);
    }

    var api = {
        get: function (url, data, err, success) {
            return _http('GET', url, data, err, success);
        },
        post: function (url, data, err, success) {
            return _http('POST', url, data, err, success);
        }
    };

    jQuery.support.cors = true;

    $('.right-content').ready(function () {
        init_userInfo();
        //init_data();
    });
    var userInfo = {
        username: '',
        token: '',
        clientType: 3,
        clientVersion: ''
    };

    /*userInfo = {
        username: 'viponline12',
        token: 'bmHjij7_3qjM-OHWZIvuS8Sonrj9hSOSmY1xIJi1yFx1kkfSLzMUtfwx68YSX-Zh4mwSYjCY84RT%0D%0As4Mc9In-Nbuk-R8rDqcKQYoxbo7zAutHYHEJuT--CuqPEPHWMzL8bgIof2l9u-Dnfq_cfujfmdbJ%0D%0AisHD3SW1ovr79Y59XjE',
        clientType: 3
    };*/

    var project = [];

    var isWEB = true;

//初始化完成任务按钮事件
    function init_event() {
        //任务规则
        $('.task_rule').click(function () {
            $('.dialog').show();
            $('.mask').show();
            $('.rule_content').show();
            $('.rule_prize_dialog').show().children('.dialog_title').text('任务规则').siblings('.dialog_content').prop('scrollTop', '0');
        });
        //我的奖励
        $('.rule_prize .prize').click(function () {
            init_prize();
            $('.dialog').show();
            $('.mask').show();
            $('.prize_list').show();
            $('.rule_prize_dialog').show().children('.dialog_title').text('我的奖励').siblings('.dialog_content').prop('scrollTop', '0');
        });
        //关闭弹框
        $('.close_btn').click(function () {

            $('.dialog').hide();
            $('.mask').hide();

            $('.rule_prize_dialog').hide();
            $('.prize_list').hide();
            $('.rule_content').hide();

            $('.btn_result_dialog').hide();
            $('.common_dialog').hide();
            $('.common_dialog img').css('display', 'inline-block');
            $('.common_dialog .dialog_content').css('height', '48px').css('padding-top', '0').html('').hide();
            $('.common_dialog .common_dialog_icon').css('height', '96px').css('margin', '0 auto 10px');
            $('.common_dialog .common_dialog_icon2').hide();

            $('.upgrade_count').hide();
        });
        //升级一帐通任务不跳转页面
        $('.upgrade_account').click(function () {
            var update = {
                token: userInfo.token,
                ip: userInfo.ip,
                channel: getUserAgent(),
                username: userInfo.username,
                sceneFlag: '1',
                extBusRef: userInfo.ppId,
                deviceId: userInfo.deviceId
            };
            if (!$(this).hasClass('disabled')) {
                if (isWEB) {
                    window.pptvUpgradePopup(update, function () {
                        window.location.reload();
                    });
                } else {
                    var uiMainWindow = external.GetObject('@pplive.com/ui/mainwindow;1');
                    var updataStr = "";
                    $.each(update, function(key, value){
                        updataStr += (key + "=" + value + "&");
                    });
                    updataStr.substring(0, updataStr.length);
                    if(uiMainWindow){
                        uiMainWindow.showModalDialog('AfterLoginUpgrade.xml', updataStr);
                    }
                }
            }
            return false;
        });
        $('.upgrade_count').click(function () {
            var update = {
                token: userInfo.token,
                ip: userInfo.ip,
                channel: getUserAgent(),
                username: userInfo.username,
                sceneFlag: '1',
                extBusRef: userInfo.ppId,
                deviceId: userInfo.deviceId
            };
            if (!$(this).hasClass('disabled')) {
                if (isWEB) {
                    window.pptvUpgradePopup(update, function () {
                        window.location.reload();
                    });
                } else {
                    var uiMainWindow = external.GetObject('@pplive.com/ui/mainwindow;1');
                    var updataStr = "";
                    $.each(update, function(key, value){
                        updataStr += (key + "=" + value + "&");
                    });
                    updataStr.substring(0, updataStr.length);
                    if(uiMainWindow){
                        uiMainWindow.showModalDialog('AfterLoginUpgrade.xml', updataStr);
                    }
                }
            }
            return false;
        });
        //领取奖励按钮事件
        $('.task_category .task_btn').click(function () {
            var $this = $(this);
            var task_id = $this.attr('data-id') / 1;
            var task = {};
            for (var i = 0; i < project.length; i++) {
                var cur_project = project[i];
                for (var j = 0; j < cur_project.task.length; j++) {
                    var cur_task = cur_project.task[j];
                    if (task_id === cur_task.id) {
                        task = cur_task;
                        break;
                    }
                }
            }
            //console.log(task);
            if (task.state !== 2) return;
            api.get(
                'receive_my_reward',
                'task_id=' + task_id + '&username=' + userInfo.username + '&token=' + userInfo.token,
                function (err) {
                    console.error(err);
                    $('.dialog').show();
                    $('.mask').show();
                    $('.btn_result_dialog').show();
                    $('.common_dialog .dialog_content').show();
                    $('.common_dialog').show().children('.common_dialog_icon').attr('src', 'http://sr3.pplive.cn/cms/10/60/ecc2abc7528793c09d5ad7aa2779c5c2.png').css('height', '70px').css('margin', '10px auto 26px');
                    $('.common_dialog .dialog_title').html('糟糕，没有拿到奖品！<br><br><span style="font-size: 14px; color: #7a7a7a;">糟糕，没有领到奖品！还有更多任务可以领奖哦~~</span>');
                },
                function (res) {
                    if (/\d+/.exec(res.code)[0] / 1) {
                        $('.dialog').show();
                        $('.mask').show();
                        $('.btn_result_dialog').show();
                        $('.common_dialog .dialog_content').show();
                        $('.common_dialog').show().children('.common_dialog_icon').attr('src', 'http://sr3.pplive.cn/cms/10/60/ecc2abc7528793c09d5ad7aa2779c5c2.png').css('height', '70px').css('margin', '10px auto 26px');
                        $('.common_dialog .dialog_title').html('糟糕，没有拿到奖品！<br><br><span style="font-size: 14px; color: #7a7a7a;">糟糕，没有领到奖品！还有更多任务可以领奖哦~~</span>');
                        return console.warn(res.msg);
                    }
                    if (res.task_prize_state === 103) {
                        //如果服务器返回需要进行一帐通升级则进行二次校验
                        $.ajax(
                            'https://api.passport.pptv.com/v3/query/accountinfo.do?username=' + userInfo.username + '&token=' + userInfo.token + '&format=jsonp',
                            {
                                type: 'GET',
                                dataType: 'jsonp',
                                jsonp: 'cb',
                                jsonpCallback: 'passport',
                                cache: true,
                                success: function (res1) {
                                    if (res1.result && res1.result.snId) {
                                        alert('系统异常，请稍后再试');
                                    } else {
                                        $('.upgrade_count').css('display', 'inline-block');
                                        $('.dialog').show();
                                        $('.mask').show();
                                        $('.btn_result_dialog').show();
                                        $('.common_dialog .dialog_content').show();
                                        $('.common_dialog').show().children('.common_dialog_icon').attr('src', 'http://sr3.pplive.cn/cms/10/60/ecc2abc7528793c09d5ad7aa2779c5c2.png').css('height', '70px').css('margin', '10px auto 26px');
                                        $('.common_dialog .dialog_title').html('糟糕，没有拿到奖品！<br><br><span style="font-size: 14px; color: #7a7a7a;">看凉生，抽大奖，需要先升级一帐通呦主人，赶紧升级吧</span>');
                                    }
                                },
                                error: function (err) {
                                    console.error(err);
                                    alert('系统异常，请稍后再试');
                                }
                            });
                    } else if (res.task_prize_state === 102 && res.prize.length) {
                        $('.dialog').show();
                        $('.mask').show();
                        $('.btn_result_dialog').show();
                        $('.common_dialog').show();
                        //如果奖品不是一个，则展示最多两张图
                        $('.common_dialog .common_dialog_icon').css('height', '96px').attr('src', res.prize[0].image1_url);
                        for (var i = 0; i < res.prize.length; i++) {
                            if (i !== 0) {
                                $('.common_dialog .common_dialog_icon2').show().attr('src', res.prize[i].image1_url);
                                break;
                            }
                        }
                        $('.common_dialog .dialog_title').html('恭喜你').siblings('.dialog_content').show().text('已获得: ' + prize_desc(res.prize)).attr('title', prize_desc(res.prize));
                        if (task.completedTimes < task.maxCompletionTimes) {
                            $this.removeClass('ls_task_btn');
                            $this.removeClass('task_complete_btn');
                            $this.text(task.button_label1);
                            task.state = 1;
                        } else {
                            $this.removeClass('ls_task_btn');
                            $this.removeClass('task_complete_btn');
                            $this.removeAttr('tj_id');
                            $this.addClass('disabled');
                            $this.text(task.button_label3);
                            task.state = 3;
                        }
                        getYunZuan();
                    } else {
                        $('.dialog').show();
                        $('.mask').show();
                        $('.btn_result_dialog').show();
                        $('.common_dialog .dialog_content').show();
                        $('.common_dialog').show().children('.common_dialog_icon').attr('src', 'http://sr3.pplive.cn/cms/10/60/ecc2abc7528793c09d5ad7aa2779c5c2.png').css('height', '70px').css('margin', '10px auto 26px');
                        $('.common_dialog .dialog_title').html('糟糕，没有拿到奖品！<br><br><span style="font-size: 14px; color: #7a7a7a;">糟糕，没有领到奖品！还有更多任务可以领奖哦~~</span>');
                        if (task.completedTimes < task.maxCompletionTimes) {
                            $this.removeClass('ls_task_btn');
                            $this.removeClass('task_complete_btn');
                            $this.text(task.button_label1);
                            task.state = 1;
                        } else {
                            $this.removeClass('ls_task_btn');
                            $this.removeClass('task_complete_btn');
                            $this.removeAttr('tj_id');
                            $this.addClass('disabled');
                            $this.text(task.button_label3);
                            task.state = 3;
                        }
                    }
                }
            );
        });

        //切换页面
        function changePage($this) {
            var btn_list_width = parseInt($this.css('width'));
            var totalPageNum = Math.ceil($this.children('li').length * 109 / btn_list_width);
            var curPage = 1;
            var prev = function () {
                if (curPage <= 1) {
                    $this.parents('.task_btn_list').children('.left_btn').addClass('left_btn_offset');
                    return curPage = 1;
                }
                var targetValue = btn_list_width * (curPage-- - 2) * -1;
                $this.animate({
                    left: targetValue,
                }, 500, 'linear');
                $this.parents('.task_btn_list').children('.right_btn').removeClass('right_btn_offset');
                check_page();
            };
            var next = function () {
                if (curPage >= totalPageNum) {
                    $this.parents('.task_btn_list').children('.right_btn').addClass('right_btn_offset');
                    return curPage = totalPageNum;
                }
                var targetValue = btn_list_width * curPage++ * -1;
                $this.animate({
                    left: targetValue,
                }, 500, 'linear');
                $this.parents('.task_btn_list').children('.left_btn').removeClass('left_btn_offset');
                check_page();
            };

            function check_page() {
                if (curPage === 1) {
                    $this.parents('.task_btn_list').children('.right_btn').removeClass('right_btn_offset');
                    $this.parents('.task_btn_list').children('.left_btn').addClass('left_btn_offset');
                } else if (curPage === totalPageNum) {
                    $this.parents('.task_btn_list').children('.right_btn').addClass('right_btn_offset');
                    $this.parents('.task_btn_list').children('.left_btn').removeClass('left_btn_offset');
                }
            }

            return {prev: prev, next: next}
        }

        $('.btn_list').each(function () {
            var switchPage = changePage($(this));
            $(this).parents('.task_btn_list').children('.right_btn').click(switchPage.next);
            $(this).parents('.task_btn_list').children('.left_btn').click(switchPage.prev);
        })
    }

//查询云钻数量
    function getYunZuan() {
        api.get('query_my_reward_yunzuan', 'username=' + userInfo.username + '&token=' + userInfo.token, function (err) {
            console.error(err);
            $('.diamond_content_span1').text('-');
        }, function (res) {
            if (/\d+/.exec(res.code)[0] / 1) {
                $('.diamond_content_span1').text('-');
                return console.warn(res.msg);
            } else {
                $('.diamond_content_span1').text(res.yunzuan_number);
            }
        });
    }

//是否是一帐通
    function isUpgrade() {
        $.ajax(
            'https://api.passport.pptv.com/isUpgrade?username=' + userInfo.username + '&token=' + userInfo.token + '&format=jsonp&scene=REG_PPTV_YZ&channel=' + getUserAgent(),
            {
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (res) {
                    res.errorCode = res.errorCode / 1;
                    res.status = res.status / 1;
                    if ((res.errorCode === 0 && res.status === 0) || res.errorCode === 7) {
                        userInfo.ip = res.ip;
                        userInfo.ppId = res.ppId;
                        userInfo.deviceId = res.deviceId;
                        $('.diamond_content_span1').text(0);
                    } else {
                        getYunZuan();
                    }
                },
                error: function (err) {
                    $('.diamond_content_span1').text('-');
                    getYunZuan();
                }
            });
    }

//初始化任务列表
    function init_data() {
        isUpgrade();
        $('.task_center').css('display', 'block');
        //任务列表处理
        var task_state = false;
        var prize_state = false;
        var task_total_num = 0;
        var task_state_list = {};
        var prize_state_list = {};
        api.get('query_task_by_user', 'username=' + userInfo.username,
            function (err) {
                console.log(err);
            }, function (res) {
                if (/\d+/.exec(res.code)[0] / 1) {
                    return console.warn(res.msg);
                }
                var task_ids = [];
                for (var i = 0; i < res.project.length; i++) {
                    var cur_project = res.project[i];
                    if (cur_project.task.length === 1 && cur_project.task[0].id === 2) {
                        continue;
                    } else {
                        //过滤分享任务
                        for (var n = 0; n < cur_project.task.length; n++) {
                            if (cur_project.task[n].id === 1) {
                                cur_project.task.splice(n, 1);
                            }
                        }
                        project.push(cur_project);
                    }
                    for (var j = 0; j < cur_project.task.length; j++) {
                        var cur_task = cur_project.task[j];
                        //过滤分享任务
                        if (cur_task.id !== 1) {
                            task_ids.push(cur_task.id);
                        }
                    }
                }
                task_total_num = task_ids.length;
                //查询任务状态
                api.get('query_task_state_by_user', 'username=' + userInfo.username + '&token=' + userInfo.token + '&task_id=' + task_ids.join(','), function (err) {
                    console.error(err);
                }, function (res1) {
                    if (/\d+/.exec(res1.code)[0] / 1) {
                        return console.warn(res1.msg);
                    }
                    task_state = true;
                    if (res1.state) {
                        for (var n = 0; n < res1.state.length; n++) {
                            task_state_list[res1.state[n].task_id] = {
                                state: res1.state[n].task_state,
                                completedTimes: res1.state[n].completedTimes,
                                maxCompletionTimes: res1.state[n].maxCompletionTimes
                            };
                        }
                    }
                    getProjectDone();
                });
                //查询奖品状态
                api.get('query_prize_state_by_user', 'username=' + userInfo.username + '&token=' + userInfo.token + '&task_id=' + task_ids.join(','), function (err) {
                    console.log(err);
                }, function (res1) {
                    if (/\d+/.exec(res1.code)[0] / 1) {
                        return console.warn(res1.msg);
                    }
                    prize_state = true;
                    if (res1.data) {
                        for (var n = 0; n < res1.data.length; n++) {
                            prize_state_list[res1.data[n].task_id] = res1.data[n].state;
                        }
                    }
                    getProjectDone();
                });
            });

        function getProjectDone() {
            if (!task_state || !prize_state) return;
            var sign_task = 0, reg_task = 0, account_task = 0, fiveVideo_task = 0;
            var task_total = 0;
            for (var i = 0; i < project.length; i++) {
                for (var j = 0; j < project[i].task.length; j++) {
                    project[i].task[j].completedTimes = task_state_list[project[i].task[j].id].completedTimes;
                    project[i].task[j].maxCompletionTimes = task_state_list[project[i].task[j].id].maxCompletionTimes;
                    if (prize_state_list[project[i].task[j].id] >= 3 && !task_state_list[project[i].task[j].id].state) {
                        project[i].task[j].state = 1;
                        task_total++;
                    } else {
                        project[i].task[j].state = prize_state_list[project[i].task[j].id] >= 3 ? 3 : prize_state_list[project[i].task[j].id];
                        //如果任务是未完成状态则过滤一期任务
                        if (prize_state_list[project[i].task[j].id] === 1) {
                            //过滤签到任务
                            if (project[i].task[j].id === 3) {
                                sign_task = project[i].task[j];
                                $.ajax('http://api.usergrowth.pptv.com/springmvc/isTodayPcard?username=' + userInfo.username + '&token=' + userInfo.token + '&format=jsonp', {
                                    type: 'GET',
                                    dataType: 'jsonp',
                                    jsonp: 'cb',
                                    jsonpCallback: 'usergrowth',
                                    cache: true,
                                    timeout: TIMEOUT,
                                    success: function (res) {
                                        res.errorCode = res.errorCode / 1;
                                        if (!res.errorCode) {
                                            api.get('execute_task_by_task' + sign_task.id, 'username=' + userInfo.username + '&token=' + userInfo.token + '&task_id=3', function (err) {
                                                console.error(err);
                                                //任务状态为4则隐藏按钮
                                                sign_task.state = 4;
                                                task_total++;
                                                init_task_html();
                                            }, function (res1) {
                                                sign_task.state = res1.task_execute_record_id === -1 ? 4 : 3;
                                                task_total++;
                                                init_task_html();
                                            });
                                        } else if (res.errorCode === 1) {
                                            sign_task.state = 1;
                                            task_total++;
                                            init_task_html();
                                        } else {
                                            sign_task.state = 4;
                                            task_total++;
                                            init_task_html();
                                        }
                                    },
                                    error: function (err) {
                                        console.error(err);
                                        sign_task.state = 4;
                                        task_total++;
                                        init_task_html();
                                    }
                                });
                                continue;
                            }
                            //过滤注册任务
                            if (project[i].task[j].id === 7) {
                                reg_task = project[i].task[j];
                                $.ajax('http://ac.vip.pptv.com/validatenewPersonwelfare?actid=xinrenlibao_act&eventid=xinrenlibao_evt&username=' + userInfo.username + '&token=' + userInfo.token + '&format=jsonp', {
                                    type: 'GET',
                                    dataType: 'jsonp',
                                    jsonp: 'cb',
                                    jsonpCallback: 'person_welfare',
                                    cache: true,
                                    timeout: TIMEOUT,
                                    success: function (res) {
                                        res.errorCode = res.errorCode / 1;
                                        if (res.errorCode !== 1) {
                                            api.get('execute_task_by_task' + reg_task.id, 'username=' + userInfo.username + '&token=' + userInfo.token + '&task_id=7', function (err) {
                                                console.error(err);
                                                reg_task.state = 4;
                                                task_total++;
                                                init_task_html();
                                            }, function (res1) {
                                                if (res1.task_execute_record_id === -1) {
                                                    reg_task.state = 3;
                                                } else {
                                                    reg_task.state = res.errorCode ? 3 : 2;
                                                }
                                                task_total++;
                                                init_task_html();
                                            });
                                        } else {
                                            reg_task.state = 4;
                                            task_total++;
                                            init_task_html();
                                        }
                                    },
                                    error: function (err) {
                                        console.error(err);
                                        reg_task.state = 4;
                                        task_total++;
                                        init_task_html();
                                    }
                                });
                                continue;
                            }
                            //过滤升级一帐通任务
                            if (project[i].task[j].id === 4) {
                                account_task = project[i].task[j];
                                $.ajax('https://api.passport.pptv.com/v3/query/accountinfo.do?username=' + userInfo.username + '&token=' + userInfo.token + '&format=jsonp', {
                                    type: 'GET',
                                    dataType: 'jsonp',
                                    jsonp: 'cb',
                                    jsonpCallback: 'account',
                                    cache: true,
                                    timeout: TIMEOUT,
                                    success: function (res) {
                                        res.errorCode = res.errorCode / 1;
                                        if (!res.errorCode && res.result && res.result.snId) {
                                            api.get('execute_task_by_task' + account_task.id, 'username=' + userInfo.username + '&token=' + userInfo.token + '&channel=' + getUserAgent()  + '&task_id=4', function (err) {
                                                console.error(err);
                                                account_task.state = 4;
                                                task_total++;
                                                init_task_html();
                                            }, function (res1) {
                                                account_task.state = res1.task_execute_record_id === -1 ? 4 : 3;
                                                task_total++;
                                                init_task_html();
                                            });
                                        } else if (!res.errorCode) {
                                            account_task.state = 1;
                                            task_total++;
                                            init_task_html();
                                        } else {
                                            account_task.state = 4;
                                            task_total++;
                                            init_task_html();
                                        }
                                    },
                                    error: function (err) {
                                        console.error(err);
                                        account_task.state = 4;
                                        task_total++;
                                        init_task_html();
                                    }
                                });
                                continue;
                            }
                            //五个视频任务
                            if (project[i].task[j].id === 2) {
                                fiveVideo_task = project[i].task[j];
                                $.ajax('http://api.usergrowth.pptv.com/springmvc/queryVideoStatus?username=' + userInfo.username + '&token=' + userInfo.token + '&format=jsonp', {
                                    type: 'GET',
                                    dataType: 'jsonp',
                                    jsonp: 'cb',
                                    jsonpCallback: 'five',
                                    cache: true,
                                    timeout: TIMEOUT,
                                    success: function (res) {
                                        res.errorCode = res.errorCode / 1;
                                        if (!res.errorCode && res.status === 1) {
                                            api.get('execute_task_by_task', 'username=' + userInfo.username + '&token=' + userInfo.token + '&task_id=2', function (err) {
                                                console.error(err);
                                                fiveVideo_task.state = 4;
                                                task_total++;
                                                init_task_html();
                                            }, function (res1) {
                                                fiveVideo_task.state = res1.task_execute_record_id === -1 ? 4 : 3;
                                                task_total++;
                                                init_task_html();
                                            });
                                        } else if (!res.errorCode && !res.status) {
                                            fiveVideo_task.state = 1;
                                            task_total++;
                                            init_task_html();
                                        } else {
                                            fiveVideo_task.state = 4;
                                            task_total++;
                                            init_task_html();
                                        }
                                    },
                                    error: function (err) {
                                        console.error(err);
                                        fiveVideo_task.state = 4;
                                        task_total++;
                                        init_task_html();
                                    }
                                });
                                continue;
                            }
                            task_total++;
                            init_task_html();
                        } else if (prize_state_list[project[i].task[j].id] === 2) {
                            if (project[i].task[j].id === 2 || project[i].task[j].id === 3 || project[i].task[j].id === 4) {
                                project[i].task[j].state = 3;
                            }
                            task_total++;
                            init_task_html();
                        }else {
                            task_total++;
                            init_task_html();
                        }
                    }
                }
            }
            //console.log(project);
            function init_task_html() {
                if (task_total_num !== task_total) {
                    return;
                }
                var html = '';
                for (var i = 0; i < project.length; i++) {
                    var current_project = project[i];
                    if (!current_project.collection) {
                        html += '<p class="task_title"><span>';
                        html += current_project.name;
                        html += '</span>';
                        /*if (current_project.id === 1) { //世界杯项目
                            html += '<a class="world_cup_detail_btn" href="http://sports.pptv.com">活动详情</a>'
                        }*/
                        html += '</p><div class="task_list">';
                        for (var j = 0; j < current_project.task.length; j++) {
                            var current_task = current_project.task[j];
                            html += '<div class="task_item"';
                            html += j % 2 ? ' style="text-align:right"><img src="' : '><img src="'; //任务列表右侧部分
                            html += current_task.image1_url;
                            html += '" alt="sign"><div class="task_desc"';
                            html += j % 2 ? ' style="text-align:left;"><span class="task_desc_span1"' : '><span class="task_desc_span1"'; //任务列表右侧部分
                            html += ' title="' + current_task.name + '">' + current_task.name;
                            html += '</span><br><span class="task_desc_span2"';
                            html += ' title="' + current_task.memo + '">' + current_task.memo;
                            html += '</span></div>';
                            if (current_task.state === 4) {
                                html += '<i class="emptyBtn"></i>';
                            }
                            html += '<a class="task_btn ';
                            html += current_task.state >= 3 ? 'disabled ' : ' ';
                            if (current_task.id === 4) {
                                html += 'upgrade_account ';
                            }
                            //任务状态为2的时候领奖，任务状态为4时初始化失败隐藏
                            if (current_task.state === 2) {
                                html += 'task_complete_btn';
                            } else if (current_task.state === 4) {
                                html += 'task_init_error';
                            }
                            html += '" data-id="';
                            html += current_task.id + '"';
                            html += (current_task.state === 1 && current_task['go_url' + userInfo.clientType]) ? ' href="' + current_task['go_url' + userInfo.clientType] + (isWEB ? '" target="_blank" tj_id="' : '" target="_self" tj_id="') + cover_point(current_task) + '"' : current_task.id === 7 ? ' tj_id="' + cover_point(current_task) + '"' : ''; //任务未完成，去完成
                            html += '>';
                            html += current_task.state >= 3 ? current_task.button_label3 : current_task.state === 2 ? current_task.button_label2 : current_task.button_label1; //根据状态显示不同的按钮文字
                            html += '</a>';
                            html += '</div></li>';
                        }
                        html += '</div>';
                    } else {
                        html += '<p class="task_title"><span>';
                        html += current_project.name;
                        html += '</span></p><div class="task_list"><div class="task_item"><img src="';
                        html += current_project.image1_url;
                        html += '" alt="sign"><div class="task_desc"><span class="task_desc_span1">';
                        html += current_project.name;
                        html += '</span><br><span class="task_desc_span2">';
                        html += current_project.memo;
                        html += '</span></div></div></div><div class="task_btn_list"><span class="left_btn left_btn_offset"></span><span class="right_btn"></span>';
                        html += '<div class="btn_list_box"><ul class="btn_list">';
                        for (var j = 0; j < current_project.task.length; j++) {
                            var current_task = current_project.task[j];
                            html += '<li><p>';
                            html += '第' + /\d+/.exec(current_task.name) + '集';
                            html += '</p><a data-id="';
                            html += current_task.id + '" ';
                            if (current_task.state === 1) {
                                html += 'href="' + current_task['go_url' + userInfo.clientType] + (isWEB ? '" target="_blank" ' : '" target="_self" ');
                            }
                            html += 'class="task_btn ';
                            html += current_task.state === 3 ? 'disabled ls_disabled">' : 'ls_task_btn" tj_id="' + cover_point({id: current_project.id === 6 ? 11 : -1, ls: /\d+/.exec(current_task.name)}) + '">'; //任务状态是否可领奖
                            html += current_task.state >= 3 ? current_task.button_label3 : current_task.state === 2 ? current_task.button_label2 : current_task.button_label1; //根据状态显示不同的按钮文字
                            html += '</a></li>';
                        }
                        html += '</ul></div></div>';
                    }
                }
                $('.task_category').html(html).ready(function () {
                    //判断是否隐藏左右按钮
                    $('.btn_list').each(function () {
                        if (($(this).children('li').length * 109) > $(this).width()) {
                            $(this).parents('.task_btn_list').children('.left_btn').show();
                            $(this).parents('.task_btn_list').children('.right_btn').show();
                        }
                    });
                    init_event();
                });
                html = null;
            }
        }

        //初始化奖品列表
        init_prize();
    }

//初始化奖品列表
    function init_prize() {
        var prizes = [];
        //优惠券
        api.get('query_my_reward_coupon', 'username=' + userInfo.username + '&token=' + userInfo.token, function (err) {
            console.log(err);
        }, function (res) {
            if (/\d+/.exec(res.code)[0] / 1) {
                return console.log(res.msg);
            }
            prizes = res.prize_item ? prizes.concat(res.prize_item) : prizes;
            getPrizeDone();
        });
        //球星卡
        api.get('query_my_reward_starcard', 'username=' + userInfo.username + '&token=' + userInfo.token, function (err) {
            console.log(err);
        }, function (res) {
            if (/\d+/.exec(res.code)[0] / 1) {
                return console.log(res.msg);
            }
            prizes = res.prize_item ? prizes.concat(res.prize_item) : prizes;
            getPrizeDone();
        });
        //实物
        api.get('query_my_reward_realprize', 'username=' + userInfo.username + '&token=' + userInfo.token, function (err) {
            console.log(err);
        }, function (res) {
            if (/\d+/.exec(res.code)[0] / 1) {
                return console.log(res.msg);
            }
            prizes = res.prize_item ? prizes.concat(res.prize_item) : prizes;
            getPrizeDone();
        });

        function getPrizeDone() {
            var len = prizes.length;
            for (var n = 0; n < len - 1; n++) {
                for (var m = 1 + n; m < len; m++) {
                    var p1 = prizes[n].award_time.replace(/[-\s:]/g, '') / 1;
                    var p2 = prizes[m].award_time.replace(/[-\s:]/g, '') / 1;
                    if (p1 < p2) {
                        var x = prizes[n];
                        prizes[n] = prizes[m];
                        prizes[m] = x;
                    }
                }
            }
            var html = '';
            for (var i = 0; i < len; i++) {
                var cur = prizes[i];
                html += '<div class="prize_item"><p class="prize_date">';
                html += cur.award_time;
                html += '</p><div class="prize_detail"><img src="';
                //球星卡图片展示区分
                html += cur.prize_type === 1 ? (cur.ext ? cur.ext.image_url : cur.image1_url) : cur.image1_url;
                html += '" alt=""><div class="prize_desc"><p class="prize_desc_p1"';
                html += ' title="' + cur.name + '">' + cur.name;
                html += '</p><p class="prize_desc_p2"><span';
                html += ' title="' + (cur.prize_type === 1 ? (cur.ext ? cur.ext.name : cur.memo) : cur.memo) + '">';
                html += (cur.prize_type === 1 ? (cur.ext ? cur.ext.name : cur.memo) : cur.memo) + '</span>';
                html += '<br/>';
                if (cur.ext && cur.ext.start_time) { //是否展示有效期
                    html += '<span title="';
                    html += cur.ext.start_time.replace(/-/g, '.').split(' ')[0] + ' - ' + cur.ext.end_time.replace(/-/g, '.').split(' ')[0] + '">';
                    html += cur.ext.start_time.replace(/-/g, '.').split(' ')[0] + ' - ' + cur.ext.end_time.replace(/-/g, '.').split(' ')[0] + '</span>';
                }
                html += '</p></div><a ';
                if ((cur.prize_type === 4) || (cur.prize_type === 5)) { //实物奖品或卡密奖品
                    html += 'data-prizeindex=';
                    html += i;
                    html += ' class="showRemind"" tj_id="';
                    html += cover_point(cur.prize_type + 100);
                    html += '">看详情</a></div></div>';
                } else if (cur.prize_type === 3) { //vip会员奖品
                    html += 'href="http://vip.pptv.com" tj_id="';
                    html += cover_point(cur.prize_type + 100);
                    html += '">去使用</a></div></div>';
                } else if (cur.prize_type === 1) { //球星卡奖品
                    html += 'href="http://sports.pptv.com" tj_id="';
                    html += cover_point(cur.prize_type + 100);
                    html += '" style="display:none;">去使用</a></div></div>';
                } else if (cur.prize_type === 7) { //二维码奖品
                    html += 'href="';
                    html += cur.ext ? cur.ext.qrcode_url : '';
                    html += '" tj_id="';
                    html += cover_point(cur.prize_type + 100);
                    html += '">去使用</a></div></div>';
                } else {
                    html += 'href="';
                    html += cur.ext ? cur.ext.redirect_url : '';
                    html += '" tj_id="';
                    html += cover_point(cur.prize_type + 100);
                    html += '">去使用</a></div></div>';
                }
            }
            $('.dialog .rule_prize_dialog .dialog_content .prize_list').html(html);

            //温馨提示
            $('.showRemind').click(function () {
                $('.prize_list').hide();
                $('.rule_content').hide();
                $('.rule_prize_dialog').hide();
                $('.btn_result_dialog').show();
                $('.common_dialog').show();
                $('.common_dialog img').css('display', 'none');
                if (prizes[$(this).attr('data-prizeindex')].prize_type === 4) {
                    $('.common_dialog .dialog_title').text('温馨提示').siblings('.dialog_content').show().css('padding-top', '40px').html('<span>客服会尽快通过账户内手机号码与您联系，请确保手机畅通。<br><br>您可通过<span style="color: #009bff">"个人中心 > 头像 > 手机"</span>核实手机号。</span>').css('height', '150px');
                } else {
                    $('.common_dialog .dialog_title').text('温馨提示').siblings('.dialog_content').show().css('padding-top', '40px').html(prizes[$(this).attr('data-prizeindex')].ext.code ? ('<span>卡号：' + prizes[$(this).attr('data-prizeindex')].ext.code + '<br><br>') : '' + '密码：' + prizes[$(this).attr('data-prizeindex')].ext.passwd + '</span>').css('height', '150px');
                }
            });
        }
    }

//初始化用户信息
    function init_userInfo() {
        //判断是否是客户端
        if (external && external.GetObject) {
            isWEB = false;
            init_cover_point();
            //获取用户信息
            var passport = external.GetObject('@pplive.com/passport;1');
            userInfo.username = passport.userName;
            userInfo.token = passport.Token;
            //获取客户端版本
            var ppframe = external.GetObject('@pplive.com/PPFrame;1');
            userInfo.clientVersion = ppframe.PPTVVersion.replace(/(\s|\.)+/g, '').slice(0, 3) / 1; //4.2.3
            if (userInfo.clientVersion < 424) {
                window.open('http://i.pptv.com/icenter/mission/pc/', '_self');
                return;
            }
            init_data();
        } else {
            init_cover_point();
            userInfo.clientType = 4;
            //判断用户是否登录
            if (ppLogin && ppLogin.isLogined()) {
                var cookie_list = document.cookie.split('; ');
                for (var i = 0; i < cookie_list.length; i++) {
                    //获取用户username
                    if (/PPName/.test(cookie_list[i])) {
                        var username_obj = cookie_list[i].split('=');
                        var username_ary = username_obj[1].split('$');
                        userInfo.username = username_ary[0];
                        continue;
                    }
                    //获取token
                    if (/ppToken/.test(cookie_list[i])) {
                        var ppTokenAry = cookie_list[i].split('=');
                        userInfo.token = ppTokenAry[1];
                        continue;
                    }
                    if (userInfo.username && userInfo.token) break;
                }
                init_data();
            } else {
                console.log('NOT LOGIN');
                ppLogin.init();
            }
        }
    }

//埋点
    function cover_point(task) {
        var point = '';
        if (task.id) {
            switch (task.id) {
                case 2:
                    point = isWEB ? 'web_tasklist_kanshipin' : 'clt_tasklist_kanshipin';
                    break;
                case 3:
                    point = isWEB ? 'web_tasklist_qiandao' : 'clt_tasklist_qiandao';
                    break;
                case 11:
                    point = isWEB ? 'web_tasklist_liangsheng' + task.ls : 'clt_tasklist_liangsheng' + task.ls;
                    break;
                case 7:
                    point = isWEB ? 'web_tasklist_lingqulibao' : 'clt_tasklist_lingqulibao';
                    break;
                case 4:
                    point = isWEB ? 'web_shengjiyizhangtong' : 'clt_shengjiyizhangtong';
                    break;
                default:
                    point = '';
            }
        } else {
            switch (task) {
                case 101:
                    point = isWEB ? 'web_mygift_qiuxingkaxiangqing' : 'clt_mygift_qiuxingkaxiangqing';
                    break;
                case 102:
                    point = isWEB ? 'web_mygift_quyunzuanshangcheng' : 'clt_mygift_quyunzuanshangcheng';
                    break;
                case 103:
                    point = isWEB ? 'web_mygift_qukandapian' : 'clt_mygift_qukandapian';
                    break;
                case 104:
                    point = isWEB ? 'web_mygift_tianxielianxifangshi' : 'clt_mygift_tianxielianxifangshi';
                    break;
                default:
                    point = isWEB ? 'web_mygift_quyongquan' : 'clt_mygift_quyongquan';
            }
        }
        return point;
    }

    function init_cover_point() {
        $('.task_rule').attr('tj_id', isWEB ? 'web_tasklist_taskrule' : 'clt_tasklist_taskrule');
        $('.prize').attr('tj_id', isWEB ? 'web_tasklist_mygift' : 'clt_tasklist_mygift');
        $('.diamond_content a').attr('tj_id', isWEB ? 'web_tasklist_yunzuanshangcheng' : 'clt_tasklist_yunzuanshangcheng');
    }

//获取奖品文案处理
    function prize_desc(prizes) {
        var len = prizes.length;
        var desc = '';
        for (var i = 0; i < len; i++) {
            if (i + 1 === len) {
                desc += prizes[i].name;
            } else {
                desc += prizes[i].name + '、'
            }
        }
        return desc;
    }
}

new_task_center();