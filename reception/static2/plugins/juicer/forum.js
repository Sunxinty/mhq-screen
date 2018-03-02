//juicer模版
var forum = {
		
		
	'todayPosts' : '{@each data as d,k}' + ' <tr><td class="theme-textColor">${d.number}</td>'
	+ '<td>${d.title}</td>'
	+ '<td>${d.from}</td>'
	+ '<td>${d.publishModule}</td>'
	+ '<td>${d.readCount}</td>'
	+ '<td>${d.comment_count}</td>'
	+ '<td>${d.event_timeStr}</td> </tr>'
	
   + '{@/each}',
   'forumcategory' : '{@each data as d,k}' + '<li  onclick="forumcategorydata('+"'forumcategory','${d.editor}')"+'"'+'>${d.editor}</li>'                                                
  + '{@/each}',
  
	'forumcategorydata' : '{@each data as d,k}' + ' <tr>'
	+ '<td>${d.title}</td>'
	+ '<td>${d.editor}</td>'
	+ '<td>${d.publishModule}</td>'
	+ '<td>${d.readCount}</td>'
	+ '<td>${d.comment_count}</td>'
	+ '<td>${d.event_timeStr}</td> </tr>'
   + '{@/each}',
   
   'keyWordText': '{@each data as d,k}' + ' <li class="theme-hotSearchArticleTextBg theme-hoverBg">${d.keywords}</li>'
   + '{@/each}',
   
   'essencehot' : '{@each data as d,k}' + '<li class="theme-buttomColor "><span class="essenceTopicText theme-textColor theme-hoverColor ">${d.keywords}</span> <span class="essenceTopicOrder">${d.searchcount}万</span></li>'
  + '{@/each}',
  'newsBody': '<div class="newsBody theme-bgColor"  >'
	          +'<div class="newsTextTittle ">'
                  +'  <h3 class="newsTittle">${data.title}</h3>'
                  +'<div>'
                  +'     <small class="theme-textColor"><span>${data.date}</span> | <span>北京时间</span></small>'
                   +'     <p ><a href="" class="theme-textColor">关注</a> <a href="" class="theme-textColor">报题</a></p>'
                   +' </div>'
                   +' </div>'
                  +'</div>'
            +'<!--摘要-->'
           +' <div class="digest theme-bgColor">'
             +'   <p class="tittle-Style theme-tittleBgColor"><b class="glyphicon glyphicon-bookmark"></b> 摘要</p>'
               +' <div class="digestText theme-textColor theme-borderRightColor">　${data.summary}'
                +'</div>'
                +'<div class="digestStatistics theme-bgColor">'
                  +'  <ul>'
                    +'  <li>文章阅读量 <span>${data.reading_count}</span></li>'
                      +'  <li>评论数 <span>${data.comment_count}</span></li>'
                        +'<li>分享数 <span>${data.share_count}</span></li>'
                    +'</ul>'
                +'</div>',
       'contentdetail':' <div class="boxImgBox"> <img src="${data.imgUrl}" alt=""></div>'
         +'  <div class="contentDetailsText">' 
         +'  ${data.content[0]}</div>'
};