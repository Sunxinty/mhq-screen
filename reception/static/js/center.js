//显示时间
function getTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var hours = h<10?"0"+h:h;
    var minutes = m<10?"0"+m:m;
    return hours+":"+minutes;
}
//初始化Top对象
var Top = new Vue({
    el:"#top",
    data:{
        title:"中央厨房调度监控中心",
        apiUrl:"http://wthrcdn.etouch.cn/weather_mini?citykey=101010100",//天气API
        weather:"20°C",
        time:getTime()   //获取当前时间
    },
    methods: {
        getWeather: function() {
            this.$http.jsonp(this.apiUrl)
                .then(function(response){
                    this.$set(this,'weather', response.data.data.wendu+"°C")
                })
                .catch(function(response) {
                    console.log(response)
                })
        }
    }
});
//请求天气数据
Top.getWeather();
//每个小时刷新一次天气状态
setInterval(function(){
    Top.getWeather();
},3600000);
//每分钟刷新一次时间
setInterval(function(){
    Vue.set(Top,'time',getTime());
},60000);


//初始化Left对象(近期重点和资源)
var Left = new Vue({
   el:"#left",
   data:{
       news:Json.newsList,
       zy:Json.zy
   }
});

//初始化 Cpb对象(成片比)
var Cpb = new Vue({
    el:"#cpb",
    data:{
        total:Json.cpb.total,
        personal:Json.cpb.personal,
    }
});
//初始化 Jrsslpm对象(今日收视率排名)
var Jrsslpm = new Vue({
    el:"#jrsslpm",
    data:{
        jrpm:Json.ssl.jrpm,
        lms:Json.ssl.lms
    }
});

//初始化Scl对象(台内生产力)
var Scl = new Vue({
    el:"#scl",
    data:{
        total:"0",
        article:Json.scl.article,
        images :Json.scl.images,
        audio:Json.scl.audio,
        video:Json.scl.video
    },
    methods: {
        addCount: function() {
            var total = this.article.scl +
                this.images.scl +
                this.audio.scl +
                this.video.scl;
            this.$set(this,'total',total);
        }
    }
});
Scl.addCount();

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

//初始化 Count1对象(全渠道粉丝总数)
var Count1 = new Vue({
    el:"#count1",
    data:{
        title:Json.count1.title,
        num:formatterCount(Json.count1.num)
    }
});
//初始化 Count2对象(月均阅读量)
var Count2 = new Vue({
    el:"#count2",
    data:{
        title:Json.count2.title,
        num:formatterCount(Json.count2.num)
    }
});

// 初始化北京地图
var myChart = echarts.init(document.getElementById('beijing'));
var data = Json.chartData;
var geoCoordMap = {
    '东城区':[116.42,39.93],
    '西城区':[116.37,39.90],
    '朝阳区':[116.53,39.91],
    '丰台区':[116.28,39.85],
    '石景山区':[116.20,39.92],
    '海淀区':[116.26,39.97],
    '门头沟区':[115.8,40.03],
    '房山区':[115.83,39.71],
    '通州区':[116.66,39.80],
    '昌平区':[116.23,40.22],
    '顺义区':[116.65,40.13],
    '大兴区':[116.33,39.70],
    '怀柔区':[116.63,40.32],
    '平谷区':[117.12,40.13],
    '密云县':[116.85,40.41],
    '延庆县':[115.97,40.45]
};
var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};
function minVisualMap(chartData) {
    let len = chartData.length;
    let min = chartData[0].value;
    for (let i = 0; i < len; i++) {
        let newMin = chartData[i].value;
        if(min>newMin){
            min = newMin;
        }
    }
    return min;
}
function maxVisualMap(chartData) {
    let len = chartData.length;
    let max = chartData[0].value;
    for (let i = 0; i < len; i++) {
        let newMax = chartData[i].value;
        if(max<newMax){
            max = newMax;
        }
    }
    return max;
}

