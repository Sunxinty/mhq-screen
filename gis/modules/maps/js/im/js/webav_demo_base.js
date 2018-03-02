//切换应用类型单选按钮事件
function changeAppType(item) {
    var appType = item.value;
    if (appType == 1) {//测试应用
        $('#myself_type_desc').hide();
        $('#demo_type_desc').show();
        $('#sdkAppIdDiv').hide();
        $('#accountTypeDiv').hide();
    } else if (appType == 0) {//自建应用
        $('#demo_type_desc').hide();
        $('#myself_type_desc').show();
        $('#sdkAppIdDiv').show();
        $('#accountTypeDiv').show();
    }
}
//选择应用类型
function selectApp() {
//    var appType = $('input[name="app_type_radio"]:checked').val();
//    if (appType == 1) {//测试应用
//
//        loginInfo.sdkAppID = loginInfo.appIDAt3rd = sdkAppID;
//        loginInfo.accountType = accountType;
//    } else if (appType == 0) {//自建应用
//        if ($("#sdk_app_id").val().length == 0) {
//            alert('请输入sdkAppId');
//            return;
//        }
//        if (!validNumber($("#sdk_app_id").val())) {
//            alert('sdkAppId非法,只能输入数字');
//            return;
//        }
//        if ($("#account_type").val().length == 0) {
//            alert('请输入accountType');
//            return;
//        }
//        if (!validNumber($("#account_type").val())) {
//            alert('accountType非法,只能输入数字');
//            return;
//        }
//        loginInfo.sdkAppID = loginInfo.appIDAt3rd = $('#sdk_app_id').val();
//        loginInfo.accountType = $('#account_type').val();
//    }
    
    loginInfo.sdkAppID = loginInfo.appIDAt3rd = sdkAppID;
    loginInfo.accountType = accountType;
    //将account_type保存到cookie中,有效期是1天
    setCookie('accountType', loginInfo.accountType, 3600 * 24);
    //$('#select_app_dialog').modal('hide');
    //调用tls登录服务
//    tlsLogin();
    tlsGetUserSig();
}
//tls登录
function tlsLogin() {
    log.info('start tlsLogin');
    // 跳转到TLS登录页面
    TLSHelper.goLogin({
        sdkappid: loginInfo.sdkAppID,
        acctype: loginInfo.accountType,
        url: "http://localhost:8082/IMTest/index2.html"
    });
}
//第三方应用需要实现这个函数，并在这里拿到UserSig
function tlsGetUserSig(res) {
    //成功拿到凭证
//    if (res.ErrorCode == TlsErrorCode.OK) {
        log.info('tlsGetUserSig success');
        //从当前URL中获取参数为identifier的值
        loginInfo.identifier = "ocean_iv";//TLSHelper.getQuery("identifier");
        //拿到正式身份凭证
        loginInfo.userSig = "eJxNjV1vgjAUhv9Lb122UmDaJV4QI4YNiAJxhpsGaandBjS0MtTsvw8IJp6783487w0kfvys6DfJpBQUvAHDghCihYUheBpN1knRMJIVmjWDb9s26iOTO9ZIponZDO27rEXJRhg259jEGE*6oKzSohAjqs5ZVhHR3lF5Xp8rTfRFsgeUErz-gvVu5bmy5Cr9iXn0efhwo2hfKteTyYxWyWmnsk1C-es2eAl*T50jnC13itTzwnO4sC-vaF223QxtjqvXQu*tuX-04lhe-a*0DflyOY21rFGirvpBBA3bQCYcDvz9A11vWcA_";//res.UserSig;
        //从当前URL中获取参数为sdkappid的值
        loginInfo.sdkAppID = loginInfo.appIDAt3rd = "1400028490";//TLSHelper.getQuery("sdkappid");

        //从当前URL中获取参数为acctype的值
        //loginInfo.accountType = TLSHelper.getQuery("acctype");

        //从cookie获取accountType
        var accountType = getCookie('accountType');
        if (accountType) {
            loginInfo.accountType = accountType;
            initDemoApp();
            //登录qavSDK
            qavSdkLogin();
            
            webimLogin();
        } else {
            alert('accountType非法');
        }
//    } else {
//        //签名过期，需要重新登录
//        if (res.ErrorCode == TlsErrorCode.SIGNATURE_EXPIRATION) {
//            tlsLogin();
//        } else {
//            log.info('tlsGetUserSig failed:[' + res.ErrorCode + "]" + res.ErrorInfo);
//            alert("[" + res.ErrorCode + "]" + res.ErrorInfo);
//        }
//    }
}

//sdk登录
function webimLogin() {
    webim.login(
        loginInfo, listeners, options,
        function (resp) {
            loginInfo.identifierNick = resp.identifierNick;//设置当前用户昵称
//            initDemoApp();
            
           // onSendMsg();
            sendCustomMsg();
        },
        function (err) {
            alert(err.ErrorInfo);
        }
    );
}

//初始化demo
function initDemoApp() {
    $("body").css("background-color", '#2f2f2f');
    $('#qavSdkDemoDiv').show();
    $('#userId').html(loginInfo.identifier);

}
//返回登录
function quitClick(type) {
    $('#qavSdkDemoDiv').hide();
    //是否登录
    if (loginInfo.identifier == null) {
        window.location.href = callBackUrl;
        //$('#select_app_dialog').modal('show');
        return;
    }
    
    if(type==0){
        isQuitFlag = true;
        //是否已进入房间
        if (currentStatus == StatusType.enter_room) {
            cancelAllView();
            qavSdk.ExitRoom();
        }
    }
    stopContext();
    //window.location.href = callBackUrl;
    
}

//qavsdk登录
function qavSdkLogin() {
    log.info('start qavSdk login');
    //log.info('accountType=' + loginInfo.accountType);
    qavSdk.Login(loginInfo.sdkAppID, loginInfo.accountType, loginInfo.sdkAppID, loginInfo.identifier, loginInfo.userSig);
    log.info('after qavSdk login');
}

//启动qavsdk
function startContext() {
    log.info('start StartContext');
    qavSdk.StartContext(loginInfo.sdkAppID, loginInfo.accountType, loginInfo.sdkAppID, loginInfo.identifier, loginInfo.userSig);
    log.info('after StartContext');
}

//停止qavsdk
function stopContext() {
    log.info('start StopContext');
    qavSdk.StopContext();
    log.info('after StopContext');
}

//判断str是否只包含数字
function validNumber(str) {
    str = str.toString();
    return str.match(/(^\d+$)/g);
}

//设置cookie
//name 名字
//value 值
//expires 有效期(单位：秒)
//path 
//domain 作用域
function setCookie(name, value, expires, path, domain) {
    var exp = new Date();
    exp.setTime(exp.getTime() + expires * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//获取cookie
function getCookie(name) {
    var result = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (result != null) {
        return unescape(result[2]);
    }
    return null;
}
//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var value = this.getCookie(name);
    if (value != null)
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//获取操作系统版本
function detectOS() {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
        var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
        if (isWin10) return "Win10";
    }
    return "other";
}




