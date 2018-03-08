//刷新数据的定时器
let refresh;
//动画播放间隔的定时器
let timer;
//动画间隔
let play;

//初始化 Task对象
let Task = new Vue({
    el:"#container",
    data:{
        title:"任务一览",
        apiUrl:HTTP.url+"",
        postParams:{},
        finishCount:580,
        totalCount:1200,
        countData:Json.count,
        whichToShow:{},
        chartData:Json.chart,
        dataArr:[Json.interview,Json.tv,Json.web]
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
            //请求列表数据
            this.$http.post(this.apiUrl,JSON.stringify(this.postParams))
                .then(function(response){
                    console.log("请求成功：",response.data);
                })
                .catch(function(response) {
                    console.log("请求错误：",response)
                });
        },
        drawChart: function(DOMid,dataArr){
            let dom = document.getElementById(DOMid);
            let Chart_pie = echarts.init(dom);
            let option = {
                color:['#F2542F','#EF990E','#0097FE'],
                calculable: false,
                series: [
                    {
                        name:'任务一览',
                        type:'pie',
                        radius: ['50%', '70%'],
                        startAngle:160,
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{term1|{b}}\n {term2|{c}%}',
                                fontSize: '22',
                                padding: [0,-60,50,-80],
                                position: 'outside',
                                rich: {
                                    term1: {
                                        fontSize: 16,
                                        color:'#fff',
                                        padding: [0,0,0,8],
                                        lineHeight: 20
                                    },
                                    term2: {
                                        fontSize: 28,
                                        color:'#fff',
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
                                // smooth:true,
                                // length:0,
                                length2:90
                            }
                        },
                        itemStyle:{
                            shadowColor: '#0097FE',
                            shadowBlur: 30
                        },
                        data:dataArr
                    }
                ]
            };
            Chart_pie.setOption(option);
        }
    }
});

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
    Vue.set(Task,"whichToShow",Task.countData[i]);
    $("#dataContainer>div").removeClass("show");
    $("#dataContainer>div").eq(i).addClass("show");
    $("#chartPie>.part").removeClass("selected");
    $("#chartPie>.part").eq(i).addClass("selected");
}

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

//请求管理设置数据
function getSettings(Task) {
    Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_INTERVIEWTASK")
        .then(function(response){
            let result = response.body.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"任务一览";
            const RADIO_BG = parseInt(result.imgtype)||1;
            const BG_URL = result.backgroundurl;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            refresh = setInterval(function(){
                Task.getData();
            },REQUEST);
            //重置页面动画间隔
            if(timer){
                clearInterval(timer);
            }
            action(PLAY,3);
            //重置标题
            Vue.set(Task,'title', TITLE);

            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url("+BG_URL+")");
            }else if(RADIO_BG===1){
                $("body").css("background-image","url('../static/imgs/taskView/bg1.png')");
            }else if(RADIO_BG===2){
                $("body").css("background-image","url('../static/imgs/taskView/bg2.png')");
            }

        })
        .catch(function(response) {
            console.log(response)
        })
}

$(function(){
    textLength($('.title'),52);
    textLength($('.content'),47);
    Task.drawChart('pie',Task.chartData);

    getSettings(Task);
    action(PLAY,3);
});