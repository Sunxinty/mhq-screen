
    //动画播放间隔的定时器
    let timer;

    //真实数据
    let detailsData = [];
    let mediaData = [];

    //计算回传总数
    let count = 0;

     //初始化 Top对象
    let Top = new Vue({
        el:"#top",
        data:{
            title:"手机素材展示"
        }
    });

    //初始化 Total对象
    let Total = new Vue({
        el:"#total",
        data:{
            title:"回传总数：",
            num:formatterCount('0')
        }
    });
    
    //初始化 Detail对象
    let Detail = new Vue({
        el:"#pgcShow",
        data:{
            apiUrl:HTTP.url+"rest/uploadPgc",
            postParams:{
                "startDate": "2017-07-01 00:00:00",
                "page": "1",
                "endDate": "2027-07-31 23:59:59",
                "type": "pgc",
                "type_": "tel_pgc",
                "size": "5"
            },
            details:Json.details,
            media:Json.media
        },
        methods: {
            getPgcData: function() {
                this.$http.post(this.apiUrl,JSON.stringify(this.postParams))
                    .then(function(response){
                        console.log("请求成功：",response.data);
                        //格式化返回的数据
                        formatData(response.data);

                        //回传总数
                        totalCount(response.data);

                        //第一次查询数据后打开socket连接
                        webSocket();
                    })
                    .catch(function(response) {
                        console.log("请求错误：",response)
                    })
            }
        }
    });
    //请求数据
    Detail.getPgcData();

    //第一次查询数据后格式化
    function formatData(results) {
        //服务器返回数据
        let result = results.data.result;
        if(results.data===''||result.length===0||result===''){
            console.log(results.msg||"返回数据异常");
        }else {
            for (let i = 0; i < 5; i++) {
                if(result[i]){
					let pathList = result[i].pathList;
					let newList = [];
					// 下面只显示9条数据，不足9条显示为空，多余9条去掉后面的
					for (let j = 0; j < 9; j++) {
						if (pathList[j]) {
							newList.push(pathList[j]);
						} else {
							newList.push("");
						}
					}
					//添加数据到detailsData
					detailsData.push(
						{
							name: result[i].createUser,
							time: result[i].lastUpdateDate,
							counts: result[i].fileCount,
                            picUrl: newList,
                            headPic:newList[0]
						}
					);
                    mediaData.push(
                        {
                            name: result[i].createUser,
                            picUrl: newList
                        }
                    );
				}else{
					let newList = [];
					for (let j = 0; j < 9; j++) {
						newList.push("");
					}
					//添加数据到detailsData
					detailsData.push(
						{
							name: '',
							time: '',
							counts: '',
                            picUrl: '',
                            headPic:''
						}
					);
                    mediaData.push(
                        {
                            name: '',
                            picUrl: newList
                        }
                    );
				}

                console.log(detailsData,mediaData);
            }
            //更新数据模型
            Vue.set(Detail, 'details', detailsData);
            Vue.set(Detail, 'media', mediaData);
        }
    }

    //socket 返回的新数据
    function addNewData(newDataString) {
        //服务器返回数据
        let newData = JSON.parse(newDataString).data.result[0];
        // 下面只显示9条数据，不足9条显示为空，多余9条去掉后面的
        let pathList = newData.pathList;
        let newList = [];
        for(let j = 0;j < 9;j++){
            if(pathList[j]){
                newList.push(pathList[j]);
            }else{
                newList.push("");
            }
        }
        //删除最早的一条数据，把最新的添加上去
        detailsData.shift();
        mediaData.shift();
        detailsData.push(
            {
                name:newData.createUser,
                time:newData.lastUpdateDate,
                counts:newData.fileCount,
                picUrl: newList,
                headPic:newList[0]
            }
        );
        mediaData.push(
            {
                name:newData.createUser,
                picUrl:newList
            }
        );

        Vue.set(Detail,'details', detailsData);
        Vue.set(Detail,'media', mediaData);
        //计数
        addCount(newData.fileCount);
    }

    //回传总数
    function totalCount(results){
        //服务器返回数据
        let total = results.data.total;
        if(results.data===''||!total){
            console.log(results.msg||"返回数据异常");
        }else {
            let totalString = total.toString();
            Vue.set(Total,'num', formatterCount(totalString));
            count = parseInt(total);
        }
    }
    //socket返回数据后右上角总数添加
    function addCount(num){
        count += num;
        let countString = count.toString();
        Vue.set(Total,'num', formatterCount(countString));
    }

    //socket连接
    function webSocket() {
        let websocket = null;
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            websocket = new WebSocket(WS.url+"websocket");
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
                addNewData(response.data);
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

    //请求管理设置数据
    function getSettings(Top) {
        Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_PGC")
            .then(function(response){
                let result = response.body.data;
                const REQUEST = parseInt(result.reqtime)*1000||30000;
                const PLAY = parseInt(result.carouseltime)*1000||6000;
                const TITLE = result.title||"手机素材展示";
                const RADIO_BG = parseInt(result.imgtype)||1;
                const BG_URL = result.backgroundurl;
                //重置页面动画间隔
                if(timer){
                    clearInterval(timer);
                }
                action(PLAY);
                //重置标题
                Vue.set(Top,'title', TITLE);
                //更改背景
                if(RADIO_BG===0){
                    $("body").css("background-image","url("+BG_URL+")");
                }else{
                    $("body").css("background-image","url('../static/imgs/pgc/bg"+RADIO_BG+".png')");
                }

            })
            .catch(function(response) {
                console.log(response)
            })
    }

    //页面动画
    function action(ms){
        if(!ms){
            ms=6000;
        }
        let i = 0;
        animotion(i);
        timer = setInterval(function(){
            if(i===4){
                i = 0;
            }else{
                i += 1;
            }
            animotion(i);
        },ms);
    }
    //动画效果
    function animotion(i){
        let index = i+1;
        $(".details").removeClass("big");
        $("#details"+index).addClass("big");
        $(".createUser").removeClass("show");
        $(".createUser").eq(i).addClass("show");
    }

    //回传总数的数字拆分为单个数字的数组
     function formatterCount(numString) {
         var numArr = numString.split("");
         if (numArr.length < 8) {
             var len = 8 - numArr.length;
             for (let i = 0; i < len; i++) {
                 numArr.unshift('0');
             }
             var countArr = numArr;
             return countArr;
         }else{
             return numArr;
         }
     }
$(function(){
    //动画开始
    animotion(0);
    action(6000);

    //获取后台管理页面的设置信息
    getSettings(Top);
});

