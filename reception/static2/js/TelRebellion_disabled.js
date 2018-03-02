/*
 * @Author: mikey.HeSir 
 * @Date: 2016-12-01 15:06:51 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2016-12-20 18:54:59
 */
var discloseTemplate = {
    'phoneDisclose':'{@each data as itme}<div class="eachList">'+
            '<div class="icon">'+
                '<div></div>'+
                '<p></p>'+
            '</div>'+
            '<div class="newsListBody">'+
                '<h3>${itme.title}</h3>'+
                '<ul>'+
                    '<li><span></span> ${itme.columnName}</li>'+
                    '<li><span></span> ${itme.createUserName}</li>'+
                    '<li><span></span> ${itme.clueCreateTime}</li>'+
                    '</ul>'+
                '<div>$${itme.description|delHtmlTag}</div>'+
            '</div>'+
        '</div>{@/each}',
    'orderByuser':'{@each data as itme}<li>'+
                        '<img src="../static2/images/headerIco.png" alt="">'+
                        '<p>${itme[0]}</p>'+
                        '<p class="topNumber">${itme[1]}</p>'+
                        '<div></div>'+
                  '</li>{@/each}'
};
// 当前点击月份
var currentBtn = "beforemonth";
var timeIndex;

$(function () {
    // rebllionChart();
    // NumberImgLength();
    phoneDisclose.todayDisclose(); // 最新爆料
    timeInit();
});

/**
 * 页面数据定时初始化
 */
var timeInit = function () {
    clickMonth();
    timeIndex = setInterval(function () {
        phoneDisclose.todayDisclose();
        if(currentBtn == "month"){
            currentBtn = "beforemonth";
            $(".orderByUser>.topTitle div:nth-of-type(2) button.beforemonth").css("background-color","#17909b").siblings().css("background-color","transparent");
            $(".orderByChannel>.topTitle div:nth-of-type(2) button.beforemonth").css("background-color","#17909b").siblings().css("background-color","transparent");

            phoneDisclose.orderBycreateuser("beforemonth");
            phoneDisclose.orderBychannel("beforemonth");
        }else{
            currentBtn = "month";
            $(".orderByUser>.topTitle div:nth-of-type(2) button.month").css("background-color","#17909b").siblings().css("background-color","transparent");
            $(".orderByChannel>.topTitle div:nth-of-type(2) button.month").css("background-color","#17909b").siblings().css("background-color","transparent");

            phoneDisclose.orderBycreateuser("month");
            phoneDisclose.orderBychannel("month");
        }
    }, 60000);
};
/**
 * 今日爆料top10
 */
var phoneDisclose = {

    todayDisclose: function () {
        var index = layer.load(1);
        var request = $.ajax({
            url:HTTP.url+"rest/brokenews/search",
            type: "POST",
            contentType:"application/json",
            dataType: "json",
            data:JSON.stringify({
                "starttime":"",
                "endtime":"",
                "page":1,
                "size":10,
                "desc":true
            })
        });

        request.done(function (msg) {
            console.info(msg);
            /**
             * 今日爆料top10
             */
            $('.newsList').html(juicer(discloseTemplate.phoneDisclose, {
                data: msg.data.array
            }));
            textLength($('.newsListBody>div'),50);
            /**
             * 爆料统计
             */
            $('#monthCount>p:first').text(msg.data.count);
            $('#dayCount>p:first').text(msg.data.count>0?msg.data.count/2:0);
            $('#pre7Count>p:first').text(msg.data.count>0?msg.data.count-1:0);
            layer.close(index);
        });

        request.fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            layer.close(index);
        });
    },


    /**
     * 爆料录入排名
     * @param String
     */
    orderBycreateuser: function (timeSymbol) {
        if(timeSymbol==="month"){
            $('.rebellionTopUser').html(juicer(discloseTemplate.orderByuser, {
                data: [
                    ["谭帅",23],["孙鑫",45]
                ]
            }));
        }else{
            $('.rebellionTopUser').html(juicer(discloseTemplate.orderByuser, {
                data: [
                    ["谭小帅",169],["孙小鑫",112],["谭帅",23],["孙鑫",45]
                ]
            }));
        }
        NumberImgLength();

        // var request = $.ajax({
        //     url: HTTP.url+"rest/brokenews/rank",
        //     type: "GET",
        //     data: {'timeSymbol': timeSymbol},
        //     dataType: "json"
        // });
        //
        // request.done(function (msg) {
        //     // console.info(msg);
        //     $('.rebellionTopUser').html(juicer(discloseTemplate.orderByuser, {
        //         data: msg
        //     }));
        //     NumberImgLength();
        // });
        //
        // request.fail(function (jqXHR, textStatus) {
        //     // alert( "Request failed: " + textStatus );
        // });

    },
    /**
     * 爆料量统计
     */
    orderBychannel: function (timeSymbol) {
        var data = [];
        if(timeSymbol==="month"){
            data = [
                {
                    value: 22,
                    name: "孙鑫"
                },
                {
                    value: 55,
                    name: "谭帅"
                }
            ];
        }else{
            data = [
                {
                    value: 122,
                    name: "孙小鑫"
                },
                {
                    value: 155,
                    name: "谭小帅"
                },
                {
                    value: 22,
                    name: "孙鑫"
                },
                {
                    value: 55,
                    name: "谭帅"
                }
            ];
        }
        rebllionChart(data);

        // var request = $.ajax({
        //     url: HTTP.url+"rest/brokenews/tongji",
        //     type: "GET",
        //     data: {'timeSymbol': timeSymbol},
        //     dataType: "json"
        // });
        //
        // request.done(function (msg) {
        //     //console.info(msg);
        //     var data = [];
        //     $.each(msg,function(index,item){
        //         var obj = {
        //             value: item[1],
        //             name: item[0]
        //         };
        //         data.push(obj);
        //     });
        //     rebllionChart(data);
        // });
        //
        // request.fail(function (jqXHR, textStatus) {
        //     //alert( "Request failed: " + textStatus );
        // });
    }

};

