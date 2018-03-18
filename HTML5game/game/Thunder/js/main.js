//获得主界面
var mainDiv = document.getElementById("maindiv");
//获得开始界面
var startdiv = document.getElementById("startdiv");
//获取屏幕宽高
var screenwidth = document.getElementById("contentdiv").offsetWidth;
var screenheight = document.getElementById("contentdiv").offsetHeight;
//获得游戏中分数显示界面
var scorediv = document.getElementById("scorediv");
//获得分数界面
var scorelabel = document.getElementById("label");
//获得游戏中剩余时间显示界面
var lefttimediv = document.getElementById("lefttimediv");
//获得剩余时间界面
var lefttimelabel = document.getElementById("label1");
//获得暂停按钮
var gpause = document.getElementById("gamepause");
//获得暂停界面
var suspenddiv = document.getElementById("suspenddiv");
//获得游戏说明界面
var introducediv = document.getElementById("introducediv");
//获得游戏说明界面返回按钮
var fanhui = document.getElementById("return");
//获得游戏结束界面
var enddiv = document.getElementById("enddiv");
//获得游戏结束后分数统计界面
var planescore = document.getElementById("planescore");
//初始化分数
var scores = 0;

//创建飞机类
function plane(hp, X, Y, sizeX, sizeY, score, dietime, speed, boomimage, imagesrc) {
    this.planeX=X;
    this.planeY=Y;
    this.imagenode=null;
    this.planehp=hp;
    this.planescore=score;
    this.planesizeX=sizeX;
    this.planesizeY=sizeY;
    this.planeboomimage=boomimage;
    this.planeisdie=false;
    this.planedietimes=0;
    this.planedietime=dietime;
    this.planespeed=speed;
//行为
/*
移动行为
 */
    this.planemove = function () {
        if (scores <= 50000) {
            this.imagenode.style.top = this.imagenode.offsetTop + this.planespeed + "px";
        }
        else if (scores > 50000 && scores <= 100000) {
            this.imagenode.style.top = this.imagenode.offsetTop + this.planespeed + 1 + "px";
        }
        else if (scores > 100000 && scores <= 150000) {
            this.imagenode.style.top = this.imagenode.offsetTop + this.planespeed + 2 + "px";
        }
        else if (scores > 150000 && scores <= 200000) {
            this.imagenode.style.top = this.imagenode.offsetTop + this.planespeed + 3 + "px";
        }
        else if (scores > 200000 && scores <= 300000) {
            this.imagenode.style.top = this.imagenode.offsetTop + this.planespeed + 4 + "px";
        }
        else {
            this.imagenode.style.top = this.imagenode.offsetTop + this.planespeed + 5 + "px";
        }
    };
    this.init=function(){
        this.imagenode=document.createElement("img");
        this.imagenode.style.left=this.planeX+"px";
        this.imagenode.style.top=this.planeY+"px";
        this.imagenode.src=imagesrc;
        mainDiv.appendChild(this.imagenode);
    };
    this.init();
}
/*
创建子弹类
 */
function bullet(X,Y,sizeX,sizeY,imagesrc){
    this.bulletX=X;
    this.bulletY=Y;
    this.bulletimage=null;
    this.bulletattach=1;
    this.bulletsizeX=sizeX;
    this.bulletsizeY=sizeY;
//行为
    /*
     移动行为
     */
    this.bulletmove=function(){
        this.bulletimage.style.top=this.bulletimage.offsetTop-20+"px";
    };
    this.init=function(){
        this.bulletimage=document.createElement("img");
        this.bulletimage.style.left= this.bulletX+"px";
        this.bulletimage.style.top= this.bulletY+"px";
        this.bulletimage.src=imagesrc;
        mainDiv.appendChild(this.bulletimage);
    };
    this.init();
}

/*
 创建单行子弹类
 */
function oddbullet(X,Y){
    bullet.call(this,X,Y,6,14,"image/bullet1.png");
}

/*
创建敌机类
 */
function enemy(hp,a,b,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc){
    plane.call(this,hp,random(a,b),-100,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc);
}
//产生min到max之间的随机数
function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}

/*
创建本方飞机类
 */
function ourplane(X,Y){
    var imagesrc="image/我的飞机.gif";
    plane.call(this,1,X,Y,66,80,0,660,0,"image/本方飞机爆炸.gif",imagesrc);
    this.imagenode.setAttribute('id','ourplane');
}
/*
创建本方飞机
 */
