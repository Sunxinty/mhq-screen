/**
 * Created by sobeyLrl on 2017/2/16.
 */
/*
 * @Author: MR.Yang
 * @Date: 2016-12-01 15:06:51
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2016-12-15 11:31:05
 */
var refresh;

(function(){
    var startTime;
    var endTime;
    var productionQTV = {
        getDatePiker : function(){
            //日期格式化
            Date.prototype.Format = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            };
            /**
             * 日期选择器
             * */
            var curDate = new Date();
            var pre3Date = new Date(curDate.getTime() - 7*24*60*60*1000); //前7天
            startTime=pre3Date.Format("yyyy-MM-dd");
            endTime=curDate.Format("yyyy-MM-dd");
            var dateRange1 = new pickerDateRange('date1', {
                isTodayValid : true,
                startDate : startTime,
                endDate : endTime,
                aRecent7Days : 'aRecent7Days',
                needCompare : false,
                defaultText : ' 至 ',
                autoSubmit : true,
                inputTrigger : 'input_trigger1',
                theme : 'ta',
                success : function(obj) {
                    startTime=obj.startDate;
                    endTime=obj.endDate;
                    productionQTV.getProductStatis();
                }
            });
        },
        /**
         * 从后台获取数据
         * */
        getProductStatis : function(){
        	console.log(startTime+" "+endTime);
            var weibo = {"total":47,"list":[{"count":"12","createusername":"谭帅"},{"count":"11","createusername":"孙鑫"},{"count":"9","createusername":"汤泽银"},{"count":"8","createusername":"蒲云翔"},{"count":"7","createusername":"王雪玲"}]};
            var weixin = {"total":49,"list":[{"count":"16","createusername":"张伸义"},{"count":"13","createusername":"方艺儒"},{"count":"10","createusername":"陈涛"},{"count":"6","createusername":"张婷"},{"count":"4","createusername":"胡小强"}]};
            var ywgdoc = {"total":37,"list":[{"count":"16","createusername":"赵超越"},{"count":"8","createusername":"刘小利"},{"count":"7","createusername":"曲太坤"},{"count":"5","createusername":"周游"},{"count":"1","createusername":"王祖华"}]};
            //微博
            productionQTV.productView(weibo,"weibo_yAxisNo","weibo_ycount","weibo_xAxisNo","weibo_totalCount");
            productionQTV.NumberImgLength();
            //微信
			productionQTV.productView(weixin,"weixin_yAxisNo","weixin_ycount","weixin_xAxisNo","weixin_totalCount");
			productionQTV.NumberImgLength(); 
            //写稿量
			productionQTV.productView(ywgdoc,"ywgdoc_yAxisNo","ywgdoc_ycount","ywgdoc_xAxisNo","ywgdoc_totalCount");
			productionQTV.NumberImgLength();

        },
        productView:function(type,yAxisNoId,ycountId,xAxisNoId,totalCountId){

            var yAxisNoStr="";
            var ycountStr="";
            var xAxisNoStr="";
            var ymaxCount;
			if(type==null){return false;}
            for(var i=0;i<type.list.length;i++){
                if(i==0){
                    ymaxCount=type.list[i].count;
                }
                yAxisNoStr+="<li>"+type.list[i].count+"</li>";
            }

            for(var i=0;i<type.list.length;i++){
                ycountStr+="<li><div><p>"+type.list[i].count+"</p></div></li>";
                xAxisNoStr+="<li>"+type.list[i].createusername+"</li>";
            }

            $("#"+yAxisNoId).html(yAxisNoStr);
            $("#"+ycountId).html(ycountStr);
            $("#"+xAxisNoId).html(xAxisNoStr);
            $("#"+totalCountId).text(type.total);

            productionQTV.RatingChart(ycountId,ymaxCount);

        },
        productViewFuck:function(type,yAxisNoId,ycountId,xAxisNoId,totalCountId){

            var yAxisNoStr="";
            var ycountStr="";
            var xAxisNoStr="";
            var ymaxCount;
            for(var i=0;i<type.length;i++){
                if(i==0){
                    ymaxCount=type[i][1];
                }
                yAxisNoStr+="<li>"+type[i][1]+"</li>";
            }

            for(var i=0;i<type.length;i++){
                ycountStr+="<li><div><p>"+type[i][1]+"</p></div></li>";
                xAxisNoStr+="<li>"+type[i][0]+"</li>";
            }

            $("#"+yAxisNoId).html(yAxisNoStr);
            $("#"+ycountId).html(ycountStr);
            $("#"+xAxisNoId).html(xAxisNoStr);
            $("#"+totalCountId).text(type.length);

            productionQTV.RatingChart(ycountId,ymaxCount);

        },
        top5: function(msg,DOMid){
            var Str="";
			if(msg.length==0){
				Str = "<tr><td>无数据</td></tr>"
				$("#"+DOMid).html(Str);
				return false;
			}
            for(var i=0;i<msg.length;i++){
			    var num = msg[i][0]?msg[i][0]:"0";
			    var title = msg[i][1]?msg[i][1]:"无";
                var zuozhe = msg[i][4]?msg[i][4]:"无";
                var publishdate = msg[i][3]?formatterDate(msg[i][3]):"无";
                Str+='<tr>'+
                    '<td></td>'+
                    '<td>'+title+'</td>'+
                    '<td>'+zuozhe+'</td>'+
                    '<td>'+publishdate+'</td>'+
                '</tr>';
            }

            $("#"+DOMid).html(Str);
        },
        fuck_top5: function(msg,DOMid){
            var Str="";
            if(msg.length==0){
                Str = "<tr><td></td><td></td><td style='text-align: center;'>无数据</td></tr>"
                $("#"+DOMid).html(Str);
                return false;
            }
            for(var i=0;i<msg.length;i++){
                var zuozhe = msg[i].author?msg[i].author:"无";
                var publishdate = msg[i].publishdate?msg[i].publishdate.split("-")[1]+"/"+msg[i].publishdate.split("-")[2]:"";
                var newPub = publishdate?publishdate.split(":")[0]+":"+publishdate.split(":")[1]:"无";
                Str+='<tr>'+
                    '<td><img src="'+msg[i].logo+'" alt=""></td>'+
                    '<td>'+msg[i].title+'</td>'+
                    '<td>'+zuozhe+'</td>'+
                    '<td>'+newPub+'</td>'+
                    '</tr>';
            }
            $("#"+DOMid).html(Str);
        },
        /**
         * 每块统计图的 高度比
         *Proportion 比例；
         *chartNumber 统计图数字
         */
        RatingChart:function(ycountId,ymaxno){
            $("#"+ycountId+" p").each(function () {
                var chartNumber =  $(this).text();
                var Proportion = ((chartNumber)/ymaxno)*100;
				if(Proportion<18){
					Proportion = 18;
				}
                var topMove = -(100-Proportion)+'%';
                //   console.log(topMove)
				
                $(this).parent().css('bottom',topMove);
            });
        },
        /**
         *图表小面的 长度显示条
         *
         **** */
        array_max:function(arr){
            var max=arr[0];
            for(var i in arr){
                if(arr[i]>max){max=arr[i];}
            }
            return max;
        },

        /**
         *
         **** */
        NumberImgLength:function(arr){
            var arrNumber = [];
            $(".reportNumber .number").each(function() {
                var i = parseInt($(this).text());
                arrNumber.push(i);
            });
            var max = productionQTV.array_max(arrNumber);
            $(".reportNumber .number").each(function() {
                var j = parseInt($(this).text());
                //  图片的长度
                var nextP = $(this).next();

                // 最大的
                if(max === j){
                    nextP.css("width","50%");
                }else{
                    var i = ((j/max)*100) + '%';
                    nextP.css("width","50%");

                }
            });
        },

        /**
         * 入口
         * */
        init:function(){
            productionQTV.getDatePiker();
            productionQTV.getProductStatis();

        }
    };
    window.productionQTV = productionQTV;
})();

