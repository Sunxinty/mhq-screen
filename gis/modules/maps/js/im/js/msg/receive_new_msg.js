//监听新消息事件
//newMsgList 为新消息数组，结构为[Msg]
function onMsgNotify(newMsgList) {
    console.log('新消息出现');
    console.log(newMsgList[0].subcmd);
    console.log(newMsgList[newMsgList.length-1].subcmd);
    if(newMsgList[newMsgList.length-1].subcmd=='ACCEPT'){
        console.log('移动端接收了通话邀请');
        $('#callingVideoState').hide();
        $('#sucessVideoTongxun').show();
        $('#callingAudioState').hide();
        $('#sucessAudioTongxun').show();
    }else if(newMsgList[newMsgList.length-1].subcmd=='HANGUP'){
        console.log('移动端挂断了通话');
    }else if(newMsgList[newMsgList.length-1].subcmd=='REFUSE'){
        console.log('移动端拒绝了通话邀请')
    }
    //var sess, newMsg;
    ////获取所有聊天会话
    //var sessMap = webim.MsgStore.sessMap();
    //
    //for (var j in newMsgList) {//遍历新消息
    //    newMsg = newMsgList[j];
    //
    //    if(!selToID){//没有聊天对象
    //        selToID=newMsg.getSession().id();
    //        selType=newMsg.getSession().type();
    //        selSess = newMsg.getSession();
    //        var headUrl;
    //        if(selType==webim.SESSION_TYPE.C2C){
    //            headUrl=friendHeadUrl;
    //        }else{
    //            headUrl=groupHeadUrl;
    //        }
    //        addSess(selType,selToID, newMsg.getSession().name(), headUrl, 0, 'sesslist');//新增一个对象
    //        setSelSessStyleOn(selToID);
    //    }
    //    if (newMsg.getSession().id() == selToID) {//为当前聊天对象的消息
    //        //在聊天窗体中新增一条消息
    //        //console.warn(newMsg);
    //        addMsg(newMsg);
    //    }
    //}
    ////消息已读上报，以及设置会话自动已读标记
    //webim.setAutoRead(selSess, true, true);
    //
    //for (var i in sessMap) {
    //    sess = sessMap[i];
    //    if (selToID != sess.id()) {//更新其他聊天对象的未读消息数
    //        updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
    //        console.debug(sess.unread());
    //        // stopPolling = true;
    //    }
    //}
}

//监听直播聊天室新消息事件
//newMsgList 为新消息数组，结构为[Msg]
//监听大群新消息（普通，点赞，提示，红包）
function onBigGroupMsgNotify(newMsgList) {
    var newMsg;
    for (var i = newMsgList.length - 1; i >= 0; i--) {//遍历消息，按照时间从后往前
        newMsg = newMsgList[i];
        webim.Log.warn('receive a new group(AVChatRoom) msg: ' + newMsg.getFromAccountNick());
        //显示收到的消息
        addMsg(newMsg);
    }
}


//处理已读消息
function handleC2cMsgReadedNotify(item){
    var sessMap = webim.MsgStore.sessMap()[webim.SESSION_TYPE.C2C+item.From_Account];
    if(sessMap){
        var msgs = _.clone(sessMap.msgs());
        var rm_msgs = _.remove(msgs,function(m){
            return m.time <= item.LastReadTime
        });
        var unread = sessMap.unread()  - rm_msgs.length;
        unread = unread > 0 ? unread : 0;
        //更新sess的未读数
        sessMap.unread( unread );
        // console.debug('更新C2C未读数:',item.From_Account,unread);
        //更新页面的未读数角标
        if(unread > 0 ){
            $("#badgeDiv_"+item.From_Account).text(unread).show();
        }else{
            $("#badgeDiv_"+item.From_Account).val("").hide();
        }
    }
}
//消息已读通知
function onMsgReadedNotify(notify) {
    _.each(notify.ReadC2cMsgNotify.UinPairReadArray,function(item){
        handleC2cMsgReadedNotify(item);
    });
}

