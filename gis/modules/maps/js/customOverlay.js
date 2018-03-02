//添加复杂的覆盖物
// 自定义InfoWindow
function CustomInfoWindow(point, data, that) {
    this._point = point;
    this._data = data;
    this._that = that;
}
CustomInfoWindow.prototype = new BMap.Overlay();

CustomInfoWindow.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    var zIndex = BMap.Overlay.getZIndex(this._point.lat);
    var divStyle = {
        'border-radius': '5px',
        'position': 'absolute',
        'zIndex': zIndex,
        'background-color': '#2D6099',
        'height': '153px',
        'width': '375px',
        'font-size': '18px',
        'color': '#fff',
        'opacity': '0.78',
    };
    var background = "url(icons/label.png) no-repeat";
    if (this._data.type == 'listplan') {
        background = "url(icons/label2.png) no-repeat";
    }
    var arrowStyle = {
        'background': background,
        'position': 'absolute',
        'width': '70px',
        'height': '41px',
        'top': '143px',
        'left': '175px',
        'overflow': 'hidden'
    };
    var url = location.search;
    if (url) {
        var datas = url.slice(1).split('&'), params = {};
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i].split('=');
            params[data[0]] = data[1];
        }
        if (params.live == 0) {
            window.ifNeedLive = 0;
        }
    }
    if (this._data.type == 'user') {
        divStyle['background-color'] = "#143B66";
        if (window.ifNeedLive != 0 && window.voiceCall == 1) {
            divStyle.height = '180px';
            arrowStyle.top = '180px';
        } else if (window.ifNeedLive != 0 && window.voiceCall != 1) {
            divStyle.height = '153px';
            arrowStyle.top = '143px';
        } else {
            divStyle.height = '123px';
            arrowStyle.top = '123px';
        }
    }

    $(div).css(divStyle);
    //$(div).append();
    /*             div.style.position = "absolute";
     div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
     div.style.backgroundColor = "#EE5D5B";
     div.style.border = "1px solid #BC3B3A";
     div.style.color = "white";
     div.style.height = "180px";
     div.style.width = "200px";
     div.style.padding = "2px";
     div.style.lineHeight = "18px";
     div.style.whiteSpace = "nowrap";
     div.style.MozUserSelect = "none";
     div.style.fontSize = "12px"*/
    // var span = this._span = document.createElement("span");
    //div.appendChild(span);
    //span.appendChild(document.createTextNode(this._text));
    var that = this;
    //小三角定义
    var arrow = this._arrow = document.createElement("div");

    $(arrow).css(arrowStyle);
    /*arrow.style.background = background;
     arrow.style.position = "absolute";
     arrow.style.width = "70px";
     arrow.style.height = "41px";
     arrow.style.top = "200px";
     arrow.style.left = "210px";
     arrow.style.overflow = "hidden";*/
    var opt = this._that.getInfoWindowTempl(this._data);
    $(div).append($(arrow)).append(opt.title).append(opt.body).addClass("myInfowindow");
    $(div).on('click', 'i.fa-times', function (e) {
        e.preventDefault();
        that.hide();
    });
    
    //$(div).append("<br><input id='call1' onclick='window.open(\"../maps/index2.html?vidioUserId=wzh_iv&type=0\",\"_blank\",\"width=800,height=800\")' type='button' value='语音通话'>");
    //$(div).append("<br><input id='call2' onclick='window.open(\"../maps/index2.html?vidioUserId=wzh_iv&type=1\",\"_blank\",\"width=800,height=800\")' type='button' value='视频通话'>");
    
    $(div).bind('open', function (e, handler) {
        $('div.myInfowindow').each(function () {
            $(this).hide();
        });
        $(this).show();
        if (handler) {
            handler();
        }
    });
    /*
     div.onmouseover = function(){
     this.style.backgroundColor = "#3067A0";
     this.style.borderColor = "#3067A0";
     this.getElementsByTagName("span")[0].innerHTML = that._overText;
     arrow.style.backgroundPosition = "0px -20px";
     }

     div.onmouseout = function(){
     this.style.backgroundColor = "#3067A0";
     this.style.borderColor = "#3067A0";
     this.getElementsByTagName("span")[0].innerHTML = that._text;
     arrow.style.backgroundPosition = "0px 0px";
     }
     */
    map.getPanes().floatPane.appendChild($(div).get(0));

    return $(div).get(0);
}
//实现显示方法    
CustomInfoWindow.prototype.show = function () {
    var div = this._div;
    if (div) {
        div.style.display = "";
        $(div).trigger('open');
    }
}
// 实现隐藏方法  
CustomInfoWindow.prototype.hide = function () {
    if (this._div) {
        this._div.style.display = "none";
    }
}
CustomInfoWindow.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    var left = pixel.x - parseInt(this._div.style.width) / 2 - 10;

    //this._div.style.left = pixel.x - parseInt(this._div.style.width) / 2 + 41+ "px";
    var top = pixel.y - parseInt(this._div.style.height) - parseInt(this._arrow.style.height);
    if (this._data.type === 'user') {
        //left += 20;
        //top -= 15;
        left += 32;
        top -= 47;
    }
    this._div.style.left = left + "px";
    this._div.style.top = top + "px";
}