var option = {
    title: {
        text: '新媒影响力',
        left:'30%',
        bottom:60,
        textStyle: {
            color: '#fff',
            fontSize:32
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: function (pramas) {
            let toolTip = '<div id="tooltip">' +
                '<h3>'+pramas.name+'</h3>'+
                '<p>'+pramas.value[2]+'</p>'+
                '</div>';
            return toolTip;
        }
    },
    visualMap: {
        min: minVisualMap(Json.chartData),
        max: maxVisualMap(Json.chartData),
        calculable: false,//允许拖动
        inRange: {
            color: ['#53FA08', '#03F1AF', '#03E3FF']
        },
        orient:'horizontal',
        left:'30%',
        bottom:20,
        text:['高','低'],
        textStyle: {
            color: '#fff',
            fontSize:20
        }
    },
    geo: {
        map: '北京',
        center:[116.42,40.09],
        label: {
            normal: {
                show:false,
                textStyle:{
                    color: '#fff',
                    fontSize:16
                }
            },
            emphasis: {
                show: false,
                textStyle:{
                    color: '#fff',
                    fontSize:16
                }
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: 'rgba(50,60,72,0.1)',
                borderColor: '#E3E5E6',
                borderWidth:2,
                shadowColor: 'rgba(29,56,79, 0.5)',
                shadowBlur: 20,
                shadowOffsetY:5,
                opacity:1
            },
            emphasis: {
                areaColor: 'rgba(50,60,72,0.3)'
            }
        }
    },
    series : [
        {
            name: '新媒体影响力',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function (val) {
                return val[2] / 10;
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true,
                    textStyle:{
                        color: '#fff',
                        fontSize:16
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
            }
        },
        {
            name: '影响力Top 3',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data.sort(function (a, b) {
                return b.value - a.value;
            }).slice(0, 3)),
            symbolSize: function (val) {
                return val[2] / 10;
            },
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
                    color: '#00e0be',
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }
    ]
};
myChart.setOption(option);

// 初始化资源使用率雷达图
var zyChart = echarts.init(document.getElementById('radar'));
var zyOption = {
    radar: [
        {
            indicator: [
                { text: '文稿使用率' },
                { text: '转播车使用率' },
                { text: '审片使用率' },
                { text: '非编使用率' }
            ],
            center: ['50%', '50%'],
            radius: '96%',
            startAngle: 90,
            splitNumber: 5,
            scale:true,
            shape: 'circle',
            name: {
                show:false
            },
            splitArea: {
                show:true,
                areaStyle: {
                    color: ['rgba(48,238,249, 0)',
                        'rgba(48,238,249, 0)',
                        'rgba(48,238,249, 0)',
                        'rgba(48,238,249, 0.1)',
                        'rgba(48,238,249, 0.2)',
                    ]
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(48,238,249, 0.5)',
                    width:1
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(48,238,249,0.8)',
                    shadowColor: 'rgba(48,238,249,1)',
                    shadowBlur: 20,
                    width:3
                }
            }
        }
    ],
    series: [
        {
            name: '雷达图',
            type: 'radar',
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1
                    }
                }
            },
            data: [
                {
                    value: Json.zy.value,
                    name: '资源使用率',
                    symbol: 'image://../static/imgs/center/zycf-zy-gq.png',
                    symbolSize: 24,
                    lineStyle: {
                        normal: {
                            color:'#0d1244',
                            type: 'solid'
                        }
                    },
                    itemStyle:{
                        normal:{
                            color:'#0d1244'
                        }
                    },
                    areaStyle:{
                        normal:{
                            color:'rgba(106,46,177,1)'
                        },
                        emphasis:{
                            color:'rgba(46,12,118,1)'
                        }
                    }
                }
            ]
        }

    ]
};
zyChart.setOption(zyOption);

//请求管理设置数据
function getSettings() {
    Vue.http.get(HTTP.url+"/allocation/search/center")
        .then(function(response){
            let result = response.data;
            const REQUEST = parseInt(result.requstTime)*1000||600000;
            const PLAY = parseInt(result.refreshTime)*1000||8000;
            const TITLE = result.title||"生产力统计";
            const RADIO_BG = parseInt(result.img_type)||0;
            const BG_URL = result.img_url;
            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url('../static/imgs/center/bg.jpg')");
            }else if(RADIO_BG===1){
                $("body").css("background-image","url("+BG_URL+")");
            }

        })
        .catch(function(response) {
            console.log(response)
        })
}
getSettings();