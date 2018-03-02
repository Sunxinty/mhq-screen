
var configProjectName = 'mhq-datashow';
var refreshTimeBtn = 100000;// 刷新记者定位信息的间隔时间ms
window.config = {
	IpAddress: "http://172.16.145.51:8088", //大屏接口IP
    apiAddress:"http://172.16.145.51:8018", // 调用app的接口Ip
    projectTppRestName:"/"+configProjectName+'/rest/',
    sitecode: 'test', //sitecode
    private_token:'259c556d498145973e0139bbbb918d58',//私钥
    imagePath:'/thumbpic',//预览图片路径,注意斜杠
    refreshTime: 1,//发布监看.采访任务.串联单制作页面刷新时间(分钟)
    //地图
    GPS:{
        baiduMapKey:'8L8x2gmt38bDCMFWPyyezvUS',//开发者密钥
        province:'四川省',
        centerCity:'成都',//中心城市，为空则根据IP定位,
        longitude:104.0446869401,	//初始化地图城市 经度
        latitude:30.6018348317,//初始化地图城市 纬度
        level:13,//地图级别
        directUrl:{//记者定位转发接口 
            key:'reporter'
        },
        queryNews:'',//定位选题接口
        maxCount:100,//最大查询数2
        refreshTime: 1,//刷新时间，单位分钟
    }
};

//gis地图url可跟参数说明

//     color:'blue',    //背景颜色修改 目前就该值
//     refreshTime:1,   //设置地图自动刷新时间 单位为分钟
//     sideTop              //边栏上边距 （值为整数）


//设置地图中心以及缩放级别
//     mapSet           //开启地图设置（为true时以下值生效）
//     map_lng          //设置经度
//     map_lat          //设置纬度
//     map_level           //设置地图缩放级别
//     map_province           //设置地图省份(必须为中文,用来绘制省份边框)
//     map_city           //设置地图城市(必须为中文)



//     以下值均为0/1 0不存在1存在

//     taskSym				//地图上的任务旗帜图标
//     reporterSym			//地图上的记者图标
//     reporterLine		    //地图上的记者图标之间是否连线
//     searchModule		    //搜索模块
//     drawMouse			//地图绘制模块
//     ifStationSym		    //是否在地图中心绘制台标
//     live				    //直播模块
//    leftMenu:0,             //左侧边栏
//    rightMenu:0,         //右侧边栏//
// smallMap			    //小地图模块  要显示则必须设置值为1 否则隐藏//
//     voiceCall			//语音通话视频通话模块 要显示则必须设置为1



