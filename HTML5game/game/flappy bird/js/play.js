var playState = function () {
    this.create = function () {
        this.gameSpeed = 200;
        this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');//背景图，这里先不用移动，游戏开始后再动
        this.pipeGroup = game.add.group();  //用于存放管道的组
        this.pipeGroup.enableBody = true;   //开启所有管道的物理引擎
        this.ground = game.add.tileSprite(0, game.height-112, game.width, 112, 'land');//同背景
        this.bg.autoScroll(-(this.gameSpeed / 10), 0);
        this.ground.autoScroll(-this.gameSpeed, 0);
        this.bird = game.add.sprite(50, 200, 'bird');   //鸟
        this.bird.animations.add('fly');                //添加飞行动画
        this.bird.animations.play('fly', 12, true);     //播放动画
        this.bird.anchor.setTo(0.5, 0.5);               //设置中心点
        game.physics.enable(this.bird, Phaser.Physics.ARCADE);  //开启鸟的物理引擎
        this.bird.body.gravity.y = 0;   //鸟的重力
        game.physics.enable(this.ground, Phaser.Physics.ARCADE);    //开启地面的物理引擎
        this.ground.body.immovable = true;  //使地面再物理环境中固定不动
        this.readyText = game.add.image(game.width / 2, 100, 'ready_text');  //get ready 文字
        this.playTip = game.add.image(game.width / 2, 250, 'tutorial') ;    //提示操作方法
        this.readyText.anchor.setTo(0.5, 0);
        this.playTip.anchor.setTo(0.5, 0);
        this.scoregroup = game.add.group();
        this.scoretext = game.add.sprite(game.width / 2, 60, 'score_text', 0, this.scoregroup);
        this.scoretext2 = null;
        this.scoretext3 = null;
        this.scoretext.anchor.setTo(0.5, 0.5);
        this.gameOverScore = [];
        this.hasStarted = false;    //判断游戏是否开始
        game.time.events.loop(900, this.generatePipes, this);    //利用时钟事件循环产生管道
        game.time.events.stop(false);   //先不启动时钟
        game.input.onDown.addOnce(this.startGame, this);
        this.soundFly = game.add.audio('wing_sound');
        this.soundHit = game.add.audio('hit_sound');
        this.getPoint = game.add.audio('point_sound');
    };

    this.update = function(){
        if(!this.hasStarted) return;
        game.physics.arcade.collide(this.bird, this.ground, this.hitGround, null, this);
        game.physics.arcade.overlap(this.bird, this.pipeGroup, this.hitPipe, null, this);
        if(this.bird.angle < 90) this.bird.angle += 2.5;
        this.pipeGroup.forEachExists(this.checkScore, this);
    };

    this.startGame = function () {
        this.gameIsOver = false;
        this.hasHitGround = false;
        this.hasHitPipe = false;
        this.hasStarted = true;
        this.score = 0;
        this.bird.body.gravity.y = 1150;
        this.readyText.destroy();
        this.playTip.destroy();
        game.input.onDown.add(this.fly, this);
        game.time.events.start();
    };

    this.fly = function () {
        this.bird.body.velocity.y = -350;
        game.add.tween(this.bird).to({ angle:-30 }, 100, null, true, 0, 0, false);
        this.soundFly.play();
    };

    this.generatePipes = function (gap) {
        gap = gap || 100;
        var position = (505 - 320 - gap) + Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random());
        var topPipeY = position - 360;
        var bottomPipeY = position + gap;

        if(this.resetPipe(topPipeY, bottomPipeY)) return;

        game.add.sprite(game.width, topPipeY, 'pipe_down', null, this.pipeGroup);
        game.add.sprite(game.width, bottomPipeY, 'pipe_up', null, this.pipeGroup);
        this.pipeGroup.setAll('checkWorldBounds', true);
        this.pipeGroup.setAll('outOfBoundsKill', true);
        this.pipeGroup.setAll('body.velocity.x', -this.gameSpeed);
    };

    this.resetPipe = function (topPipeY, bottomPipeY) {
        var i = 0;
        this.pipeGroup.forEachDead(function (pipe) {
            if(pipe.y <= 0){
                pipe.reset(game.width, topPipeY);
                pipe.hasScored = false;
            } else {
                pipe.reset(game.width, bottomPipeY);
            }

            pipe.body.velocity.x = -this.gameSpeed;
            i++;
        }, this);
        return i === 2;
    };
    var score = 0;
    this.checkScore = function (pipe) {
        if(!pipe.hasScored && pipe.y <= 0 && pipe.x <= this.bird.x -17 -54){
            pipe.hasScored = true;
            this.getPoint.play();
            this.score++;
            score = this.score + '';
            this.scoretext.frame = parseInt(score[0]);
            if(score.length > 1){
                if(!this.scoretext2) {
                    this.scoretext2 = game.add.sprite(game.width / 2 + 13, 60, 'score_text', 1, this.scoregroup);
                    this.scoretext2.anchor.setTo(0.5, 0.5);
                    this.scoretext.x = game.width / 2 - 13;
                } else {
                    this.scoretext2.frame = parseInt(score[1]);
                }
            }
            if(score.length > 2){
                if(!this.scoretext3) {
                    this.scoretext3 = game.add.sprite(game.width / 2 + 26, 60, 'score_text', 1, this.scoregroup);
                    this.scoretext3.anchor.setTo(0.5, 0.5);
                    this.scoretext.x = game.width / 2 - 26;
                    this.scoretext2.x = game.width / 2;
                } else {
                    this.scoretext3.frame = parseInt(score[2]);
                }
            }
            return true;
        }
        return false;
    };

    this.stopGame = function(){
        this.bg.stopScroll();
        this.ground.stopScroll();
        this.pipeGroup.forEachExists(function(pipe){
            pipe.body.velocity.x = 0;
        }, this);
        this.bird.animations.stop('fly', 0);
        game.input.onDown.remove(this.fly,this);
        game.time.events.stop(true);
    };
    this.hitPipe = function(){
        if(this.gameIsOver) return;
        this.hasHitPipe = true;
        if(!this.hasHitGround)
            this.soundHit.play();
        this.gameOver();
    };
    this.hitGround = function(){
        if(this.hasHitGround) return; //已经撞击过地面
        this.hasHitGround = true;
        if(!this.hasHitPipe)
            this.soundHit.play();
        this.gameOver(true);
    };
    this.gameOver = function(show_text){
        this.gameIsOver = true;
        this.stopGame();
        if(show_text) this.showGameOverText();
    };//这里把最后的得分加上啦
    var gScore;
    this.showGameOverText = function(){
        //this.scoreText.destroy();
        game.bestScore = game.bestScore || 0;
        if(this.score > game.bestScore) game.bestScore = this.score; //最好分数
        this.gameOverGroup = game.add.group(); //添加一个组
        var gameOverText = this.gameOverGroup.create(game.width/2,0,'game_over'); //game over 文字图片
        var scoreboard = this.gameOverGroup.create(game.width/2,70,'score_board'); //分数板
        gScore = this.score + '';
        for(var i = 0;i < gScore.length;i++){
            /*if(i === 0)
                this.gameOverScore.push(game.add.sprite(game.width / 2 + 65, 105, 'gScore_text', parseInt(gScore[0]), this.gameOverGroup));
            if(i === 1){
                this.gameOverScore.push(game.add.sprite(game.width / 2 + 65 + 6, 105, 'gScore_text', parseInt(gScore[1]), this.gameOverGroup));
                this.gameOverScore[0].x -= 6;
            }
            if(i === 2){
                this.gameOverScore.push(game.add.sprite(game.width / 2 + 65 + 12, 105, 'gScore_text', parseInt(gScore[2]), this.gameOverGroup));
                this.gameOverScore[0].x -= 6;
                this.gameOverScore[1].x -= 6;
            }*/
            this.gameOverScore.push(game.add.sprite(game.width / 2 + 65 + i * 6, 105, 'gScore_text', parseInt(gScore[i]), this.gameOverGroup));
            if(i !== 0)
                this.gameOverScore[i - 1].x -= 6 * (gScore.length - i);
        }

        var medal = this.gameOverGroup.create(80, 136, 'medal');
        medal.anchor.setTo(0.5, 0.5);
        if(this.score >= 70) medal.frame = 2;
        else if(this.score >= 20) medal.frame = 1;
        var replayBtn = game.add.button(game.width/2, 210, 'button_play', function(){//重玩按钮
            game.state.start('playState');
        }, this, null, null, null, null, this.gameOverGroup);
        gameOverText.anchor.setTo(0.5, 0);
        scoreboard.anchor.setTo(0.5, 0);
        replayBtn.anchor.setTo(0.5, 0);
        this.gameOverGroup.y = 30;
        this.scoregroup.destroy();
    }
};