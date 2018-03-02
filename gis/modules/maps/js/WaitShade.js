/**遮罩层公共类，依赖Jquery,layerui*/
var WaitShade = (function(){
	var shade = {
	shade: null,
	defaultConfig:{shade:[0.5,'#ddd']},
	show: function(config){
		var _config = $.extend({},this.defaultConfig,config);
		$('#shadowAll').css('display','block');
		this.shade = layer.load(2, _config);
	},
	hide: function(){
		if(this.shade){
			$('#shadowAll').css('display','none');
			layer.close(this.shade);
		}
	}
}
//定义AMD模块
if ( typeof define === "function" && define.amd ) {
		 define( "waitShade", [], function() {
		  return shade;
		 });
	}

	return {
		show: shade.show,
		hide: shade.hide
	}
})();
