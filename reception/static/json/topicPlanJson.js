/*
*Name:BirTV-选题策划
*CreationTime:2017-07-28
*Author:sunxin
*/
var taskList = [
    {
        id:01,
        title:"暑期特色活动主题，呵护青少年健康成长",   //标题
        name:"李强",   //记者名称
        time:"2017-08-22 09:22:42",   //时间
        content:"为了进一步丰富未成年暑假生活，促进未成年健康成长、全面发展，当地政府积极组织文化歌咏比赛、绘画展等各类特色主题活动。",//内容
        type:{
            tg:true,    //是否通过
            ds:false,   //是否待审
            th:false,   //是否退回
            yzp:true,   //是否已指派
            wzp:false   //是否未指派
        },
        value:1
    },
    {
        id:02,
        title:"以房养老骗局",
        name:"王鑫",
        time:"2017-08-22 11:43:25",
        content:"以房养老骗局，数十名老人证据不足维权难。由于老人们签署并公证了一系列文书，想要拿回原本属于自己的房子，难度很大。",
        type:{
            tg:true,
            ds:false,
            th:false,
            yzp:false,
            wzp:true
        },
        value:2
    },
    {
        id:03,
        title:"邓小平诞辰纪念日",
        name:"李思琪",
        time:"2017-08-22 14:34:22",
        content:"2017年8月22日是我国伟大的马克思主义者，无产阶级革命家、政治家、军事家、外交家，中国共产党、中国人民解放军、中华人民共和国的主要领导人邓小平同志的诞辰113周年纪念日。。",
        type:{
            tg:false,
            ds:true,
            th:false,
            yzp:true,
            wzp:false
        },
        value:3
    },
    {
        id:04,
        title:"贩卖黑奴及其废除国际纪念日",
        name:"廖璐",
        time:"2017-08-21 10:22:35",
        content:"8月23日是贩卖黑奴及其废除国际纪念日，主要了解该纪念日的来历。",
        type:{
            tg:false,
            ds:true,
            th:false,
            yzp:false,
            wzp:true
        },
        value:2
    },
    {
        id:05,
        title:"区残联成立联社，服务残疾人更专业",
        name:"白晓刚",
        time:"2017-08-21 16:34:23",
        content:"区残联成立联社，服务残疾人更加专业，更加贴心。",
        type:{
            tg:true,
            ds:false,
            th:false,
            yzp:true,
            wzp:false
        },
        value:3
    },
    {
        id:06,
        title:"高温来袭保修多 物业人员格尽职守",
        name:"李强",
        time:"2017-08-21 17:16:23",
        content:"近几日连续高温，物业人员任然恪尽职守。",
        type:{
            tg:false,
            ds:false,
            th:true,
            yzp:true,
            wzp:false
        },
        value:1
    },
    {
        id:07,
        title:"洛杉矶2028奥运会",
        name:"廖璐",
        time:"2017-08-20 10:34:45",
        content:"洛杉矶承办2028奥运会最新情况",
        type:{
            tg:true,
            ds:false,
            th:false,
            yzp:false,
            wzp:true
        },
        value:1
    },
    {
        id:08,
        title:"手机国内长途和漫游费被取消",
        name:"李强",
        time:"2017-08-20 15:22:26",
        content:"今年9月1日期，我国将全面取消手机长途和漫游费。",
        type:{
            tg:true,
            ds:false,
            th:false,
            yzp:true,
            wzp:false
        }
    },
    {
        id:09,
        title:"农村环境整治",
        name:"李思琪",
        time:"2017-08-20 17:43:21",
        content:"“七道七治”取得了“看得见”的成效，农村“脏乱差”现象不仅得到有效解决，建管并举、一村一景也在逐步实现。",
        type:{
            tg:false,
            ds:true,
            th:false,
            yzp:false,
            wzp:true
        },
        value:2
    },
    {
        id:10,
        title:"军人书法展开幕",
        name:"廖璐",
        time:"2017-08-19 11:22:23",
        content:"8月19日军人书法展开幕。",
        type:{
            tg:true,
            ds:false,
            th:false,
            yzp:false,
            wzp:true
        },
        value:3
    },
]