var loaderState = function (game) {
    var progressText;
    this.init = function () {
        progressText = game.add.bitmapText(game.world.centerX, game.world.centerY + 30, 'shop_font', '0%', 48);
        progressText.anchor.setTo(0.5, 0.5);
    };
    this.preload = function () {
        //加载menu界面元素
        game.load.image('bkg', 'art/title/bkg.png');
        game.load.image('title', 'art/title/title.png');
        game.load.image('menu_options', 'art/title/btn_menu_options.png');
        game.load.image('menu_play', 'art/title/btn_menu_play.png');

        //加载option界面元素
        game.load.image('option_bkg', 'art/settings/bkg.png');
        game.load.image('knob', 'art/settings/knob.png');
        game.load.image('track', 'art/settings/track.png');
        game.load.image('checkbox_off', 'art/settings/checkbox_off.png');
        game.load.image('checkbox_on', 'art/settings/checkbox_on.png');
        game.load.image('continue', 'art/settings/continue.png');
        game.load.image('black', 'art/settings/black.png');

        //加载level选择
        game.load.image('btn_back', 'art/level/back.png');
        game.load.image('chapter_bkg', 'art/level/box_chapter_bkg.png');
        game.load.image('chapter_bkg_lock', 'art/level/box_chapter_bkg_lock.png');
        game.load.image('chapter_1_thumb', 'art/level/chapter_1_thumb.png');
        game.load.image('chapter_2_thumb', 'art/level/chapter_2_thumb.png');
        game.load.image('chapter_3_thumb', 'art/level/chapter_3_thumb.png');
        game.load.image('select_button', 'art/level/select_button.png');
        game.load.image('select_button_lock', 'art/level/select_button_lock.png');
        game.load.image('select_button_boss', 'art/level/select_button_boss.png');

        //加载1、2、3关的背景
        game.load.image('bg1_1', 'art/background/bg1/bg_layer1.png');
        game.load.image('bg1_2', 'art/background/bg1/bg_layer2.png');
        game.load.image('bg1_3', 'art/background/bg1/bg_layer3.png');
        game.load.image('bg1_4', 'art/background/bg1/bg_layer4.png');
        game.load.image('bg2_1', 'art/background/bg2/bg_layer1.png');
        game.load.image('bg2_2', 'art/background/bg2/bg_layer2.png');
        game.load.image('bg2_3', 'art/background/bg2/bg_layer3.png');
        game.load.image('bg2_4', 'art/background/bg2/bg_layer4.png');
        game.load.image('bg3_1', 'art/background/bg3/bg_layer1.png');
        game.load.image('bg3_2', 'art/background/bg3/bg_layer2.png');
        game.load.image('bg3_3', 'art/background/bg3/bg_layer3.png');
        game.load.image('bg3_4', 'art/background/bg3/bg_layer4.png');

        //加载音效和音乐
        game.load.audio('menu_music', 'audio/music/menu_music.mp3');
        game.load.audio('button', 'audio/sfx/button.ogg');
        game.load.text('level_object', 'js/inf.json');

        //加载物体
        game.load.image('light', 'art/light/light.png');
        game.load.atlas('boom', 'art/boom/boom.png', 'art/boom/boom.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('pickups', 'art/pickups/pickups.png', 'art/pickups/pickups.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('lift', 'art/lift/lift.png', 'art/lift/lift.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //人物和枪
        game.load.atlas('player', 'art/player/characters/player.png', 'art/player/characters/player.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('gun', 'art/player/gun/gun_hand.png', 'art/player/gun/gun_hand.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        
        //加载敌人
        game.load.atlas('zombie', 'art/enemies/basic_zombie/basic_zombie.png', 'art/enemies/basic_zombie/basic_zombie.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('shooter', 'art/enemies/shooter/shooter.png', 'art/enemies/shooter/shooter.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('worm', 'art/enemies/worm/worm.png', 'art/enemies/worm/worm.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('runner', 'art/enemies/runner/runner.png', 'art/enemies/runner/runner.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('flyer', 'art/enemies/flyer/flyer.png', 'art/enemies/flyer/flyer.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('hopper', 'art/enemies/hopper/hopper.png', 'art/enemies/hopper/hopper.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('dripper', 'art/enemies/dripper/dripper.png', 'art/enemies/dripper/dripper.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('turtle', 'art/enemies/turtle/turtle.png', 'art/enemies/turtle/turtle.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('brainworm', 'art/enemies/brainworm/brainworm.png', 'art/enemies/brainworm/brainworm.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        //加载子弹
        game.load.atlas('bullet', 'art/projectiles/projectiles.png', 'art/projectiles/projectiles.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        //hud
        game.load.image('pause_button', 'art/hud/pause_button.png');
        game.load.image('coin_icon', 'art/hud/coin_icon.png');
        game.load.image('health_bar_base', 'art/hud/health_bar_base1.png');
        game.load.image('health_point1', 'art/hud/health_point1.png');
        game.load.image('health_point2', 'art/hud/health_point2.png');

        game.load.onFileComplete.add(function(progress){ 
            progressText.setText(progress + '%');
        });
    };
    this.create = function () {
        window.game_object = JSON.parse(game.cache.getText('level_object'));
        window.money = game_object.player.money;
        this.camera.fade('#000000');
        this.camera.onFadeComplete.addOnce(function () {
            game.state.start('menuState');
        }, this);
    };
};