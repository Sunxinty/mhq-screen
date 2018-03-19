//刷新数据的定时器
let refresh;
//动画播放间隔的定时器
let timer;
//动画间隔
let play = 6000;
//请求间隔
let REQUEST;

//初始化 MediaTask对象
let MediaTask = new Vue({
    el:"#container",
    data:{
        title:"新媒体任务监看",
        startDate:getOneWeekBefore(),
        endDate:getDate(),
        apiUrl:HTTP.url+"rest/newmedia/getdata",
        // apiUrl:"http://172.16.146.4:8068/mhq-mserver/rest/newmedia/getdata",
        domArr:["website","wechat","weibo"],
        dataArr:[Json.website,Json.wechat,Json.weibo]
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
        chooseTime: function() {
            clearInterval(refresh);
            var _this = this;
            _this.$set(_this,'startDate', this.$refs.newStart.value);
            _this.$set(_this,'endDate', this.$refs.newEnd.value);
            _this.getData();
            refresh = setInterval(function(){
                _this.getData();
            },REQUEST);
        },
        getData: function() {
            this.$http.get(this.apiUrl+"?startTime="+this.startDate+"&endTime="+this.endDate)
                .then(function(response){
                    console.log("请求成功：",response.data);
                    if(response.data.code==="00"){
                        //格式化返回的数据
                        this.formatData(response.data);
                    }
                })
                .catch(function(response) {
                    console.log("请求错误：",response)
                })
        },
        formatData: function (results) {
            //返回数据
            let result = results.data;
            let detailsData = [];
            if(!result||result.length===0){
                console.log(results.msg||"返回数据异常");
            }else {
                for (R in result) {
                    let published = result[R].published;
                    let notPub = result[R].notPub;
                    if(result[R].list){
                        let pathList = result[R].list;
                        let newList = [];
                        // 下面只显示6条数据，不足6条显示为空，多6条去掉后面的
                        for (let j = 0; j < 6; j++) {
                            if (pathList[j]) {
                                let newStatus = null;
                                if(pathList[j].status==="审核通过"){
                                    newStatus = 2; //通过
                                }else if(pathList[j].status==="审核退回"){
                                    newStatus = 0; //退回
                                }else if(pathList[j].status==="推送中"||pathList[j].status==="推送完成"||pathList[j].status==="推送失败"){
                                    newStatus = 3; //已推送
                                }else {
                                    newStatus = 1; //待审
                                }
                                newList.push({
                                    title:pathList[j].title,
                                    name:pathList[j].name,
                                    time:pathList[j].time,
                                    status:newStatus
                                });
                            } else {
                                newList.push("");
                            }
                        }
                        //添加数据到detailsData
                        detailsData.push(
                            {
                                published:published,
                                notPub:notPub,
                                list:newList
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
                                published:published,
                                notPub:notPub,
                                list:newList
                            }
                        );
                    }

                    console.log(detailsData);
                }
                //更新数据模型
                this.$set(this, 'dataArr',detailsData);
                if(!timer) {
                    action(PLAY, 3);
                }
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
            REQUEST = parseInt(result.reqtime)*1000||36000;
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
        $("body").css("background-image","url('../static/imgs/mediaTask/bg"+RADIO_BG+".png')");
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

    getSettings(MediaTask);

    // action(PLAY,3);

});

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