var selfplane = new ourplane(120, 485);
var ourplane = document.getElementById('ourplane');
var yidong = function () {
    var oevent = window.event || arguments[0];
    var selfplaneX = oevent.clientX;
    var selfplaneY = oevent.clientY;
    ourplane.style.left = selfplaneX - selfplane.planesizeX / 2 + "px";
    ourplane.style.top = selfplaneY - selfplane.planesizeY / 2 + "px";
};
var yidongmobile = function () {
    if(event.touches.length === 1) {
        if (!event.defaultPrevented)
            event.preventDefault();
        var selfplaneX = event.touches[0].pageX;
        var selfplaneY = event.touches[0].pageY;
        ourplane.style.left = selfplaneX - selfplane.planesizeX / 2 + "px";
        ourplane.style.top = selfplaneY - selfplane.planesizeY / 2 + "px";
    }
};
/*
暂停事件
 */
var number = 0;
var set;
var time;
var gamepause = function () {
    if(number == 0){
        suspenddiv.style.display = "block";
        if(document.removeEventListener){
            mainDiv.removeEventListener("mousemove", yidong, true);
            mainDiv.removeEventListener("touchmove", yidongmobile, true);
            bodyobj.removeEventListener("mousemove", bianjie, true);
            bodyobj.removeEventListener("touchmove", bianjie, true);
        }
        else if(document.detachEvent) {
            mainDiv.detachEvent("onmousemove", yidong);
            mainDiv.detachEvent("onmousemove", yidongmobile);
            bodyobj.detachEvent("onmousemove", bianjie);
            bodyobj.detachEvent("ontouchmove", bianjie);
        }
        clearInterval(set);
        clearInterval(time);
        number = 1;
    }
    else {
        suspenddiv.style.display = "none";
        if(document.addEventListener){
            mainDiv.addEventListener("mousemove", yidong, true);
            mainDiv.addEventListener("touchmove", yidongmobile, true);
            bodyobj.addEventListener("mousemove", bianjie, true);
            bodyobj.addEventListener("touchmove", bianjie, true);
        }
        else if(document.attachEvent){
            mainDiv.attachEvent("onmousemove", yidong);
            mainDiv.attachEvent("ontouchmove", yidongmobile);
            bodyobj.attachEvent("onmousemove", bianjie);
            bodyobj.attachEvent("ontouchmove", bianjie);
        }
        set = setInterval(start, 20);
        time = setInterval(settime, 1000);
        number = 0;
    }
};
//判断飞机是否移出边界，如果移出边界，则取消mousemove事件，反之加上mousemove事件
var bianjie = function () {
    var oevent = window.event || arguments[0];
    var bodyobjX = oevent.clientX;
    var bodyobjY = oevent.clientY;
    if(event.touches !== undefined && event.touches.length === 1) {
        if (!event.defaultPrevented)
            event.preventDefault();
        bodyobjX = event.touches[0].pageX;
        bodyobjY = event.touches[0].pageY;
    }

    if(bodyobjX < 5 || bodyobjX > screenwidth - 5 || bodyobjY < 0 || bodyobjY > screenheight){
        if(document.removeEventListener){
            mainDiv.removeEventListener("mousemove", yidong, true);
            mainDiv.removeEventListener("touchmove", yidongmobile, true);
        }
        else if(document.detachEvent){
            mainDiv.detachEvent("onmousemove", yidong);
            mainDiv.detachEvent("ontouchmove", yidongmobile);
        }
    }
    else {
        if(document.addEventListener) {
            mainDiv.addEventListener("mousemove", yidong, true);
            mainDiv.addEventListener("touchmove", yidongmobile, true);
        }
        else if(document.attachEvent){
            mainDiv.attachEvent("onmousemove", yidong);
            mainDiv.attachEvent("ontouchmove", yidongmobile);
        }
    }
};
var bodyobj = document.getElementsByTagName("body")[0];
if(document.addEventListener){
    //为本方飞机添加移动和暂停
    mainDiv.addEventListener("mousemove", yidong, true);
    mainDiv.addEventListener("touchmove", yidongmobile, true);
    //为本方飞机添加暂停事件
    selfplane.imagenode.addEventListener("click", gamepause, true);
    //为body添加判断本方飞机移出边界事件
    bodyobj.addEventListener("mousemove", bianjie, true);
    bodyobj.addEventListener("touchmove", bianjie, true);
    suspenddiv.getElementsByTagName("button")[0].addEventListener("click", gamepause, true);
    suspenddiv.getElementsByTagName("button")[1].addEventListener("click", introduce, true);
    suspenddiv.getElementsByTagName("button")[2].addEventListener("click", jixu, true);
}
else if(document.attachEvent){
    //为本方飞机添加移动
    mainDiv.attachEvent("onmousemove", yidong);
    mainDiv.attachEvent("touchmove", yidongmobile);
    //为本方飞机添加暂停事件
    selfplane.imagenode.attachEvent("onclick", gamepause);
    //为body添加判断本方飞机移出边界事件
    bodyobj.attachEvent("onmousemove", bianjie);
    bodyobj.attachEvent("ontouchmove", bianjie);
    suspenddiv.getElementsByTagName("button")[0].addEventListener("click", gamepause, true);
    suspenddiv.getElementsByTagName("button")[1].addEventListener("click", introduce, true);
    suspenddiv.getElementsByTagName("button")[2].addEventListener("click", jixu, true);
}
//初始化隐藏本方飞机
selfplane.imagenode.style.display = "none";
/*
敌机对象数组
 */
