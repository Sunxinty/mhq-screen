/**
 * 时间utils函数
 * @author lg
 * @update 2016-08-11
 */
var DateUtil =(function(){
    function _Date(){};

    _Date.prototype = {
        /**
         * 日期格式化,格式化为指定的日期格式并返回格式化后的字符串
         * eg:DateUtil.format(new Date(),"yyyy-MM-dd hh:mm:ss")
         */
        format:function(date, fmt){
            var o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds()                 //秒

            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        },
        /**
         * 根据指定日期获取下一周的时间
         */
        getWeek:function(date){
            var date = date || new Date();
            var monday = new Date(date.getTime());
            var sunday = new Date(date.getTime());
            monday.setDate(monday.getDate()+1-monday.getDay());
            sunday.setDate(sunday.getDate()+7-sunday.getDay());
            return {monday:monday, sunday:sunday};
        },
        /**
         * 根据指定日期获取上一周的时间
         */
        getPreviousWeek:function(date){
            var date = date || new Date();
            //返回date是一周中的某一天
            var week = this._GetWeek(date).monday;
            //返回date是一个月中的某一天
            // var month = this.getDate();
            //一天的毫秒数
            var millisecond = 1000*60*60*24;

            //上周最后一天即本周开始的前一天
            var priorWeekLastDay = new Date(week.getTime()-millisecond);
            //上周的第一天
            var priorWeekFirstDay = new Date(priorWeekLastDay.getTime()-(millisecond*7));
            return {preWeekMondy:priorWeekFirstDay, preWeekSunday:priorWeekLastDay};
        },
        /**
         * 获取最近某天的日期
         */
        getLastNdays : function(n) {
            var n = n;
            var d = new Date();
            var year = d.getFullYear();
            var mon = d.getMonth() + 1;
            var day = d.getDate();
            if (day <= n) {
                if (mon > 1) {
                    mon = mon - 1;
                } else {
                    year = year - 1;
                    mon = 12;
                }
            }
            d.setDate(d.getDate() - n);
//			year = d.getFullYear();
//			mon = d.getMonth() + 1;
//			day = d.getDate();
//			s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-"
//					+ (day < 10 ? ('0' + day) : day);

            return this.format(d,"yyyy-MM-dd");
        },
        /**
         * 获取当前时间
         */
        getNow: function(){
            return this.format(new Date(),"yyyy-MM-dd hh:mm:ss");
        },
        /**
         * 获取当前日期
         */
        getToday: function(){
            return this.format(new Date(),"yyyy-MM-dd");
        },
        getParam: function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  decodeURI(r[2]); return null;

        },
        /**
         * 将对象转成url字符串
         * @param  {[object]} param 需要转成url参数的对象
         * @param  {[type]} key URL参数字符串的前缀
         * @param  {[type]} encode true/false 是否进行URL编码,默认为true
         * @return {[type]} url字符串 &name=aa&age=20
         */
        urlEncode : function(param, key, encode){
            if(param==null) return '';
            var paramStr = '';
            var t = typeof (param);
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
            } else {
                for (var i in param) {
                    var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                    paramStr += this.urlEncode(param[i], k, encode);
                }
            }

            return paramStr;
        }

    }

    if ( typeof define === "function" && define.amd ) {
        define( "dateUtil", [], function() {
            return new _Date();
        });
    }

    return new _Date();
})();