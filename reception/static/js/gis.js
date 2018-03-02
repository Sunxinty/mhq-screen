$(function(){
    //刷新数据的定时器
    let refresh;

    //初始化 Top对象
    let Top = new Vue({
        el:"#top",
        data:{
            title:"实时热点"
        }
    });

    //初始化 NewsList对象
    let NewsList = new Vue({
        el:"#news_list",
        data:{
            list:Json.list
        }
    });

    // 初始化中国地图
    let myChart = echarts.init(document.getElementById('china'));
    let myChartData = [
        {loc: '四川',value:123,title:'高考志愿'}
    ];
    let geoCoordMap = {
        '西藏':[91.11,29.97],
        '上海':[121.48,31.22],
        '福建':[119.3,26.08],
        '广西':[108.33,22.84],
        '广东':[113.23,23.16],
        '山西':[112.53,37.87],
        '云南':[102.73,25.04],
        '海南':[110.35,20.02],
        '辽宁':[123.38,41.8],
        '吉林':[125.35,43.88],
        '宁夏':[106.27,38.47],
        '江西':[115.89,28.68],
        '青海':[101.74,36.56],
        '内蒙古':[111.65,40.82],
        '四川':[104.06,30.67],
        '陕西':[108.95,34.27],
        '重庆':[106.54,29.59],
        '江苏':[118.78,32.04],
        '贵州':[106.71,26.57],
        '北京':[116.46,39.92],
        '新疆':[87.68,43.77],
        '浙江':[120.19,30.26],
        '山东':[117,36.65],
        '甘肃':[103.73,36.03],
        '天津':[117.2,39.13],
        '河南':[113.65,34.76],
        '黑龙江':[126.63,45.75],
        '河北':[114.48,38.03],
        '湖南':[113,28.21],
        '安徽':[117.27,31.86],
        '湖北':[114.31,30.52],
		'台湾':[121.50,25.05],
		'香港':[114.10,22.20],
		'澳门':[113.33,22.13]
    };
    let convertData = function (data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
            let geoCoord = geoCoordMap[data[i].loc];
            if (geoCoord) {
                res.push({
                    name: data[i].loc,
                    value: geoCoord.concat(data[i].value,data[i].title)
                });
            }
        }
        return res;
    };
    let option = {
        tooltip : {
            trigger: 'item',
            triggerOn:'none',
            alwaysShowContent:true,
            backgroundColor:'rgba(0,0,0,0)',
            formatter: function (pramas) {
                let toolTip = '<div id="tooltip">' +
                                '<h3 class="tool_title">'+' '+'</h3>'+
                                '<p>'+
                                    '<span>'+'地点: '+pramas.name+'</span>'+
                                    '<span>'+'文章数: '+pramas.value[2]+'</span>'+
                                '</p>'+
                              '</div>';
                return toolTip;
            }
        },
        geo: {
            map: 'china',
            label: {
                normal: {
                    show:false,
                    textStyle:{
                        color: '#fff',
                        fontSize:24
                    }
                },
                emphasis: {
                    show: false,
                    textStyle:{
                        color: '#fff',
                        fontSize:24
                    }
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: 'rgba(26,77,210,0.7)',
                    borderColor: '#7EF5CA',
                    borderWidth:2,
                    shadowColor: 'rgba(0,0,0, 0.5)',
                    shadowBlur: 10,
                    shadowOffsetY:5,
                    opacity:1
                },
                emphasis: {
                    areaColor: 'rgba(26,77,210,0.7)'
                }
            }
        },
        series : [
            {
                name: '坐标',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertData(myChartData),
                symbol:'image://../static/imgs/gis/marker.png',
                symbolSize:[120,80],
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'inside',
                        show: false,
                        textStyle:{
                            color: '#fff',
                            fontSize:13
                        }
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#00e0be'
                    }
                },
                zlevel: 2
            },
            {
                name: '热点',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(myChartData),
                symbolSize: 12,
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#b4ee44',
                        shadowBlur: 5,
                        shadowColor: '#333'
                    }
                },
                zlevel: 1
            }
        ]
    };
    myChart.setOption(option);
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex:0
    });

    //实时热点新闻列表
    let detailsData = Json.list;

    //根据返回的新数据更新页面
    function addNewData(newDataString) {
        //服务器返回数据
        let newData = newDataString.data;
        if(newData.length===0||newData===''){
            console.log(newData.msg||"返回数据异常");
        }else {
            detailsData=[];
            // 最多只显示8条数据
            let len = newData.length < 8 ? newData.length : 8;
            for (let i = 0; i < len; i++) {
                detailsData.push(
                    {
                        title: newData[i].title,
                        time: newData[i].dt,
                        loc: newData[i].province,
                        eventCat: newData[i].eventCat,
                        num: newData[i].docCount
                    }
                );
            }
            Vue.set(NewsList, 'list', detailsData);
            updataChart(i);
        }
    }

    //更新echarts
    function updataChart(index){
        let newLocation = detailsData[index].loc;
        let newTitle = detailsData[index].eventCat;
        let newValue = detailsData[index].num;
        myChartData = [{loc: newLocation,value:newValue,title:newTitle}];
        option.series[0].data=convertData(myChartData);
        option.series[1].data=convertData(myChartData);
        myChart.setOption(option,true);
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex:0
        });
    }

    //请求数据
    function getData() {
        Vue.http.post(
            HTTP.url+"rest/hot/news",
            {"geoName":"","offset":"1","size":"8","fromDt":getTime('00'),"toDt":getTime('23')}
        )
            .then(function(response){
                addNewData(response.data);
            })
            .catch(function(response) {
                console.log(response)
            })

    }

    //选项卡
    toggleTab();

    //开始轮播
    updataChart(0);
    animotion(0,-12);
    let timer;
    let i;
    action(6000);

    //获取后台管理页面的设置信息
    getSettings(Top);

    //发送请求
    getData();

    refresh = setInterval(function(){
        getData();
    },36000);

    //请求管理设置数据
    function getSettings(Top) {
        Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_GIS")
            .then(function(response){
                let result = response.body.data;
                const REQUEST = parseInt(result.reqtime)*1000||36000;
                const PLAY = parseInt(result.carouseltime)*1000||6000;
                const TITLE = result.title||"实时热点";
                const RADIO_BG = parseInt(result.imgtype)||0;
                const BG_URL = result.backgroundurl;
                //定时发送请求刷新数据
                if(refresh){
                    clearInterval(refresh);
                }
                refresh = setInterval(function(){
                    getData();
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
                    $("body").css("background-image","url('../static/imgs/gis/bg.jpg')");
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
        if(!ms){
            ms=6000;
        }
        let move = -6;
        i =0;
        animotion(i,move);
        updataChart(0);
        timer = setInterval(function(){
            if(move===750){
                move = -6;
            }else{
                move += 108;
            }
            if(i===7){
                i = 0;
            }else{
                i += 1;
            }
            animotion(i,move);
            updataChart(i);
        },ms);
    }
    //动画效果
    function animotion(i,move){
        $(".selected").css("top",move+"px");
        $(".list").removeClass("active");
        $(".list").eq(i).addClass("active");
    }
    //选项卡切换
    function toggleTab(){
        $("#myTab li a").on('click',function(){
            setTimeout(function(){
                let a = $("#myTab li.active").index();
                if(a===1){
                    $("#huakuai").css("left",0+"px");
                }else if(a===2){
                    $("#huakuai").css("left",162+"px");
                }
            },100);
        });
    }
    //显示时间
    function getTime(hours) {
        var D = new Date();
        var y = D.getFullYear();
        var m = D.getMonth()+1;
        var d = D.getDate();
        var year = y.toString();
        var month = m<10?"0"+m:m;
        var day = d<10?"0"+d:d;
        return year+month+day+hours;
    }
});

