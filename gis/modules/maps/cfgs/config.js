/*
* GIS相关配置
*/
var configProjectName = 'mhq-datashow';// 项目包名
var refreshTimeBtn = 100;// 刷新记者定位信息的间隔时间（单位:秒s）
window.config = {
	IpAddress: "http://172.16.145.51:8088", //大屏接口IP(记者，任务)
    apiAddress:"http://172.16.145.51:8018", // 调用app的接口Ip（直播组相关）
    projectTppRestName:"/"+configProjectName+'/rest/',
    sitecode: 'test', //sitecode
    private_token:'259c556d498145973e0139bbbb918d58',//私钥
    imagePath:'/thumbpic',//预览图片路径,注意斜杠
    refreshTime: 1,//发布监看.采访任务.串联单制作页面刷新时间(分钟)
    //地图
    GPS:{
        baiduMapKey:'8L8x2gmt38bDCMFWPyyezvUS',//地图开发者密钥
        province:'四川省',
        centerCity:'成都',//中心城市，为空则根据IP定位,
        longitude:104.0446869401,	//初始化地图城市 经度
        latitude:30.6018348317,//初始化地图城市 纬度
        level:13,//地图级别
        directUrl:{//记者定位转发接口
            key:'reporter'
        },
        queryNews:'',//定位选题接口
        maxCount:100,//最大查询数
        refreshTime: 1,//刷新时间，单位分钟
    }
};