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
                }else{
                    $("body").css("background-image","url('icons/bg"+RADIO_BG+".png')");
                }
            }
        },
        error:function(error){
            console.log(error.msg||"请求异常",2000);
        }
    });
}
loadData();
//监听背景设置的变化
webSocket();
//socket连接
function webSocket() {
    let websocket = null;
    //判断当前浏览器是否支持WebSocket
    if('WebSocket' in window){
        websocket = new WebSocket(WS.url+"Websocket");
        //连接发生错误的回调方法
        websocket.onerror = function(){
            logInfo("socket error");
        };
        //连接成功建立的回调方法
        websocket.onopen = function(){
            logInfo("socket open");
        };
        //接收到消息的回调方法
        websocket.onmessage = function(response){
            logInfo(response.data);
            let result = JSON.parse(response.data);
            const RADIO_BG = parseInt(result.type)||1;
            const BG_URL = result.backgroundurl||"";
            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url("+BG_URL+")");
            }else{
                $("body").css("background-image","url('icons/bg"+RADIO_BG+".png')");
            }
        };
        //连接关闭的回调方法
        websocket.onclose = function(){
            logInfo("socket close");
        };
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function(){
            websocket.close();
        };

        //在控制台打印信息
        function logInfo(info){
            console.log("socket返回信息：",info);
        }
        //关闭连接
        function closeWebSocket(){
            websocket.close();
        }
        //发送消息
        function send(){
            websocket.send("给我来点最新消息");
        }
    }
    else{
        alert('Not support websocket');
    }

}