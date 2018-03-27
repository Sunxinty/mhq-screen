// 获取当前时间
function getToday(){
    var nowdate = new Date();
    var year = nowdate.getFullYear();
    var mouth = nowdate.getMonth()+1;
    var date = nowdate.getDate();
    var hours = nowdate.getHours();
    var minutes = nowdate.getMinutes();
    var seconds = nowdate.getSeconds();
    if(mouth<10){mouth = "0"+mouth}
    if(date<10){date = "0"+date}
    if(hours<10){hours = "0"+hours}
    if(minutes<10){minutes = "0"+minutes}
    if(seconds<10){seconds = "0"+seconds}
    return year+"-"+mouth+"-"+date+" "+hours+":"+minutes+":"+seconds;
}

/**
 *百度地图js
 */
(function ($, dateUtil, listplanService, echarts) {
    var reporterDataArr = [];//记录当前所有直播人员
    var inrefresh = 0;//记录是否在刷新中
    var directName = '';//记录当前直播人，实现刷新页面时不刷新直播
    var directUrl = '';//记录当前直播地址，实现刷新页面时不刷新直播
    var directID = '';//记录当前直播人ID
    var urlParams = {};//当前url参数
    var refreshBtn = false;
    var newZoom = 13;
    var resc = 1;
    var newLacotion = {
        lng:0,
        lat:0
    };

    function Map() {
        // this.getUrlParams();
        this.initMap();
        this._init();
    }

    $.extend(Map.prototype, {
        preTager: null,
        titleWidth: 0,
        titleHiden: true,
        map: null,
        smallMap: null,
        rootPath: window.configProjectName,
        headUrl: null,
        infoOverlays: {},
        appointModal: null,
        rtcInstance: null,
        reporters: null,
        /**
         * 标签部分事件绑定
         */
        getUrlParams: function () {
            var url = location.search;
            console.log("urlParams:"+url)
            if (url) {
                var datas = url.slice(1).split('&'), params = {};
                for (var i = 0; i < datas.length; i++) {
                    var data = datas[i].split('=');
                    params[data[0]] = data[1];
                }
                if (params.station) {
                    urlParams = window.config.GPS.stationConfig[params.station];
                } else {
                    urlParams = params;
                }
            }
            else{
                urlParams={};
            }
            if(urlParams.voiceCall==1){
                window.voiceCall=1;
            }
            if (urlParams.leftMenu != 0) {
                $('#aside').css('display', 'block');
            }
            if (urlParams.rightMenu != 0) {
                $('#direct').css('display', 'block');
            }
            if (urlParams.smallMap == 1) {
                $('#smallMap').css('display', 'block');
            }
            if (urlParams.searchModule != 0) {
                $('#mapNav').css('display', 'none');
            }
            //判断背景颜色
            if (urlParams.color == 'blue') {
                $('body').attr('id', 'gisBlue');
            }
            if(urlParams.sideTop){
                $('#aside,#direct,#mapNav').css('top',urlParams.sideTop+'px');
            }
        },
        _bindLabelEvent: function (_this) {
            //屏蔽右键菜单事件
            $("#aside").bind("contextmenu", function (e) {
                return false;
            });
            //屏蔽双击事件
            $("#aside").bind("dblclick", function (e) {
                return false;
            });
        },
        _init: function () {
            var _this = this;
            _this._bindLabelEvent(_this);
            _this.map = new BMap.Map("allmap");
            /**
             * 地图初始化是构建时间空间为当天日期
             */
            var now = new Date();
            var timeStr = dateUtil.format(now, "yyyy-MM-dd");

            $('input[name="datetimepicker"]').each(function () {
                $(this).val(timeStr);
                $(this).datetimepicker({
                    format: 'yyyy-mm-dd',
                    language: 'zh-CN',
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: true,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    initialDate: new Date()
                });
            });

            var returnV = _this._checkValue();
            _this._getAjaxData(returnV);

            $('#switches-btn').bind('click', {}, function (event) {
                //右侧的列表的隐藏和关闭.
                $('#aside').toggleClass("open");
                $('#smallMap').toggleClass("smallMapOpen");
            });
            $(".controlMiss").bind("click", {}, function (event) {
                $('#direct').toggleClass("miss");
            });
            //搜索按钮点击事件
            $('#search-li').on('click', function () {
                var returnV = _this._checkValue();
                _this._getAjaxData(returnV);
            });
            
            // 刷新按钮
            $('#xt-list-btns').on('click', 'span', function () {
                // 滚动或拖拽地图后重新获取地图中心坐标
                if(resc==1){
                    var pt = _this.map.getBounds().getCenter();
                    // console.log(pt)
                    newLacotion.lng = pt.lng;
                    newLacotion.lat = pt.lat;
                    resc = 0;
                }
                console.log("当前地图层级："+newZoom)
                refreshBtn = true;

                $('#xt-list-btns span').css('display', 'none');
                if (inrefresh == 0) {
                    inrefresh = 1;
                    var returnV = _this._checkValue();
                    _this._getAjaxData(returnV);
                }
            });

            // 定时刷新地图和数据
            setInterval(function(){
                $('#xt-list-btns span').trigger("click")
            },refreshTimeBtn*1000)

            // 滚动鼠标时记录当前地图的层级和中心位置
            var scrollFunc=function(e){
                e=e || window.event;
                newZoom = _this.map.getZoom();
                resc = 1;
            }
            
            if(document.addEventListener){
                document.addEventListener('DOMMouseScroll',scrollFunc,false);
            }
            window.onmousewheel=document.onmousewheel=scrollFunc;

            // 拖动地图结束时获取地图中心坐标
            _this.map.addEventListener("dragend", function (){
                resc = 1;
            });
           
        },
        /**
         * 检查是否有选中的复选框,更具选中的复选框进行加载哪些数据
         */
        _checkValue: function () {
            var checkedElements = [];

            $("form input:checked").each(function (index) {
                checkedElements.push($(this).attr("id"));
            });

            return checkedElements;
        },
        /**
         * 构建选题数据对象.将数据解析成符合要求的数据结构
         *
         */
        _doWithLisplanData: function (value, type, name) {
            var obj = {};
            $.extend(obj, value);

            var occurLocationCode = value.position;
            obj.x = occurLocationCode ? occurLocationCode.split(',')[0] : window.config.GPS.longitude;
            obj.y = occurLocationCode ? occurLocationCode.split(',')[1] : window.config.GPS.latitude;
            obj.eventlocation = value.eventlocation || '';

            obj.imgip = value.imgip;
            obj.type = name;
            obj.taskType = type;
            obj.isUser = false;
            obj.style = "";
            return obj;
        },
        /**
         * 构建记者数据对象
         */
        _doWithAuthData: function (value, type) {
            var _this = this;
            var obj = new Object();
            var timeStr = "";

            if (value.registtime) {
                var dd = new Date(value.registtime);
                timeStr = dateUtil.format(dd, "yyyy-MM-dd hh:mm:ss");
            }
            obj.id = value.uid;
            obj.time = value.updatetime;
            if (isNaN(parseInt(value.lprecision.slice(0, 1)))&&value.lprecision.slice(0, 1)!="-") {
            	
                obj.x = $.base64.decode(value.lprecision);
                obj.y = $.base64.decode(value.latitude);
            } else {
                obj.x = value.lprecision;
                obj.y = value.latitude;
            }
            obj.client = value.loginsystem;
            if (obj.client == "zhihui") {
                obj.client = "报道指挥";
            }
            obj.telphone = value.phonenum ? value.phonenum : "";
            obj.address = "";
            obj.lstatus = value.lstatus;
            obj.username = value.username ? value.username : "";
            obj.usercode = value.usercode;
            obj.isUser = true;
            obj.taskType = type;
            obj.type = 'user';
            obj.style = "";
            obj.videostatus = value.videostatus || 0;
            obj.videoaddress = value.videoaddress || 0;
            obj.channelname = value.channelname || '还没取名字呢';
            obj.icon = ['icons/directing.png'];
            obj.videouserid=value.videouserid;
            if (value.icon) {
                if (value.icon.indexOf(';') != -1) {
                    obj.icon = value.icon.split(';')
                    if (value.icon[0].slice(0, 4) != 'http') {
                        for (var i = 0; i < obj.icon.length; i++) {
                            obj.icon[i] = 'data:image/jpeg;base64,' + obj.icon[i];
                        }
                    }
                } else {
                    if (value.icon.slice(0, 4) != 'http') {
                        obj.icon[0] = 'data:image/jpeg;base64,' + value.icon;
                    } else {
                        obj.icon[0] = value.icon;
                    }
                }
            }

			obj.imageUrl=value.userimg;

            if (obj.videostatus == 1) {
                var exist = 0;
                for (var i = 0; i < reporterDataArr.length; i++) {
                    if (reporterDataArr[i].usercode == obj.usercode) {
                        reporterDataArr[i] = obj;
                        exist = 1;
                    }
                }
                if (exist == 0) {
                    reporterDataArr.push(obj);//获取记者数据
                }
            }

            return obj;
        },
        /*
        * 获取地址
        */
        getAddress: function (obj) {
            var point = new BMap.Point(obj.x, obj.y);
            var geoc = new BMap.Geocoder();

            geoc.getLocation(point, function (rs) {
                var addComp = rs.addressComponents;
                obj.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            });
        },
        //获取地图所有数据,任务及记者
        _getAjaxData: function (options) {
			var authors = [];
			var plans = [];
            reporterDataArr = [];
            var _this = this;
            //获取选题
            var d1 = $.Deferred();
            var d2 = $.Deferred();

            if (_.includes(options, "listplanNotCheck")) {
                _this._getLlistplan(
                    function (response, type) {
                        var data = response.data;
                        var taskNumber = data.length;
                        $("#taskNumber").text("今日任务 "+taskNumber+"条");
                        plans = [];
                        for (var j = 0; j < data.length;j++) {
                            if (j > config.GPS.maxCount) break;
                            var value = data[j];
                            plans.push(_this._doWithLisplanData(data[j], type, "listplan"));
                            type = "";
                        }
                        d1.resolve(plans);
                    }, d1
                );
            } else {
                d1.resolve([]);
            }

            //获取记者定义数据
            if (_.includes(options, "author")) {
                _this._getAutherData(
                    function (response) {
                        var data = "";
                        authors = [];
                        var userinfos;
                        var headPortraits={};
                        var userNumber = 0;
                        if(response.userinfos){
							userinfos=JSON.parse(response.userinfos);
							for(var i in userinfos){
								if(userinfos[i].avatarUrl!="null"||userinfos[i].avatarUrl!=null)
								headPortraits[userinfos[i].userCode]=userinfos[i].avatarUrl;
								else
								headPortraits[userinfos[i].userCode]="icons/auther3.png";
							}
                        }
						else{
							for (var j = 0; j < response.data.length; j++) {
								headPortraits[response.data[j].usercode] = response.data[j].userimg||"icons/auther3.png"
							}
						}
                        if (response.data){
                            data = response.data;
                        }

                        var type = 'user';
                        for (var j = 0; j < data.length; j++) {
                            if (j > config.GPS.maxCount) break;
                            if(data[j].lstatus==1){
                            	userNumber++;
                                authors.push(_this._doWithAuthData(data[j], type));
                            }
                            type = '';
                        }
                        $("#userNumber").text("在线记者 "+userNumber+"人");
                        _this.queryLiveGroupRe(authors)
                        _this.reporters = authors;
                        d2.resolve(authors);
                    },d2
                );
            } else {
                d2.resolve([]);
            }
			
			_this.refreshMap(_.concat(plans, authors));
        },
        /**
         * 获取任务调用
         * @param function success 请求成功的回调函数
         */
        _getLlistplan: function (success, d1) {
            var _this = this;
            var params = {};
            params.isdesc = true;
            params.size = window.config.GPS.maxCount;
            params.page = 1;
            var now = new Date();
            var timeStr = dateUtil.format(now, "yyyy-MM-dd");
            // 获取当天任务列表
            params.starttime = timeStr+" 00:00:00";
            params.endtime = timeStr+" 23:59:59";
            
            var url = window.config.IpAddress+"/mhq-mserver/rest/gis/interview";
            _this.queryData(url, params, success);
        },
        /**
         * 记者定位的请求调用
         */
        _getAutherData: function (success, d2) {
            var _this = this;
            var now = new Date(); //当前日期
            var params = {};

            params.start = $("#starttime").val();
            if (params.start){
                params.start = params.start + " 00:00:00";
            }

            params.end = $("#endtime").val();
            if (params.end){
                params.end = params.end + " 23:59:59";
            }

			var url = window.config.IpAddress+"/mhq-mserver/rest/gis/getReports"
			
            $.ajax({
                type: "GET",
                url: url,
                data: params,
                async:false,
                "timeout": 20000,
                success: function (msg) {
                    success(msg);
                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText == 'timeout') {
                        alert('服务器响应超时');
                    }
                    d2.resolve([]);
                }
            });
        },
        
		// _initEcharts: function (plans, datas, fromPoint) {
  //           var _this = this;
  //           if (_this.map) {
  //               //清除覆盖物
  //               _this.map.clearOverlays();
  //           }

  //           var option,
  //               series = [],
  //               lineDatas = [],
  //               effectScatterDatas = [{name: "", value: fromPoint.concat(0)}];

  //           var color = ['#a6c84c'];

  //           _.forEach(datas, function (data, index) {

  //               var toPoint = [data.x, data.y];
  //               var effectScatter = 100;

  //               if (data.videostatus == 0) {
  //                   effectScatter = 0;
  //               }
  //               lineDatas.push({fromName: "", toName: "", coords: [fromPoint, toPoint]});

  //               effectScatterDatas.push({name: "", value: toPoint.concat(effectScatter)})
  //           });

  //           series.push(
  //               {
  //                   type: 'lines',
  //                   coordinateSystem: 'bmap',
  //                   zlevel: 2,
  //                   effect: {
  //                       show: false,
  //                       period: 6,
  //                       trailLength: 0,
  //                       symbol: 'arrow',
  //                       symbolSize: 12
  //                   },
  //                   lineStyle: {
  //                       normal: {
  //                           color: '#187BEB',
  //                           width: 2,
  //                           //opacity: 0.4,
  //                           opacity: 1,
  //                           curveness: 0.2
  //                       }
  //                   },
  //                   data: lineDatas
  //               },
  //               {
  //                   type: 'effectScatter',
  //                   coordinateSystem: 'bmap',
  //                   zlevel: 2,
  //                   rippleEffect: {
  //                       brushType: 'stroke',
  //                       scale: 10,
  //                       period: 4
  //                   },
  //                   label: {
  //                       normal: {
  //                           show: true,
  //                           position: 'right',
  //                           formatter: '{b}'
  //                       }
  //                   },
  //                   symbolSize: function (val) {
  //                       return val[2] / 8;
  //                   },
  //                   itemStyle: {
  //                       normal: {
  //                           color: '#187BEB'
  //                       }
  //                   },
  //                   data: effectScatterDatas
  //               });

  //           var styleJson = [
  //               {
  //                   "featureType": "background",
  //                   "elementType": "all",
  //                   "stylers": {
  //                       "color": "#dddddd"
  //                   }
  //               },
  //               {
  //                   "featureType": "poi",
  //                   "elementType": "labels",
  //                   "stylers": {
  //                       "color": "#f3f3f3",
  //                       "visibility": "off"
  //                   }
  //               },
  //               {
  //                   "featureType": "poi",
  //                   "elementType": "labels.text.fill",
  //                   "stylers": {
  //                       "color": "#296090"
  //                   }
  //               },
  //               {
  //                   "featureType": "boundary",
  //                   "elementType": "geometry",
  //                   "stylers": {
  //                       "color": "#cccccc"
  //                   }
  //               },
  //               {
  //                   "featureType": "label",
  //                   "elementType": "labels.text.stroke",
  //                   "stylers": {
  //                       "color": "#d94343",
  //                       "visibility": "off"
  //                   }
  //               },
  //               {
  //                   "featureType": "water",
  //                   "elementType": "all",
  //                   "stylers": {
  //                       "color": "#999999"
  //                   }
  //               },
  //               {
  //                   "featureType": "highway",
  //                   "elementType": "geometry.fill",
  //                   "stylers": {
  //                       "color": "#eeeeee"
  //                   }
  //               },
  //               {
  //                   "featureType": "arterial",
  //                   "elementType": "geometry.fill",
  //                   "stylers": {
  //                       "color": "#eeeeee"
  //                   }
  //               },
  //               {
  //                   "featureType": "local",
  //                   "elementType": "geometry.fill",
  //                   "stylers": {
  //                       "color": "#eeeeee"
  //                   }
  //               },
  //               {
  //                   "featureType": "railway",
  //                   "elementType": "geometry.fill",
  //                   "stylers": {
  //                       "color": "#eeeeee"
  //                   }
  //               },
  //               {
  //                   "featureType": "local",
  //                   "elementType": "geometry.fill",
  //                   "stylers": {
  //                       "color": "#dddddd"
  //                   }
  //               }
  //           ];
  //           option = {
  //               bmap: {
  //                   // 百度地图中心经纬度
  //                   center: fromPoint,
  //                   // 百度地图缩放
  //                   zoom: 13,
  //                   // 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
  //                   roam: true,
  //                   // 百度地图的自定义样式，见 http://developer.baidu.com/map/jsdevelop-11.htm
  //                   mapStyle: {styleJson: styleJson}
  //               },
  //               series: series
  //           };
  //           if (!_this.chart) {
  //               var dom = document.getElementById("allmap");

  //               _this.Chart = echarts.init(dom);
  //               _this.Chart.on('click', function (params) {
  //               });
  //               _this.map = null;
  //               _this.infoOverlays = {};
  //           }

  //           if (option && typeof option === "object") {

  //               _this.Chart.setOption(option, false);
  //               var allDatas = _.concat(plans, datas);
  //               _this.refreshMap(allDatas);
  //           }
  //       },
        /**
         * 数据加载完后刷新右侧数据显示数据
         * @param Array 获取的所有数据对象数组
         */
        initMap: function () {
            var _this = this;
            _this.map = new BMap.Map("allmap");

            var centerPoint = new BMap.Point(window.config.GPS.longitude, window.config.GPS.latitude);

            _this.map.centerAndZoom(centerPoint, window.config.GPS.level);
            _this.map.enableScrollWheelZoom();//设置鼠标滚动缩放
            var ctrl = new BMapLib.TrafficControl({
                showPanel: false,//是否显示路况提示面板
                offset: new BMap.Size(150, 5)
            });//路况信息
            _this.map.addControl(ctrl);//添加控件和比例尺

            ctrl.setAnchor(BMAP_ANCHOR_BOTTOM_LEFT);

            /**屏蔽右键事件*/
            _this.map.addEventListener("rightclick", function (e) {});
            /**地图所有图块加载完成事件*/
            _this.map.addEventListener("tilesloaded", function (e) {
                $("#tcBtn").removeClass("anchorBL");
            });
        },
        refreshMap: function (data) {
            var _this = this;
           
            _this.map.enableScrollWheelZoom();//设置鼠标滚动缩放
            var ctrl = new BMapLib.TrafficControl({
                showPanel: false,//是否显示路况提示面板
                offset: new BMap.Size(150, 5)
            });//路况信息
            _this.map.addControl(ctrl);//添加控件和比例尺

            ctrl.setAnchor(BMAP_ANCHOR_BOTTOM_LEFT);
             
            //地图实例化
            var relOption = {
                lng: window.config.GPS.longitude || null,
                lat: window.config.GPS.latitude || null,
                province: window.config.GPS.province || null,
                city: window.config.GPS.centerCity || null,
                zlevel: window.config.GPS.level || null
            };

            if(relOption.lng&&relOption.lat){
                var centerPoint = new BMap.Point(relOption.lng, relOption.lat);
                if(!refreshBtn){
                    _this.map.centerAndZoom(centerPoint, relOption.zlevel||window.config.GPS.level);
                }
                else{
                    var centerPoint0 = new BMap.Point(newLacotion.lng, newLacotion.lat);
                    _this.map.centerAndZoom(centerPoint0, newZoom);
                }
            }else{
                //根据IP获取当前城市名
                var centerPoint = new BMap.Point(window.config.GPS.longitude, window.config.GPS.latitude);
                function myFun(result){
                    var cityName = result.name;
                    if(urlParams.smallMap==1){
                        _this.smallMap.setCenter(cityName);
                    }
                    _this.map.setCenter(cityName);
                }

                var myCity = new BMap.LocalCity();
                myCity.get(myFun);
            }
            // 设置地图风格
            if(window.config.GPS.mapStyle){
                _this.map.setMapStyle({style:window.config.GPS.mapStyle});
            }
            //清楚覆盖物
            _this.map.clearOverlays();
            if(urlParams.smallMap==1){
                _this.smallMap.clearOverlays();
            }

            if (urlParams.ifStationSym != 0) {
                //川台添加标注
                var myIcon = new BMap.Icon("icons/sssmall.png", new BMap.Size(26, 50));
                var marker2 = new BMap.Marker(centerPoint, {icon: myIcon});  // 创建标注
                _this.map.addOverlay(marker2);              // 将标注添加到地图中
                marker2 = new BMap.Marker(centerPoint, {icon: myIcon});  // 创建标注
                if(urlParams.smallMap==1){
                    _this.smallMap.addOverlay(marker2);              // 将标注添加到地图中
                }
            }

            if (urlParams.drawMouse != 0) {
                /**---框选绘制--begin*/
                var styleOptions = {
                    strokeColor: "red",    //边线颜色。
                    strokeWeight: 3,       //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                    strokeStyle: 'solid' //边线的样式，solid或dashed。
                };
                //实例化鼠标绘制工具
                var drawingManager = new BMapLib.DrawingManager(_this.map, {
                    isOpen: false, //是否开启绘制模式
                    enableDrawingTool: true, //是否显示工具栏
                    drawingToolOptions: {
                        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                        offset: new BMap.Size(5, 5), //偏离值
                    },
                    rectangleOptions: styleOptions //矩形的样式
                });
                var types = ['marker', 'circle', 'polyline', 'polygon'];
                for (var j = 0; j < types.length; j++) {
                    var obj = types[j];
                    $('a[drawingtype="' + obj + '"]').hide();
                }
                //添加鼠标绘制工具监听事件，用于获取绘制结果
                drawingManager.addEventListener('overlaycomplete', overlaycomplete);

                function overlaycomplete(e) {
                    var overlays = [];
                    var path = e.overlay.getPath();
                    var ll, ul;
                    if (path.length == 4) {
                        ll = path[0];
                        ul = path[2];
                        if (!((ul.lat > ll.lat && ul.lng > ll.lng) || (ul.lat < ll.lat && ul.lng < ll.lng))) {
                            ll = path[1];
                            ul = path[3];
                        }
                    }
                    if (ul.lat < ll.lat) {
                        var t;
                        t = ll;
                        ll = ul;
                        ul = t;
                    }
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        if (obj.type == 'user') {
                            if ((obj.x < ul.lng && obj.y < ul.lat) && (obj.x > ll.lng && obj.y > ll.lat)) {
                                overlays.push(obj);
                            }
                        }

                    }

                    _this.map.removeOverlay(e.overlay);
                };
            }
            /**---框选绘制--end*/

            //绘制边界线
            function getBoundary() {
                var bdary = new BMap.Boundary();
                var province = relOption.province || "四川省";
                bdary.get(province, function (rs) {       //获取行政区域
                    //_this.map.clearOverlays();        //清除地图覆盖物
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                        //alert('未能获取当前输入行政区域');
                        return;
                    }
                    var pointArray = [];
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 4,
                            strokeColor: "#ff0000",
                            fillColor: "transparent"
                        }); //建立多边形覆盖物
                        _this.map.addOverlay(ply);  //添加覆盖物
                        pointArray = pointArray.concat(ply.getPath());
                    }
                });
            }

            setTimeout(function () {
                getBoundary();
                if(urlParams.sideTop){
                    $('#allmap .anchorTR').css('top',urlParams.sideTop+'px');
                }
            }, 1000);
            //填充数据
            var data_info = data;
            var taskIndex_i = 0;

            BMapLib.TextIconOverlay.prototype.getStyleByText = function (text, styles) {
                return styles[0];
            };
            var myMarkerStyles = [{
                url: 'icons/user.png',
                size: new BMap.Size(42, 78),
                textColor: '#1d6fac',
                opt_textSize: 14
            }];

            for (var i = 0; i < data_info.length; i++) {
                data_info[i].index = i;
                var myIcon = null, imgPath = null;

                var point = new BMap.Point(data_info[i].x, data_info[i].y);
                if (urlParams.taskSym != 0) {
                    imgPath = "icons/" + data_info[i].type + "_1.png";
                    myIcon = new BMap.Icon(imgPath, new BMap.Size(50, 69));
                    var marker = new BMap.Marker(point, {icon: myIcon});
                }

                // 创建标注
                if (data_info[i].type === 'user') {
                    var name = data_info[i].username;
                    ;
                    if (name.length > 2) {
                        name = name.substr(0,3);
                    }

                    if (urlParams.reporterSym != 0) {
                        marker = new BMapLib.TextIconOverlay(point, name, {styles: myMarkerStyles});
                    }

                    if (urlParams.reporterLine != 0 && urlParams.reporterSym != 0) {
                        var linePoint = [centerPoint, point];
                        var curve = new BMapLib.CurveLine(linePoint, {
                            strokeColor: "#1A87FF",
                            strokeWeight: 2,
                            strokeOpacity: 1
                        }); //创建弧线对象
                        var curveCopy = new BMapLib.CurveLine(linePoint, {
                            strokeColor: "#1A87FF",
                            strokeWeight: 2,
                            strokeOpacity: 1
                        }); //创建弧线对象;
                        _this.map.addOverlay(curve); //添加到地图中
                        
                    }
                }
                var markerCopy = {};
                for(var p in marker){
                    markerCopy[p]=marker[p];
                }
                if (marker)_this.map.addOverlay(marker);// 将标注添加到地图中

                (function (marker,markerCopy, data, point) {
                    if (!marker||!markerCopy)return false;
                    marker.addEventListener("click", function () {
                        _this.buildOverlays(point, data);
                    });
                })(marker,markerCopy, data_info[i], point);

            }
            //更新右侧的列表
            _this.refrenshLayout(data_info);

            $('a[name="appointButton"]').on('click', function () {
                alert("click");
            });

            $('#xt-list-btns span').css('display', 'block');
            inrefresh = 0;

        },
        buildOverlays: function (point, data) {
            var _this = this;
            var infoOverlays = _this.infoOverlays;
            if (data.id) {
                var id = data.id;
            } else if (data.uuid) {
                var id = data.uuid;
            }

            //myCompOverlay.V !=null 修复infowindow.V丢失导致不显示的问题
            //if (!infoOverlays[id] || !infoOverlays[id].V) {

                var myCompOverlay = new CustomInfoWindow(point, data, _this);
                _this.map.addOverlay(myCompOverlay);
                infoOverlays[id] = myCompOverlay;
                $(myCompOverlay._div).trigger('open', function () {
                    $(myCompOverlay._div)
                        .find('button.sendMessage').data('username',data.username)
                        .end()
                        .find('button.voiceCall').data('username',data.username)
                        .end()
                        .find('button.videoConversation').data('username',data.username)

                    //查看素材
                    $('.showBackMaterial').click(function () {
                        var material = $('.dataChoose').data('datas').resMaterial;
                        var imgip = $('.dataChoose').data('imgip');
                        _this.showMaterial(material,imgip);
                        $('#direct').removeClass('miss');
                    });
                });
           // } else {
           //     infoOverlays[id].show();
           // }
        },
        /**
         * 判断对象是否是字符串
         */
        isString:function(obj){
        	return Object.prototype.toString.call(obj) === "[object String]";
        },
        /**
         * 构建map InfoWindow模板
         */
        getInfoWindowTempl: function (data) {
            var _this = this;
            var btnMaterial;
            var tpl = '';
            var btn = '<a class="btn btn-active pull-right" id="' + data.id + '" onclick="showModal(this.id);">指派</a>';
            var ifDirect = '', buttonBtns = '';
            if (data.videostatus == 1) {
                ifDirect = '<span style="color:red">直播中</span>';
            } else {
                ifDirect = '<span style="color:#fff">未直播</span>';
                buttonBtns =
                    '<button  class="voiceCall" id="'+data.usercode+'" style="left:0px;min-width: 188px">语音通话</button>' +
                    '<button  class="videoConversation" id="'+data.usercode+'" style="left:188px;min-width: 188px">视频通话</button>';
            }

            var liveContent = '<label style="font-size: 14px;padding-left: 30px;"><i class="fa fa-video-camera" style="color:#fff;margin-right: 5px;" aria-hidden="true"></i>直播：&nbsp;&nbsp;' + ifDirect + '</label>';
            if (urlParams.live == 0) {
                liveContent = '';
                buttonBtns = '';
            }

            if (data.type != 'user') {
                if (data.resMaterial.length > 0&&urlParams.rightMenu!=0) {
                    btnMaterial = '<a class="btn btn-active pull-right maps-btn showBackMaterial" style ="float:right !important;">回传素材</a>';
                } else {
                    btnMaterial = ''
                }
            }
            if (data.type == 'listplan') {
                tpl = {
                    title: '<div style=" color: #ff9103;font-size: 18px; margin-top: 0; margin-bottom:0px;padding:5px 5px 5px 20px;">' +
                    '<i class="fa fa-times pull-right" aria-hidden="true" style="font-size: 14px;margin-left: 20px;"></i>' +
                    '<label class="text-cut" style="display: block;">' + data.title + '</label></div>',
                    body: '<p style="font-size: 14px;margin-left:20px; margin-bottom:7px;" class="text-cut"><span class="glyphicon glyphicon-map-marker" style="color:#fff;" aria-hidden="true"></span>&nbsp;&nbsp;地点：&nbsp;&nbsp;' + data.positionName + '</p>' +
                    '<p style="font-size: 14px;margin-left:20px;margin-bottom:7px;" ><span class="glyphicon glyphicon-user" style="color:#fff;" aria-hidden="true"></span>&nbsp;&nbsp;创建人：&nbsp;&nbsp;' + data.createUserName + '</p>' +
                    '<p style="font-size: 14px;margin-left:20px;margin-bottom:7px;"><span class="glyphicon glyphicon-time"  style="color:#fff;" aria-hidden="true"></span>&nbsp;&nbsp;发生时间：&nbsp;&nbsp;' + data.createTime + '</p>' +
                    '<p style="font-size: 14px;margin-left:20px;margin-bottom:7px;"><span class="glyphicon glyphicon-star-empty" style="color:#fff;" aria-hidden="true"></span>&nbsp;&nbsp;栏目：&nbsp;&nbsp;' + data.columnName + '</p>' + btnMaterial

                }
            } else if (data.type == 'user') {
                var infoBody = $('<div style="float:left;height: 142px;width: 10%;display: inline-block;"><img src="' + data.imageUrl + '" ' +
                    ' class="img-circle" width="40px;" height="40px;" onerror="javascript:this.src=\'icons/auther3.png\';" style="margin-top: 15px;margin-left: -6px;"></div>' +
                    '<div style="width: 76%;display: inline-block;"><i class="fa fa-times pull-right" style="margin-right: -45px;margin-top: 5px;" aria-hidden="true"></i>' +
                    '<div class="userInfo">' +
                    '<p style="font-size: 16px;padding-left:30px; margin-top: 10px;">' + data.username + '</p>' +
                    '<label style="font-size: 14px;padding-left: 30px;" class="text-cut"><span class="glyphicon glyphicon-map-marker" style="color:#fff;margin-right: 5px;" aria-hidden="true"></span>地点：&nbsp;&nbsp;' + data.address + '</label>' +
                    '<label style="font-size: 14px;padding-left: 30px;"><span class="glyphicon glyphicon-phone" style="color:#fff;margin-right: 5px;" aria-hidden="true"></span>电话：&nbsp;&nbsp;' + data.telphone + '</label>'
                    + liveContent + buttonBtns
                );

                if (_this.rtcCheck && _this.rtcCheck.video) {
                    infoBody.find('#vedioBtn').css("display", "table-cell");
                }
                if (_this.rtcCheck && _this.rtcCheck.audio) {
                    infoBody.find('#voiceBtn').css("display", "table-cell");
                }
                infoBody.find('button').css({
                    border: 'none',
                    'border-right': '1px solid #FFF',
                    background: '#EA3827',
                    outline: 'none',
                    position: 'absolute',
                    width: '125px',
                    color: '#FFF',
                    padding: '6px 0',
                });
                infoBody.find('button.sym').css({
                    width: '375px',
                });
                infoBody.find('button.videoConversation').css({
                    border: 'none',
                });

                tpl = {
                    body: infoBody
                }
            }

            return tpl;
        },
        /**
         * 初始化和事件改变时，构建右侧的列表
         */
        refrenshLayout: function (data_info) {
            var _this = this,
                $xt_list = $('#xt-list'),
                $user_list = $('#user-list'),
                adds = [],
                xtList = [],
                userList = [];
            $.each(data_info, function (index, data) {
                if (data.type == "listplan") {
                    xtList.push(_this.getListplanTempl(data));
                } 
                else if (data.type == "user") {
                    userList.push(_this.getUserTempl(data));
                    adds.push(data);
                }
            });
            if (xtList.length == 0) {
                xtList.push('<p class="no-data">无数据！</p>');
            }
            if (userList.length == 0) {
                userList.push('<p class="no-data">无数据！</p>');
            }
            $xt_list.empty().append(xtList);
            $user_list.empty().append(userList);

            //默认展示首个素材或者直播列表
            if ($('#xt-list-btns .btn-active').attr('id') == 'xt-list-btn') {
                var material = [];
                var imgip = "";
                if ($xt_list.find('.panel-wrap').length != 0) {
                    $xt_list.find('.panel-wrap').eq(0).addClass('dataChoose');
                    material = $('.dataChoose').data('datas').resMaterial;
                    imgip = $('.dataChoose').data('imgip');
                    console.log($('.dataChoose').data('datas').resMaterial)
                }
                _this.showMaterial(material,imgip);
            } else if ($('#xt-list-btns .btn-active').attr('id') == 'user-list-btn') {
                _this.showDirect();
            }

            var myGeo = new BMap.Geocoder();
            var index = 0;

            function bdGEO() {
                if (adds.length > 0) {
                    var data = adds[index];
                    geocodeSearch(data);
                    index++;
                }
            }

            function geocodeSearch(data) {
                if (index < adds.length - 1) {
                    setTimeout(bdGEO, 100);
                }
                var point = new BMap.Point(data.x, data.y);
                var geoc = new BMap.Geocoder();
                myGeo.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    var address = [];
                    if (addComp.city)
                        address.push(addComp.city);
                    if (addComp.district)
                        address.push(addComp.district);
                    if (addComp.street)
                        address.push(addComp.street);

                    data.address = address.join("");
                    var user = $("#" + data.id + " p.userAddress");
                    if (user)
                        user.empty().append('<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>地点:&nbsp;&nbsp;' + data.address);

                });
            }
            bdGEO();
        },
        showVedioCall: function (data, callType) {
            var _this = this;
            var data = {
                name: data.username,
                url: data.imageUrl,
                phone: data.telphone,
                location: data.address
            }
            if (!_this.rtcInstance) {
                _this.initRTC();
            }
            _this.rtcInstance.call(callType, data);
        },
        getListplanTempl: function (data) {
		
            data.flowStatus = '回传素材';
            var _this = this,
                flowStatus = data.flowStatus,
                btn = '';
            if (data.resMaterial.length > 0&&urlParams.rightMenu!=0) {
                btn = '<button class="btn btn-active btn-sm remData">回传素材</button>'
            } else {
                btn = ''
            }

            var listplanDIV = '<div class="panel-wrap"><div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<p style="font-size: 18px;margin: 0;color: #ff9103;"><label class="text-cut">' + data.title + '</label></p>' +
                '</div><div class="panel-body" style="padding:15px 15px 0 15px;">' +
                '<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span>日期:&nbsp;&nbsp;' + data.createTime + '</p>' +
                '<p><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>地点:&nbsp;&nbsp;' + data.positionName + '</p>' +
                '<p><span class="glyphicon glyphicon-user" aria-hidden="true"></span>创建人:&nbsp;&nbsp;' + data.createUserName + '</p>' +
                '<p><span class="glyphicon glyphicon-film" aria-hidden="true"></span>栏目:&nbsp;&nbsp;' + data.columnName + '</p>' +
                '<p><i class="fa fa-user-md" aria-hidden="true"></i>执行人:&nbsp;&nbsp;' + data.executorName+ '</p>' +
                //'<p>'+data.context+'</p></div>'+
                '<div class="panel-footer panel-footer-material">' + btn + '</div></div></div>';

            var $div = $(listplanDIV);

            $div.data('datas', data);
            $div.data('imgip', data.imgip);
            $div.on('click', function () {
                resc = 1;
                $('.dataChoose').removeClass('dataChoose');
                $(this).addClass('dataChoose');
                //获取素材数据并写入右侧展示区
                var material = $('.dataChoose').data('datas').resMaterial;
                var imgip = $('.dataChoose').data('imgip');
                _this.showMaterial(material,imgip);

                var point = new BMap.Point(data.x, data.y);

                _this.map.setCenter(point);//将改点设置为中心
                var infoOverlays = _this.infoOverlays;
                var id = data.id;
                _this.buildOverlays(point, data);

            }).on('click', 'button.btn-active', function () {
                $('#direct').removeClass('miss');
            });
            $div.on('click', 'a.playVideo', function (e) {
                e.preventDefault();
                var index = $(this).attr('data-index');
                _this.playVideo(videos, index);
            });
            return $div;
        },
        getUserTempl: function (data) {
            var _this = this;
            var name = data.username;
            var canCall = true;

            var ifDirect = '', liveContent = '', stylemargin = 'margin-bottom: 37px;';
            if (data.videostatus == 1) {
                ifDirect = '<span style="color:red">直播中</span>';
            } else {
                ifDirect = '<span style="color:#fff">未直播</span>';
            }
            if (urlParams.live != 0) {
                liveContent = '<p style="font-size:15px;margin-left:-14px" >当前状态:&nbsp;&nbsp;' + ifDirect + '</p>';
                stylemargin = '';
            }
            var userTemps = ['<div class="panel-wrap" id="' + data.id + '">',
                '<div class="panel panel-default">',
                '<div class="panel-heading" style="display: inline-block;padding:15px 0;border-bottom: none;">',
                '<div style="width: 100px;">',
                '<img src="' + data.imageUrl + '" onerror="javascript:this.src=\'icons/auther3.png\';" alt="..." class="img-thumbnail">',
                '</div>',
                '</div>',
                '<div class="panel-body" style="width: 160px;display: inline-block;float: right;padding: 15px 5px;">',
                '<p style="color:#ff9103;font-size: 18px;font-weight:600;margin-left:-25px;' + stylemargin + '">&nbsp;&nbsp;' + name + '</p>' + liveContent,
                '<p style="margin: 0 0 5px -90px;color: #fff;"><span style="margin-right: 15px;color: #c6c6c6 !important;" class="glyphicon glyphicon-time" aria-hidden="true"></span>日期:&nbsp;&nbsp;' + data.time + '</p>',
                '<p style="margin: 0 0 5px -90px;color: #fff;" class="userAddress text-cut"><span class="glyphicon glyphicon-map-marker" style="margin-right: 15px;"  aria-hidden="true"></span>地点:&nbsp;&nbsp;' + data.address + '</p>',
                '<p style="margin: 0 0 5px -90px;color: #fff;"><span style="margin-right: 15px;" class="glyphicon glyphicon-phone" aria-hidden="true"></span>电话:&nbsp;&nbsp;' + data.telphone + '</p>',
                '</div>',
                '<div class="panel-footer" style="padding: 0;">',
                '</div>',
                '</div>',
                '</div>'];

            var $userDIV = $(userTemps.join(""));

            //绑定数据
            $userDIV.data('datas', data);

            if (_this.rtcCheck && _this.rtcCheck.video) {
                $userDIV.find('a.a-video').css("display", "table-cell");
            }
            if (_this.rtcCheck && _this.rtcCheck.audio) {
                $userDIV.find('a.a-audio').css("display", "table-cell");
            }

            $userDIV.on('click', function (event) {
                resc = 1;
                //获取视频地址数据
                $('.directChoose').removeClass('directChoose');
                $(this).addClass('directChoose');
                var urlDatas = $('.directChoose').data('datas');
                if (urlDatas.videostatus == 1) {
                    _this.showDirect(urlDatas);
                } else {
                    $('.directChoose').removeClass('directChoose');
                }

                event.preventDefault();
                var point = new BMap.Point(data.x, data.y);

                _this.map.setCenter(point);//将改点设置为中心
                _this.buildOverlays(point, data);
            });

            return $userDIV;
        },
        //展示任务回传素材
        showMaterial: function (material,imgip) {
        	var material = material;
        	var imgip = imgip;
            var _this = this;
            $('#direct .headDir').html('<span>回传素材</span>');
            $('#direct .bottomDir').show().html('');
            $('#direct .contentDir').show().html('');
            var length = 0;
            
            for(var i=0;i<material.length;i++){
            	if(_this.isString(material[i])){
            		material[i] = JSON.parse(material[i]);
            	}
                var imgurl = (material[i].streamMediaUrl[0]).replace("${REQUEST_IP}",imgip)
                material[i].streamMediaUrl[0] = imgurl
                var vdurl = (material[i].keyFrameUrl[0]).replace("${REQUEST_IP}",imgip)
                material[i].keyFrameUrl[0] = vdurl
            }

            if (material.length == 0) {
                $('#direct .contentDir').html('<div class="nowShow"><span>暂无素材</span></div>');
                for (var i = 0; i < 9; i++) {
                    var content = '<div class="imgShow" data-type=""><img src="icons/material.png" /><span>采集中...</span></div>';
                    $('#direct .bottomDir').append(content);
                }
            } else {
            	
                //加入第一个预览
                if (material[0].type != "biz_sobey_video") {
                    $('#direct .contentDir').html('<span>' + material[0].name + ':</span><div class="nowShow"><p><img src="' + material[0].streamMediaUrl + '" /></p></div>');
                } 
                else if (material[0].type == "biz_sobey_video") {
                    if (material[0].keyFrameUrl== '')$('#direct .contentDir').html('<div class="nowShow"><span>请选择素材</span></div>');
                    ;
                    $('#direct .contentDir').html('<span>' + material[0].name + ':</span><div class="nowShow"><video controls style="width:100%;height:260px;" src="' + material[0].streamMediaUrl + '" poster="' + material[0].keyFrameUrl+ '"></video></div>');
                }
                //加下方预览列表
                for (var i = 0; i < material.length; i++) {
                	
                    if (material[i].type != "biz_sobey_video") {
                        length++;
                        var content = '<div class="imgShow" style="background:url(' + material[i].streamMediaUrl + ');background-size: cover;background-position: center;" data-type="1"><img class="img" src="' + material[i].streamMediaUrl + '" /><span>' + material[i].name + '</span></div>';
                        $('#direct .bottomDir').append(content);
                    } 
                    else if (material[i].type == "biz_sobey_video") {
                        if (material[i].keyFrameUrl!= '') {
                            length++;
                            var content = '<div class="imgShow" style="background:url(' + material[i].keyFrameUrl+ ');background-size: cover;background-position: center;" data-type="biz_sobey_video"> <img class="video" src="' + material[i].keyFrameUrl+ '" id="' + material[i].streamMediaUrl + '" />' +
                                '<img class="videosym" src="icons/play (1).png" /><span>' + material[i].name + '</span></div>';
                            $('#direct .bottomDir').append(content);
                        }
                    }
                    if ($('.bottomDir .imgShow').eq(0).data('type') != "biz_sobey_video" || $('.bottomDir .imgShow').eq(0).data('type') == "biz_sobey_video") {
                        $('.bottomDir .imgShow').eq(0).addClass('matordirChoosed')
                    }
                }

                _this.fillFull(length, 'material');
                $('#direct .imgShow').unbind('click').click(function () {
                    $('.matordirChoosed').removeClass('matordirChoosed');
                    if ($(this).data('type') != "biz_sobey_video") {
                        $(this).addClass('matordirChoosed');
                        $('#direct .contentDir').html('<span>' + $(this).find('span').text() + ':</span><div class="nowShow"><p><img src="' + $(this).find('.img').attr('src') + '" /></p></div>')
                    } else if ($(this).data('type') == "biz_sobey_video") {
                        $(this).addClass('matordirChoosed');
                        $('#direct .contentDir').html('<span>' + $(this).find('span').text() + ':</span><div class="nowShow"><video controls style="width:100%;height:260px;" ' +
                            'src="' + $(this).find('.video').attr('id') + '" poster="' + $(this).find('.video').attr('src') + '"></video></div>');
                    }
                })
            }
        },
        //展示直播组列表
        showDirect: function (urldatas) {

            if (urlParams.live == 0) {
                return false;
            }

            var _this = this;
            $('#direct .headDir').html('<span class="groupLive">直播</span>');
            _this.groupLiveBox();
        },
        //当素材或这直播数不足9时填充满
        fillFull: function (num, type) {
            if (num < 9) {
                var leave = 9 - num,
                    href = '',
                    text = '';
                if (type == 'material') {
                    href = 'icons/material.png',
                        text = '采集中...';
                } else if (type == 'direct') {
                    href = 'icons/live.png',
                        text = '频道';
                }
                for (var i = 0; i < leave; i++) {
                    var content = '<div class="imgShow"><img src = "' + href + '" /><span>' + text + ifIndex(i) + '</span></div>';
                    $('#direct .bottomDir').append(content);
                }
                function ifIndex(n) {
                    if (type == 'direct') {
                        return num + n + 1;
                    } else {
                        return '';
                    }
                }
            }
        },
        //查询
        queryData: function (url, params, callback) {
          	var _url = url || "",
                _params = params || "",
                _callback = callback || $.noop();

            $.ajax({
                type: "post",
                url: _url,
                async:false,
                data: JSON.stringify(_params),
                "timeout": 20000,
                dataType:"json",
                contentType:"application/json",
                success: function (response) {
                  	console.log(response)
                    _callback(response, "listplan");
                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText == 'timeout') {
                    	alert('服务器响应超时');
                    }
                }
            })
        },
        // 加载直播组中记者列表
        queryLiveGroupRe:function(dataList){
            // $(".jizhe-list ul").html("");
            console.log(dataList);
            if(dataList.length==0||dataList==undefined){
                $(".jizhe-list ul").html("<li><p>无数据！</p><li>")
                $(".users-list ul").html("<li><p>无数据！</p><li>")
            }
            else{
                $(".jizhe-list ul").html("")
                $(".users-list ul").html("")
                for(var i=0;i<dataList.length;i++){
                    var username = dataList[i].username;
                    var usercode = dataList[i].usercode;
                    var imageUrl = dataList[i].imageUrl;
                    var department = dataList[i].department||"无";
                    $(".jizhe-list ul").append('<li data-code="'+usercode+'"><img src="'+imageUrl+'"/><p>'+username+'</p><p>部门：'+department+'</p></li>')
                    $(".users-list ul").append('<li data-code="'+usercode+'"><img src="'+imageUrl+'"/><p>'+username+'</p><p>部门：'+department+'</p></li>')
                }
            }
        },
        // 查询直播组列表
        groupLiveBox:function(){
            $('#direct .bottomDir').hide();
            $('#direct .contentDir').hide();
            $('#direct .groupLiveBox').show().html('<div id="createGroupBtn"><a href="##" id="createBtn">新建直播组</a><a href="##" id="examineLive">直播审核</a></div><ul id="groupLiveList"></ul>');

            $.ajax({
                url: window.config.apiAddress+"/mhq-im-mservice/reserve/search.json?pageNO=1&pageSize=10&checkStatus=2",
                type: 'get',
                dataType: 'json',
                success: function (res) {
                    if(res.data){
                        var dataList = res.data;
                        var liveNumber = 0;
                        $("#groupLiveList").html("");
                        console.log("直播列表：",dataList)
                        for(var i=0;i<dataList.length;i++){
                            var checkStatus = dataList[i].checkStatus;
                            var members = dataList[i].members;
                            var memberArr = [];
                            if(checkStatus==4){
                                // 正在直播
                                liveNumber++;
                                for(var j=1;j<members.length;j++){
                                    memberArr.push(members[j].userName)
                                }
                                $("#groupLiveList").append('<li data-id="'+dataList[i].id+'"><h3>直播主题：<span>'+dataList[i].title+'（直播中）</span></h3><p><span>'+dataList[i].beginTime+' 开始直播<span></p><p>直播时长：'+dataList[i].liveTime+'分钟</p><p>组长：'+dataList[i].userName+'</p><p>组员：'+memberArr.join(",")+'</p></li>')
                                // <a href="##" class="changeUsers">增减组员</a>
                            }
                            else if(checkStatus==2){
                                // 审核通过未直播
                                liveNumber++;
                                for(var j=1;j<members.length;j++){
                                    memberArr.push(members[j].userName)
                                }
                                $("#groupLiveList").append('<li data-id="'+dataList[i].id+'"><h3>直播主题：<span>'+dataList[i].title+'（未开始）</span></h3><p><span>'+dataList[i].beginTime+' 开始直播<span></p><p>直播时长：'+dataList[i].liveTime+'分钟</p><p>组长：'+dataList[i].userName+'</p><p>组员：'+memberArr.join(",")+'</p></li>')
                                // <a href="##" class="changeUsers">增减组员</a>
                            }
                        }
                        if(liveNumber==0){
                            console.log("无直播列表！")
                            $('#direct .groupLiveBox')
                            .html('<div id="createGroupBtn"><a href="##" id="createBtn">新建直播组</a><a href="##" id="examineLive">直播审核</a></div><p style="color:#fff;line-height:30px;text-align:center;">无直播的组！</p>')
                        }
                    }
                }
            })
        }
    });

    window.Map = Map;

})(window.jQuery, window.DateUtil, window.listplanService, echarts);