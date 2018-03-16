
//动画播放间隔的定时器
let timer;
let PLAY = 3000;
//选择栏目的下拉菜单
let dk;

//初始化 Top对象
let Top = new Vue({
    el:"#top",
    data:{
        title:"串联单"
    }
});

let TVlist = new Vue({
    el:"#container",
    data:{
        chooseTime:getDate(),
        programs:[{'name':"当日无数据",'uid':"0"}],
        selectedProgram:'0',
        selectedProgramName:'',
        thead:{
            td1:"序号",
            td2:"预计播出",
            td3:"新闻标题",
            td4:"栏目名",
            td5:"作者",
            td6:"文稿状态",
            td7:"节目进程"
        },
        docProcessArr:[
            {uid:1,name:"文稿编辑"},
            {uid:2,name:"文稿审核"}
        ],
        processArr:[
            {uid:1,name:"节目编辑"},
            {uid:2,name:"节目合成"},
            {uid:3,name:"节目审片"},
            {uid:4,name:"节目送播"}
        ],
        list:Json.tabData,
        ImgsUrls:[]
    },
    methods: {
        getPrograms: function(){
            this.$http.get(HTTP.url+'rest/search/serielist?'+
                'cloumid=&'+
                'startTime='+this.chooseTime+'%2000:00:00&endTime='+this.chooseTime+'%2023:59:59'+"&type=mch")
                .then(function(response){
                    console.log("请求成功：",response.data);
                    formatProgramsData(response.data);
                })
                .catch(function(response) {
                    console.log("请求错误：",response);
                });
        },
        getList: function() {
            //请求串联单数据
            this.$http.get(HTTP.url+'rest/searchId?doctype=false&'+
                'id='+this.selectedProgram+"&type=mch")
                .then(function(response){
                    console.log("请求成功：",response.data);
                    foolishPager(response.data);
                })
                .catch(function(response) {
                    console.log("请求错误：",response)
                });
        },
        getImgsUrls: function() {
            let arr = this.list;
            let imgsUrls =[];
            if(arr.length===0){
                imgsUrls.push('');
            }else{
                for(let i=0;i<arr.length;i++){
                    imgsUrls.push(arr[i].img);
                }
            }
            this.$set(this,'ImgsUrls', imgsUrls);
        },
        getNewPrograms: function(){
            this.$set(this,'chooseTime', this.$refs.newTime.value);
            this.getPrograms();
        },
        getNewList: function(){
            this.$set(this,'selectedProgram', this.$refs.newProgram.value);
            this.getList();
        }
    }
});
TVlist.getPrograms();

//格式化返回的数据,栏目列表
function formatProgramsData(msg){
    let programs = [];
    let arr = msg.data;
    if(arr.length===0){
        programs.push({'name':"当日无数据",'uid':"0"});
        // programs.push({'name':"sobey新闻",'uid':"0"}); //展会时接口未返回数据要展示假数据
    }else{
        for (let i = 0; i < arr.length; i++) {
            programs.push({
                'name': arr[i].columnName,
                'uid': arr[i].id
            })
        }
    }

    Vue.set(TVlist,"programs",programs);
    Vue.set(TVlist,"selectedProgram",programs[0].uid);
    Vue.set(TVlist,"selectedProgramName",programs[0].name);

    // 更新下拉菜单的栏目
    setTimeout(function(){
        dk.refresh();
    },50);

    TVlist.getList();

}

