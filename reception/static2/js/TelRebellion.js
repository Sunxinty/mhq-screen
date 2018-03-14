/*
 * @Author: mikey.HeSir 
 * @Date: 2016-12-01 15:06:51 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2016-12-20 18:54:59
 */

var discloseTemplate = {
    'phoneDisclose':'{@each data as itme}<div class="eachList">'+
            '<div class="newsListBody">'+
                '<h3>${itme.title}</h3>'+
                '<ul class="category${itme.category}">'+
                    '<li><span class="glyphicon glyphicon-blackboard"></span> ${itme.columnName}</li>'+
                    '<li><span class="glyphicon glyphicon-user"></span> ${itme.createUserName}</li>'+
                    '<li><span class="glyphicon glyphicon-time"></span> ${itme.clueCreateTime}</li>'+
                    '</ul>'+
                '<div>$${itme.description|delHtmlTag}</div>'+
            '</div>'+
        '</div>{@/each}',
    'orderByuser':'{@each data as itme}<li>'+
                        '<img src="../static2/images/headerIco.png" alt="">'+
                        '<p>${itme.groupValue}</p>'+
                        '<p class="topNumber">${itme.countValue}</p>'+
                        '<div></div>'+
                  '</li>{@/each}'
};
var refresh;
var START = getOneWeekBefore();
var END = getDate();
function chooseTime(){
    START = $("#pickdate_start").val();
    END = $("#pickdate_end").val();
    initData(START,END);
}
$(function () {
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
    $("#pickdate_start").val(START);
    $("#pickdate_end").val(END);
    initData(START,END);
    refresh = setInterval(function(){
        console.log('刷新');
        initData(START,END);
    },30000);
    //请求管理设置数据
    getSettings();
});

var initData = function(start,end){
    phoneDisclose.todayDisclose(start,end); // 今日爆料top10
    phoneDisclose.orderBycreateuser(); //爆料录入排名
    phoneDisclose.orderBychannel(); //爆料量统计
};

/**
 * 今日爆料top8
 */
var phoneDisclose = {

    todayDisclose: function (start,end) {
        var index = layer.load(1);
        var request = $.ajax({
            url:HTTP.url+"rest/brokenews/search",
            type: "POST",
            contentType:"application/json",
            dataType: "json",
            data:JSON.stringify({
                "starttime":start,
                "endtime":end,
                "page":1,
                "size":8,
                "desc":true
            })
        });

        request.done(function (msg) {
            console.info(msg);
            /**
             * 今日爆料top8
             */
            $('.newsList').html(juicer(discloseTemplate.phoneDisclose, {
                data: msg.data.array
            }));
            textLength($('.newsListBody>div'),70);
            /**
             * 爆料统计
             */
            $('#monthCount>p:last').text(msg.data.count);
            $('#dayCount>p:last').text(msg.data.toDayCount);
            // $('#pre7Count>p:first').text(msg.data.count>0?msg.data.count-1:0);
            layer.close(index);
        });

        request.fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            layer.close(index);
        });
    },


    /**
     * 爆料类统计
     * @param String
     */
    orderBycreateuser: function () {
        // $('.rebellionTopUser').html(juicer(discloseTemplate.orderByuser, {
        //     data: [
        //         ["谭小帅",169],["孙小鑫",112],["谭帅",23],["孙鑫",45]
        //     ]
        // }));
        // NumberImgLength();

        var request = $.ajax({
            url: HTTP.url+"rest/brokenews/statistics?groupByField=category",
            type: "GET",
            dataType: "json"
        });

        request.done(function (msg) {
            // console.info(msg);
            $('.rebellionTopUser').html(juicer(discloseTemplate.orderByuser, {
                data: msg.data
            }));
            NumberImgLength();
        });

        request.fail(function (jqXHR, textStatus) {
            // alert( "Request failed: " + textStatus );
        });

    },
    /**
     * 爆料来源统计
     */
    orderBychannel: function () {
        // var data = [
        //         {
        //             value: 122,
        //             name: "孙小鑫"
        //         },
        //         {
        //             value: 155,
        //             name: "谭小帅"
        //         },
        //         {
        //             value: 22,
        //             name: "孙鑫"
        //         },
        //         {
        //             value: 55,
        //             name: "谭帅"
        //         }
        //     ];
        //
        // rebllionChart(data);

        var request = $.ajax({
            url: HTTP.url+"rest/brokenews/statistics?groupByField=source",
            type: "GET",
            dataType: "json"
        });

        request.done(function (msg) {
            //console.info(msg);
            var arr = msg.data;
            var data = [];
            $.each(arr,function(index,item){
                var obj = {
                    value: item.countValue,
                    name: item.groupValue
                };
                data.push(obj);
            });
            rebllionChart(data);
        });

        request.fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
        });
    }

};

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
        color:['#DF0059', '#00E4FF','#D31DD1','#1ABB15','#5167CF','#D6D9DB'],
        calculable: false,
        series: [
            {
                name: '渠道统计',
                type: 'pie',
                radius: ['56%', '68%'],
                startAngle:0,
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: true,
                        formatter: '{term1|{b}}\n {term2|{c}}',
                        fontSize: '22',
                        padding: [0,-40,50,-40],
                        position: 'outside',
                        rich: {
                            term1: {
                                fontSize: 14,
                                padding: [0,4,0,-4],
                                lineHeight: 20,
                                color:"#fff"
                            },
                            term2: {
                                fontSize: 28,
                                lineHeight: 30
                            }
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        smooth:false,
                        length:0,
                        length2:80
                    }
                },
                itemStyle: {
                    shadowBlur: 0
                },
                data: data
            }
        ]
    };
    rebllionChart.setOption(option);
};

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

//请求管理设置数据
function getSettings() {
    $.ajax({
        type: "GET",
        url:HTTP.url+"allocation/search/SOBEY_MHQ_PHONEDISCLOSE",
        dataType: 'json',
        success: function(response){
            let result = response.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            const PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"电话爆料";
            const RADIO_BG = parseInt(result.imgtype)||1;
            const BG_URL = result.backgroundurl;
            //定时发送请求刷新数据
            if(refresh){
                clearInterval(refresh);
            }
            refresh = setInterval(function(){
                console.log('刷新');
                initData(START,END);
            },REQUEST);
            //重置标题
            $("#top>.top_title").html(TITLE);
            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url("+BG_URL+")");
            }else{
                $("body").css("background-image","url('../static2/images/phoneDisclose/bg"+RADIO_BG+".png')");
            }
        },
        error: function(error){
            console.error("管理设置数据获取异常");
        }
    });
}
