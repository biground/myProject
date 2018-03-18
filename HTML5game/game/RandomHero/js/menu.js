var menuState = function () {
    this.create = function () {
        //切换场景时淡出
        this.camera.flash('#000000');
        //开始画面
        //  滚动的背景
        this.bg1 = game.add.tileSprite(0, 160, game.width, 240, 'bg3_1').autoScroll(-7, 0);
        this.bg2 = game.add.tileSprite(0, 160, game.width, 240, 'bg3_2').autoScroll(-14, 0);
        this.bg2.scale.y = 1.3;
        this.bg2.scale.x = 1.3;
        this.bg3 = game.add.tileSprite(0, 160, game.width, 240, 'bg3_3').autoScroll(-21, 0);
        this.bg3.scale.y = 1.5;
        this.bg3.scale.x = 1.5;
        this.bg4 = game.add.tileSprite(0, 160, game.width, 240, 'bg3_4').autoScroll(-28, 0);
        this.bg4.scale.y = 1.8;
        this.bg4.scale.x = 1.8;
        var bkg = game.add.image(0, -50, 'bkg');
        bkg.width = game.width;
        bkg.height = game.height + 100;
        //  创建不同场景的不同组
        //      开始画面
        this.menu_state();
        this.black = game.add.sprite(0, 0, 'black');
        this.black.alpha = 0;
        this.option_state();
    };

    this.menu_state = function () {
        //      开始画面组menu_layer
        //      menu_layer包含一个title图片和两个按钮组(group)
        this.menu_layer = game.add.group(game.world, 'menu_layer');
        this.menu_layer.create(0, 0);
        game.add.sprite(game.world.centerX - 280, game.world.centerY, 'title', null, this.menu_layer);
        this.menu_play_btn_group = game.add.group(null, 'menu_play_btn_group');
        this.menu_options_btn_group = game.add.group(null, 'menu_options_btn_group');
        //

        game.add.sprite(game.world.centerX + 350, game.world.centerY - 50, 'menu_play', null, this.menu_play_btn_group);
        game.add.sprite(game.world.centerX + 350, game.world.centerY + 50, 'menu_options', null, this.menu_options_btn_group);
        this.menu_layer.add(this.menu_play_btn_group);
        this.menu_layer.add(this.menu_options_btn_group);
        this.menu_layer.setAllChildren('anchor.x', 0.5);
        this.menu_layer.setAllChildren('anchor.y', 0.5);
        this.menu_layer.setAllChildren('inputEnabled', true);

        //  为按钮添加监听
        //  因为所有的按钮都是inputDown变颜色然后执行不同的事件
        //  所以都添加同一个回调函数btn_click
        this.menu_layer.forEach(function (children) {
            if(children.type === 7){
                //7代表类型为group,因为group的name都不同所以只能通过type判断children是否为group
                children.callAll('events.onInputDown.add', 'events.onInputDown', this.btn_click, this);
            }
        }, this);
    };

    this.option_state = function () {
        //游戏设置模块组 option_layer
        this.option_layer = game.add.group(game.world, 'option_layer');
        this.option_layer.y =game.world.centerY + 224;
        this.option_layer.z = 8;
        game.add.sprite(game.world.centerX, game.world.centerY, 'option_bkg', null, this.option_layer);

        //给对应的设置放进不同的分组
        this.option_layer_music = game.add.group(this.option_layer, 'option_layer_music');
        game.add.bitmapText(game.world.centerX - 90, game.world.centerY - 30, 'shop_font', 'MUSIC', 32, this.option_layer_music);
        game.add.sprite(game.world.centerX + 90, game.world.centerY - 30, 'checkbox_on', null, this.option_layer_music);

        this.option_layer_sfx = game.add.group(this.option_layer, 'option_layer_sfx');
        game.add.bitmapText(game.world.centerX - 90, game.world.centerY + 30, 'shop_font', 'SFX', 32, this.option_layer_sfx);
        game.add.sprite(game.world.centerX + 90, game.world.centerY + 30, 'checkbox_on', null, this.option_layer_sfx);

        this.option_layer_back = game.add.group(this.option_layer, 'option_layer_back');
        game.add.sprite(game.world.centerX, game.world.centerY + 160, 'continue', null, this.option_layer_back);

        this.option_layer.setAllChildren('anchor.x', 0.5);
        this.option_layer.setAllChildren('anchor.y', 0.5);
        this.option_layer.setAllChildren('inputEnabled', true);
        this.option_layer.forEach(function (children) {
            if(children.type === 7){
                //7代表类型为group,因为group的name都不同所以只能通过type判断children是否为group
                children.callAll('events.onInputDown.add', 'events.onInputDown', this.option_click, this);
            }
        }, this);
        this.option_show = game.add.tween(this.option_layer).to({y:0}, 400, null, false, 0, 0, false);
        this.option_hide = game.add.tween(this.option_layer).to({y:game.world.centerY + 224}, 400, null, false, 0, 0, false);
    };

    this.option_click = function (sprite) {
        switch(sprite.parent.name){
            case 'option_layer_music':{
                if(sprite.key === 'checkbox_on'){
                    sprite.loadTexture('checkbox_off');
                    game_object.music = false;
                } else {
                    sprite.loadTexture('checkbox_on');
                    game_object.music = true;
                }
            } break;
            case 'option_layer_sfx':{
                if(sprite.key === 'checkbox_on'){
                    sprite.loadTexture('checkbox_off');
                    game_object.sfx = false;
                } else {
                    sprite.loadTexture('checkbox_on');
                    game_object.sfx = true;
                }
            } break;
            case 'option_layer_back': {
                sprite.tint = 0xe7e7e7;
                var that = this;
                sprite.events.onInputUp.addOnce(function (sprite) {
                    sprite.tint = 0xffffff;
                    that.black.alpha = 0;
                    that.menu_layer.setAllChildren('inputEnabled', true);
                    that.option_hide.start();
                });
            }break;
        }
    };

    this.btn_click = function (sprite) {
        //inputDown时变色(整个group中的children都要变色)
        sprite.parent.setAll('tint', 0xe7e7e7);
        //通过不同的group.name来判断应该执行哪个事件
        sprite.events.onInputUp.add(function (sprite) {
            sprite.parent.setAll('tint', 0xffffff);
            switch (sprite.parent.name){
                case 'menu_play_btn_group' : this.camera_fade('chapter'); break;
                case 'menu_options_btn_group' : this.show_options(); break;
                default:break;
            }
        }, this);
    };

    //切换场景
    this.camera_fade = function (sprite) {
        //切换场景时淡入
        this.camera.fade('#000000');
        this.camera.onFadeComplete.addOnce(function () {
            game.state.start(sprite + 'State');
        }, this);
    };

    //设置参数
    this.show_options = function(){
        this.black.alpha = 0.5;
        this.black.z = 7;
        this.menu_layer.setAllChildren('inputEnabled', false);
        this.option_show.start();
    };
};