var pokes = {};
pokes.matchingGame = {};
pokes.matchingGame.cardWidth = 80;
pokes.matchingGame.cardHeight = 120;
var number = {};
var poke = [];
var set;
pokes.matchingGame.deck = [
    "cardAK", "cardAK",
    "cardAQ", "cardAQ",
    "cardAJ", "cardAJ",
    "cardBK", "cardBK",
    "cardBQ", "cardBQ",
    "cardBJ", "cardBJ",
    "cardCK", "cardCK",
    "cardCQ", "cardCQ",
    "cardCJ", "cardCJ",
    "cardDK", "cardDK",
    "cardDQ", "cardDQ",
    "cardDJ", "cardDJ"
];
number = [
  0,1,2,3,4,5,6,7,8,9,10,11
];
var pipei = 0;
var step = 0;
var time = 0;

//先从12组牌中选出6组来
function xipai() {
    for(var i = 0;i < 12;i+=2){
        poke.push(pokes.matchingGame.deck[number[i] * 2],pokes.matchingGame.deck[number[i] * 2 + 1]);
    }
}
//随机排序扑克的函数，返回-1或1
function shuffle() {
    return Math.random() > 0.5 ? -1 : 1;
}
//翻牌功能的实现
function selectCard() {
    var $fcard = $(".card-flipped");
    //翻了2张牌后退出翻牌
    if($fcard.length > 1){
        return;
    }
    $(this).addClass("card-flipped");
    //若翻动了两张牌，检测一致性
    var $fcards = $(".card-flipped");
    if($fcards.length == 2){
        step++;
        setTimeout(function(){
            checkPattern($fcards);
        }, 700);
    }
}
//检测2张牌是否一致
function checkPattern(cards) {
    var pattern1 = $(cards[0]).data("pattern");
    var pattern2 = $(cards[1]).data("pattern");

    $(cards).removeClass("card-flipped");
    if(pattern1 === pattern2){
        $(cards).addClass("card-removed").bind("webkitTransitionEnd", function () {
            $(this).remove();
        });
        if($("#card").find($(".removeClass"))){
            if(pipei !== 5) pipei += 1;
            else{
                $("#enddiv .step").html("你一共用了" + step + "步！");
                $("#enddiv .time").html("用时为" + time + "秒");
                $("#enddiv").attr("display","block").fadeTo(300, 1);
                clearInterval(set);
            }
        }
    }
}

function refresh() {
    step = 0;
    time = 0;
    pipei = 0;
    $("#enddiv").css("display","none");
    //实现随机洗牌
    set = setInterval(function(){
        time++;
    }, 1000);
    number.sort(shuffle);//两两一组一共12组，先洗组号
    xipai();//把前6组牌放进poke数组里面
    poke.sort(shuffle);//再洗poke数组里的6组牌
    var $enddiv = $("#enddiv");
    $enddiv.after("\n" +
        "        <div class=\"card\">\n" +
        "            <div class=\"face front\"></div>\n" +
        "            <div class=\"face back\"></div>\n" +
        "        </div>");
    var $card = $(".card");
    for(var i = 0;i < 11;i++){
        $card.clone().appendTo($("#cards"));
    }
    $(".card").each(function (index) {
        //调整坐标
        $(this).css({
            "left":($("#cards").width() - pokes.matchingGame.cardWidth) / 2 + "px",
            "top" :($("#cards").height() - pokes.matchingGame.cardHeight) / 2 + "px"
        });
        $(this).delay(index * 100).animate({
            "left":(pokes.matchingGame.cardWidth + 20) * ((index) % 4) + "px",
            "top" :(pokes.matchingGame.cardHeight + 20) * Math.floor((index) / 4) + "px"
        });
        //吐出一个牌号
        var pattern = poke.pop();
        //暂存牌号
        $(this).data("pattern", pattern);
        //把其翻牌后的对应牌面附加上去
        $(this).find(".back").addClass(pattern);
        //点击牌的功能函数挂接
        $(this).click(selectCard);
    });
    function show(){
        $(".card").queue("fx");
        setTimeout(show, 100);
    }
    show();
}