/**
 * 统计月
 */
function clickMonth(){
    // 初始值
    phoneDisclose.orderBycreateuser("beforemonth");
    phoneDisclose.orderBychannel("beforemonth");
    $(".orderByUser>.topTitle div:nth-of-type(2) button").each(function () {
        $(this).off().on("click",function () {
            clearInterval(timeIndex);
            setTimeout(timeInit(), 5000);
            $(this).css("background-color","#17909b").siblings().css("background-color","transparent");
            //$(this).addClass('opt').siblings().removeClass('opt');
            if($(this).text()=='本月'){
                phoneDisclose.orderBycreateuser("month");
            }else{
                phoneDisclose.orderBycreateuser("beforemonth");
            }
        });
    });
    $(".orderByChannel>.topTitle div:nth-of-type(2) button").each(function () {
        $(this).off().on("click",function () {
            clearInterval(timeIndex);
            setTimeout(timeInit(), 5000);
            $(this).css("background-color","#17909b").siblings().css("background-color","transparent");
            //$(this).addClass('opt').siblings().removeClass('opt');
            if($(this).text()=='本月'){
                phoneDisclose.orderBychannel("month");
            }else{
                phoneDisclose.orderBychannel("beforemonth");
            }
        });
    });
}

//去掉所有的html标记
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");
}


//限制字符个数
function textLength(ele, maxLength) {
    ele.each(function () {
        var maxwidth = maxLength;
        if ($(this).text().length > maxwidth) {
            $(this).text($(this).text().substring(0, maxwidth));
            $(this).html($(this).html() + '…');
        }
    });
}

/*
 *图表小面的 长度显示条
 设置 上传排名的 背景图片比例
 **** */
var NumberImgLength = function () {
    var arrNumber = [];
    $(".topNumber").each(function () {
        var i = parseInt($(this).text());
        arrNumber.push(i);
    });

    var max = array_max(arrNumber); //最大值
    //console.log(max);

    $(".topNumber").each(function () {
        var j = parseInt($(this).text());
        //  图片的长度
        var nextDiv = $(this).next();

        // 最大的
        if (max === j) {
            nextDiv.css("width", "103%");
        } else {
            var i = (j / max) * 103 + "%";
            console.log(i);
            nextDiv.css("width", i);
        }
    });
};


//  数组中最大的数字
function array_max(arr) {
    var max = arr[0];
    for (var i in arr) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}


/*  爆料量统计 */
var rebllionChart = function (data) {
    var rebllionChart = echarts.init(document.getElementById('rebllionChart'));

    var option = {
        color:['#19CA15', '#DB1096','#FFE400','#00E8E5','#1800FF','#D6D9DB'],
        calculable: false,
        series: [
            {
                name: '频道统计',
                type: 'pie',
                radius: ['50%', '70%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true, position: 'outer', formatter: "{b} {c}",
                            textStyle: {
                                color:'white',
                                align : 'right',
                                baseline : 'middle',
                                fontFamily : '微软雅黑',
                                fontSize : 15,
                                fontWeight : 'bolder'
                            }
                        },
                        labelLine: {
                            length:8,
                            lineStyle:{
                                color:'white'
                            },
                            show: true
                        }
                    }/*,
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    }*/
                },
                data: data
            }
        ]
    };
    rebllionChart.setOption(option);
};