//记者定位自定义覆盖物
function UserPosition(point, data, that) {
    this._point = point;
    this._data = data;
    this._that = that;
}
UserPosition.prototype = new BMap.Overlay();

UserPosition.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    var zIndex = BMap.Overlay.getZIndex(this._point.lat);
    console.log("zIndex=" + zIndex);
    $(div).css({
        'position': 'absolute',
        'zIndex': 120000,
        'background-color': 'transparent',
        'height': '78px',
        'width': '78px',
        'font-size': '18px',
        'color': '#fff',
        'background-image': 'url(icons/user.png)',
        'background-repeat': 'no-repeat',
        'background-position': 'bottom center'
    });

    var that = this;
    //var img = document.createElement("img");
    //img.src = this._data.imageUrl;//头像
    ////当头像未加载出来时使用默认头像
    //img.onerror = function (e) {
    //	this.src = 'icons/auther3.png';
    //}
    ////img.src = 'icons/user1.png';//头像
    //$(img).css({
    //    'width': '57%',
    //    'height': '57%',
    //    'position': 'absolute',
    //    'top': '8px',
    //    'left': '17px'
    //});

    var img = document.createElement("div");
    img.innerHTML = this._data.username.substr(1);//名字
    //当头像未加载出来时使用默认头像
    $(img).css({
        'width': '38px',
        'height': '38px',
        'lineHeight': '38px',
        textAlign: 'center',
        'position': 'absolute',
        'top': '3px',
        'left': '3px',
        fontSize: '14px',
        color: '#1d6fac'
    });

    $(img).addClass('img-circle');
    $(div).append($(img));
    $(div).addClass("user-positon");
    if (parseInt(this._data.videostatus)) {
        $(div).addClass("animated infinite bounce");
    }

    /*
     var arrow = this._arrow = document.createElement("div");
     var background = "url(icons/label.png) no-repeat";
     if (this._data.type == 'listplan') {
     background = "url(icons/label2.png) no-repeat";
     }
     arrow.style.background = background;
     arrow.style.position = "absolute";
     arrow.style.width = "70px";
     arrow.style.height = "41px";
     arrow.style.top = "200px";
     arrow.style.left = "210px";
     arrow.style.overflow = "hidden";
     div.appendChild(arrow);*/
    //var opt = this._that.getInfoWindowTempl(this._data);
    //$(div).append(opt.title);
    //$(div).append(opt.body);
    //$(div).addClass("myInfowindow");
//	$(div).on('click', 'i.fa-times', function(e) {
//		e.preventDefault();
//		that.hide();
//	});
//	$(div).bind('open',function(){
//		$('div.myInfowindow').each(function(){
//			$(this).hide();
//		});
//		$(this).show();
//	});
    /*
     div.onmouseover = function(){
     this.style.backgroundColor = "#3067A0";
     this.style.borderColor = "#3067A0";
     this.getElementsByTagName("span")[0].innerHTML = that._overText;
     arrow.style.backgroundPosition = "0px -20px";
     }

     div.onmouseout = function(){
     this.style.backgroundColor = "#3067A0";
     this.style.borderColor = "#3067A0";
     this.getElementsByTagName("span")[0].innerHTML = that._text;
     arrow.style.backgroundPosition = "0px 0px";
     }
     */
    map.getPanes().markerPane.appendChild($(div).get(0));

    return $(div).get(0);
}
//实现显示方法    
UserPosition.prototype.show = function () {
    var div = this._div;
    if (div) {
        div.style.display = "";
        $(div).trigger('open');
    }
}
//实现隐藏方法  
UserPosition.prototype.hide = function () {
    if (this._div) {
        this._div.style.display = "none";
    }
}
UserPosition.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._div.style.width) / 2 + 15 + "px";
    this._div.style.top = pixel.y - parseInt(this._div.style.height) + 5 + "px";
}