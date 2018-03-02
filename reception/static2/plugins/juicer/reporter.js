/**
 * 
 */
var content=function(data){
	var strlen = 0;
	if(data.length<20)
		return data;
	for(var i = 0;i <data.length; i++)
	{
		if(data.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
			strlen += 2;
			else 
				strlen++;
		if(strlen>40)
			return data.substring(0,i)+"..";
	}
	return data;
}
var defpic=function(data){
	return data.length>0?data:"static/images/headerIco.png";
}
var num=function(data){
	return data*10;
}
var reporter={
		'uploadlist':'<p class="uploadName">上传 &nbsp;<b>素材</b></p>'
			+'{@each  data as d,k}'
			+'{@if k<18 }'
			+'<div class="eachUpload">'
			+'<div class="matterBox">'
			+'{@if d.entityType=="biz_sobey_video"}'
			+'<div class="vedioBtn" style="display:block;"></div>'
			+'{@else}'
			+'<div class="vedioBtn"></div>'
			+'{@/if}'
			+'<img  class="img" src="$${d.keyframe}" style="">'
			+'</div>'
			+'<p title="${d.title}">$${d.title|content}</p>'
			+'<span>上传人:${d.userName}</span>'
			+'</div>'
			+'{@/if}'
			+'{@/each}',
		'userlist':	'{@each  data as d,k}'		
			+'{@if k<5}'
			+'<li>'
			+'<p>${d.name}</p>'
			+'<p class="topNumber">${d.num}</p>'
			+'<div></div>'
			+'</li>'
			+'{@/if}'
			+'{@/each}'
			
};
//+'<img src="$${d.icon|defpic}" alt="">'