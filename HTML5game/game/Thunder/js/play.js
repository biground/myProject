var playState = function () {
    this.create = function () {
        this.gameSpeed = 200;
        this.bulletSpeed = 200;
        this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'background').autoScroll(0, 10);         //自动滚动的背景图
        this.enemyGroup = game.add.group();
        this.enemyGroup.enableBody = true;
        this.bulletGroup = game.add.group();
        this.bulletGroup.enableBody = true;
        this.updatescore = game.add.bitmapText(0, 0, 'thunder_font', 'score: ' + this.score, 20);
        this.updatetime = game.add.bitmapText(0, 30, 'thunder_font', 'time: ' + this.time, 20);
        this.myPlane = game.add.sprite(game.width / 2, 500, 'myPlane');     //本方飞机
        this.myPlane.animations.add('fly', [0, 1]);
        this.myPlane.animations.add('die', [2, 3, 4, 5]);
        this.myPlane.animations.play('fly', 5, true);
        this.myPlane.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.myPlane, Phaser.Physics.ARCADE, true);
        this.hasStarted = false;
        this.canMove = true;
        game.time.events.loop(150, this.createBullets, this);   //利用时钟事件产生敌人和子弹
        game.time.events.loop(800 - this.gameSpeed, this.createEnemy, this);
        game.time.events.loop(1000, this.countTime, this);
        this.startGame();
    };

    this.update = function(){
        if(!this.hasStarted) return;
        game.physics.arcade.overlap(this.myPlane, this.enemyGroup, this.crash, null, this);
        game.physics.arcade.overlap(this.enemyGroup, this.bulletGroup, this.killEnemy, null, this);
        this.updatescore.setText('score: ' + this.score);
        this.updatetime.setText('time: ' + this.time);
        if(!game.paused && this.canMove){
            this.myPlane.x = game.input.x;
            this.myPlane.y = game.input.y;
        }
        if(Phaser.Rectangle.contains(this.myPlane.body, game.input.x, game.input.y))this.canMove = true;
        if(game.input.mousePointer.isDown && !this.gameIsOver){
            game.paused = true;
            this.canMove = false;
            this.showMenu();
        }
    };

    this.startGame = function () {
        this.gameIsOver = false;
        this.hasStarted = true;
        this.score = 0;
        this.time = 60;
        this.timeline = 50;
        this.mark = 0;
        game.time.events.start();
    };

    this.countTime = function () {
        this.time--;
        if(this.time === this.timeline){
            this.gameSpeed += 100;
            this.timeline -= 10;
        }
        if(this.time === 0){
            this.crash();
        }
    };

    this.random = function(min, max){
        return Math.floor(min + Math.random() * (max - min));
    };

    this.createBullets = function () {
        var positionX = this.myPlane.x;
        var positionY = this.myPlane.y - 37;

        if(this.resetBullet(positionX, positionY)) return;

        game.add.sprite(positionX, positionY, 'bullet', null, this.bulletGroup);
        this.bulletGroup.setAll('checkWorldBounds', true);
        this.bulletGroup.setAll('outOfBoundsKill', true);
        this.bulletGroup.setAll('body.velocity.y', -this.bulletSpeed);
    };

    this.resetBullet = function (X, Y) {
        var i = 0;
        this.bulletGroup.forEachDead(function (bullet) {
            if(i === 0) {
                bullet.reset(X, Y);
                bullet.revive();
                bullet.body.velocity.y = -this.bulletSpeed;
                i++;
            }
        }, this);
        return i;
    };

    this.createEnemy = function () {
        var positionX;
        var positionY;
        var plane = '';
        this.mark++;
        if(this.mark % 20 === 0) {       //大飞机
            positionX = this.random(0, game.width - 130);
            positionY = -159;
            plane = 'enemy_l_fly';
        } else if(this.mark % 5 === 0) { //中飞机
            positionX = this.random(0, game.width - 46);
            positionY = -59;
            plane = 'enemy_m_fly';
        } else {                    //小飞机
            positionX = this.random(0, game.width - 34);
            positionY = -30;
            plane = 'enemy_s_fly';
        }
        if(this.resetEnemy(positionX, positionY, plane)) return;


        this.enemy = game.add.sprite(positionX, positionY, plane, null, this.enemyGroup);
        if(this.enemy.key === 'enemy_l_fly' || this.enemy.key === 'enemy_l_hit') {
            this.enemy.health = 12;
        } else if(this.enemy.key === 'enemy_m_fly' || this.enemy.key === 'enemy_m_hit') {
            this.enemy.health = 6;
        } else {
            this.enemy.health = 1;
        }
        this.enemyGroup.setAll('checkWorldBounds', true);
        this.enemyGroup.setAll('outOfBoundsKill', true);
        this.enemyGroup.setAll('body.velocity.y', this.gameSpeed / 2);
    };

    this.resetEnemy = function (positionX, positionY, plane) {
        var i = 0;
        this.enemyGroup.forEachDead(function (enemy) {
			if(!i) return;
                if (enemy.key === plane || enemy.key === 'enemy_' + plane[6] + '_die') {
                    enemy.reset(positionX, positionY);
                    enemy.loadTexture(plane);
                    enemy.body.velocity.y = this.gameSpeed / 2;
                    if (enemy.key === 'enemy_l_fly' || enemy.key === 'enemy_l_die') {
                        enemy.health = 12;
                    } else if (enemy.key === 'enemy_m_fly' || enemy.key === 'enemy_m_die') {
                        enemy.health = 6;
                    } else {
                        enemy.health = 1;
                    }
                    i++;
                }
        }, this);
        return i;
    };

    this.killEnemy = function(enemy, bullet){
        if(!this.gameIsOver) {
            enemy.health--;
            if (enemy.health > 0) {
                bullet.kill();
                if (enemy.key === 'enemy_m_fly' || enemy.key === 'enemy_l_fly') {
                    enemy.animations.add('hit', [0, 1]);
                    enemy.animations.play('hit', 15, false);
                    enemy.events.onAnimationComplete.add(function () {
                        enemy.animations.frame = 0
                    });
                }
            } else if ((!enemy.animations.frame)) {
                var frameRate = [2, 3, 4];
                this.score += 1000;
                if (enemy.key[6] === 'm') {
                    frameRate.push(5);
                    this.score += 4000;
                } else if (enemy.key[6] === 'l') {
                    frameRate.push(5, 6, 7);
                    this.score += 9000;
                }
                bullet.kill();
                enemy.body.velocity.y = 0;
                enemy.animations.add('die', frameRate);
                enemy.animations.play('die', 10, false, true);
            }
        }
    };

    this.crash = function(){
        this.myPlane.animations.play('die', 10, false, true);
        this.gameOver();
    };

    this.showMenu = function () {
        var buttonGroup = game.add.group();
        game.add.button(game.width / 2, 150, 'button_resume',function(){                    //继续按钮
            game.paused = false;
            buttonGroup.destroy();
        }, this, 1, 0, null, null, buttonGroup);
        game.add.button(game.width / 2, 270, 'button_tips',function(){                    //显示提示页面
            buttonGroup.visible = false;
            var tipGroup = game.add.group();
            tipGroup.create(game.width / 2, 270, 'tip_panel'); //提示背景
            game.add.bitmapText(game.width / 2, 150, 'thunder_font', 'Tip', 50, tipGroup);
            game.add.bitmapText(game.width / 2, 200, 'thunder_font', 'move:follow mouse', 15, tipGroup);
            game.add.bitmapText(game.width / 2, 240, 'thunder_font', 'Scores of plane', 18, tipGroup);
            game.add.bitmapText(game.width / 2, 280, 'thunder_font', 'small: 1000 points', 15, tipGroup);
            game.add.bitmapText(game.width / 2, 320, 'thunder_font', 'middle: 5000 points', 15, tipGroup);
            game.add.bitmapText(game.width / 2, 360, 'thunder_font', 'large: 10000 points', 15, tipGroup);
            game.add.button(game.width / 2, 400, 'button_back',function(){                    //开始按钮
                buttonGroup.visible = true;
                tipGroup.destroy();
            }, this, 1, 0, null, null, tipGroup);   //返回键
            tipGroup.setAll('anchor.x', '0.5');
            tipGroup.setAll('anchor.y', '0.5');
        }, this, 1, 0, null, 0, buttonGroup);
        game.add.button(game.width/2, 390, 'button_main', function(){//重玩按钮
            game.paused = false;
            game.state.start('menuState');
        }, this, 1, 0, null, null, buttonGroup);
        buttonGroup.setAll('anchor.x', '0.5');
        buttonGroup.setAll('anchor.y', '0.5');
    };

    this.gameOver = function(){
        this.gameIsOver = true;
        this.stopGame();
        this.showGameOverText();
    };//这里把最后的得分加上啦

    this.stopGame = function(){
        this.bg.stopScroll();
        this.myPlane.animations.stop('fly', 0);
        game.time.events.stop(true);
    };


    this.showGameOverText = function(){
        this.updatescore.destroy();
        this.updatetime.destroy();
        game.bestScore = game.bestScore || 0;
        if(this.score > game.bestScore) game.bestScore = this.score; //最好分数
        this.gameOverGroup = game.add.group(); //添加一个组
        this.gameOverGroup.create(game.width/2,0,'game_over'); //game over 文字图片
        this.gameOverGroup.create(game.width/2,70,'score_board'); //分数板
        game.add.bitmapText(game.width / 2, 150, 'thunder_font', this.score + '', 24, this.gameOverGroup);
        game.add.bitmapText(game.width / 2, 210, 'thunder_font', game.bestScore + '', 24, this.gameOverGroup);
        game.add.button(game.width/2, 430, 'button_play', function(){//重玩按钮
            game.state.start('playState');
            this.gameOverGroup.destroy();
        }, this, 1, 0, null, null, this.gameOverGroup);
        this.gameOverGroup.setAll('anchor.x', 0.5);
        this.gameOverGroup.setAll('anchor.y', 0);
        this.gameOverGroup.y = 40;
    };
};
