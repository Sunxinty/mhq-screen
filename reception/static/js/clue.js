
    //刷新数据的定时器
    let refresh;
    //动画播放间隔的定时器
    let timer;
    //动画播放间隔
    let PLAY = 3000;

    //初始化 Top对象
    let Top = new Vue({
        el:"#top",
        data:{
            title:"互联网线索汇聚"
        }
    });

    //初始化 BtnContainer对象
    let BtnContainer = new Vue({
        el:"#btnContainer",
        data:{
            apiUrl:HTTP.url+"rest/internet/news",
            params:{
                "classifyname":"",
                "pageSize":6
                // "sourceIds":["1271","5087","22213","34030","34031","34032"]
            },
            btn:Json.testData,
            animotionType:1
        },
        methods: {
            getList: function() {
                //请求列表数据
                this.$http.post(this.apiUrl,JSON.stringify(this.params))
                    .then(function(response){
                        console.log("请求成功：",response.data);
                        //格式化返回的数据
                        formatListData(response.data);
                    })
                    .catch(function(response) {
                        console.log("请求错误：",response)
                    });
            }
        }
    });

    //初始化 DataContainer对象
    let DataContainer = new Vue({
        el:"#dataContainer",
        data:{
            apiUrl:HTTP.url+"rest/internet/saerchId?id=",
            details:Json.testData
        },
        methods: {
            getData: function() {
                //请求详细数据
                let ids = listID;
                //根据每条ID获取详情数据
                for(let i=0;i<ids.length;i++){
                    this.$http.get(this.apiUrl+ids[i])
                        .then(function(response){
                            console.log("请求成功：",response.data);
                            //格式化返回的数据
                            formatData(response.data,i);
                        })
                        .catch(function(response) {
                            console.log("请求错误：",response)
                        });
                }
            }
        }
    });

    //请求管理设置数据
    function getSettings(BtnContainer,Top) {
        Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_CLUE")
            .then(function(response){
                let result = response.body.data;
                const REQUEST = parseInt(result.reqtime)*1000||36000;
                PLAY = parseInt(result.carouseltime)*1000||6000;
                const TITLE = result.title||"互联网线索汇聚";
                const RADIO_BG = parseInt(result.imgtype)||1;
                const RADIO_SW = parseInt(result.showway)||1;
                const BG_URL = result.backgroundurl;
                //定时发送请求刷新数据
                if(refresh){
                    clearInterval(refresh);
                }
                refresh = setInterval(function(){
                    BtnContainer.getList();
                },REQUEST);
                //重置页面动画间隔
                if(timer){
                    clearInterval(timer);
                }
                Vue.set(BtnContainer,"animotionType",RADIO_SW);
                if(RADIO_SW===1){
                    action1(PLAY);
                }else if(RADIO_SW===2){
                    action2(PLAY);
                }
                //重置标题
                Vue.set(Top,'title', TITLE);
                //更改背景
                changeBG(BG_URL,RADIO_BG);
            })
            .catch(function(response) {
                console.log(response)
            })
    }
    function changeBG(BG_URL,RADIO_BG){
        //更改背景
        if(RADIO_BG===0){
            $("body").css("background-image","url("+BG_URL+")");
        }else{
            $("body").css("background-image","url('../static/imgs/clue/bg"+RADIO_BG+".png')");
        }
    }

    //页面动画1
    function action1(ms){
        let move = -10;
        let i = 0;
        animotion1(i,move);
        timer = setInterval(function(){
            if(move===710){
                move = -10;
            }else{
                move += 144;
            }
            if(i===5){
                i = 0;
            }else{
                i += 1;
            }
            animotion1(i,move);
        },ms);
    }
    //动画效果1
    function animotion1(i,move){
        $("#btnSelected1").css({"top":move+"px","left":"-40px"});
        $("#btnList1 .btn").removeClass("selected");
        $("#btnList1 .btn").eq(i).addClass("selected");
        $(".detailsContainer").removeClass("show");
        $(".detailsContainer").eq(i).addClass("show");
    }
    //页面动画2
    function action2(ms){
        let top = -30;
        let left = -3;
        let i = 0;
        animotion2(i,top,left);
        timer = setInterval(function(){
            if(i===0){
                i += 1;
                left = 393;
            }else if(i===1){
                i += 1;
                top = 256;
                left = -3;
            }else if(i===2){
                i += 1;
                left = 393;
            }else if(i===3){
                i += 1;
                top = 545;
                left = -3;
            }else if(i===4){
                i += 1;
                left = 393;
            }else if(i===5){
                i = 0;
                top = -30;
                left = -3;
            }
            animotion2(i,top,left);
        },ms);
    }
    //动画效果2
    function animotion2(i,top,left){
        $("#btnSelected2").css({"top":top+"px","left":left+"px"});
        $("#btnList2 .btn").removeClass("selected");
        $("#btnList2 .btn").eq(i).addClass("selected");
        $(".detailsContainer").removeClass("show");
        $(".detailsContainer").eq(i).addClass("show");
    }

    //真实数据
    let listData =[];
    let listID = [];
    let detailsData =[];
    //列表数据格式化
    function formatListData(results) {
        //服务器返回数据
        let result = results.data;
        if(result.length===0||result===''){
            console.log(results.msg||"返回数据异常");
        }else{
            listData =[];
			listID = [];
            detailsData =[];
            for(let i = 0;i<result.length;i++){
                //添加数据到detailsData
                listData.push(
                    {
                        name:result[i].from,
                        title:result[i].title,
                        time:result[i].collectTimel
                    }
                );
                listID.push(result[i].nid);
            }

            //列表数据获取后更新视图
            Vue.set(BtnContainer,'btn', listData);
            setTimeout(function(){
                textLength($("#btnList2 .btn_title"), 18);
            },5);

            //列表数据获取成功后，根据每条数据的ID 请求详细数据
            DataContainer.getData();
        }

    }

    //详情数据格式化
    let a = 0;
    function formatData(results,index) {
        a++;
        //服务器返回数据
        let result = results.data;
        //添加数据到detailsData
        detailsData[index]=
            {
                name:result.from,
                title:result.title,
                content:result.summary,
                time:result.collectTimel,
                fullText:result.fullText,
                picUrl:result.materials
            };

        if(a===6){
            Vue.set(DataContainer,'details', detailsData);
            a=0;
        }
    }

$(function(){
    //动画开始
    animotion1(0,6);
    action1(6000);

    //获取后台管理页面的设置信息
    getSettings(BtnContainer,Top);

    //请求列表数据
    BtnContainer.getList();

    //定时发送请求刷新数据
    refresh = setInterval(function(){
        BtnContainer.getList();
    },36000);


});

//限制字符个数
function textLength(ele, maxLength) {
    ele.each(function () {
        var maxwidth = maxLength;
        if ($(this).text().length > maxwidth) {
            $(this).text($(this).text().substring(0, maxwidth));
            $(this).html($(this).html() + '…');
        }
    });
}
