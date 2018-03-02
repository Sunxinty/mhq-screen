/**
 * 
 */
var spreadTop={
		
		'cmsTop':'<p class="topName">浏览量</p>'
			+'{@each  i in range(0, 5)}<li class="top${i+1}">'
			+'<div class="topIcon"></div>'
			+'<div class="topTxt">${data[i].title}</div>'				
			+'<div class="topChart">'
			+'<div class="topChartOut"><div class="topChartIn topChartIn${i+1}" value="${Number(data[i].count)/Number(data.max)*100}"></div></div>'
			+'<div class="sendNumber">${data[i].count}</div>'
			+'</div>'
			+'</li>'
			+'{@/each}'		
}
