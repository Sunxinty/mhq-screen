var myApp= angular.module("myApp", []);
myApp.controller('myfirstcontroller',['$scope','getData',function ($scope,getData) {

    getData(function (data) {
        $scope.ondutyTitle=data.data.ondutyTitle;
        $scope.editorMaster=data.data.watchman;
        var newwatchdata =[];
        var watchdata = JSON.parse(data.data.watchdata);
        //合并相同栏目的人物
        for(let i=0;i<watchdata.length;i++){
            newwatchdata.push({
                title:watchdata[i].title,
                data:[]
            });
            let lanmu = watchdata[i].data;
            for(let j=0;j<lanmu.length;j++){
                let hasThisTitle = false;
                let title = lanmu[j].title;
                let person = lanmu[j].person[0];
                for(let k=0;k<newwatchdata[i].data.length;k++){
                    if(title===newwatchdata[i].data[k].title){
                        hasThisTitle = true;
                        newwatchdata[i].data[k].person.push(person)
                    }
                }
                if(!hasThisTitle){
                    newwatchdata[i].data.push({
                        title:title,
                        person:[person]
                    })
                }
            }
        }
        $scope.page=newwatchdata;
    });

}]);

myApp.service('getData', ['$http',function ($http) {
    var data= function (suc) {
        $http.get(HTTP.url+"rest/search/watchdata").success(function (data) {
            suc(data);
        }).error(function (data) {
            alert(data);
        })
    };
    return data;
}]);

//请求管理设置数据
function getSettings() {
    $.ajax({
        type: "GET",
        url:HTTP.url+"allocation/search/SOBEY_MHQ_ONDUTYPLAN",
        dataType: 'json',
        success: function(response){
            let result = response.data;
            const REQUEST = parseInt(result.reqtime)*1000||36000;
            const PLAY = parseInt(result.carouseltime)*1000||6000;
            const TITLE = result.title||"值班安排";
            const RADIO_BG = parseInt(result.imgtype)||0;
            const BG_URL = result.backgroundurl;
            //定时刷新页面
            setInterval(function(){
                location.reload();
            },REQUEST);
            //重置标题
            $("#top>.top_title").html(TITLE);
            //更改背景
            if(RADIO_BG===0){
                $("body").css("background-image","url("+BG_URL+")");
            }else{
                $("body").css("background-image","url('../static2/images/bgOnd.jpg')");
            }
        },
        error: function(error){
            console.error("管理设置数据获取异常");
        }
    });
}
//请求管理设置数据
getSettings();