var enemys = [];

/*
子弹对象数组
 */
var bullets = [];
var mark = 0;
var mark1 = 0;
var backgroundPositionY = 0;
var countdown = 60;
function settime() {
    if(countdown === 0){
        lefttimelabel.innerHTML = countdown;
        enddiv.style.display = "block";
        planescore.innerHTML = scores;
        if(document.removeEventListener) {
            mainDiv.removeEventListener("mousemove",yidong,true);
            mainDiv.removeEventListener("touchmove",yidongmobile,true);
            bodyobj.removeEventListener("mousemove",bianjie,true);
            bodyobj.removeEventListener("touchmove",bianjie,true);
        }
        else if(document.detachEvent) {
            mainDiv.detachEvent("onmousemove",yidong);
            mainDiv.detachEvent("ontouchmove",yidongmobile);
            bodyobj.removeEventListener("mousemove",bianjie,true);
            bodyobj.removeEventListener("touchmove",bianjie,true);
        }
        clearInterval(set);
    }
    else {
        countdown --;
        lefttimelabel.innerHTML = countdown;
    }
}

function start() {
    mainDiv.style.backgroundPositionY = backgroundPositionY + "px";
    backgroundPositionY += 0.5;
    if (backgroundPositionY === screenheight) {
        backgroundPositionY = 0;
    }
    mark++;
    /*
    创建敌方飞机
     */


    if (mark === 15) {
        mark1++;//大飞机
        if (mark1 % 20 === 0) {
            enemys.push(new enemy(12, 57, screenwidth - 130, 110, 164, 30000, 540, 1, "image/大飞机爆炸.gif", "image/enemy2_fly_1.png"));
        }
        //中飞机
        else if (mark1 % 5 === 0) {
            enemys.push(new enemy(6, 25, screenwidth - 46, 46, 60, 5000, 360, random(1, 3), "image/中飞机爆炸.gif", "image/enemy3_fly_1.png"));
        }
        //小飞机
        else {
            enemys.push(new enemy(1, 19, screenwidth - 34, 34, 24, 1000, 360, random(1, 4), "image/小飞机爆炸.gif", "image/enemy1_fly_1.png"));
        }
        mark = 0;
    }
    /*
    移除敌方飞机
     */
    var enemyslen = enemys.length;
    for (var i = 0; i < enemyslen; i++) {
        if (enemys[i].planeisdie !== true) {
            enemys[i].planemove();
        }
        /*
        如果敌机超出边界，删除敌机
         */
        if (enemys[i].imagenode.offsetTop > screenheight) {
            mainDiv.removeChild(enemys[i].imagenode);
            enemys.splice(i, 1);
            enemyslen--;
        }
        //当敌机死亡标记为true时，经过一段时间后清除敌机
        if (enemys[i].planeisdie === true) {
            enemys[i].planedietimes += 20;
            if (enemys[i].planedietimes === enemys[i].planedietime) {
                mainDiv.removeChild(enemys[i].imagenode);
                enemys.splice(i, 1);
                enemyslen--;
            }
        }
    }
    /*
    创建子弹
     */
    if (mark % 5 === 0) {
        bullets.push(new oddbullet(parseInt(selfplane.imagenode.style.left) + 31, parseInt(selfplane.imagenode.style.top) - 10));
    }
    /*
    移动子弹
     */
    var bulletslen = bullets.length;
    for (var i = 0; i < bulletslen; i++) {
        bullets[i].bulletmove();
        /*
        如果子弹超出边界，删除子弹
         */
        if (bullets[i].bulletimage.offsetTop < 0) {
            mainDiv.removeChild(bullets[i].bulletimage);
            bullets.splice(i, 1);
            bulletslen--;
        }
    }
    /*
    碰撞判断
    */
    for(var k=0;k<bulletslen;k++){
        for(var j=0;j<enemyslen;j++){
            //判断碰撞本方飞机
            if(enemys[j].planeisdie === false){
                if(enemys[j].imagenode.offsetLeft + enemys[j].planesizeX >= selfplane.imagenode.offsetLeft && enemys[j].imagenode.offsetLeft <= selfplane.imagenode.offsetLeft  + selfplane.planesizeX) {
                    if(enemys[j].imagenode.offsetTop + enemys[j].planesizeY >= selfplane.imagenode.offsetTop + 40 && enemys[j].imagenode.offsetTop <= selfplane.imagenode.offsetTop - 20 + selfplane.planesizeY) {
                        //碰撞本方飞机，游戏结束，统计分数
                        selfplane.imagenode.src = "image/本方飞机爆炸.gif";
                        enddiv.style.display = "block";
                        planescore.innerHTML = scores;
                        if(document.removeEventListener) {
                            mainDiv.removeEventListener("mousemove",yidong,true);
                            mainDiv.removeEventListener("touchmove",yidongmobile,true);
                            bodyobj.removeEventListener("mousemove",bianjie,true);
                            bodyobj.removeEventListener("touchmove",bianjie,true);
                        }
                        else if(document.detachEvent) {
                            mainDiv.detachEvent("onmousemove",yidong);
                            mainDiv.detachEvent("ontouchmove",yidongmobile);
                            bodyobj.removeEventListener("mousemove",bianjie,true);
                            bodyobj.removeEventListener("touchmove",bianjie,true);
                        }
                        clearInterval(set);
                        clearInterval(time);
                        clearInterval(time);
                    }
                }
                //判断子弹与敌机碰撞
                if((bullets[k].bulletimage.offsetLeft + bullets[k].bulletsizeX > enemys[j].imagenode.offsetLeft) && (bullets[k].bulletimage.offsetLeft < enemys[j].imagenode.offsetLeft + enemys[j].planesizeX)) {
                    if(bullets[k].bulletimage.offsetTop <= enemys[j].imagenode.offsetTop + enemys[j].planesizeY && bullets[k].bulletimage.offsetTop + bullets[k].bulletsizeY >= enemys[j].imagenode.offsetTop) {
                        //敌机血量减子弹攻击力
                        enemys[j].planehp = enemys[j].planehp - bullets[k].bulletattach;
                        //敌机血量为0，敌机图片换为爆炸图片，死亡标记为true，计分
                        if(enemys[j].planehp === 0){
                            scores = scores + enemys[j].planescore;
                            scorelabel.innerHTML = scores;
                            enemys[j].imagenode.src = enemys[j].planeboomimage;
                            enemys[j].planeisdie = true;
                        }
                        //删除子弹
                        mainDiv.removeChild(bullets[k].bulletimage);
                        bullets.splice(k, 1);
                        bulletslen--;
                        break;
                    }
                }
            }
        }
    }
    /*
    开始游戏按钮
     */

}
function begin() {
    startdiv.style.display = "none";
    mainDiv.style.display = "block";
    selfplane.imagenode.style.display = "block";
    scorediv.style.display = "block";
    lefttimediv.style.display = "block";
    /*
    调用开始函数
     */
    set = setInterval(start, 20);
    time = setInterval(settime, 1000);
    lefttimelabel.innerHTML = countdown;
    scorelabel.innerHTML = scores;
}

function introduce() {
    introducediv.style.display = "block";
    suspenddiv.style.display = "none";
    fanhui.onclick = function () {
        introducediv.style.display = "none";
        suspenddiv.style.display = "block";
    }
}


function jixu() {
    location.reload(true);
}