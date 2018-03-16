//数据请求已经屏蔽，有三处地方，要开启的时候搜索getData即可

//刷新数据的定时器
let refresh;
//动画播放间隔的定时器
let timer;
//动画间隔
let play;
//请求间隔
let REQUEST;

//初始化 Task对象
let Task = new Vue({
    el:"#container",
    data:{
        title:"任务一览",
        startDate:getOneWeekBefore(),
        endDate:getDate(),
        // apiUrl:HTTP.url+"rest/task/info",
        apiUrl:"http://172.16.146.4:8068/mhq-mserver/rest/task/info",
        finishCount:Json.finishCount,
        totalCount:Json.totalCount,
        chartData:Json.chart,
        dataArr:[Json.interview,Json.tv,Json.web]
    },
    mounted:function(){
        var _this = this;
        // _this.getData();
        // // 每十分钟更新数据
        // refresh = setInterval(function(){
        //     _this.getData();
        // },600000);
    },
    methods: {
        chooseTime: function() {
            clearInterval(refresh);
            var _this = this;
            _this.$set(_this,'startDate', this.$refs.newStart.value);
            _this.$set(_this,'endDate', this.$refs.newEnd.value);
            // _this.getData();
            // refresh = setInterval(function(){
            //     _this.getData();
            // },REQUEST);
        },
        getData: function() {
            //请求列表数据
            this.$http.get(this.apiUrl+"?start="+this.startDate+"&end="+this.endDate+"&size=8")
                .then(function(response){
                    console.log("请求成功：",response.data);
                    if(response.data.code==="00"){
                        let resultData = response.data.data;
                        //更新数据模型
                        this.$set(this, 'finishCount',resultData.finishCount||0);
                        this.$set(this, 'totalCount',resultData.totalCount||0);
                        this.$set(this, 'chartData',resultData.chart||Json.chart);
                        this.$set(this, 'dataArr',[
                            this.formatDate(resultData["INTERVIEW"])||Json.interview,
                            this.formatDate(resultData["INFO"])||Json.tv,
                            this.formatDate(resultData["ARTICLEEDITOR"])||Json.web
                        ]);
                        textLength($('.title'),52);
                        textLength($('.content'),47);
                        this.drawChart('pie',this.chartData);
                        action(PLAY,3);
                    }
                })
                .catch(function(response) {
                    console.log("请求错误：",response)
                });
        },
        formatDate: function(dataArr){
            let newList = [];
            if(!dataArr||dataArr.length===0){
                console.log("返回数据异常");
            }else {
                for (let j = 0; j < 8; j++) {
                    if (dataArr[j]) {
                        let newStatus = null;
                        if(dataArr[j].status===1){
                            newStatus = 2; //已完成
                        }else if(dataArr[j].status===10){
                            newStatus = 1; //进行中
                        }else {
                            newStatus = 0; //未认领
                        }
                        newList.push({
                            title:dataArr[j].title,
                            content:dataArr[j].content.replace(/<[^>]+>|[]|[&nbsp;]/g,"").replace("&nbsp;",''),
                            name:dataArr[j].name,
                            time:typeof(dataArr[j].time)===Number?getTime(dataArr[j].time):dataArr[j].time.split(" ")[0],
                            status:newStatus,
                            category:dataArr[j].category
                        });
                    } else {
                        newList.push("");
                    }
                }
                console.log(newList);
            }
            return newList
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
                                formatter: '{term1|{b}}\n {term2|{c}}',
                                fontSize: '22',
                                padding: [0,-60,50,-80],
                                position: 'inside',
                                rich: {
                                    term1: {
                                        fontSize: 18,
                                        color:'#fff',
                                        padding: [0,-6,0,8],
                                        lineHeight: 20
                                    },
                                    term2: {
                                        fontSize: 30,
                                        color:'#fff',
                                        padding: [0,16,0,32],
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
                                length2:60
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
            REQUEST = parseInt(result.reqtime)*1000||36000;
            PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"任务一览";
            const RADIO_BG = parseInt(result.imgtype)||1;
            const BG_URL = result.backgroundurl;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            // refresh = setInterval(function(){
            //     Task.getData();
            // },REQUEST);
            //重置页面动画间隔
            if(timer){
                clearInterval(timer);
            }
            action(PLAY,3);
            //重置标题
            Vue.set(Task,'title', TITLE);

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
        $("body").css("background-image","url('../static/imgs/taskView/bg"+RADIO_BG+".png')");
    }
}

$(function(){
    //选择日期时间
    $("#pickdate_start").dateDropper({
        animate: true,
        init_animation:'bounce',
        format: 'Y-m-d',
        yearsRange:10,
        minYear: '1990'
    });
    //选择日期时间
    $("#pickdate_end").dateDropper({
        animate: true,
        init_animation:'bounce',
        format: 'Y-m-d',
        yearsRange:10,
        minYear: '1990'
    });

    textLength($('.title'),52);
    textLength($('.content'),47);
    Task.drawChart('pie',Task.chartData);

    getSettings(Task);
    action(PLAY,3);
});

//显示日期
function getTime(ms) {
    let D = new Date(ms);
    let y = D.getFullYear();
    let m = D.getMonth()+1;
    let d = D.getDate();
    let day = d<10?"0"+d:d;
    let month = m<10?"0"+m:m;
    return y+"/"+month+"/"+day;
}
//显示日期
function getDate() {
    let D = new Date();
    let y = D.getFullYear();
    let m = D.getMonth()+1;
    let d = D.getDate();
    let day = d<10?"0"+d:d;
    let month = m<10?"0"+m:m;
    return y+"-"+month+"-"+day;
}
//显示一周前
function getOneWeekBefore() {
    let now = new Date();
    let D = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    let y = D.getFullYear();
    let m = D.getMonth()+1;
    let d = D.getDate();
    let day = d<10?"0"+d:d;
    let month = m<10?"0"+m:m;
    return y+"-"+month+"-"+day;
}