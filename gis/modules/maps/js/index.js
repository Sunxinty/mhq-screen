// var modal = null;
var reLogin = true;
var liveLogin = 0;
var liveUser = 0; // 选择直播人员，1组长  2组员
var callType; // 语音视频通话类型
var roomId ; // 房间号
//川台测试应用腾讯账号
var sdkAppID = 1400028490;
var accountType = 8244;
var selToID = "ocean"; //当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
var selType = webim.SESSION_TYPE.C2C; //当前聊天类型
var selSess = null; //当前聊天会话对象
//默认好友头像
var friendHeadUrl = 'icons/auther3.png'; //仅demo使用，用于没有设置过头像的好友
//默认群头像
var groupHeadUrl = 'img/group.jpg'; //仅demo使用，用于没有设置过群头像的情况
var layerIndex;     //通话弹窗
var Mic;    //麦克风状态
var Player;    //播放器状态
var newTimeer;   //联通时间
var newTimeerInterval;   //通话时间定时器
//当前用户身份
var loginInfo = {
    sdkAppID: sdkAppID,//用户所属应用id
    appIDAt3rd: sdkAppID,//用户所属应用id
    accountType: accountType,//用户所属应用帐号类型
    identifier: selToID,//当前用户ID
    userSig: null//当前用户身份凭证
};
var isAccessFormalEnv = true; //是否访问正式环境

if (webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
    isAccessFormalEnv = false; //访问测试环境
}

var isLogOn = false; //是否开启sdk在控制台打印日志
//初始化时，其他对象，选填
var options = {
    'isAccessFormalEnv': isAccessFormalEnv, //是否访问正式环境，默认访问正式，选填
    'isLogOn': isLogOn //是否开启控制台打印日志,默认开启，选填
};
//监听连接状态回调变化事件
var onConnNotify = function(resp) {
    var info;
    switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
            webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
            break;
        case webim.CONNECTION_STATUS.OFF:
            info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
            webim.Log.warn(info);
            break;
        case webim.CONNECTION_STATUS.RECONNECT:
            info = '连接状态恢复正常: ' + resp.ErrorInfo;
            webim.Log.warn(info);
            break;
        default:
            webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
            break;
    }
};

//IE9(含)以下浏览器用到的jsonp回调函数
function jsonpCallback(rspData) {
    webim.setJsonpLastRspData(rspData);
}

//第三方应用需要实现这个函数，并在这里拿到UserSig
function tlsGetUserSig() {
    loginInfo.userSig = "eJxNTltPgzAU-i991bhyC2DiAy5TpjQGmXHZS9PAYatsbaG1zBj-*4CwxPN2vvsv2mTFna4aypTiFbpHjo8xdiM-xuh2IuGseAeU1Qa6kQ*CwB0kMzvZKDPU60b3FTb8BJPYicMoiEJvxnkFwvCaT1GyBCauOWUpv4Wh5kfBvxzN98NHVh-Ldfoiv3rLi*MTpMRZF1G7PPibgx*yzOzII9xY3UvVZP0bTvgqWYgaFgWuvHfblNBv489TnKdg98f2TFidvOq2fM6dKNfkYS6z0GkuxVDo4mG56*Hx0N8FB0xYmQ__";
    //从cookie获取accountType
    if (accountType) {
        loginInfo.accountType = accountType;
        //登录qavSDK
        OnBtnLogin();
        // 视音频通话时才发送消息
        if(!liveLogin){
            webimLogin();
        }
    } else {
        alert('accountType非法');
    }
}
//监听事件
var listeners = {
    "onConnNotify": onConnNotify //监听连接状态回调变化事件,必填
    ,
    "jsonpCallback": jsonpCallback //IE9(含)以下浏览器用到的jsonp回调函数，
};
//反初始化
function OnUninit() {
    sdk.unInit();
}
//sdk登录
function webimLogin() {
    webim.login(
        loginInfo, listeners, options,
        function (resp) {
            loginInfo.identifierNick = resp.identifierNick;//设置当前用户昵称
            sendCustomMsg(1);
            toastr.success("webim login success")
        },
        function (err) {
            alert(err.ErrorInfo);
        }
    );
}

