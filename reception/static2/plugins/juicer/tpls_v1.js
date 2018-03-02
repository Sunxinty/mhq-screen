//juicer模版
var tpls = {
	'todayWeibo' : '{@each data as d,k}' + '<li class="theme-buttomColor-11293e">'
			+ '<div class="newsIcon">'
				+ '<p class="ranking theme-rankingBgColor">${d.number}</p>'
				+ '<div><img src="http://img1.cache.netease.com/catchpic/2/21/21C9F2B88319053A33A8BEC55BAFA76B.jpg" alt=""></div>'
			+ '</div>'
			+ '<div class="newsBox  theme-textColor-cef5f5">'
				+ '<p class="newsFrom theme-textColor-00a0e9">${d.title} <span>${d.event_timeStr}</span></p>'
				+ '<p class="topNewsTittle theme-textColor-cef5f5">'
					+ '${d.summary}'
					
					+ '<a href="'+rootPath+'/forward/detail?id=${d.taskguid}" target="_blank" class="details theme-textColor-00a0e9">点击更多详情</a>'
				+ '</p>'
				+ '<p class="share">'
					+ '<a href="" class="theme-textColor-89c7ff"><i class="glyphicon glyphicon-share"></i> <span >${d.reprint_count}</span></a>'
					+ '<a href="" class="comment theme-textColor-89c7ff"><i class="glyphicon glyphicon-pencil "></i> <span >${d.comment_count}</span></a>'
					+ '<a href="" class="theme-textColor-89c7ff"><i class="glyphicon glyphicon-thumbs-up "></i> <span >${d.applaud_count}</span></a>'
				+ '</p>'
			+ '</div>'
			+ '</li>{@/each}',
	// 热门话题模版		
	'topics':'{@each data as itme}'+'<li  class="theme-buttomColor-11293e"><span class="toplicLink theme-textColor-00a0e9 theme-hoverColor">${itme.title}</span> <span class="toplicVisite">${itme.read_count}万</span></li>{@/each}',
	// 热门话题微博模版
	'topicsWblog':'{@each data as itme}'+
		'<li class="theme-buttomColor">                                                                                                                  '+
		'    <div class="hotTopicImg"><img src="http://upload.cheaa.com/2014/0609/1402274629915.jpg" alt=""></div>                                       '+
		'    <div class="hotTopicBox  theme-textColor-cef5f5">                                                                                                                   '+
		'        <p class="hotTopicNewsFrom theme-textColor-00a0e9">${itme.title}<span>${itme.event_timeStr}</span></p>                                              '+
		'        <p class="hotTopicNewsTittle theme-textColor-cef5f5">                                                                                                          '+
		'            ${itme.summary}'+
		'            <a href="'+rootPath+'/forward/detail?id=${itme.attrId}" target="_blank" class="details theme-textColor">点击查看详情</a>                                                        '+
		'        </p>                                                                                                                                    '+
		'        <p class="share">                                                                                                                       '+
		'            <a class="theme-textColor-89c7ff" href=""><i class="glyphicon glyphicon-share"></i> <span>${itme.reprintCount}</span></a>                   '+
		'            <a href="" class="comment theme-textColor-89c7ff"><i class="glyphicon glyphicon-pencil "></i> <span>${itme.commentCount}</span></a>  '+
		'            <a  class="theme-textColor-89c7ff" href=""><i class="glyphicon glyphicon-thumbs-up "></i> <span>${itme.applaudCount}</span></a>               '+
		'        </p>                                                                                                                                    '+
		'    </div>                                                                                                                                      '+
		'</li>{@/each}',
	'localhotlist' : '{@each data as d,k}'
		+'<li class="theme-buttomColor-11293e">'
			+ '<div class="localHotImg"><img src="${d.imageUrl}" alt=""></div>'
			+'<div class="localHotBox theme-textColor-cef5f5">'
			+'<p class="localHotFrom theme-textColor-00a0e9">${d.title}<span>${d.occurrenceTime}</span></p>'
			+'<p class="localHotNewsTittle">'
			+'${d.summary}'
			+' <a href="'+rootPath+'/forward/detail?id=${d.taskguid}" class="details theme-textColor">点击查看详情</a>'
			+'</p>'
			+'<p class="share">'
	        +'<a  class="theme-textColor-89c7ff" href=""><i class="glyphicon glyphicon-share"></i> <span>${d.repeat}</span></a>'
	        +'<a  class="comment theme-textColor-89c7ff" href=""><i class="glyphicon glyphicon-pencil "></i> <span>${d.discuss}</span></a>'
	        +'<a href="" class="theme-textColor-89c7ff"><i class="glyphicon glyphicon-thumbs-up "></i> <span>${d.praise}</span></a>'
	        +'</p>'
	        +'</div>'
	    +' </li>{@/each}',
	'travelkeyuser' : ''
			+'<p class="travelKeyUserTittle theme-tittleBgColor"> <span class="glyphicon glyphicon-user"></span>传播关键用户</p>'
			+'<div class="travelKeyUserHeader theme-bRight">'
			+' <p><img src="${data.imgscr}" alt=""></p>'
			+'  <ul>'
			+' <li class="travelKeyUserName theme-textColor">${data.sn}</li>'
			+' <li>粉丝数：${data.foc}</li>'
			+' </ul>'
			+'  <div class="travelKeyUserForwordTime ">'
			+'    <span class="theme-travelTimeNumBg">转发时间<br>${data.traveltimestr}</span>'
			+'        <span class="theme-travelTimeNumBg">转发数<br>${data.rc}</span>'
			+'   </div>'
			+'</div>'
			+'<div class="travelKeyUserForword">'
			+'    <span class="theme-textColor">转发内容：</span>${data.content}'
			+'</div>',
	'travelkeyuserway' : '{@each data as d,k}'
		     +'<li><span class="glyphicon glyphicon-arrow-right"></span>'
		     +'<img src="${d.imgscr}"  style="cursor:pointer" id="${d.keynodeid}"><h4>${d.sn}</h4></li>'
			+ '{@/each}',
	'ageratiochartlist' : '{@each data as d,k}'
		    +' <li class="theme-buttomColor"><i class="theme-bgColor-${d[2]} "></i>${d[0]} <span>${d[1]}</span></li>'  
		  + '{@/each}',
	'userportrayallist' : '{@each data as d,k}'
		    +' <li class="theme-buttomColor"><i class="theme-bgColor-${d.color} "></i>${d.name} <span>${d.scale}</span></li>'  
		  + '{@/each}',
	'hotSearchWords' : '{@each data as d,k}'
			+ '<li  class="theme-bgColor-162f48 theme-textColor-a1bbac theme-bgHoverCol-265680 ">' + '${d.keywords}'
			+ '</li>{@/each}',
    'hotsearch' : '{@each data as d,k}'
		+ '<li  class="theme-bgColor-162f48 theme-textColor-a1bbac theme-bgHoverCol-265680 ">' + '${d.keywords}'
		+ '</li>{@/each}',
	'hsearchrank' : '{@each data as d,k}'
			+ '<li>'
			+ '<p class=" hotOrderList theme-hotSearchOrderColor theme-hoverColor">'
			+ ' <span>${d.number}.</span>${d.keywords}</p>'
			+ '<div class="progress theme-barBg" >'
			+ '<p class="progress-bar " role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:${d.width};"></p>'
			+ '</div>' 
			+ '</li>{@/each}',
	'navPrivate' : ''
			+ '<a href="javascript:loadPrivateTree(${data.folderid})">返回上一级</a>'
			+ '&nbsp;|&nbsp;${data.folderpath}\\${data.objname}',
	'tierAnalyzeList':
				'{@each data as d,k}'+
				'<li class="theme-buttomColor-11293e">'+'${d.layer}'+': <span>'+'${d.percent}'+'%</span>'+
				'</li>'+
				'{@/each}' ,
	'doweekWeibo' : '{@each data as d}' + '<li class="theme-buttomColor">'
		+ '<div class="newsIcon">'
			+ '<p class="ranking theme-rankingBgColor">${d.order}</p>'
			+ '<div><img src="${d.imageUrl}" alt=""></div>'
		+ '</div>'
		+ '<div class="newsBox">'
			+ '<p class="newsFrom theme-textColor">${d.newSource} <span>${d.occurrenceTime}</span></p>'
			+ '<p class="topNewsTittle">'
				+ '${d.title}'
				
				+ '<a href="'+rootPath+'/forward/detail?id=123" target="_blank" class="details theme-textColor">点击更多详情</a>'
			+ '</p>'
			+ '<p class="share">'
				+ '<a href=""><i class="glyphicon glyphicon-share theme-iconColor"></i> <span class="theme-textColor">${d.repeat}</span></a>'
				+ '<a href="" class="comment"><i class="glyphicon glyphicon-pencil theme-iconColor"></i> <span class="theme-textColor">${d.discuss}</span></a>'
				+ '<a href=""><i class="glyphicon glyphicon-thumbs-up theme-iconColor"></i> <span class="theme-textColor">${d.praise}</span></a>'
			+ '</p>'
		+ '</div>'
		+ '</li>{@/each}',
		'cueCards':'<div id="cueCards" style="display: none;position: relative;">友情提示:没有更多信息!</div>',
		'relatedweibo':'{@each data as d,k}'
			+'<li class="theme-buttomColor">'
    		+'<span><img src=${d.src}></span>'
    		+'<div>'
    			+'<h4 class="theme-textColor">${d.title}</h4>'
    			+'<p>${d.content}</p>'
    		+'</div>'
    	+'</li>{@/each}',
	'imdetails' : '{@each data as d,k}'
		+ '<tr>'
		+ '<td><span></span></td>'
		+ '<td>${d.title}</td>'
		+ '<td class="theme-textColorGrey">${d.froms}</td>'
		+ '<td class="theme-textColorGrey">${d.date}</td>'
		+ '</tr>'
		+ '{@/each}',
	'hotimlist' : '{@each data as d,k}'
		+ '<li>'
		+'    <div class="newsIcon">'
		+'       <p class="ranking theme-bgColor-grey">${d.order}</p>'
		+'    </div>'
		+  '{@if d.order == 1}'
		+'    <div class="hotMediumBox">'
		+ '{@else}'
		+     '<div class="hotMediumBox hotMediumBox1">'
		+  '{@/if}'
		+  '{@if d.order > 4}'
		+'        <p class="hotMediumBoxTittle">${d.title}</p>'
		+ '{@else}'
		+   '        <p class="hotMediumBoxTittle theme-textColor">${d.title}</p>'
		+  '{@/if}'
		+'        <p class="hotMediumBoxFrom">'
		+'            <span class="formAndHot">'
		+'                <span>来源：${d.froms}</span>'
		+'                <span>热度：${d.hotcount}</span>'
		+'            </span>'
		+'            <span class="clickAndReply">'
		+'                <span class="theme-textColor">点击量：${d.clickcount}</span>'
		+'                <span class="theme-textColor">回复量:${d.replycount}</span>'
		+'            </span>'
		+'        </p>'
		+'    </div>'
		+ '</li>{@/each}',
	'hotSearchOrder' : '{@each data as d,k}'
		+ '<li><span class="theme-bgColor-grey">${d.number}</span> ${d.keywords}</li>{@/each}',
	'areahottittle' : '{@each data as d,k}'
		+ '<option class="theme-bgColor" value="${d.id}">${d.name}</option>{@/each}',
	'hotcommentlist' : '{@each data as d,k}'
		+ '<li class="theme-buttomColor"><b class="theme-bgColor-grey">${d.order}</b> ${d.title} <span class="theme-textColor">${d.count}</span></li>{@/each}',
	'allChannel' : '{@each data as d,k}'
		+' <li id="${d.id}" style="cursor:pointer">'
		+'   <p class="allChannelImg"><img src="${d.imgsrc}" alt=""></p>'
		+'   <p>${d.title}</p>'
		+'</li>{@/each}',
	'subslist' : '{@each data as d,k}'
		+' <div class="takesNewsBox theme-buttomColor">'
		+'    <p class="imgs"><img src="${d.imgsrc}" alt=""></p>'
		+'    <div class="newsList">'
		+'        <p class="newsListTittle ">${d.title}</p>'
		+'        <p>'
		+'             <p>${d.content}</p>'
		+'             <span >${d.source}</span> &nbsp;${d.time}</p>'
		+'    </div>'
		+' </div>{@/each}',
	'subswebtitle' : '{@each data as d,k}'
		+ '<li id="${d.id}">${d.title}</li>{@/each}',
	'subswebsitelist' : '{@each data as d,k}'
		+'	<div class="takesNewsBox theme-buttomColor">'
		+'	    <div class="newsList">'
		+'	        <p class="newsListTittle theme-textColor">${d.title}</p>'
		+'	        <p>'
		+'	            <span class="theme-textColor">${d.source}</span> &nbsp;${d.time}'
		+'	            <b class="glyphicon glyphicon-heart theme-textColor-red"></b>'
		+'	        <p>${d.content} <a href="">点击查看详情</a></p>'
		+'	        </p>'
		+'	    </div>'
		+'	</div>'
		+ '{@/each}',
	'detailImgUl':'{@each data as d,k}'
		+"<li class='smallImgListBox theme-border'><img class='smallImg' src='${d}' alt=''></li>"
		+ '{@/each}',
	'weibomaplist':'{@each data as d,k}'
		+"<li><p></p><div>${d.name}</div><div>${d.value}</div></li>"
		+ '{@/each}',
	// 关键传播账号
	'userSpread':'{@each data as item,k}<li>                           '+
	    '<div>${item.number}</div>                                             '+
	    '<table>                                                 '+
	    '    <tr>                                                '+
	    '        <td >${item.sn}</td>                        '+
	    '        <td class="atention">关注</td>                  '+
	    '        <td class="retransmission">转发数</td>          '+
	    '    </tr>                                               '+
	    '    <tr>                                                '+
	    '        <td class="fans">粉丝数 <span>${item.followNubmer}</span></td> '+
	    '        <td>${item.foc}</td>                    '+
	    '        <td>${item.rc}</td>                              '+
	    '    </tr>                                               '+
	    '</table>                                                '+
	    '</li>{@/each}',
    'sitedetails':'{@each data as d,k}'
    	+'<li name="weibodetail" value="${parseInt(k)+1}">'
        +'  <span>${d.order}</span>'
        +'  <div>'
        +'   <p>${d.time}</p>'
        +'   <p>${d.title}</p>'
        +'  </div>'
        +'</li>'
	 + '{@/each}'
};