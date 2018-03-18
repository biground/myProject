var menuState = function () {
    this.create = function () {
        game.add.tileSprite(0, 0, game.width, game.height, 'background').autoScroll(0, 10);         //自动滚动的背景图
        var titleGroup = game.add.group();                                                          //创建存放标题的组
        titleGroup.create(0, 0, 'title');                                                           //添加标题到组中
        var myPlane = titleGroup.create(game.width / 2, 500, 'myPlane');                            //添加myPlane到组中
        myPlane.animations.add('fly', [0, 1]);                                                              //添加动画
        myPlane.animations.play('fly', 5, true);                                                    //播放动画
        myPlane.anchor.setTo(0.5, 0.5);
        var startButton = game.add.button(game.width / 2, 400, 'button_play',function(){                    //开始按钮
            game.state.start('playState');
        }, this, 1, 0);
        startButton.anchor.setTo(0.5, 0.5);
    }
};