// 创建/进入房间
function createLiveRoom(id,type){
    roomId = id;
    callType = type;
    sdk.createRoom(roomId,1, "LiveMaster"
        ,function() {
            g_role = E_Role.LiveMaster;
            toastr.success("进入直播间成功！");
            OnBtnOpenMic();
        }
        ,function(err){
            console.log(err)
            if(err.code!="8024"){
                toastr.error("错误码:"+err.code+"错误信息:"+err.desc)
            }
        }
    )
}

// 播放直播
function showLiveRtmp(url){
    if(url!=""&&url!=null&&url!="undefined"){
        $(".copyLive p span").text(url);
        $(".play-live #live-video").show();
        var option = {
            "live_url": url,
            "width": 580,
            "height": 380
        };
        
        var player = new qcVideo.Player("live-video", option);
        
        $(".play-live p.no-liveRtmp").hide();
        $(".video-js").css({"width":"100%","height":"100%"})
    }
    else{
        $(".copyLive p span").text("无");
        $(".play-live #live-video").hide();
        $(".play-live p.no-liveRtmp").show();
    }
}

// 查询审核状态
function queryExamine(type){
    $(".examine-list ul").html("");
    $.ajax({
        url: window.config.apiAddress+"/mhq-im-mservice/reserve/search.json?pageNO=1&pageSize=10&checkStatus="+type,
        type: 'get',
        dataType: 'json',
        success: function (res) {
            if(res.data){
                var dataList = res.data;
                if(dataList.length>0){
                    for(var i=0;i<dataList.length;i++){
                        var members = dataList[i].members;
                        var memberArr = [];
                        for(var j=1;j<members.length;j++){
                            memberArr.push(members[j].userName)
                        }
                        if(type==1){
                            $(".examine-list ul").append('<li><p>直播主题：<span>'+dataList[i].title+'</span></p><p>直播时长：<span>'+dataList[i].liveTime+'分钟</span></p><p>直播时间：<span>'+dataList[i].beginTime+'</span></p><p>直播组长：<span>'+dataList[i].userName+'</span></p><p>直播组员：<span>'+memberArr.join(",")+'</span></p><div class="section t-center"><a href="##" onclick="examineBtn('+dataList[i].id+',3)">拒绝</a><a href="##" onclick="examineBtn('+dataList[i].id+',2)">通过</a></div></li>')
                        }
                        else{
                            $(".examine-list ul").append('<li><p>直播主题：<span>'+dataList[i].title+'</span></p><p>直播时长：<span>'+dataList[i].liveTime+'分钟</span></p><p>直播时间：<span>'+dataList[i].beginTime+'</span></p><p>直播组长：<span>'+dataList[i].userName+'</span></p><p>直播组员：<span>'+memberArr.join(",")+'</span></p></li>')
                        }
                    }
                }
                else{
                    $(".examine-list ul").html('<li>无数据！</li>')
                }
            }
        },
        error:function(err){
            $(".examine-list ul").html('<li>请求出错！</li>')
        }
    })
}

// 审核通过和拒绝
function examineBtn(id,type){
    var params = {
        "id":id,
        "checkStatus":type,
        "checkUser":"ocean"
    }
    $.ajax({
        url: window.config.apiAddress+"/mhq-im-mservice/reserve/check",
        type: 'post',
        data:JSON.stringify(params),
        dataType: 'json',
        contentType:"application/json",
        success: function (res) {
            if(res.ResponseMessage.status=="success"){
                queryExamine(1)
                toastr.success(res.ResponseMessage.message.zh_CN);
            }
        },
        error:function(err){
            toastr.error(err.ResponseMessage.message.zh_CN,"审核失败！")
        }
    })
}

