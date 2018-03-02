/*
*Name:BirTV-选题策划
*CreationTime:2017-07-28
*Author:sunxin
*/

function slideList(){
    var ul = $(".task-list ul");
    var li = ul.find("li");
    var length = li.length;
    var moveHeight = li.height()+52;
    var index = 0;

    // 任务大于6个
    if (length>6) {
        for(var i=0;i<6;i++){
            var clone = li.eq(i).clone();
            ul.append(clone);
        }

        li = ul.find("li");
        li.eq(0).addClass("active");
        length = li.length;

        setTimeout(function(){
            setInterval(function(){
                if(index<length-6){
                    index++;
                    li.eq(index-1).removeClass("active");
                    li.eq(index).addClass("active");
                    ul.animate({top:-moveHeight*index},1000,function(){
                        if (index==(length-6)) {
                            ul.css("top",0);
                            li.eq(index).removeClass("active");
                            li.eq(0).addClass("active");
                            index=0;
                        }
                    });
                    setTimeout(function(){
                        if(index==10){
                            toppicPanel.toppicData = taskList[0]
                        }
                        else{
                            toppicPanel.toppicData = taskList[index]
                        }
                    },1800)
                }
            },10000)
        },3000)
    }
    // 任务小于6个
    else{
        li.eq(0).addClass("active");
        setTimeout(function(){
            setInterval(function(){
                index++;
                li.eq(index-1).removeClass("active");
                li.eq(index).addClass("active");
                if (index==length) {
                    li.eq(index-1).removeClass("active");
                    li.eq(0).addClass("active");
                    index=0;
                }
            },10000)
        },3000)
    }

    setTimeout(function(){
        setInterval(function(){
            $(".toppic-panel,.bg-line").addClass("active");
            $(".gear-box").each(function(index,element){
                var pstr = $(element).attr("style");
                var pdeg = pstr.replace("transform: rotateY(","");
                pdeg = parseFloat(pdeg.replace("deg) translateZ(300px)",""));
                var deg = pdeg -24;
                if((deg+36)%360==0){
                    $(element).addClass("active");
                }else{
                    $(element).removeClass("active");
                }
                $(element).css({
                    "transform":"rotateY("+ deg +"deg) translateZ(300px)"
                });
            });
            setTimeout(function(){
                $(".toppic-panel,.bg-line").removeClass("active");
            },2000);
        },10000)
    },3000);
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

var taskListVue = new Vue({
	el:".task-list",
	data:{
		taskList:taskList,
		params:{
		  "isdesc":true,
		  "page":1,
		  "size":20,
		  "starttime":"2017-01-01 00:00:00",
		  "endtime":getToday("23:59:59"),
		  "status":[0,2,-1,3]
		}
	},
	mounted:function(){
		var _this = this;
		_this.getData();
		// 每十分钟更新数据
		setInterval(function(){
			_this.getData();
		},600000)
	},
	methods:{
		getData:function(){
			var _this = this;
			_this.$http.post(HTTP.url + "rest/search/topice",_this.params).then(function(res){
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
							type1:dataList[i].examinestatus,////0:通过，2:待审，-1:退回, 3:已指派
							type2:dataList[i].interview,//是否采访
							type3:dataList[i].info,//文稿
							type4:dataList[i].internation,//互联网
							type5:dataList[i].assignstate//是否指派
						}
                        _this.taskList.push(task)
					}
					toppicPanel.toppicData = _this.taskList[0]
                    slideList();
				}
			},function(err){
                slideList();
			})
		}
	}

});

var gearList = new Vue({
	el:".move-gear",
	data:{
		gearList:30
	}
})

var toppicPanel = new Vue({
	el:".toppic-panel",
	data:{
		toppicData:taskListVue.taskList[0]
	}
})

$(function(){
	// 获取标题和背景图
	$.ajax({
	    type: 'GET',
	    url: HTTP.url+"allocation/search/SOBEY_MHQ_TOPICPLAN",
	    dataType: "json",
	    success: function(res){
	    	if(res.data){
				var title = res.data.title==""?"选题策划":res.data.title;
				if(res.data.imgtype==0){
					var imgUrl = "../static/imgs/interviewTask/bg_new.jpg)";
				}
				else{
					var imgUrl = res.data.backgroundurl?res.data.backgroundurl:"../static/imgs/interviewTask/bg_new.jpg)";
				}
				$(".header h1").text(title);
			    $("title").text(title);
			    $("body").css("background-image","url("+imgUrl+")");
			}
			else{
				$(".header h1").text("选题策划");
			    $("title").text("选题策划");
			    $("body").css("background-image","url(../static/imgs/interviewTask/bg_new.jpg)")
			}
	    },
	    error:function(){
	    	$(".header h1").text("选题策划");
	    	$("title").text("选题策划");
	    	$("body").css("background-image","url(../static/imgs/topicPlan/bg_new.jpg)")
	    }
	});

	// 设置齿轮默认位置
	$(".gear-box").each(function(index,element){
		$(this).css({
			"transform":"rotateY("+ 12*(index+1) +"deg) translateZ(300px)"
		});
	});

	// 齿轮动起来
	$(".gear-box").each(function(index,element){
        var pstr = $(element).attr("style");
        var pdeg = pstr.replace("transform: rotateY(","");
        pdeg = parseFloat(pdeg.replace("deg) translateZ(300px)",""));
        if((pdeg+36)%360==0){
        	$(element).addClass("active");
        }
	});

});