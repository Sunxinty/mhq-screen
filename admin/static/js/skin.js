//提交表单
function article_save_submit(){
    var RADIO_BG=$('input:radio[name="radio-bg"]:checked').val();
    $.ajax({
        "url":HTTP.url+"alloction/changeSkin?imgtype="+RADIO_BG,
        "type":"post",
        "dataType":"json",
        "contentType":"application/json",
        "success":function(result){
            $.Huimodalalert('保存成功',2000);
        },
        "error":function(error){
            $.Huimodalalert(error.msg||"保存失败",2000);
        }
    });

}
//读取配置
function loadData(){
    $.ajax({
        url:HTTP.url+"allocation/search/SOBEY_MHQ_HOME",
        type:"get",
        success:function(result){
            console.log(result.data);
            if(result.data){
                var RADIO_BG = result.data.imgtype;
                $('#DEFULT'+RADIO_BG).prop('checked',true);
            }
        },
        error:function(error){
            $.Huimodalalert(error.msg||"请求异常",2000);
        }
    });
}

$(function(){

    //页面加载后加载配置
    setTimeout(function(){
        loadData();
    },300);


});