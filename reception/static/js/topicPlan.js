
//刷新数据的定时器
let refresh;
//动画播放间隔的定时器
let timer;
//动画间隔
let play;

var Topic = new Vue({
	el:"#container",
	data:{
        title:"选题策划",
		taskList:[],
		params:{
		  "isdesc":true,
		  "page":1,
		  "size":6,
		  "starttime":"2017-01-01 00:00:00",
		  "endtime":getToday("23:59:59"),
		  "status":[0,2,-1,3]
		}
	},
	mounted:function(){
		var _this = this;
		_this.getData();
		// 每十分钟更新数据
        refresh = setInterval(function(){
			_this.getData();
		},600000);
	},
	methods:{
		getData:function(){
			var _this = this;
			_this.$http.post(HTTP.url + "rest/search/topice",_this.params)
            .then(function(res){
				var dataList = res.body.data.result;
				if(dataList&&dataList.length>0){
                    _this.taskList.length = 0;
					for(var i=0;i<dataList.length;i++){
						var task = {};
						task.id = dataList[i].contentId_;//ID
						task.title = dataList[i].title||"";//标题
						task.name = dataList[i].createUserName||"";//创建人
						task.time = dataList[i].createDate||"";//创建时间
						task.content = dataList[i].content||"无内容";//内容
						task.content = task.content.replace(/<.*?>/ig,"").replace(/&nbsp;/ig," ");

						task.type = {
							type1:dataList[i].examinestatus,////0:通过，1:编辑， 2:待审，-1:退回, 3:已指派
							type2:dataList[i].interview,//是否采访
							type3:dataList[i].info,//文稿
							type4:dataList[i].internation,//互联网
							type5:dataList[i].assignstate//是否指派
						}
                        _this.taskList.push(task)
					}
				}
			})
            .catch(function(response) {
                console.log("请求错误：",response)
            });
		}
	}

});

//页面动画
function action(ms){
    let move = 40;
    let i = 0;
    animotion(i,move);
    timer = setInterval(function(){
        i = (i+1)%6;
        move = i*130+40;
        animotion(i,move);
    },ms);
}
//动画效果
function animotion(i,move){
    $(".selectedBG").css("top",move+"px");
    $(".view").removeClass("selected");
    $(".view").eq(i).addClass("selected");
    let $firstDom = $(".show>.details").eq(0);
    $(".show>.details").eq(0).remove();
    $(".show>.details").parent().append($firstDom);
}

function getToday(time){
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    if(m<10){m = "0"+m}
    if(d<10){d = "0"+d}
    return y+"-"+m+"-"+d+" "+time;
}

//请求管理设置数据
function getSettings(Topic) {
    Vue.http.get(HTTP.url+"allocation/search/SOBEY_MHQ_TOPICPLAN")
        .then(function(response){
            let result = response.body.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"选题策划";
            const RADIO_BG = parseInt(result.imgtype)||0;
            const BG_URL = result.backgroundurl;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            refresh = setInterval(function(){
                Topic.getData();
            },REQUEST);
            //重置页面动画间隔
            if(timer){
                clearInterval(timer);
            }
            action(PLAY,6);
            //重置标题
            Vue.set(Topic,'title', TITLE);

            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url("+BG_URL+")");
            }else if(RADIO_BG===1){
                $("body").css("background-image","url('../static/imgs/topicPlan/bg1.png')");
            }else if(RADIO_BG===2){
                $("body").css("background-image","url('../static/imgs/topicPlan/bg2.png')");
            }

        })
        .catch(function(response) {
            console.log(response)
        })
}

$(function(){

    getSettings(Topic);

    //打开页面有个发牌的动画,完了要赶紧清除，不然血崩
    setTimeout(function(){
        $(".show").removeClass("onceshow");
    },3000);
});