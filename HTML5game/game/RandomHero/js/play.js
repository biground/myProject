var playState = function () {
	this.preload = function() {
        //根据关卡加载地图
		game.load.tilemap('map', 'assets/c' + (game_object.current_chapter + 1) + '_level_' + (game_object.current_level + 1) + '.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'art/tiles/tile_sheet.png');
        //Object图片
        if(game_object.current_chapter === 0 && game_object.current_level === 0) {
            game.load.image('signpost', 'art/tutorial/signpost.png');
        }
        console.log(game_object.current_chapter,game_object.current_level);
	};
    this.create = function () {
        //创建键盘事件
        this.cursors = game.input.keyboard.createCursorKeys();
        state = this;
        //创建tiledmap
		this.map = game.add.tilemap('map', 64, 64);
        this.map.addTilesetImage('tile_sheet', 'tiles', 64, 64);
		this.Map = this.map.createLayer('Map');
        this.Object = this.map.createLayer('Objects');
        this.Collision = this.map.createLayer('Collision');
        this.EnemiesCollision = this.map.createLayer('EnemiesCollision');
        this.EnemiesCollision.visible = false;
        this.Collision.visible = false;
        this.Object.visible = false;
        this.map.setCollision(200, true, this.EnemiesCollision);
        this.map.setCollision(200, true, this.Collision);
        this.Map.resizeWorld();

        //创建并设置Objects层上的各个物体
        this.group_object = game.add.group();
        this.group_signpost = game.add.group(this.group_object);
        this.group_coins = game.add.group(this.group_object);
        this.group_coins_gold = game.add.group(this.group_coins);
        this.group_coins_silver = game.add.group(this.group_coins);
        this.group_cure = game.add.group(this.group_object);
        this.group_tutorial = game.add.group(this.group_object);
        this.group_bullet = game.add.group(this.group_object);
        //敌人
        this.group_enemy = game.add.group(this.group_object);
        this.group_zombie = game.add.group(this.group_enemy);
        this.group_boss_hulk = game.add.group(this.group_enemy);
        this.group_boss_turtle = game.add.group(this.group_enemy);
        this.group_brainworm = game.add.group(this.group_enemy);
        this.group_dripper = game.add.group(this.group_enemy);
        this.group_flyer = game.add.group(this.group_enemy);
        this.group_hopper = game.add.group(this.group_enemy);
        this.group_runner = game.add.group(this.group_enemy);
        this.group_shooter = game.add.group(this.group_enemy);
        this.group_spikes = game.add.group(this.group_enemy);
        this.group_turtle = game.add.group(this.group_enemy);
        this.group_worm = game.add.group(this.group_enemy);
        this.group_enemy_bullet = game.add.group(this.group_object);
        //玩家
        this.group_player = game.add.group(this.group_object);
        this.group_water = game.add.group(this.group_object);
        this.group_water_face = game.add.group(this.group_water);
        this.group_water_inside = game.add.group(this.group_water);
        this.group_light = game.add.group(this.group_object);
        this.group_platform = game.add.group(this.group_object);
        this.group_flash = game.add.group(this.group_object);
        this.group_effects = game.add.group(this.group_object);
        this.group_endzone = game.add.group(this.group_object);
        this.group_hud = game.add.group(this.group_object);
        this.group_black = game.add.group(this.group_hud);
        this.group_hud_healthbar = game.add.group(this.group_hud);
        this.group_hud_coin = game.add.group(this.group_hud);
        this.group_hud_pause_menu = game.add.group(this.group_hud, 'group_pause_menu');
        this.hide = true;
        this.show = false;

        this.option_show = game.add.tween(this.option_layer).to({y:0}, 400, null, false, 0, 0, false);
        this.option_hide = game.add.tween(this.option_layer).to({y:game.world.centerY + 224}, 400, null, false, 0, 0, false);

        this.replaceTiled();

        this.black = game.add.sprite(game.camera.position.x + game.camera.width / 2, game.camera.position.y + game.camera.height / 2, 'black');
        this.black.alpha = 0;
        this.group_black.add(this.black);

        var i;
        this.health_bar_base1 = game.add.sprite(40, 70, 'health_bar_base', null, this.group_hud);
        for(i = 0;i < player.maxHealth;i++){
            game.add.sprite(40 + 20 * (i + 1), 70, 'health_point1', null, this.group_hud_healthbar);
        }
        this.health_bar_base2 = game.add.sprite(38 + 20 * (i + 1), 70, 'health_bar_base', null, this.group_hud);
        this.coin_icon = game.add.sprite(700, 70, 'coin_icon', null, this.group_hud_coin);
        this.coin_text = game.add.bitmapText(730, 70, 'shop_font', money + '', 64, this.group_hud_coin);
        this.health_bar_base2.scale.x *= -1;
        this.pause_button = game.add.sprite(1150, 70, 'pause_button', null, this.group_hud_pause_menu);
        this.group_hud.setAllChildren('anchor.x', 0.5);
        this.group_hud.setAllChildren('anchor.y', 0.5);
        this.group_hud.setAllChildren('fixedToCamera', true);
        this.coin_text.anchor.x = 0;
        this.pause_button.events.onInputDown.add(this.btn_click, this);
        this.pause_button.inputEnabled = true;

        this.option_state();

        //设置按键
        this.key_fire = game.input.keyboard.addKey(Phaser.KeyCode.J);
        this.key_jump = game.input.keyboard.addKey(Phaser.KeyCode.K);
        this.key_left = game.input.keyboard.addKey(Phaser.KeyCode.A);
        this.key_right = game.input.keyboard.addKey(Phaser.KeyCode.D);
        this.key_jumpdown = game.input.keyboard.addKey(Phaser.KeyCode.S);
        //游戏后面的背景
        // var bg1 = game.add.tileSprite(0, 0, game.width, 240, 'bg' + (game_object.current_chapter + 1) + '_1');
        // bg1.width = game.world.width;
        // bg1.height = game.world.height;
        // var bg2 = game.add.tileSprite(0, 0, game.width, 240, 'bg' + (game_object.current_chapter + 1) + '_2');
        // bg2.width = game.world.width;
        // bg2.height = game.world.height;
        // var bg3 = game.add.tileSprite(0, 0, game.width, 240, 'bg' + (game_object.current_chapter + 1) + '_3');
        // bg3.width = game.world.width;
        // bg3.height = game.world.height;
        // this.group_bkg = game.add.group(game.world, 'group_bkg');
        // this.group_bkg.add(bg1, bg2, bg3);
        // this.group_bkg.z = 0;
        this.camera.flash('#fff');
    };

    this.replaceTiled = function() {
        var remove = true;
        this.map.forEach(function(tile) {
            switch(tile.index) {
                case 7:
                case 8:
                case 9:
                case 47:
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 153:
                case 161: {
                    tile.setCollision(false, false, true, false);
                }
            }
        }, this, 0, 3, this.map.width, this.map.height, this.Map);
        this.map.forEach(function(tile) {
            if(tile.index){
                remove = HashSearch(tile.index, createTable, tile.x, tile.y);
                // if(tile.index>=201&&tile.index<=240){
                //     HashSearch(tile.index, createTable, tile.x, tile.y);
                //     remove = false;
                // }
                //if(!HashSearch(tile.index, createTable, tile.x, tile.y, group, speed)) remove = false;

                if(remove) {
                    this.map.removeTile(tile.x, tile.y, this.Object);
                }
            }

        }, this, 0, 2, this.map.width, this.map.height, this.Object);


        //怪物
        this.group_zombie.callAll('animations.add', 'animations', 'walk', ['walk1', 'walk2', 'walk3', 'walk4', 'walk5', 'walk6']);
        this.group_zombie.callAll('animations.play', 'animations', 'walk', 10, true);

        this.group_shooter.callAll('animations.add', 'animations', 'walk', ['walk1', 'walk2', 'walk3', 'walk4', 'walk5', 'walk6']);
        this.group_shooter.callAll('animations.play', 'animations', 'walk', 10, true);
        this.group_shooter.callAll('animations.add', 'animations', 'idle', ['idle']);
        this.group_shooter.callAll('animations.add', 'animations', 'shoot', ['shoot1', 'shoot2', 'shoot3', 'shoot4']);

        this.group_worm.callAll('animations.add', 'animations', 'move', ['move1', 'move2', 'move3', 'move4']);
        this.group_worm.callAll('animations.add', 'animations', 'spawn', ['spawn1', 'spawn2', 'spawn3', 'spawn4', 'spawn5', 'spawn6', 'spawn7']);
        this.group_worm.callAll('animations.add', 'animations', 'idle', ['spawn1']);
        this.group_worm.callAll('animations.play', 'animations', 'idle', 10, true);

        this.group_runner.callAll('animations.add', 'animations', 'walk', ['walk1', 'walk2', 'walk3', 'walk4', 'walk5', 'walk6']);
        this.group_runner.callAll('animations.add', 'animations', 'idle', ['walk1']);
        this.group_runner.callAll('animations.play', 'animations', 'idle');

        this.group_flyer.callAll('animations.add', 'animations', 'fly', ['fly1', 'fly2', 'fly3', 'fly4']);
        this.group_flyer.callAll('animations.play', 'animations', 'fly', 10, true);

        this.group_hopper.callAll('animations.add', 'animations', 'jump', ['hopper3', 'hooper1']);
        this.group_hopper.callAll('animations.add', 'animations', 'fly', ['hopper1']);
        this.group_hopper.callAll('animations.add', 'animations', 'land', ['hopper3', 'hopper2']);
        this.group_hopper.callAll('animations.add', 'animations', 'idle', ['hopper2']);
        this.group_hopper.callAll('animations.play', 'animations', 'idle');
        this.group_hopper.setAllChildren('anchor.y', 1);

        this.group_dripper.callAll('animations.add', 'animations', 'attack', ['dripper1', 'dripper2', 'dripper3', 'dripper4', 'dripper5']);
        this.group_dripper.callAll('animations.add', 'animations', 'done', ['dripper6', 'dripper7', 'dripper8', 'dripper9']);
        this.group_dripper.callAll('animations.add', 'animations', 'idle', ['dripper1']);
        this.group_dripper.callAll('animations.play', 'animations', 'idle');

        this.group_turtle.callAll('animations.add', 'animations', 'attack', ['shoot1', 'shoot2', 'shoot3']);
        this.group_turtle.callAll('animations.add', 'animations', 'hide', ['hide1', 'hide2', 'hide3']);
        this.group_turtle.callAll('animations.add', 'animations', 'show', ['hide3', 'hide2', 'hide1']);
        this.group_turtle.callAll('animations.add', 'animations', 'idle', ['idle']);
        this.group_turtle.callAll('animations.add', 'animations', 'shell', ['hide3']);
        this.group_turtle.setAllChildren('anchor.y', 1);

        this.group_brainworm.callAll('animations.add', 'animations', 'attack', ['shoot1', 'shoot2', 'shoot3', 'shoot4']);
        this.group_brainworm.callAll('animations.add', 'animations', 'idle', ['idle']);
        this.group_brainworm.callAll('animations.play', 'animations', 'idle');
        this.group_brainworm.setAllChildren('anchor.y', 1);

        //电梯
        this.group_platform.callAll('animations.add', 'animations', 'lift', ['lift1', 'lift2']);
        this.group_platform.callAll('animations.play', 'animations', 'lift', 10, true);

        //硬币
        this.group_coins_gold.callAll('animations.add', 'animations', 'rotate', ['gold_coin1', 'gold_coin2', 'gold_coin3', 'gold_coin4', 'gold_coin5', 'gold_coin6']);
        this.group_coins_gold.callAll('animations.play', 'animations', 'rotate', 10, true);
        this.group_coins_silver.callAll('animations.add', 'animations', 'rotate', ['silver_coin1', 'silver_coin2', 'silver_coin3', 'silver_coin4', 'silver_coin5', 'silver_coin6']);
        this.group_coins_silver.callAll('animations.play', 'animations', 'rotate', 10, true);
        this.group_coins_gold.setAllChildren('anchor.x', 0.5);
        this.group_coins_gold.setAllChildren('anchor.y', 0.5);
        this.group_coins_silver.setAllChildren('anchor.x', 0.5);
        this.group_coins_silver.setAllChildren('anchor.y', 0.5);
        this.group_coins_gold.x += 32;
        this.group_coins_gold.y += 32;
        this.group_coins_silver.x += 32;
        this.group_coins_silver.y += 32;

        //灯光
        //因为是从 tile 中创建的所以坐标是tile的左上角坐标,得设置到 tile 中心
        this.group_light.setAllChildren('anchor.x', 0.5);
        this.group_light.setAllChildren('anchor.y', 0.5);
        this.group_light.x += 32;
        this.group_light.y += 32;

        //医疗包
        //同上
        this.group_cure.callAll('animations.add', 'animations', 'lay', ['medikit1']);
        this.group_cure.callAll('animations.play', 'animations', 'lay');
        this.group_cure.setAllChildren('anchor.x', 0.5);
        this.group_cure.setAllChildren('anchor.y', 0.5);
        this.group_cure.x += 32;
        this.group_cure.y += 32;

        //水
        this.group_water_face.callAll('animations.add', 'animations', 'water_flow', ['water1', 'water2', 'water3', 'water4']);
        this.group_water_face.callAll('animations.play', 'animations', 'water_flow', 10, true);
        this.group_water_face.y += 40;

        this.group_water_inside.callAll('animations.add', 'animations', 'water', ['water5']);
        this.group_water_inside.callAll('animations.play', 'animations', 'water');

        this.group_water.setAllChildren('alpha', 0.7);

        //特效

        this.group_flash.createMultiple(30, 'boom');
        this.group_flash.callAll('animations.add', 'animations', 'flash', ['flash_64']);
        this.group_flash.setAllChildren('anchor.x', 0.5);
        this.group_flash.setAllChildren('anchor.y', 0.5);

        this.group_effects.createMultiple(200, 'boom');
        this.group_effects.setAllChildren('anchor.x', 0.5);
        this.group_effects.setAllChildren('anchor.y', 0.5);
        this.group_effects.callAll('animations.add', 'animations', 'coin_spark', ['coin_spark1', 'coin_spark2', 'coin_spark3', 'coin_spark4', 'coin_spark5']);
        this.group_effects.callAll('animations.add', 'animations', 'wall_spark', ['wall_spark_small1', 'wall_spark_small2', 'wall_spark_small3', 'wall_spark_small4', 'wall_spark_small5']);
        this.group_effects.callAll('animations.add', 'animations', 'hit_spark', ['hit_spark_small1', 'hit_spark_small2', 'hit_spark_small3', 'hit_spark_small4', 'hit_spark_small5']);
        this.group_effects.callAll('animations.add', 'animations', 'water_splash', ['water_splash1', 'water_splash2', 'water_splash3', 'water_splash4', 'water_splash5']);
        this.group_effects.callAll('animations.add', 'animations', 'explosion', ['explosion1', 'explosion2', 'explosion3', 'explosion4', 'explosion5', 'explosion6', 'explosion7']);

        //替换提示牌

        if(game_object.current_chapter === 0 && game_object.current_level === 0) {
            for(var i = 0;i < 5;i++) {
                var sign = this.map.searchTileIndex(228 + i, 0, true, this.Object);
                this.group_signpost.add(new Signpost(game, sign.x * 64, sign.y * 64, i));
                this.group_tutorial.add(game.add.bitmapText(sign.x * 64, sign.y * 64 - 200, 'shop_font', tutorial[i], 32));
                this.map.removeTile(sign.x, sign.y, this.Object);
            }
            this.group_signpost.setAllChildren('anchor.x', 0.5);
            this.group_signpost.setAllChildren('anchor.y', 0.5);
            this.group_signpost.x += 32;
            this.group_signpost.y += 32;

            this.group_tutorial.setAllChildren('alpha', 0);
            this.group_tutorial.setAllChildren('anchor.x', 0.5);
            this.group_tutorial.setAllChildren('anchor.y', 0.5);
            this.group_tutorial.setAllChildren('align', 'center');
            this.group_tutorial.setAllChildren('maxWidth', 32 * 23);
        }
    };

    this.show_tutorial = function(player, signpost) {
        if(!this.show) {
            player.readindex = signpost.index;
            game.add.tween(this.group_tutorial.getChildAt(signpost.index)).to({alpha:1}, 200, null, true);
            this.show = true;
            this.hide = false;
        }
        player.readstate = true;
    };

    this.hide_tutorial = function(player) {
        if(!this.hide) {
            game.add.tween(this.group_tutorial.getChildAt(player.readindex)).to({alpha:0}, 200, null, true);
            this.show = false;
            this.hide = true;
        }
        player.readstate = false;
    };

    this.btn_click = function(sprite) {
        //切换场景时淡入
        this.camera.fade('#000000');
        this.camera.onFadeComplete.addOnce(function () {
            game.state.start('chapterState');
        }, this);
    };

    this.show_options = function(){
        this.black.alpha = 0.5;
        this.black.z = 7;
        this.option_show.start();
    };

    this.option_state = function () {
        //游戏设置模块组 option_layer
        this.option_layer = game.add.group(this.group_hud, 'option_layer');
        this.group_hud_up = game.add.group(this.group_hud);
        //var i = game.add.sprite(game.camera.width / 2, 80, 'option_bkg', null, this.group_hud_up);
        //this.group_hud_up.y -= 160;

        this.group_hud_down = game.add.group(this.group_hud);
        this.group_hud_btn_mainmenu = game.add.group(this.group_hud_down, 'group_hud_btn_mainmenu');
        //game.add.sprite(game.camera.position.x + game.camera.width / 2, game.camera.position.y + game.camera.height / 2, 'pause_btn_mainmenu', null, this.group_hud_btn_mainmenu);
        this.group_hud_btn_continue = game.add.group(this.group_hud_down, 'group_hud_btn_continue');
        //game.add.sprite(game.camera.position.x + game.camera.width / 2, game.camera.position.y + game.camera.height / 2 + 250, 'pause_btn_continue', null, this.group_hud_btn_continue);
        //this.group_hud_down.y += game.camera.height / 2 + 120
        this.group_hud_down.setAllChildren('inputEnabled', true);
        this.group_hud_down.forEach(function (children) {
            if(children.type === 7){
                //7代表类型为group,因为group的name都不同所以只能通过type判断children是否为group
                children.callAll('events.onInputDown.add', 'events.onInputDown', this.btn_click, this);
            }
        }, this);

        this.hud_up_show = game.add.tween(this.group_hud_up).to({y:80}, 400, null, false, 0, 0, false);
        this.hud_up_hide = game.add.tween(this.group_hud_up).to({y:-80}, 400, null, false, 0, 0, false);
        this.hud_down_show = game.add.tween(this.group_hud_down).to({y:0}, 400, null, false, 0, 0, false);
        this.hud_down_hide = game.add.tween(this.group_hud_down).to({y:game.world.centerY + 224}, 400, null, false, 0, 0, false);
        this.option_layer.setAllChildren('fixedToCamera', true);
        console.log(this.option_layer);
    };
};