// 直播组增减成员方法
function changeUsers(data){
    if(!data){
        return;
    }
    if(data.type=="0"){
        // 踢出成员
        var id = data.id;
        var parmas = [{
            id:id,
            type:data.type
        }]
        $.ajax({
            url: window.config.apiAddress+"/mhq-im-mservice/reserve/change/user.json",
            type: 'post',
            data: JSON.stringify(parmas),
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                console.log(res)
                if(res.ResponseMessage.status=="success"){
                    setTimeout(function(){
                        toastr.success(res.ResponseMessage.message.zh_CN)
                        Map.prototype.groupLiveBox();
                        $("#changeUsers").hide();
                    },500)
                }
                else{
                    toastr.info(res.ResponseMessage.message.zh_CN)
                }
            },
            error:function(err){
                toastr.error(err.ResponseMessage.message.zh_CN)
            }
        });
    }
    else if(data.type=="1"){
        // 增加成员
        var parmas = [{
            "userName":data.userName,
            "userCode":data.userCode,
            "type":data.type,
            "groupId":data.groupId
        }]
        $.ajax({
            url: window.config.apiAddress+"/mhq-im-mservice/reserve/change/user.json",
            type: 'post',
            data: JSON.stringify(parmas),
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                console.log(res)
                if(res.ResponseMessage.status=="success"){
                    setTimeout(function(){
                        toastr.success(res.ResponseMessage.message.zh_CN)
                        Map.prototype.groupLiveBox();
                        $("#changeUsers").hide();
                    },500)
                }
                else{
                    toastr.info(res.ResponseMessage.message.zh_CN)
                }
            },
            error:function(err){}
        });
    }
}