//分页
let list;
let START;
let WAITLENGTH;
function foolishPager(msg){
    if(timer){
        clearInterval(timer);
    }
    list = [];
    let nowList = [];
    if(!msg||!msg.list||!msg.list.parentList||msg.list.parentList.length===0){
        console.log("当前条件下没有找到串联单");
    }else{
        let arr = msg.list.parentList;  //串联单数据
        let allLength = arr.length;     //串联单总长度
        let len = allLength<6?allLength:6;  //串联单第一页条数
        let waitLength = allLength-len;       //剩余未显示的串联单条数
        START=len;
        WAITLENGTH=waitLength;
        for(let i = 0;i<allLength;i++){
            list.push(formatListData(arr[i],i));  //所有数据放进list中
        }
        for(let j = 0;j<len;j++){
            nowList.push(list[j]);        //把当前页面要显示的数据放进nowList中
        }
        setTimeout(function(){
            page(START,WAITLENGTH)
        },PLAY*len);

        action(PLAY,len);
    }
    Vue.set(TVlist,"list",nowList);
    setTimeout(function(){
        Vue.set(TVlist,'selectedProgramName', $(".dk-selected").text());
    },50);
    // TVlist.getImgsUrls();
}
function page(start,waitLength){
    START=start;
    WAITLENGTH=waitLength;
    if(WAITLENGTH>0){
        if(timer){
            clearInterval(timer);
        }
        let NOWLIST = [];
        let LEN = WAITLENGTH<6?WAITLENGTH:6;
        for(let j = START;j<LEN+START;j++){
            NOWLIST.push(list[j]);        //把当前页面要显示的数据放进nowList中
        }
        Vue.set(TVlist,"list",NOWLIST);
        // TVlist.getImgsUrls();
        START += LEN;
        WAITLENGTH -= LEN;
        action(PLAY,LEN);
        setTimeout(function(){
            page(START,WAITLENGTH)
        },PLAY*LEN);
    }else{
        page(WAITLENGTH,START);
    }
}

//格式化返回的数据,串联单
function formatListData(msg,index){
    let id = index+1;
    let p = msg.doc.programedit;
    let f = msg.doc.flowStatus;
    let process = 0;
    let docProcess = 0;
    if(p===0||p===-1||p===2||p===3||p===4){
        process = 1;
    }else if(p===4||p===5||p===6){
        process = 2;
    }else if(p===7||p===8){
        process = 3;
    }else if(p===9){
        process = 4;
    }
    if(f===1||f===-1){
        docProcess = 1;
    }else if(f===3||f===4||f===5||f===6||f===0) {
        docProcess = 2;
    }
    let oneList = {
        td1:id<10?"0"+id:""+id,
        td2:getTime(msg.doc.showdate),
        td3:msg.doc.title,
        td5:msg.doc.author==""?msg.doc.createdBy:msg.doc.author,
        img:" ",
        docProcess:docProcess,
        process: process
    };
    return oneList;
}


//请求管理设置数据
function getSettings(Top) {
    Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_TASK")
        .then(function(response){
            let result = response.body.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            PLAY = parseInt(result.carouseltime)*1000||3000;
            const TITLE = result.title||"串联单任务监看";
            const RADIO_BG = parseInt(result.imgtype)||1;
            const BG_URL = result.backgroundurl;
            //重置页面动画间隔
            if(timer){
                clearInterval(timer);
            }
            action(PLAY,6);
            //重置标题
            Vue.set(Top,'title', TITLE);
            $(".top_title").html(TITLE); //一个十分诡异的事件,临时解决一下
            
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
        $("body").css("background-image","url('../static/imgs/task/bg"+RADIO_BG+".png')");
    }
}

//页面动画
function action(ms,howMany){
	console.log(howMany);
    if(!ms){
        ms=3000;
    }
    if(!howMany){
        howMany = 6;
    }
    const STEP = 130;
    const START = 202;
    const END = STEP*howMany-STEP+START;
    const MAX = howMany-1;

    let move = START;
    let i = 0;
    animotion(i,move);
    timer = setInterval(function(){
        if(move===END){
            move = START;
        }else{
            move += STEP;
        }
        if(i===MAX){
            i = 0;
        }else{
            i += 1;
        }
        animotion(i,move);
    },ms);
}
//动画效果
function animotion(i,move){
    $("#selected").css("animation-duration",PLAY/1000+"s");
    $("#selected").css("top",move+"px");
    $(".tr").removeClass("selected");
    $(".tr").eq(i).addClass("selected");
    $(".selectedImg").removeClass("show");
    $(".selectedImg").eq(i).addClass("show");
}

//显示时间
function getTime(ms) {
    let D = new Date(ms);
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


$(function(){
    //选择日期时间
    $("#pickdate").dateDropper({
        animate: true,
        format: 'Y-m-d',
        maxYear: '2020'
    });
    dk = new Dropkick("#lanmu_choose",{change: function () {
        TVlist.getNewList();
    }});

    //获取后台管理页面的设置信息
    getSettings(Top);

});