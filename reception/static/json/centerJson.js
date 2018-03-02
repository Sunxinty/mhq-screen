//此乃生产力统计页面的假数据
var Json = {
    //近期重点
    newsList:[
      {"id":"01","title":"人类从洞穴岩画开始"},
      {"id":"02","title":"长江大学事件"},
      {"id":"03","title":"阿富汗人将有自己的总统"},
      {"id":"04","title":"金融危机与减贫"},
      {"id":"05","title":"首艘国产航母下水"}
    ],
    //资源
    zy:{
        shang:"文稿使用率 "+"67%",
        zuo:"转播车使用率 "+"58%",
        xia:"审片使用率 "+"35%",
        you:"非编使用率 "+"56%",
        value: [67, 58, 35, 56]
    },
    //成片比
    cpb:{
        total:"68",
        personal:{
            one:{count:"70%",src:"../static/imgs/center/xjp.jpg"},
            two:{count:"40%",src:"../static/imgs/center/mzd.jpg"},
            three:{count:"50%",src:"../static/imgs/center/zzy.jpg"},
            four:{count:"30%",src:"../static/imgs/center/hyb.jpg"},
            five:{count:"36%",src:"../static/imgs/center/hjt.jpg"}
        }
    },
    //全天收视率排名
    ssl:{
        jrpm:{
            paiming:"12",
            shangsheng:"2"
        },
        lms:[
            {name:"财经新闻",ssl:"4.876%"},
            {name:"早间新闻",ssl:"4.6%"},
            {name:"晚间新闻",ssl:"4.276%"},
            {name:"科学世界",ssl:"4.16%"},
            {name:"经济与法",ssl:"4.07%"}
        ]
    },
    //台内生产力
    scl:{
        article:{name:"文章",scl:138},
        images :{name:"图片",scl:120},
        audio:{name:"音频",scl:83},
        video:{name:"视频",scl:99}
    },
    //全渠道粉丝总数
    count1:{
        title:"全渠道粉丝总数",
        num:"65632184"
    },
    //月均阅读量
    count2:{
        title:"月均阅读量（APP、微信、微博）：",
        num:"34789201"
    },
    //新媒影响力
    chartData:[
        {name: '东城区', value: 279},
        {name: '西城区', value: 222},
        {name: '朝阳区', value: 201},
        {name: '丰台区', value: 133},
        {name: '石景山区', value: 145},
        {name: '海淀区', value: 216},
        {name: '门头沟区', value: 133},
        {name: '房山区', value: 121},
        {name: '通州区', value: 116},
        {name: '昌平区', value: 163},
        {name: '顺义区', value: 187},
        {name: '大兴区', value: 139},
        {name: '怀柔区', value: 138},
        {name: '平谷区', value: 143},
        {name: '密云县', value: 110},
        {name: '延庆县', value: 111}
    ]
};