
    //刷新数据的定时器
    let refresh;
    //动画播放间隔的定时器
    let timer;

    //初始化 Top对象
    let Top = new Vue({
        el:"#top",
        data:{
            title:"互联网线索汇聚"
        }
    });

    //初始化 BtnList对象
    let BtnList = new Vue({
        el:"#btnList",
        data:{
            apiUrl:HTTP.url+"rest/internet/news",
            params:{
                "classifyname":"",
                "pageSize":6
                // "sourceIds":["1271","5087","22213","34030","34031","34032"]
            },
            btn:Json.testData
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
    function getSettings(BtnList,Top) {
        Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_CLUE")
            .then(function(response){
                let result = response.body.data;
                const REQUEST = parseInt(result.reqtime)*1000||36000;
                const PLAY = parseInt(result.carouseltime)*1000||6000;
                const TITLE = result.title||"互联网线索汇聚";
                const RADIO_BG = parseInt(result.imgtype)||0;
                const BG_URL = result.backgroundurl;
                //定时发送请求刷新数据
                if(refresh){
                    clearInterval(refresh);
                }
                refresh = setInterval(function(){
                    BtnList.getList();
                },REQUEST);
                //重置页面动画间隔
                if(timer){
                    clearInterval(timer);
                }
                action(PLAY);
                //重置标题
                Vue.set(Top,'title', TITLE);
                //更改背景
                if(RADIO_BG===0){
                    $("body").css("background-image","url('../static/imgs/clue/bg.png')");
                }else if(RADIO_BG===1){
                    $("body").css("background-image","url("+BG_URL+")");
                }

            })
            .catch(function(response) {
                console.log(response)
            })
    }

    //页面动画
    function action(ms){
        let move = -10;
        let i = 0;
        animotion(i,move);
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
            animotion(i,move);
        },ms);
    }
    //动画效果
    function animotion(i,move){
        $("#btnSelected").css("top",move+"px");
        $(".btn").removeClass("selected");
        $(".btn").eq(i).addClass("selected");
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
            Vue.set(BtnList,'btn', listData);

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
    animotion(0,6);
    action(6000);

    //获取后台管理页面的设置信息
    getSettings(BtnList,Top);

    //请求列表数据
    BtnList.getList();

    //定时发送请求刷新数据
    refresh = setInterval(function(){
        BtnList.getList();
    },36000);

});