$(document).ready(function () {
    //调用客户端方法
    $('body').on('click', 'button.sendMessage', function () {
        window.PostCmdToPC(0, $(this).data('username'), "", "");
    })
    // 语音通话
    .on('click', 'button.voiceCall', function () {
        roomId = 0;
        liveLogin = 0;
        var vidiouserid = $(this).attr('id');
        var userName=$(this).parent().children('p').text();
        var userIcon=$(this).parent().parent().prev().children('img').attr('src');
        if(userIcon.indexOf("null")>-1){
            userIcon = friendHeadUrl
        }
        layerIndex=layer.open({
            type: 1,
            title:'<div class="mine-move" style="position: absolute;width: 100%;height: 42px;background-color: #6d6d6d;color: white;top: 0;padding-left: 20px;left: 0;">正在与'+userName+'的通话中</div>',
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            anim: 0,
            move: ".mine-move",
            shadeClose: false, //开启遮罩关闭
            content:$('#layerVideoSdk'),
            area:['600px',"600px"],
            success: function () {
                $('.userIcon').each(function () {
                    $(this).attr('src',userIcon);
                });
                $('.userName').each(function () {
                    $(this).text(userName);
                });
                Mic=true;
                Player=true;
                roomId = Math.round(Math.random()*99999)+1;
                callType=0;
                selToID=vidiouserid;
                tlsGetUserSig();
            }
        });
    })
    // 视频通话
    .on('click', 'button.videoConversation', function () {
        roomId = 0;
        liveLogin = 0;
        var vidiouserid = $(this).attr('id');
        var userName=$(this).parent().children('p').text();
        var userIcon=$(this).parent().parent().prev().children('img').attr('src');
        if(userIcon.indexOf("null")>-1){
            userIcon = friendHeadUrl
        }
        layerIndex=layer.open({
            type: 1,
            title:'<div class="mine-move" style="position: absolute;width: 100%;height: 42px;background-color: #6d6d6d;color: white;top: 0;padding-left: 20px;left: 0;">正在与'+userName+'的通话中</div>',
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            anim: 0,
            move: ".mine-move",
            shadeClose: false, //开启遮罩关闭
            content:$('#layerVideoSdk'),
            area:['600px',"600px"],
            success: function () {
                $('.userIcon').each(function () {
                    $(this).attr('src',userIcon);
                });
                $('.userName').each(function () {
                    $(this).text(userName);
                });
                Mic=true;
                Player=true;
                roomId = Math.round(Math.random()*99999)+1;
                callType=1;
                selToID=vidiouserid;
                tlsGetUserSig();
            }
        });
    })
    // 关闭通话框
    .on('click','.closeTongxun',function(){
        sendCustomMsg(0);
        reLogin = true;
        OnBtnLogout(function () {
            $('#callingVideoState').show();
            $('#callingAudioState').show();
            $('#sucessAudioTongxun').hide();
            layer.close(layerIndex);
            $('.OnCloseMic').children('i').removeClass('icon-jingyin').addClass('icon-huatong');
            $('.OnClosePlayer').children('i').removeClass('icon-jingyin1').addClass('icon-webtubiaoku08');
            clearInterval(newTimeerInterval);
            $(".render0").hide();
            setTimeout(function(){
                $('#xt-list-btns span').trigger("click")
            },1000)
        });
    })
    .on('click','.OnCloseMic',function(){
        if(Mic){
            OnBtnCloseMic();
            $('.OnCloseMic').children('i').removeClass('icon-huatong').addClass('icon-jingyin');
        }else{
            OnBtnOpenMic();
            $('.OnCloseMic').children('i').removeClass('icon-jingyin').addClass('icon-huatong');
        }
        Mic=!Mic;
    })
    .on('click','.OnClosePlayer',function(){
        if(Player){
            OnBtnClosePlayer();
            $('.OnClosePlayer').children('i').removeClass('icon-webtubiaoku08').addClass('icon-jingyin1');
        }else{
            OnBtnOpenPlayer();
            $('.OnClosePlayer').children('i').removeClass('icon-jingyin1').addClass('icon-webtubiaoku08');
        }
        Player=!Player;
    });
    //选题列表
    $('#xt-list-btn').on('click', function (event) {
        event.preventDefault();
        $('#xt-list').show();
        $('#user-list').hide();
        $('#checkClaim').show();
        $('#panel-searchUser').hide();
        $('#panel-searchTask').show();
        $(this).addClass('btn-active');
        $('#user-list-btn').removeClass('btn-active');

        //默认展示第一条素材
        var materials = [];
        if ($('#xt_list').find('.panel-wrap').length > 0) {
            $('#xt_list').find('.panel-wrap').eq(0).addClass('dataChoose');
            materials = $('.dataChoose').data('datas').materials;
        }
        console.log(Map.prototype);
        Map.prototype.showMaterial(materials);
    });
    //用户列表
    $('#user-list-btn').on('click', function (event) {
        event.preventDefault();
        $('#xt-list').hide();
        $('#user-list').show();
        $('#checkClaim').hide();
        $('#panel-searchUser').show();
        $('#panel-searchTask').hide();
        $(this).addClass('btn-active');
        $('#xt-list-btn').removeClass('btn-active');

        Map.prototype.showDirect();
    });
    //为选题列表绑定事件
    $('#xt-list').on('dblclick', 'div.panel-wrap', function (event) {
        event.preventDefault();
    });
    //返回列表绑定事件
    $('#backToList').on('click', function (event) {
        event.preventDefault();
        toggleElement([$('#xt-list'), $('#xt-list-btns'), $('#xt-detail'), $('#xt-detail-btns'), $('#checkClaim')]);
    });

    //选题列表过滤时间
    $('#listplanClaim').on('ifChecked', function (event) {
        $('#xt-list').children('div[data-flowstatus="5"]').show();
    }).on('ifUnchecked', function (event) {
        $('#xt-list').children('div[data-flowstatus="5"]').hide();
    });
    $('#listplanNotClaim').on('ifChecked', function (event) {
        $('#xt-list').children('div[data-flowstatus!="5"]').show();
    }).on('ifUnchecked', function (event) {
        $('#xt-list').children('div[data-flowstatus!="5"]').hide();
    });

    //记者列表过滤
    $('#panel-searchUser').on('input', 'input', function (e) {
        var input = $(this).val().trim();
        $('#user-list > .panel-wrap').hide();
        var sel = $('#user-list > .panel-wrap').find('p:contains("' + input + '")');

        sel.closest('div.panel-wrap').show();
    });
    //任务列表过滤
    $('#panel-searchTask').on('input', 'input', function (e) {
        var input = $(this).val().trim();
        $('#xt-list > .panel-wrap').hide();
        var sel = $('#xt-list > .panel-wrap').find('p:contains("' + input + '")');
        sel.closest('div.panel-wrap').show();
    });

    // 直播组相关
    // 新建直播组的日期控件
    laydate.render({
      elem: '#liveDate',
      type: 'datetime',
      min: getToday(),
      theme:"#187beb"
    });

    // 点击创建直播组
    $(".groupLiveBox").on("click","a#createBtn",function(){
        $("#liveName,#liveDate,#liveLeader,#liveUser").val("");
        $(".createLiveBox").toggle();
        $("#liveName").focus();
        $(".examineLive,.showLiveGroup,#changeUsers").hide();
    });

    // 点击切换任务，记者按钮
    $("#xt-list-btn,#user-list-btn").on("click",function(){
        $(".createLiveBox,.examineLive,.showLiveGroup,#changeUsers").hide();
    });

    // 隐藏创建直播组
    $(".createLiveBox > span").click(function(){
        $(".createLiveBox").hide();
    });

    // 成员、组长
    var userArr=[],leader={};

    // 新建直播组选择成员
    $(".jizhe-list ul").on("click","li",function(){
        if($(this).data("code")==""||$(this).data("code")==undefined){
            return;
        }
        // 选择组长
        if(liveUser==1){
            if(!$(this).hasClass("active")){
                $(this).addClass("active")
                $(this).siblings("li").removeClass("active")
            }
            var leaderName = $(this).find("p").eq(0).text();
            var code = $(this).data("code");
            $("#liveLeader").val(leaderName)
            leader = {
                "userName":leaderName,
                "userCode":code,
                "isGroupLeader":true
            }
        }
        else if(liveUser==2){
            if($(this).data("code")==leader.userCode){
                return;
            }
            if(leader.userCode==undefined||leader.userCode==""){
                toastr.error("请先选择组长！")
                $("#liveLeader").focus();
                return;
            }
            // 选择组员
            $(this).toggleClass("active");
            var nameArr = [];
            userArr = [];
            $(".jizhe-list li").each(function(index,item){
                if($(this).hasClass("active")){
                    var name = $(this).find("p").eq(0).text();
                    var code = $(this).data("code");
                    userArr.push({
                        "userName":name,
                        "userCode":code,
                        "isGroupLeader":false
                    })
                    nameArr.push(name)
                }
            });
            $("#liveUser").val(nameArr.join(","))
        }
    });

    $("#liveName,#liveDate").focus(function(){
        $(".choice-list").hide();
    })

    $("#liveTime").change(function(){
        $(".choice-list").hide();
    })

    $("#liveLeader").focus(function(){
        if($(this).val()==""){
            leader = {};
        }
        $(".choice-list").show();
        liveUser = 1;
        $(".jizhe-list li").each(function(index,item){
            $(this).removeClass("active");
        })
    });
    $("#liveUser").focus(function(){
        if($(this).val()==""){
            userArr = [];
        }
        $(".choice-list").show();
        liveUser = 2;
        $(".jizhe-list li").each(function(index,item){
            $(this).removeClass("active");
        })
    });

    // 新建直播组
    $(".suerCreateBtn").click(function(){
        var groupMember = [];
        if($("#liveName").val()==""){
            toastr.warning("请输入直播组名称！")
            $("#liveName").focus();
            return;
        }
        else if($("#liveDate").val()==""){
            toastr.warning("请选择直播时间！")
            $("#liveDate").focus();
            return;
        }
        else if($("#liveTime").val()==""){
            toastr.warning("请选择直播时长！")
            $("#liveTime").focus();
            return;
        }
        else if($("#liveLeader").val()==""){
            toastr.warning("请选择直播组长！")
            $("#liveLeader").focus();
            return;
        }
        groupMember.push(leader);
        groupMember = groupMember.concat(userArr);
        var liveParams = {
            "beginTime":$("#liveDate").val(),
            "liveTime":$("#liveTime").val(),
            "isRemindPush":false,
            "remindPushTime":"45",
            "title":$("#liveName").val(),
            "direct":"1",
            "groupMember":groupMember
        }
        // console.log(liveParams)

        $.ajax({
            url: window.config.apiAddress+"/mhq-im-mservice/reserve/save.json",
            type: 'post',
            data:JSON.stringify(liveParams),
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                if(res.ResponseMessage.status=="success"){
                   $("#createBtn").trigger("click");
                   setTimeout(function(){
                        toastr.success("新建成功！");
                        Map.prototype.groupLiveBox();
                        userArr=[];
                        leader={};
                    },1000)
                }
                else{
                    toastr.error(res.ResponseMessage.message.zh_CN)
                }
            },
            error:function(err){
                toastr.error(err.statusText)
            }
        });
    });

    // 点击直播列表
    $(".groupLiveBox").on("click","ul li p",function(){
        var _this = this;
        var id = $(this).parent("li").data("id");
        liveLogin = 1;
        $(".examineLive,.createLiveBox,#changeUsers").hide();
        if(reLogin){
            roomId = id;
            tlsGetUserSig();
            OnBtnOpenMic();
        }
        else{
            if(id!=roomId&&roomId!=0){
                roomId = id;
                sdk.quitRoom(function(suc){
                    $(_this).trigger("click")
                    toastr.info("准备进入房间")
                },function(err){
                    if(err.code!="8024"){
                        toastr.error("退出房间错误码:"+err.code+"错误信息:"+err.desc)
                    }
                })
                setTimeout(function(){
                    createLiveRoom(id,1)
                },500)
            }
            else if(roomId==0){
                roomId = id;
                setTimeout(function(){
                    createLiveRoom(id,1)
                },500)
            }
        }
        reLogin = false;
        $.ajax({
            url: window.config.apiAddress+"/mhq-im-mservice/reserve/getRecordDetail.json?id="+id,
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                if(res.ResponseMessage.status=="success"){
                    var members = res.data.members;
                    $(".liveUserList ul").html("");
                    if(members.length>0){
                        for(var i=0;i<members.length;i++){
                            $(".liveUserList ul").append('<li id="'+members[i].Id+'" data-url="'+members[i].liveURL+'"><p>直播流'+(i+1)+'</p><p>'+members[i].userName+'</p></li>')
                        }
                        $(".liveUserList ul li").eq(0).addClass("active");
                        var liveURL = members[0].liveURL;
                        showLiveRtmp(liveURL)
                    }
                }
                else{
                    toastr.info(res.ResponseMessage.message.zh_CN)
                }
            },
            error:function(err){
                toastr.error(err.statusText)
            }
        });
        $(".showLiveGroup").show();
    });

    // 关闭直播组
    $(".close-livegroup,#closeLive").click(function(){
        $(".showLiveGroup").hide();
        $(".liveUserList ul").html("");
        $(".play-live #live-video").hide();
        $(".play-live p.no-liveRtmp").show();
        $(".copyLive p span").text("");
        sdk.quitRoom(function(){
            roomId=0;
            toastr.success("out room success");
            sdk.logout(function(){
                toastr.success("logout success");
                reLogin = true;
            })
        });
    });

    // 复制直播地址
    $(".copyLiveAddress").click(function(e){
        var text = $(".copyLive p span").text();
        if(text=="无"||text==""){
            toastr.error("无直播流地址！");
            return false;
        }
        var clipboardData = window.clipboardData;
        if (!clipboardData) {
            clipboardData = e.originalEvent.clipboardData;  
        }  
        clipboardData.setData('Text', text);  
        toastr.success("复制直播地址成功！") 
    });

    // 点击组员直播
    $(".liveUserList ul").on("click","li",function(){
        var url = $(this).data("url");
        if(!$(this).hasClass("active")){
            $(this).addClass("active")
            $(this).siblings("li").removeClass("active")
        }
        showLiveRtmp(url)
    });
    // 点击审核按钮
    $(".groupLiveBox").on("click","a#examineLive",function(){
        $(".createLiveBox,.showLiveGroup").hide();
        $(".examineLive").toggle();
        $("#liveName,#liveDate,#liveLeader,#liveUser").val("");
        $(".examineLive ol li").eq(0).trigger("click");
    });
    $(".examineLive ol li").click(function(){
        if(!$(this).hasClass("active")){
            $(this).siblings("li").removeClass("active");
            $(this).addClass("active");
        }
    });
    $(".examineLive > span").click(function(){
        $(".examineLive").hide();
        $(".examineLive ul li").html("");
    });
    // 点击增减组员按钮
    $(".groupLiveBox").on("click","ul li a.changeUsers",function(){
        $("#changeUsers li").each(function(){
            $(this).removeClass("active")
        })
        $(".examineLive,.createLiveBox,.showLiveGroup").hide();
        $("#changeUsers").show();
        var id = $(this).parent("li").data("id");
        var members = [];
        $.ajax({
            url: window.config.apiAddress+"/mhq-im-mservice/reserve/getRecordDetail.json?id="+id,
            type: 'get',
            // contentType: 'application/json',
            dataType: 'json',
            async:false,
            success: function (res) {
                if(res.ResponseMessage.status=="success"){
                    members = res.data.members;
                }
                else{
                    toastr.info(res.ResponseMessage.message.zh_CN)
                }
            },
            error:function(err){
                toastr.error(err.statusText)
            }
        });

        $(".users-list li").each(function(index,item){
            $(item).find("a").remove();
            var params0 = {
                "userName":$(item).find("p").eq(0).text(),
                "userCode":$(item).data("code"),
                "type":"1",
                "groupId":id
            }
            params0 = JSON.stringify(params0)
            $(item).append('<a href="##" title="加入房间" class="add-user">+</a>').data("user",params0);
        })

        $(".users-list li").each(function(index,item){
            var code = $(item).data("code");
            for(var i=0;i<members.length;i++){
                var userCode = members[i].userCode;
                var isLeader = members[i].isGroupLeader;
                var userName = members[i].userName;
                var Id = members[i].Id
                if(isLeader==1){
                    if(userCode==code){
                       $(item).find("a").remove(); 
                   }
                }
                else{
                    if(userCode==code){
                        var params = {
                            "id":Id,
                            "userName":userName,
                            "userCode":code,
                            "type":"0",
                            "groupId":id
                        }
                        params = JSON.stringify(params)
                        $(item).find("a").remove();
                        $(item).append('<a href="##" title="踢出房间" class="delete-user">x</a>').data("user",params)
                    }
                }
            }
        })
    });

    // 点击增减成员按钮
    $(".users-list").on("click","li a",function(){
        var data = $(this).parent("li").data("user");
        data = JSON.parse(data);
        changeUsers(data);
    })
    $("#changeUsers span.close").click(function(){
        $("#changeUsers").hide();
    });
});
new Map();

//读取后台管理设置页面的配置信息
function loadData(){
    $.ajax({
        url:HTTP.url+"allocation/search/SOBEY_MHQ_GIS",
        type:"get",
        success:function(result){
            console.log(result.data);
            if(result.data){
                var TITLE = result.data.title;
                $("#TITLE").val(TITLE);
                var RADIO_BG = result.data.imgtype;
                var BG_URL = result.data.backgroundurl;
                //更改背景
                if(RADIO_BG===0){
                    $("body").css("background-image","url("+BG_URL+")");
                }else if(RADIO_BG===1){
                    $("body").css("background-image","url('../icons/bg1.png')");
                }else if(RADIO_BG===2){
                    $("body").css("background-image","url('../icons/bg2.png')");
                }
            }
        },
        error:function(error){
            console.log(error.msg||"请求异常",2000);
        }
    });
}
loadData();