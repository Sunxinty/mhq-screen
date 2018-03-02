/*
*Name:BirTV-采访任务
*CreationTime:2017-08-02
*Author:sunxin
*/
var position = [
	{
		top: "1px",
		left: "423px"
	},
	{
		top: "172px",
		left: "834px"
	},
	{
		top: "501px",
		left: "834px"
	},
	{
		top: "665px",
		left: "424px"
	},
	{
		top: "501px",
		left: "-12px"
	},
	{
		top: "177px",
		left: "-12px"
	},
]

function getToday(time){
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    if(m<10){m = "0"+m}
    if(d<10){d = "0"+d}
    return y+"-"+m+"-"+d+" "+time;
}

var taskVue = new Vue({
	el:".container",
	mounted:function(){
		var _this = this;
		_this.getTaskData();
		_this.getData();
		setTimeout(function(){
			_this.turnBox();
			$(".task-turn").removeClass("active")
		},10)
		
		$(".turntable-box").each(function(index,element){
			if($(element).hasClass("active")){
				var taskList = _this.taskData[index];
				_this.taskList = taskList;
				_this.move(taskList.type);
			}
		});
	},
	data:{
		params:{
            "starttime":"2017-01-01 00:00:00",
            "endtime":getToday("23:59:59"),
            "page":1,
            "size":6,
            "isdesc":true
		},
		taskData:taskData,
		taskList:[]
	},
	methods:{
		move:function(type){
			if(type==1){
				$(".schedule-move").css("top","-28px")
			}
			else if(type==2){
				$(".schedule-move").css("top","100px")
			}
			else if(type==3){
				$(".schedule-move").css("top","220px")
			}
			else if(type==4){
				$(".schedule-move").css("top","575px")
			}
		},
		turnBox:function(){
			$(".turntable-box").each(function(index,element){
				$(this).css({
					left: position[index].left,
					top: position[index].top,
					opacity:1
				})
			})
		},
		getData:function(){
			this.$http.get(HTTP.url+"allocation/search/SOBEY_MHQ_INTERVIEWTASK").then(function(res){
				console.log(res.body.data)
				var data = res.body.data
				if(data){
					var title = data.title==""?"采访任务":data.title;
					if(data.imgtype==0){
						var imgUrl = "../static/imgs/interviewTask/bg_new.jpg)"
					}
					else{
						var imgUrl = data.backgroundurl?data.backgroundurl:"../static/imgs/interviewTask/bg_new.jpg)";
					}
					$(".header h1").text(title);
			    	$("title").text(title);
			    	console.log(imgUrl)
			    	$("body").css("background-image","url("+imgUrl+")");
				}
				else{
					$(".header h1").text("采访任务");
			    	$("title").text("采访任务");
			    	$("body").css("background-image","url(../static/imgs/interviewTask/bg_new.jpg)")
				}
			},function(res){
				$(".header h1").text("采访任务");
		    	$("title").text("采访任务");
		    	$("body").css("background-image","url(../static/imgs/interviewTask/bg_new.jpg)")
			})
		},
        getTaskData: function() {
            //请求采访任务数据
            this.$http.post(HTTP.url+'rest/search/interview',JSON.stringify(this.params))
                .then(function(response){
                    console.log("请求成功：",response.data);
                    formatListData(response.data);
                })
                //.catch(function(response) {
                //    console.log("请求错误：",response)
                //});
        }
	}
});

//格式化返回的数据
function formatListData(msg){

    var TaskData = [];
    if(!msg||!msg.data||msg.data.length===0){
        console.log("无采访任务数据");
    }else{
        var arr = msg.data;
        for(var i = 0;i<6;i++){
        	if(arr[i]){
                var id = i+1;
                var scheduleArr = arr[i].taskprogress;
                var count = 1;
                var schedule =[
                    {
                        type:"领取任务",
                        name:"未进行",
                        time:""
                    },
                    {
                        type:"回传任务素材",
                        name:"",
                        time:"",
                        imgArray:[]
                    },
                    {
                        type:"采访完成任务",
                        name:"未进行",
                        time:""
                    }
                ];
                if(arr[i].resMaterial.length>0){
                    var len = arr[i].resMaterial.length>4?4:arr[i].resMaterial.length;
                    for(var k =0;k<len;k++){
                        schedule[1].imgArray.push(arr[i].resMaterial[k]);
                    }
                }
                if(!scheduleArr){
                    console.log("任务进程为空");
                }else{
					if(scheduleArr.length==0){
						console.log("任务进程为空");
						return false;
					}
                    for(var j=0;j<scheduleArr.length;j++){
                        if(scheduleArr[j].statuName==='认领任务'){
                            schedule[0] = {
                                type:scheduleArr[j].statuName,
                                name:scheduleArr[j].operatorName,
                                time:scheduleArr[j].updateTime
                            };
                            count=2;
                        }

                        if(scheduleArr[j].statuName==='采访完成任务'){
                            schedule[2] = {
                                type:scheduleArr[j].statuName,
                                name:scheduleArr[j].operatorName,
                                time:scheduleArr[j].updateTime
                            };
                            count=4;
                        }

                    }
                }

                TaskData.push({
                    id:id,
                    title:arr[i].title,
                    content:arr[i].content.replace(/<.*?>/ig,"").replace(/&nbsp;/ig," "),
                    name:arr[i].createUserName, // 创建任务人
                    time:arr[i].createTime, // 创建任务时间
                    address:arr[i].positionName,
                    type:count, //进度
                    schedule:schedule
                });
			}else{

                var id = i+1;
                var schedule =[
                    {
                        type:"领取任务",
                        name:"未进行",
                        time:""
                    },
                    {
                        type:"回传任务素材",
                        name:"",
                        time:"",
                        imgArray:[]
                    },
                    {
                        type:"采访完成任务",
                        name:"未进行",
                        time:""
                    }
                ];
                TaskData.push({
                    id:id,
                    title:'',
                    content:'',
                    name:'', // 创建任务人
                    time:'', // 创建任务时间
                    address:'',
                    type:1, //进度
                    schedule:schedule
                });

			}

        }

    }

	taskVue.taskData = TaskData;
	taskVue.taskList = TaskData[0];
}

$(function(){
	
	var nIndex = 1;

	setTimeout(function(){
		$(".sapmiao-line,.task-saomiao").addClass("active");
	},10)

	setInterval(function(){

		$(".line-bg,.task-turn").addClass("active");

		$(".sapmiao-line,.task-saomiao").removeClass("active");

		setTimeout(function(){
			$(".sapmiao-line,.task-saomiao").addClass("active");
		},10)

		$(".turntable-box").each(function(index,element){
			index = index+nIndex;
			if(index>5){
				index = index-6;
			}
			$(element).css({
				left: position[index].left,
				top: position[index].top
			})

			if(index==5){
				var tIndex = 5-nIndex;
				$(".turntable-box.active").removeClass("active");
				$(".turntable-box").eq(tIndex).addClass("active");
				if(tIndex==-1){
					tIndex=5
				}
				taskVue.taskList = taskVue.taskData[tIndex];
				taskVue.move(taskVue.taskList.type);
			}
		})

		nIndex++;

		if(nIndex==7){
			nIndex=1
		}
		
		setTimeout(function(){
			$(".line-bg,.task-turn").removeClass("active");
		},1000)

	},15000);

}())

