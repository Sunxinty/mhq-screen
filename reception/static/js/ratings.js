
//刷新数据的定时器
let refresh;
//页面动画的定时器
let timer;

//初始化 BtnList对象
let List = new Vue({
    el:"#container",
    data:{
        title:"收视率对比",
        apiUrl:HTTP.url+"ratings/search",
        list:[],
        btn:[]
    },
    methods: {
        getList: function() {
            //请求列表数据
            this.$http.post(this.apiUrl,JSON.stringify({
                "page":1,
                "size":9999
            }))
                .then(function(response){
                    console.log("请求成功：",response.data);
                    this.$set(this,"list",response.data.data.list);
                    let page = Math.ceil(this.list.length/8);
                    action(6000,page);
                    this.getTopFive();
                })
                .catch(function(response) {
                    console.log("请求错误：",response)
                });
        },
        getTopFive: function(){
            let arr = this.list;
            let topArr = [];
            let len = arr.length<5?arr.length:5;
            for(let i=0;i<len;i++){
                topArr.push(arr[i]);
            }
            this.$set(this,"btn",topArr);
        }
    }
});

//请求管理设置数据
function getSettings(List) {
    Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_RATINGS")
        .then(function(response){
            let result = response.body.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            const PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"收视率对比";
            const RADIO_BG = parseInt(result.imgtype)||0;
            const BG_URL = result.backgroundurl;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            refresh = setInterval(function(){
                List.getList();
            },REQUEST);
            //重置标题
            Vue.set(List,'title', TITLE);
            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url('../static/imgs/ratings/bg.png')");
            }else if(RADIO_BG===1){
                $("body").css("background-image","url("+BG_URL+")");
            }

        })
        .catch(function(response) {
            console.log(response)
        })
}
//页面动画
function action(ms,howMany){
    if(!ms){
        ms=6000;
    }
    if(!howMany){
        howMany = 1;
    }
    const STEP = 720;
    const START = 0;
    const END = STEP*howMany-STEP+START;

    let move = START;
    animotion(move);
    timer = setInterval(function(){
        if(move===END){
            move = START;
        }else{
            move += STEP;
        }
        animotion(move);
    },ms);
}
//动画效果
function animotion(move){
    $("#glass").css("top","-"+move+"px");
}

$(function(){

    //获取后台管理页面的设置信息
    getSettings(List);

    //请求列表数据
    List.getList();

    //定时发送请求刷新数据
    // refresh = setInterval(function(){
    //     List.getList();
    // },60000);

});
