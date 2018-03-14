
    //真实数据
    let detailsData =[];
    //刷新数据的定时器
    let refresh;
    //动画播放间隔的定时器
    let timer;
    //总共的按钮数量
    let btnNum;
    //定时请求间隔时间(ms)
    let REQUEST;
	
    //初始化 Top对象
    let Top = new Vue({
        el:"#top",
        data:{
            title:"内容库展示"
        }
    });

    //初始化 BtnList对象
    let BtnList = new Vue({
        el:"#btnList",
        data:{
            btn:[
                {name:"收录素材"},
                {name:"上传素材"},
                {name:"手机回传"}
            ]
        }
    });

    //初始化 DataContainer对象
    let DataContainer = new Vue({
        el:"#dataContainer",
        data:{
            apiUrl:HTTP.url+"rest/uploadPgc",
            startDate:"2017-07-01",
            endDate:"2027-07-31",
            countsName:"回传总数",
            paramsArr:[],
            // details:[
            //     Json.pgc,
            //     Json.vtube,
            //     Json.pc
            // ]
            details:[
                {},
                {},
                {}
            ]
        },
        methods: {
            showBtns: function(arr){
                Vue.set(BtnList,"btn",arr);
                for(let i=0;i<arr.length;i++){
                    this.paramsArr.push(arr[i].type)
                }
                this.getData();
            },
            getData: function() {
                var arr = this.paramsArr;
                for(let i=0;i<arr.length;i++){
                    //请求数据
                    this.$http.post(this.apiUrl,JSON.stringify({
                        "startDate": this.startDate+" 00:00:00",
                            "page": "1",
                            "endDate": this.endDate+" 23:59:59",
                            "type": arr[i],
                            "size": "15"
                    }))
                        .then(function(response){
                            console.log("请求成功：",response.data);
                            //格式化返回的数据
                            formatData(response.data,i);
                        })
                        .catch(function(response) {
                            console.log("请求错误：",response)
                        });
                }
            }
        }
    });

    //时间日期
    let Timechoose = new Vue({
        el:"#time_choose",
        data:{
            startDate:getOneWeekBefore(),
            endDate:getDate()  //获取当前日期
        },
        methods: {
            chooseTime: function() {
                clearInterval(refresh);
                Vue.set(DataContainer,'startDate', this.$refs.newStart.value);
                Vue.set(DataContainer,'endDate', this.$refs.newEnd.value);
                DataContainer.getData();
                refresh = setInterval(function(){
                    DataContainer.getData();
                },REQUEST);
            }
        }
    });

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

    //动画开始
    animotion(0,270);
    action(6000);

    //获取后台管理页面的设置信息
    getSettings(DataContainer,Top);

});

//请求管理设置数据
function getSettings(DataContainer,Top) {
    Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_DATACONTAINER")
        .then(function(response){
            let result = response.body.data;
            REQUEST = parseInt(result.reqtime)*1000||72000;
            const PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"内容库展示";
            const RADIO_BG = parseInt(result.imgtype)||1;
            const BG_URL = result.backgroundurl;
            const EXTEND = JSON.parse(result.extend)||[];

            DataContainer.showBtns(EXTEND);
            btnNum = EXTEND.length;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            refresh = setInterval(function(){
                DataContainer.getData();
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
                $("body").css("background-image","url("+BG_URL+")");
            }else{
                $("body").css("background-image","url('../static/imgs/dataContainer/bg"+RADIO_BG+".png')");
            }

        })
        .catch(function(response) {
            console.log(response);
        })
}

//页面动画
function action(ms){
    if(!btnNum){
        btnNum=3;
    }
    let move = 215;
    let i = 0;
    let max = btnNum-1;
    let moveMax = 215+(max*130);
    animotion(i,move);
    timer = setInterval(function(){
        if(move===moveMax){
            move = 215;
        }else{
            move += 130;
        }
        if(i===max){
            i = 0;
        }else{
            i += 1;
        }
        animotion(i,move);
    },ms);
}
//动画效果
function animotion(i,move){
    $("#btnSelected").css("top",move+"px");
    $(".btn").css("color","#02BBE7");
    $(".btn").eq(i).css("color","#ffffff");
    $(".detailsContainer").removeClass("show");
    $(".detailsContainer").eq(i).addClass("show");
}

//数据格式化
function formatData(results,index) {
    //服务器返回数据
    let result = results.data.result;
    let total = results.data.total;
    if(results.data===''||result.length===0||result===''){
        console.log(results.msg||"返回数据异常",detailsData);
		detailsData[index] = {};
        detailsData[index].counts = 0;
		// if(index===0){
		// 	detailsData[index]=Json.pgc;
		// }else if(index===1){
		// 	detailsData[index]=Json.vtube;
		// }else if(index===2){
		// 	detailsData[index]=Json.pc;
		// }
    }else {
        detailsData[index] = {};
        detailsData[index].details = [];
        detailsData[index].counts = total;
        for (let i = 0; i < result.length; i++) {
            //添加数据到detailsData
            detailsData[index].details.push(
                {
                    name: result[i].createUser,
                    title: result[i].name,
                    picUrl: result[i].pathList[0]
                }
            );
        }
    }
	updataDetails();
}

let a=0;
//数据请求并格式化完成后更新页面
function updataDetails() {
	a++;
	if(a===btnNum){
		//更新数据模型
		Vue.set(DataContainer,'details', detailsData);
		a=0;
        detailsData =[];
	}
}

//显示时间
function getTime() {
    let D = new Date();
    let h = D.getHours();
    let m = D.getMinutes();
    let hours = h<10?"0"+h:h;
    let minutes = m<10?"0"+m:m;
    return hours+":"+minutes+":00";
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