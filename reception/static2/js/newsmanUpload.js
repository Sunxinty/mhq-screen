/*
 * @Author: mikey.HeSir 
 * @Date: 2016-12-01 15:06:51 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2016-12-15 14:05:09
 */


$(function() {
	var thisTime=['day','week','month'];
	var thisIndex=0;  //当前展现的计数器
	var setTime;      //点击定时器
	$('.uploadName').click(function () {
		var time=$(this).attr('data-time');
		for(var i=0;i<3;i++){
			if(time==thisTime[i]){
				thisIndex=i;
			}
		}
		clearTimeout(setTime);
		getDatedata($(this).attr('data-time'));
		$('.uploadName').each(function () {
			$(this).removeClass('active');
		});
		$(this).addClass('active');
	});
	getDatedata('day');
	function getDatedata(time){
		var layerIndex=layer.load(0,{shade: [0.2]});
		var start=0;
		if(time=='day'){
			start=0;
		}else if(time=='week'){
			start=6;
		}else if(time=='month'){
			start=30;
		}
		$.ajax({
			type:"POST",
			url:'/MHQ/rest/s/reporterUploadHn',
			data:{
				page:1,
				size:5000,
				pageSize:5000,
				startTime:getDate(start),
				endTime:getDate(0)
			},
			success:function(data){
				$("#totalcount").text(data.totalCount);
				$("#viewcount").text(data.videocount);
				$("#piccount").text(data.piccount);
				initData(data.pgcinfo);
				initUser(data.userlist);
				if(data.userlist != null&&data.userlist.length>0){
					NumberImgLength(Number(data.userlist[0].num));
				}
				$('.uploadName').each(function () {
					$(this).removeClass('active');
				});
				if(thisIndex==3){
					thisIndex=0;
					$('.uploadName:eq('+0+')').addClass('active');
				}else{
					$('.uploadName:eq('+thisIndex+')').addClass('active');
				}
				thisIndex++;
				setTime=setTimeout(function () {
					getDatedata(thisTime[thisIndex], function () {

					})
				},30000);
			},
			error: function () {

			}
		}).then(function () {
			layer.close(layerIndex);
		});
	}
});

//限制字符个数

function textLength(ele,maxLength){
        ele.each(function(){
            var maxwidth=maxLength;
            if($(this).text().length>maxwidth){
                $(this).text($(this).text().substring(0,maxwidth));
                $(this).html($(this).html()+'…');
            }
        });

}

function initData(data){
	$("#uploadlist").html("");
	if(data!=null&&data.length>0)
	$("#uploadlist").html(juicer(reporter.uploadlist, {data : data}));
	else
		$("#uploadlist").html("<p  class='nodata'>暂无数据</p>");
	
}
function initUser(data){
	if(data!=null&&data.length>0)
		$("#userlist").html(juicer(reporter.userlist, {data :data}));
	else
		$("#userlist").html("<span style='color: white;'>暂无数据</span>");

}










/*
*图表小面的 长度显示条
设置 上传排名的 背景图片比例
*
**** */


var NumberImgLength = function(max){
        $(".topNumber").each(function () {
             var j = Number($(this).text());
            //  图片的长度
              var nextDiv = $(this).next();
            // 最大的
             if(max === j){
                 nextDiv.css("width","103%"); 
             }else{
                  var i = (j/max)*103 +"%";
                 nextDiv.css("width",i);                 
              }
        });
          
       
}


//  数组中最大的数字
 function array_max(arr){
        var max=arr[0];
        for(var i in arr){
        if(arr[i]>max){max=arr[i];}
        }
        return max;
        }    
//获取n天前的时间
 function getDate(nday){
 	var date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * nday);
 	Y = date.getFullYear() + '-';
 	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
 	D = (date.getDate()<10?'0'+date.getDate():date.getDate())+ ' ';
 	h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
 	m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+ ':';
 	s = (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()); 
     return Y+M+D+h+m+s;	
 }