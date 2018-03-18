var loaderState = function (game) {
    var progressText;
    this.init = function () {
		var loading = game.add.sprite(game.world.centerX, game.world.centerY, 'loading');
		loading.animations.add('play');
		loading.animations.play('play');
        loading.anchor = { x:0.5, y:0.5 };
        progressText = game.add.text(game.world.centerX, game.world.centerY + 30, '0%', { fill: '#fff', fontSize:'16px' });
        progressText.anchor = { x:0.5, y:0.5 };
    };
    this.preload = function () {
        game.load.image('background', 'atlas/bg_day.png');           //背景
        game.load.image('land', 'atlas/land.png');                   //地面
        game.load.image('title', 'atlas/title.png');                 //游戏标题
        game.load.spritesheet('bird', 'atlas/birds.png', 34, 25, 3); //鸟
        game.load.image('button_play', 'atlas/button_play.png');     //按钮
        game.load.image('pipe_up', 'atlas/pipe_up.png');             //下管道
        game.load.image('pipe_down', 'atlas/pipe_down.png');         //上管道
        game.load.spritesheet('score_text', 'atlas/score.png', 24, 36, 10);     //分数字体
        game.load.spritesheet('gScore_text', 'atlas/gameoverscore.png', 11, 13, 10);
        game.load.spritesheet('medal', 'atlas/medal.png', 44, 44, 3);           //奖牌
        game.load.audio('point_sound', 'atlas/sfx_point.ogg');       //得分音效
        game.load.audio('wing_sound', 'atlas/sfx_wing.ogg');         //飞行音效
        game.load.audio('hit_sound', 'atlas/sfx_hit.ogg');           //撞击的音效

        game.load.image('ready_text', 'atlas/text_ready.png');
        game.load.image('tutorial', 'atlas/tutorial.png');
        game.load.image('game_over', 'atlas/text_game_over.png');
        game.load.image('score_board', 'atlas/score_panel.png');

        game.load.onFileComplete.add(function(progress){ 
            progressText.text = progress + '%';
        })

    };
    this.create = function () {
        game.state.start('menuState');
    }
};