$(document).ready(function(){

    //请求管理设置数据
    getSettings();

	productionQTV.init();
    refresh = setInterval(function(){
		console.log('刷新');
		productionQTV.getProductStatis();
	},30000)

});

//请求管理设置数据
function getSettings() {
    $.ajax({
        type: "GET",
        url:HTTP.url+"allocation/search/SOBEY_MHQ_CENTER",
        dataType: 'json',
        success: function(response){
            let result = response.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            const PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"生产力统计";
            const RADIO_BG = parseInt(result.imgtype)||0;
            const BG_URL = result.backgroundurl;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            refresh = setInterval(function(){
                console.log('刷新');
                productionQTV.getProductStatis();
            },REQUEST);
            //重置标题
            $("#top>.top_title").html(TITLE);
            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url('../static2/images/bgPro.jpg')");
            }else if(RADIO_BG===1){
                $("body").css("background-image","url("+BG_URL+")");
            }
        },
        error: function(error){
            console.error("管理设置数据获取异常");
        }
    });
}

//显示日期
function formatterDate(ms) {
    let D = new Date(ms);
    let y = D.getFullYear();
    let m = D.getMonth()+1;
    let d = D.getDate();
    let day = d<10?"0"+d:d;
    let month = m<10?"0"+m:m;
    return month+"/"+day
}