var MD5 = require("md5");
var $ = require("jquery");
// var appid = '2015063000000001';
var appid = '20170825000076973';
// 我的appid
// var key = '12345678';
var key = 'liOElrAvfuetesvJgyJZ';
var salt = + new Date();
var obj = {
    wyw: '文言文',
    zh: '中文',
    en: '英文',
    jp: '日语',
    kor: '韩语',
    fra: '法语'
};
var vocabularyBook = [];
// var query = 'apple\norange\nblue';
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
// auto 自动检测   zh 中文    en 英文        yue 粤语
// wyw 文言文      jp 日语    kor 韩语       fra 法语
// spa 西班牙语    th 泰语    ara 阿拉伯语   ru 俄语
// pt 葡萄牙语     de 德语    it 意大利语    el 希腊语
// nl 荷兰语       bl 波兰语  bul 保加利亚语 est 爱沙尼亚语
// dan 丹麦语      fin 芬兰语 cs 捷克语      rom 罗马尼亚语
// slo 斯洛文尼亚语swe 瑞典语 hu匈牙利语     cht 繁体中文
// vie 越南语
//
var from = 'zh';
var to = 'jp';
$(document).keyup(function(event){
    if(event.keyCode == 13){
        var query = $("#trans").val().trim();
        var str1 = appid + query + salt +key;
        var sign = MD5(str1);
        $.ajax({
            url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
            type: 'get',
            dataType: 'jsonp',
            data: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: function (data) {
                show(data);
            }
        });
    }
});

function show(message){
    var result = message.trans_result[0].dst;
    $("#translated").val(result);
}
$(".switch > a").text(obj[from] + ' => ' + obj[to]);

// http://fanyi.baidu.com/gettts?lan=kor&text=%EC%A2%8B%EC%9D%80%20%EC%95%84%EC%B9%A8&spd=3&source=web


$(".input .pronunciation").click(function(){
    var text = $("#trans").val().trim();
    var speed = 5;
    // var src = "http://tts.baidu.com/text2audio?lan=" + from + "&ie=UTF-8&spd=" + speed +"&text=" + text;
    voice(from,text,speed);
});
$(".show .pronunciation").click(function(){
    var text = $("#translated").val().trim();
    var speed = 3;
    // var src = "http://tts.baidu.com/text2audio?lan=" + to + "&ie=UTF-8&spd=" + speed +"&text=" + text;
    voice(to,text,speed)
});


$("#from").change(function(){
    from = this.value;
    $(".switch a").text(obj[from] + ' => ' + obj[to]);
});
$("#to").change(function(){
    to = this.value;
    $(".switch a").text(obj[from] + ' => ' + obj[to]);
});
// 发音
// http://tts.baidu.com/text2audio?lan=en&ie=UTF-8&spd=2&text=apple
// lan 参数是语言，zh-中文  en-英文
// spd 参数是语速，1-9，数字越大语速越快，朗读中文感觉6语速最合适
// text参数是需要合成为语音的文本内容

$(".addnote").click(function(){
    var transText = $("#trans").val().trim();
    var translatedText = $("#translated").val().trim();
    var time = new Date().toLocaleDateString();
    // new Date().toLocaleDateString() 获得年月日
    // new Date().toDateString() 获得星期和年月日
    var record = {
        text: transText,
        transText: translatedText,
        from: from,
        to: to,
        time: time
    };
    vocabularyBook.unshift(record);
    console.log(vocabularyBook);
});

$(".note").click(function(){
    $(".main").hide();
    $(".wordList").show();
    wordList();
});

function wordList() {
    for(var i = 0, len = vocabularyBook.length; i < len ; i++){
        var word = document.createElement("div");
        word.style.cssText = "margin:10px 0;background:rgba(0,228,189,.2);";
        var left = document.createElement("i");
        left.style.cssText = "width:50%;height:20px;font-size:15px;font-style:normal;display:inline-block;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
        left.innerText = vocabularyBook[i].text;
        var right = $(left).clone()[0];
        right.innerText = vocabularyBook[i].transText;
        var time = $(left).clone()[0];
        time.style.width = "100%" ;
        time.style.textAlign = "right";
        time.style.paddingRight = "2em";
        time.style.boxSizing = "border-box";
        time.innerText = vocabularyBook[i].time;
        $(word).append(left).append(right).append(time);
        $(".wordList").append(word);
    }

    $(".wordList div").bind("click",function(){
        var index = $(this).index();
        var content = vocabularyBook[index];
        $(".wordList").hide();
        $(".detail").show();
        showDetail(content);
    });
    function showDetail(content) {
        $(".detail .from").text(content.text);
        $(".detail .to").text(content.transText);
    }
}
function voice(lang,text,spd){
    var src = "http://fanyi.baidu.com/gettts?lan="+ lang + "&text=" + text + "&spd=" + spd + "&source=web";
    $("video").attr('src',src);
}