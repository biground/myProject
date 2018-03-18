var chapterState = function () {
    this.create = function () {
        this.camera.flash('#ffffff');
        game.add.tileSprite(0, 160, game.width, 240, 'bg3_1').autoScroll(-7, 0);
        var bg3_2 = game.add.tileSprite(0, 160, game.width, 240, 'bg3_2').autoScroll(-14, 0);
        bg3_2.scale.y = 1.3;
        bg3_2.scale.x = 1.3;
        var bg3_3 = game.add.tileSprite(0, 160, game.width, 240, 'bg3_3').autoScroll(-21, 0);
        bg3_3.scale.y = 1.5;
        bg3_3.scale.x = 1.5;
        var bg3_4 = game.add.tileSprite(0, 160, game.width, 240, 'bg3_4').autoScroll(-28, 0);
        bg3_4.scale.y = 1.8;
        bg3_4.scale.x = 1.8;
        var bkg = game.add.image(0, -50, 'bkg');
        bkg.width = game.width;
        bkg.height = game.height + 100;
        game.world.width = 1250;
        game.world.height = 700;
        //      章节选择画面
        this.chapter_state();
    };

    this.chapter_state = function () {
        //章节选择画面组chapter_layer
        //chapter_layer包含一个bitmapText、若干个chapter_bkg按钮组和一个back按钮组
        this.chapter_layer = game.add.group(game.world, 'chapter_layer');
        this.chapter_layer.create(0, 0);

        //back按钮组
        this.chapter_back_btn_group = game.add.group(null, 'chapter_back_btn_group');
        this.chapter_layer.add(this.chapter_back_btn_group);
        var back = game.add.sprite(game.world.centerX, game.height - 60, 'btn_back', null, this.chapter_back_btn_group);
        back.inputEnabled = true;
        back.events.onInputDown.add(this.btn_click, this);

        //chapter_bkg按钮组
        this.chapter_bkg_group =game.add.group(null, 'chapter_bkg_group');
        this.chapter_bkg_group.create(0, 0);
        this.chapter_layer.add(this.chapter_bkg_group);
        game.add.bitmapText(game.width / 2, 60, 'shop_font', 'CHAPTER SELECT', 64, this.chapter_layer);
        for(var i = 0;i < game_object.chapter.length;i++) {
            this.chapter_bkg = game.add.group(null, 'chapter_bkg_' + i);
            this.chapter_bkg.create(0, 0);
            this.chapter_bkg_group.add(this.chapter_bkg);
            game.add.sprite(33 * (i + 1) + 372 * i + 186, game.height / 2, 'chapter_bkg', null, this.chapter_bkg);
            game.add.sprite(33 * (i + 1) + 372 * i + 186, game.height / 2 + 36, 'chapter_' + (i + 1) + '_thumb', null, this.chapter_bkg);
            if(game_object.chapter[i].lock === true)
                game.add.sprite(33 * (i + 1) + 372 * i + 186, game.height / 2, 'chapter_bkg_lock', null, this.chapter_bkg);
            game.add.bitmapText(33 * (i + 1) + 372 * i + 186, 225, 'shop_font', game_object.chapter[i].name, 32, this.chapter_bkg);
            this.chapter_bkg.callAll('events.onInputOver.add', 'events.onInputDown', this.btn_click, this);
        }
        this.chapter_bkg_group.setAllChildren('inputEnabled', true);
        this.chapter_layer.setAllChildren('anchor.x', 0.5);
        this.chapter_layer.setAllChildren('anchor.y', 0.5);
    };

    this.btn_click = function (sprite) {
        //inputDown时变色(整个group中的children都要变色)
        sprite.parent.setAll('tint', 0xe7e7e7);
        //通过不同的group.name来判断应该执行哪个事件
        sprite.events.onInputUp.add(function (sprite) {
            sprite.parent.setAll('tint', 0xffffff);
                switch (sprite.parent.name){
                    case 'chapter_back_btn_group' : this.camera_fade('menu'); break;
                    case 'chapter_bkg_0':
                    case 'chapter_bkg_1':
                    case 'chapter_bkg_2': this.camera_fade('level', sprite.parent.name[12]);break;
                    default:break;
                }
        }, this);
    };

    //切换场景
    this.camera_fade = function (sprite, chapter) {
        //切换场景时淡入
        if(chapter) {
            game_object.current_chapter = parseInt(chapter);
        }
        if(!game_object.chapter[game_object.current_chapter].lock || sprite === 'menu') {
            this.camera.fade('#000000');
            this.camera.onFadeComplete.addOnce(function () {
                game.state.start(sprite + 'State');
            }, this);
        }
    };
};