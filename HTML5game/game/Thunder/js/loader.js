var loaderState = function (game) {
    var progressText;
    this.init = function () {
        var loading = game.add.sprite(game.world.centerX, game.world.centerY, 'loading');
        loading.animations.add('play');
        loading.animations.play('play', 15, true);  //加载界面
        loading.anchor = { x:0.5, y:0.5 };
        progressText = game.add.text(game.world.centerX, game.world.centerY + 30, '0%', { fill: '#fff', fontSize:'16px' });
        progressText.anchor = { x:0.5, y:0.5 };     //加载进度
    };
    this.preload = function () {
        game.load.image('background', 'image/background_1.png');                                        //背景
        game.load.image('title', 'image/startBg.png');                                                  //游戏标题
        game.load.image('bullet', 'image/bullet.png');                                                  //子弹
        game.load.image('tip_panel', 'image/tipPanel.png');                                             //游戏提示面板
        game.load.image('game_over', 'image/gameOver.png');                                             //游戏结束
        game.load.image('score_board', 'image/score_panel.png');                                        //分数面板

        game.load.spritesheet('myPlane', 'image/myPlane.png', 64, 74, 6);                               //本方飞机
        game.load.spritesheet('button_play', 'image/startButton.png', 241, 92);                         //开始按钮
        game.load.spritesheet('button_resume', 'image/resumeButton.png', 241, 92);                      //继续按钮
        game.load.spritesheet('button_tips', 'image/tipsButton.png', 241, 92);                          //说明按钮
        game.load.spritesheet('button_back', 'image/backButton.png', 124, 48);                          //返回按钮
        game.load.spritesheet('button_main', 'image/mainButton.png', 241, 92);                          //主页按钮
        game.load.spritesheet('enemy_s_fly', 'image/enemy_s_fly.png', 34, 31, 5);                       //敌方小飞机
        game.load.spritesheet('enemy_m_fly', 'image/enemy_m_fly.png', 45, 60, 6);                       //敌方中飞机
        game.load.spritesheet('enemy_l_fly', 'image/enemy_l_fly.png', 110, 160, 8);                     //敌方大飞机

        game.load.bitmapFont('thunder_font', 'image/thunder_font.png', 'image/thunder_font.fnt');       //字体文件


        game.load.onFileComplete.add(function(progress){ 
            progressText.text = progress + '%';
        })

    };
    this.create = function () {
        game.state.start('menuState');
    }
};