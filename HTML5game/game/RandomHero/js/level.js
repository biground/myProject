var levelState = function () {
    this.create = function () {
        this.camera.flash('#ffffff');
        game.add.tileSprite(0, 160, game.width, 240, 'bg' + (game_object.current_chapter + 1) + '_1').autoScroll(-7, 0);
        var bg3_2 = game.add.tileSprite(0, 160, game.width, 240, 'bg' + (game_object.current_chapter + 1) + '_2').autoScroll(-14, 0);
        bg3_2.scale.y = 1.3;
        bg3_2.scale.x = 1.3;
        var bg3_3 = game.add.tileSprite(0, 160, game.width, 240, 'bg' + (game_object.current_chapter + 1) + '_3').autoScroll(-21, 0);
        bg3_3.scale.y = 1.5;
        bg3_3.scale.x = 1.5;
        var bg3_4 = game.add.tileSprite(0, 160, game.width, 240, 'bg' + (game_object.current_chapter + 1) + '_4').autoScroll(-28, 0);
        bg3_4.scale.y = 1.8;
        bg3_4.scale.x = 1.8;
        var bkg = game.add.image(0, -50, 'bkg');
        bkg.width = game.width;
        bkg.height = game.height + 100;

        //      关卡选择画面
        this.level_state();
    };

    this.level_state = function () {
        //章节选择画面组chapter_layer
        //level_layer包含一个bitmapText、若干个level_bkg按钮组和一个back按钮组
        this.level_layer = game.add.group(game.world, 'level_layer');
        this.level_layer.create(0, 0);

        //back按钮组
        this.level_back_btn_group = game.add.group(null, 'level_back_btn_group');
        this.level_layer.add(this.level_back_btn_group);
        var back = game.add.sprite(game.world.centerX, game.height - 60, 'btn_back', null, this.level_back_btn_group);
        back.inputEnabled = true;
        back.events.onInputDown.add(this.btn_click, this);

        //level_bkg按钮组
        this.level_bkg_group =game.add.group(null, 'level_bkg_group');
        this.level_bkg_group.create(0, 0);
        this.level_layer.add(this.level_bkg_group);
        game.add.bitmapText(game.width / 2, 60, 'shop_font', 'LEVEL SELECT', 64, this.level_layer);
        var width, height, key;
        var length = game_object.chapter[game_object.current_chapter].level.length;
        for(var i = 0;i < length;i++) {
            this.level_bkg = game.add.group(null, 'level_bkg_' + i);
            this.level_bkg.create(0, 0);
            this.level_bkg_group.add(this.level_bkg);
            width = 127 + 58 + i % 6 * 176;
            height = i < 6 ? game.height / 2 -78 : game.height / 2 + 78;
            key = i < 9 ? '0' + (i + 1) + '' : (i + 1) + '';
            if(game_object.chapter[game_object.current_chapter].level[i].lock === false) {
                game.add.sprite(width, height, 'select_button', null, this.level_bkg);
                game.add.bitmapText(width, height, 'shop_font', key, 32, this.level_bkg);
            } else if(i === length - 1) {
                game.add.sprite(width, height, 'select_button_boss', null, this.level_bkg);
            } else {
                game.add.sprite(width, height, 'select_button_lock', null, this.level_bkg);
            }
            this.level_bkg.callAll('events.onInputOver.add', 'events.onInputDown', this.btn_click, this);
        }
        this.level_bkg_group.setAllChildren('inputEnabled', true);
        this.level_layer.setAllChildren('anchor.x', 0.5);
        this.level_layer.setAllChildren('anchor.y', 0.5);
    };


    this.btn_click = function (sprite) {
        //inputDown时变色(整个group中的children都要变色)
        sprite.parent.setAll('tint', 0xe7e7e7);
        //通过不同的group.name来判断应该执行哪个事件
        sprite.events.onInputUp.add(function (sprite) {
            sprite.parent.setAll('tint', 0xffffff);
            switch (sprite.parent.name){
                case 'level_back_btn_group' : this.camera_fade('chapter'); break;
                case 'level_bkg_0':
                case 'level_bkg_1':
                case 'level_bkg_2':
                case 'level_bkg_3':
                case 'level_bkg_4':
                case 'level_bkg_5':
                case 'level_bkg_6':
                case 'level_bkg_7':
                case 'level_bkg_8':
                case 'level_bkg_9':
                case 'level_bkg_10':
                case 'level_bkg_11': this.camera_fade('play', sprite.parent.name[10]);break;
                default:break;
            }
        }, this);
    };
    //切换场景
    this.camera_fade = function (sprite, level) {
        //切换场景时淡入
        if(level){
            game_object.current_level = parseInt(level);
        }
        if(!game_object.chapter[game_object.current_chapter].level[game_object.current_level].lock || sprite === 'chapter') {
            this.camera.fade('#000000');
            this.camera.onFadeComplete.addOnce(function () {
                game.state.start(sprite + 'State');
            }, this);
        }
    };
};