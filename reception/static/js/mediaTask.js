//刷新数据的定时器
let refresh;
//动画播放间隔的定时器
let timer;
//动画间隔
let play;

//初始化 MediaTask对象
let MediaTask = new Vue({
    el:"#container",
    data:{
        title:"新媒体任务监看",
        apiUrl:HTTP.url+"",
        postParams:{},
        domArr:["wechat","weibo","website"],
        dataArr:[Json.wechat,Json.weibo,Json.website]
    },
    mounted:function(){
        var _this = this;
        _this.getData();
        // 每十分钟更新数据
        refresh = setInterval(function(){
            _this.getData();
        },600000);
    },
    methods: {
        getData: function() {
            this.$http.post(this.apiUrl,JSON.stringify(this.postParams))
                .then(function(response){
                    console.log("请求成功：",response.data);
                    //格式化返回的数据
                    formatData(response.data);
                })
                .catch(function(response) {
                    console.log("请求错误：",response)
                })
        },
        formatData: function (results) {
            //返回数据
            let result = results.data.result;
            if(results.data===''||result.length===0||result===''){
                console.log(results.msg||"返回数据异常");
            }else {
                for (let i = 0; i < 5; i++) {
                    if(result[i]){
                        let pathList = result[i].pathList;
                        let newList = [];
                        // 下面只显示6条数据，不足6条显示为空，多6条去掉后面的
                        for (let j = 0; j < 6; j++) {
                            if (pathList[j]) {
                                newList.push(pathList[j]);
                            } else {
                                newList.push("");
                            }
                        }
                        //添加数据到detailsData
                        detailsData.push(
                            {
                                name: result[i].xxx,
                                time: result[i].xxx,
                                title: result[i].xxx,
                                status: result[i].xxx
                            }
                        );
                    }else{
                        let newList = [];
                        for (let j = 0; j < 6; j++) {
                            newList.push("");
                        }
                        //添加数据到detailsData
                        detailsData.push(
                            {
                                name: result[i].xxx,
                                time: result[i].xxx,
                                title: result[i].xxx,
                                status: result[i].xxx
                            }
                        );
                    }

                    console.log(detailsData);
                }
                //更新数据模型
                this.$set(this, 'wechat', detailsData);
                this.$set(this, 'weibo', detailsData);
                this.$set(this, 'website', detailsData);
            }
        },
        drawChartNormal: function(DOMid,color,text,dataArr){
            let dom = document.getElementById(DOMid);
            let Chart_pie = echarts.init(dom);
            let option = {
                color:[color,'#75A6BF'],
                calculable: false,
                graphic: [
                    {
                        type: 'text',
                        left:'center',
                        top:'center',
                        z:3,
                        zlevel:100,
                        style:{
                            text:text,
                            font: '14px "微软雅黑", sans-serif',
                            fill:color
                        }
                    }
                ],
                series: [
                    {
                        name:text,
                        type:'pie',
                        radius: ['35%', '50%'],
                        startAngle:0,
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{term1|{b}}\n {term2|{c}}',
                                fontSize: '22',
                                padding: [0,-50,50,-60],
                                position: 'outside',
                                rich: {
                                    term1: {
                                        fontSize: 14,
                                        padding: [0,0,0,8],
                                        lineHeight: 20
                                    },
                                    term2: {
                                        fontSize: 28,
                                        lineHeight: 30
                                    }
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                smooth:true,
                                length:0,
                                length2:120
                            }
                        },
                        itemStyle:{
                            shadowBlur: 0
                        },
                        data:dataArr
                    }
                ]
            };
            Chart_pie.setOption(option);
        },
        drawChartSelected: function(DOMid,color,text,dataArr){
            let dom = document.getElementById(DOMid);
            let Chart_pie = echarts.init(dom);
            let option = {
                color:[color,'#75A6BF'],
                calculable: false,
                graphic: [
                    {
                        type: 'text',
                        left:'center',
                        top:'center',
                        z:3,
                        zlevel:100,
                        style:{
                            text:text,
                            font: '24px "微软雅黑", sans-serif',
                            fill:color
                        }
                    }
                ],
                series: [
                    {
                        name:text,
                        type:'pie',
                        radius: ['50%', '75%'],
                        startAngle:0,
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{term1|{b}}\n {term2|{c}}',
                                fontSize: '22',
                                padding: [0,-50,50,-60],
                                position: 'outside',
                                rich: {
                                    term1: {
                                        fontSize: 14,
                                        padding: [0,0,0,8],
                                        lineHeight: 20
                                    },
                                    term2: {
                                        fontSize: 28,
                                        lineHeight: 30
                                    }
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                smooth:true,
                                length:0,
                                length2:100
                            }
                        },
                        itemStyle:{
                            shadowColor: color,
                            shadowBlur: 20
                        },
                        data:dataArr
                    }
                ]
            };
            Chart_pie.setOption(option);
        },
        setChartOption: function(DOMid){
            let domArr=this.domArr;
            let dataArr=this.dataArr;
            for(let i=0;i<domArr.length;i++){
                let color = '';
                let text = '';
                if(domArr[i]==="wechat"){
                    color="#37E000";
                    text="微信";
                }else if(domArr[i]==="weibo"){
                    color="#EC2673";
                    text="微博";
                }else if(domArr[i]==="website"){
                    color="#29A5EB";
                    text="网站";
                }
                let series = [{value:dataArr[i].published, name:'已发布'},{value:dataArr[i].notPub, name:'未发布',itemStyle:{opacity:0.1}}];
                if(DOMid===domArr[i]){
                    this.drawChartSelected(domArr[i],color,text,series)
                }else{
                    this.drawChartNormal(domArr[i],color,text,series)
                }
            }
        }
    }
});
//请求数据
// MediaTask.getData();
MediaTask.setChartOption("wechat");

//页面动画
function action(ms,howMany){
    console.log(howMany);
    if(!ms){
        ms=6000;
    }
    if(!howMany){
        howMany = 3;
    }

    let i = 0;
    animotion(i);
    timer = setInterval(function(){
        i = (i+1)%howMany;
        animotion(i);
    },ms);
}
//动画效果
function animotion(i){
    MediaTask.setChartOption(MediaTask.domArr[i]);
    $("#left>div").removeClass("selected");
    $("#left>div").eq(i).addClass("selected");
    $("#right>div").removeClass("show");
    $("#right>div").eq(i).addClass("show");
}

//请求管理设置数据
function getSettings(MediaTask) {
    Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_CENTER")
        .then(function(response){
            let result = response.body.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"新媒体任务监看";
            const RADIO_BG = parseInt(result.imgtype)||1;
            const BG_URL = result.backgroundurl;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            refresh = setInterval(function(){
                MediaTask.getData();
            },REQUEST);
            //重置页面动画间隔
            if(timer){
                clearInterval(timer);
            }
            action(PLAY,3);
            //重置标题
            Vue.set(MediaTask,'title', TITLE);

            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url("+BG_URL+")");
            }else if(RADIO_BG===1){
                $("body").css("background-image","url('../static/imgs/mediaTask/bg1.png')");
            }else if(RADIO_BG===2){
                $("body").css("background-image","url('../static/imgs/mediaTask/bg2.png')");
            }

        })
        .catch(function(response) {
            console.log(response)
        })
}

$(function(){

    getSettings(MediaTask);

    action(PLAY,3);

});