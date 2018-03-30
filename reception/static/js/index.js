//初始化 Top对象
let Top = new Vue({
    el:"#top",
    data:{
        title:"融合媒体报道指挥监看系统",
        settingUrl:Json.settingUrl
    },
    methods:{
        //进入后台设置页面
        open: function(whereUrlToGo){
            window.open(whereUrlToGo);
        }
    }
});

//初始化 Container对象
let Container = new Vue({
    el:"#container",
    data:{
        list:[],
        centerSrc:"static/imgs/index/selected.png",
        whichList:{},
        deg:0,             //根据块块个数计算每个块块的角度
        imgWIDTH:258,      //每个块块的宽度
        turnIndex:0,     //转动了多少个单位
        Index:0           //正面展示哪一个块块
    },
    watch: {
        list:function(arr){
            var len = arr.length;
            this.deg = 360/len;
            this.layout();
        }
    },
    mounted: function () {
        loadData();
    },
    methods:{
        //根据元素的个数，进行布局
        layout:function(){
            var width = this.imgWIDTH;
            var deg = this.deg;
            var r = width / 2 / Math.tan(deg / 2 / 180 * Math.PI);
            // var Z = r+20;
            var Z = 700;
            setTimeout(function(){
                $(".station ul li").each(function(index,elem){
                    var rad = deg*index;
                    $(this).css("transform","rotateY("+rad+"deg) "+"translateZ("+Z+"px) "+"rotateX("+30+"deg) ");
                    if(index===0){
                        $(this).css("opacity","0");
                    }
                });
            },30);
        },
        left: function() {
            //控制中间大转盘选取的块块
            var len = this.list.length;
            var maxIndex = len-1;
            if(this.Index===0){
                this.Index=maxIndex
            }else{
                this.Index--
            }
            //控制转盘转动
            this.turnIndex++;
            //执行
            this.action();
        },
        right: function() {
            //控制中间大转盘选取的块块
            var len = this.list.length;
            var maxIndex = len-1;
            if(this.Index===maxIndex){
                this.Index=0
            }else{
                this.Index++
            }
            //控制转盘转动
            this.turnIndex--;
            //执行
            this.action();
        },
        action: function(){
            //转盘转动
            var ti = this.turnIndex;
            var Y = ti*this.deg;
            $(".station ul").css("transform","rotateY("+Y+"deg)");
            //中间选取的值改变
            var i = this.Index;
            this.$set(this,'whichList', this.list[i]);
            $(".station ul li").each(function(index,elem){
                if(index===i){
                    $(this).css("opacity","0");
                }else{
                    $(this).css("opacity","1");
                }
            });
        },
        //进入点击的页面
        open: function(whereUrlToGo){
            window.open(whereUrlToGo);
        },
        //进入正中间选中的页面
        openSelected: function(whereUrlToGo){
            window.open(whereUrlToGo);
        }
    }
});

//读取个性化配置
function loadData(){
    $.ajax({
        url:HTTP.url+"allocation/search/SOBEY_MHQ_HOME",
        type:"get",
        success:function(result){
            console.log(result.data);
            if(result.data){
                var RADIO_BG = result.data.imgtype;
                changeBG("",RADIO_BG);     //背景
                var RADIO_THEME = result.data.theme;
                changeTHEME(RADIO_THEME);  //主题
            }
        },
        error:function(error){
            console.log(error.msg||"请求异常",2000);
        }
    });
}
function changeBG(BG_URL,RADIO_BG){
    //更改背景
    $("body").css("background-image","url('static/imgs/index/bg"+RADIO_BG+".png')");
}
function changeTHEME(RADIO_THEME){
    //更改主题
    if(RADIO_THEME===1){
        Vue.set(Container,"list",Json.summer);
        Vue.set(Container,"whichList",Json.summer[0]);
    }else if(RADIO_THEME===2){
        Vue.set(Container,"list",Json.spring);
        Vue.set(Container,"whichList",Json.spring[0]);
    }
}