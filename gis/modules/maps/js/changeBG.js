//读取后台管理设置页面的配置信息
function loadData(){
    $.ajax({
        url:HTTP.url+"allocation/search/SOBEY_MHQ_GIS",
        type:"get",
        success:function(result){
            console.log(result.data);
            if(result.data){
                var TITLE = result.data.title;
                $("#TITLE").val(TITLE);
                var RADIO_BG = result.data.imgtype;
                var BG_URL = result.data.backgroundurl;
                //更改背景
                if(RADIO_BG===0){
                    $("body").css("background-image","url("+BG_URL+")");
                }else{
                    $("body").css("background-image","url('icons/bg"+RADIO_BG+".png')");
                }
            }
        },
        error:function(error){
            console.log(error.msg||"请求异常",2000);
        }
    });
}
loadData();