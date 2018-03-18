var jump_time = 0;
var tutorial = [
        'KILL ENEMIES AND COLLECT COINS TO GAIN MONEY',
        'BUY NEW WEAPONS AND COSTUMES WITH YOUR COINS. ACCESS THE SHOP FROM THE PAUSE MENU',
        'MEDKITS WILL RESTORE YOUR HEALTH BUT ONLY IF YOU NEED IT',
        'PRESS S AND JUMP BUTTON TO DROP THROUGH PLATFORMS',
        'MOUE TOWARDS THE DOOR AT THE END OF EACH LEVEL TO ADUANCE'
    ];

var left = -1, right = 1;
var down = 1, up = -1;
var walk = -1, idle = 0, attack = 1;
var fly = 2, jump = 1, land = -1;
var done = -1;
var hide = -1, show = 2, shell = 3;

var state;
var weapon;
var gun;

var player;

Inheritance_Manager = {};

Inheritance_Manager.extend = function(subClass, baseClass) {
    subClass.prototype = Object.create(baseClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
};

//猪脚类
var Player = function(game, x, y, arg) {
    if(arg.length !== 3) console.error('Player argument length error!'); 
    var skey = arg[0],
        gkey = arg[1],
        speed = arg[2];
    Player.baseConstructor.call(this, game, x, y - 64, skey);
    this.anchor.setTo(0.5, 0);
    //人物动画
    this.animations.add('run', ['player_run1.png', 'player_run2.png', 'player_run3.png', 'player_run4.png', 'player_run5.png', 'player_run6.png'], 10);
    this.animations.add('stand', ['player_idle1.png'], 10);
    this.animations.add('jump', ['player_jump1.png'], 10);
    this.animations.add('fall', ['player_fall1.png'], 10);

    //枪
    gun = game.add.sprite(this.width / 2 - 12, this.height / 2 - 4, gkey);
    state.group_player.add(gun);
    state.group_player.add(this);
    this.addChild(gun);
    game.physics.arcade.enable(gun);

    //子弹
    weapon = game.add.weapon(30, 'bullet', 'bullet1', state.group_bullet);
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 1500;
    weapon.fireRate = 800;
    weapon.trackSprite(gun, 52, 8, false);
    weapon.fireAngle = Phaser.ANGLE_RIGHT;

    //物理属性
    game.physics.arcade.enable(this);
    this.body.width = 50;
    this.direction = right;
    this.velocityX = this.direction * speed;
    this.body.gravity.y = 2000;
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 800;
    //游戏属性
    this.health = 3;
    this.da = 8;
    this.maxHealth = 3;
    this.invincibletime = 0;
    this.jump_time = 0;
    this.fall_time = 0;
    this.fall = false;
    this.readstate = false;
    this.onLift = false;
    this.inWater = false;
    this.flash = true;
    this.flashnum = 0;
    this.firetime = 0;
    this.dead = false;
    this.nextlevel = false;
    game.camera.follow(this);
    return this;
};

Inheritance_Manager.extend(Player, Phaser.Sprite);
Player.prototype.update = function() {
    //猪脚
        //碰撞
            //和不能穿过的地板碰撞
    this.body.gravity.y = 2000;
    player.onLift = false;
    if(this.health === 0){
        if(!this.dead){
            this.dead = true;
            var spark = state.group_effects.getFirstExists(false);
            spark.reset(player.body.x, player.body.y);
            spark.anchor.x = 0;
            spark.animations.play('explosion', 30, false, true);
        }
            game.camera.fade('#000000');
            game.camera.onFadeComplete.addOnce(function () {
                game.state.start('playState');
            }, game);
    }
    game.physics.arcade.collide(this, state.Collision);
        //和能穿过的地板碰撞
    if(!this.fall) {
        game.physics.arcade.collide(this, state.Map);
    }
    if(!this.inWater){
        game.physics.arcade.overlap(this, state.group_water_face, function(player) {
            player.velocityX = 150;
            player.inWater = true;
        });
    }
    else {
        if(!game.physics.arcade.overlap(this, state.group_water_face)){
            this.inWater = false;
            player.velocityX = 300;
        }
    }

    game.physics.arcade.collide(weapon.bullets, state.Collision, function(bullet, tile){
        var spark = state.group_effects.getFirstExists(false);
        spark.reset(bullet.body.x, bullet.body.y);
        spark.anchor.x = 0;
        if(bullet.angle === 0){
            if(spark.scale.x < 0){
                spark.scale.x *= -1;
            }
        }
        if(bullet.angle === -180) {
            spark.x += 32;
            if(spark.scale.x > 0){
                spark.scale.x *= -1;
            }
        }
        spark.animations.play('wall_spark', 30, false, true);
        console.log(bullet);
        bullet.kill();
    });
            //和硬币碰撞
    game.physics.arcade.overlap(this, state.group_coins_silver, function(player, coins){
        money++;
        var spark = state.group_effects.getFirstExists(false);
        spark.reset(coins.body.x, coins.body.y);
        spark.animations.play('coin_spark', 30, false, true);
        state.coin_text.text = money;
        coins.kill();
    });
    game.physics.arcade.overlap(this, state.group_coins_gold, function(player, coins){
        money += 5;
        var spark = state.group_effects.getFirstExists(false);
        spark.reset(coins.body.x, coins.body.y);
        spark.animations.play('coin_spark', 30, false, true);
        state.coin_text.text = money;
        coins.kill();
    });
            //和水碰撞
            //和医疗包碰撞

    game.physics.arcade.overlap(this, state.group_cure, function(player, cure){
        money++;
        var spark = state.group_effects.getFirstExists(false);
        spark.reset(cure.body.x, cure.body.y);
        spark.animations.play('coin_spark', 30, false, true);
        player.heal(player.maxHealth);
        cure.kill();
    });
    if(this.invincibletime < game.time.now){
            //和地刺碰撞
            //和敌人碰撞
            this.tint = 0xffffff;
            state.group_enemy.forEach(function(group){
                game.physics.arcade.overlap(player, group, function(player, enemy){
                    player.damage(1);
                    state.group_hud_healthbar.getChildAt(player.health).loadTexture('health_point2');
                    player.invincibletime = game.time.now + 2000;
                });     
            });
            //和敌人的子弹碰撞
            state.group_enemy_bullet.forEach(function(group){
                game.physics.arcade.overlap(state.Collision, group, function(bullet, tile){
                    if(tile.index === 200){
                        var spark = state.group_effects.getFirstExists(false);
                        spark.reset(bullet.body.x, bullet.body.y);
                        spark.animations.play('hit_spark', 30, false, true);
                        bullet.kill();
                    }
                });
                game.physics.arcade.overlap(player, group, function(player, bullet) {
                    player.damage(1);
                    state.group_hud_healthbar.getChildAt(player.health).loadTexture('health_point2');
                    player.invincibletime = game.time.now + 2000;
                    var spark = state.group_effects.getFirstExists(false);
                    spark.reset(bullet.body.x, bullet.body.y);
                    spark.animations.play('hit_spark', 30, false, true);
                    bullet.kill();
                });
            });
    }
            //和电梯碰撞
    state.group_platform.forEach(function(platform){
        platform.Update();
    });
    game.physics.arcade.collide(this, state.group_platform, function(player, platform){
        player.onLift = true;
    });

    if(this.invincibletime > game.time.now) {
        if(this.flashnum % 6 === 0){
            if(this.flash){
                this.tint = 0xff0000;
                this.flash = false;
            }
            else{
                this.tint = 0xffffff;
                this.flash = true;
            }
            this.flashnum = 0;
        }
        this.flashnum++;
    }
            //和终点碰撞
    game.physics.arcade.collide(this, state.group_endzone, function(){
        if(!player.nextlevel){
            player.nextlevel = true;
            game_object.current_level++;
            if(game_object.current_level > 10){
                game_object.current_level = 0;
                game_object.current_chapter++;
            }
            game_object.chapter[game_object.current_chapter].lock = false;
            game_object.chapter[game_object.current_chapter].level[game_object.current_level].lock = false;
            game.camera.fade('#000000');
            game.camera.onFadeComplete.addOnce(function () {
                game.state.start('playState');
            }, game);
        }
    });
        //跳跃动画
    if(this.body.onFloor()) {
        this.animations.play('run');
        this.body.velocity.y = 0;
    } else{
        if(!this.onLift){
            if(this.body.velocity.y < 0) {
                this.animations.play('jump');
            } else {
                this.animations.play('fall');
            }
        } else {
            this.animations.play('run');
            if(this.body.velocity.x === 0){
                this.animations.play('stand');
            }
            this.fall = false;
        }
    }
        //按键响应
            //跑步
    if(state.key_left.isDown) {
        this.body.velocity.x = -this.velocityX;
        if(this.direction === right) {
            this.direction = left;
            this.scale.x *= -1;
            weapon.fireAngle = Phaser.ANGLE_LEFT;
            weapon.trackSprite(gun, -52, 8, false);
        }
    } else if(state.key_right.isDown) {
        this.body.velocity.x = this.velocityX;
        if(this.direction === left) {
            this.direction = right;
            this.scale.x *= -1;
            weapon.fireAngle = Phaser.ANGLE_RIGHT;
            weapon.trackSprite(gun, 52, 8, false);
        }
    } else {
        this.body.velocity.x = 0;
        if(this.body.onFloor()) {
            this.animations.play('stand');
        }
    }
            //开火    
    if(state.key_fire.isDown){
        var f = weapon.fire();
        if(f){
            var spark = state.group_flash.getFirstExists(false);
            spark.alpha = 0.1;
            if(this.direction === left)
                spark.reset(gun.body.x - 24, gun.body.y + 8);
            else
                spark.reset(gun.body.x + 24, gun.body.y + 8);
            spark.animations.play('flash', 30, false, true);
        }

        game.physics.arcade.overlap(weapon.bullets, state.Collision, function(bullet, tile){
            if(tile.index !== -1)
                bullet.kill();
        });
    }
            //跳和下跳
    if(state.key_jumpdown.isDown && state.key_jump.isDown && this.body.onFloor()) {
        this.falltime = game.time.now + 100;
        this.fall = true;
    } else if(state.key_jump.isDown && (this.body.onFloor() || this.onLift) && game.time.now > this.jump_time) {
        this.body.velocity.y = -800;
        this.jump_time = game.time.now + 200;
    }
    if(game.time.now > this.falltime) {
        this.fall = false;
    }

    //第一关的提示牌
    if(game_object.current_chapter === 0 && game_object.current_level === 0) {
        if(!this.readstate) {
            game.physics.arcade.overlap(this, state.group_signpost, state.show_tutorial, null, state);
        } else {
            if(!game.physics.arcade.overlap(this, state.group_signpost)) {
                state.hide_tutorial(this);
            }
        }
    }

    //敌人更新
    state.group_enemy.forEach(function(group){
        group.forEachExists(function(enemy){
            enemy.Update();
        });
    });
};

var EndZone = function(game, x, y, arg) {
    if(arg.length !== 1) console.error('EndZone argument length error!');
    var key = arg[0];
    EndZone.baseConstructor.call(this, game, x, y, key);
    game.physics.arcade.enable(this);
    state.group_endzone.add(this);
    this.alpha = 0;
    this.width = 64;
    this.height = 128;
};
Inheritance_Manager.extend(EndZone, Phaser.Sprite);

//物体类
var Platform = function(game, x, y, arg) {
    if(arg.length !== 1) console.error('Platform argument length error!');
    this.index = arg[0];
    Platform.baseConstructor.call(this, game, x - 16, y, 'lift');
    game.physics.arcade.enable(this);
    state.group_platform.add(this);
    this.body.immovable = true;
    this.body.checkCollision = {none: false, up:true, down:false, left:false, right: false};
    this.directionX = null;
    this.directionY = null;
    switch(this.index){
        case 1: this.directionX = left;break;
        case 2: this.directionX = right;break;
        case 3: this.directionY = up;break;
        case 4: this.directionY = down;break;
    }
};
Inheritance_Manager.extend(Platform, Phaser.Sprite);
Platform.prototype.Update = function() {
    game.physics.arcade.overlap(this, state.Object, function(platform, tile){
        if(tile.index === 220){
            if(platform.directionX){
                platform.directionX *= -1;
            } else if(platform.directionY) {
                platform.directionY *= -1;
            }
        }
    });
    game.physics.arcade.collide(this, state.Collision);
    if(this.directionX){
        this.body.velocity.x = this.directionX * 150;
        this.body.velocity.y = 0;
    } else {
        this.body.velocity.y = this.directionY * 150;
        this.body.velocity.x = 0;
    }
};

var Signpost = function(game, x, y, index) {
    Signpost.baseConstructor.call(this, game, x, y, 'signpost');
    game.physics.arcade.enable(this);
    this.index = index;
};
Inheritance_Manager.extend(Signpost, Phaser.Sprite);

var Coin = function(game, x, y, arg) {
    if(arg.length !== 1) console.error('Coin argument length error!'); 
    var type = arg[0];
    var group = (type === 'silver' ? state.group_coins_silver:state.group_coins_gold);

    Coin.baseConstructor.call(this, game,x,y,'pickups', null, group);
    group.add(this);

    game.physics.arcade.enable(this);
};
Inheritance_Manager.extend(Coin, Phaser.Sprite);

var Water = function(game, x, y, arg) {
    if(arg.length !== 1) console.error('Water argument length error!'); 
    var type = arg[0];
    var group = (type === 'inside' ? state.group_water_inside:state.group_water_face);

    Water.baseConstructor.call(this, game, x, y - 64, 'boom');
    group.add(this);

    game.physics.arcade.enable(this);
};
Inheritance_Manager.extend(Water, Phaser.Sprite);

var Light = function (game, x, y) {
    Light.baseConstructor.call(this, game, x, y, 'light');
    state.group_light.add(this);
};
Inheritance_Manager.extend(Light, Phaser.Sprite);

var Cure = function(game, x, y) {
    Cure.baseConstructor.call(this, game, x, y, 'pickups');
    state.group_cure.add(this);
    game.physics.arcade.enable(this);
};
Inheritance_Manager.extend(Cure, Phaser.Sprite);

//怪物类
var Monster = function(game, x, y, key, dir, sp ,hp) {
    Monster.baseConstructor.call(this, game, x, y, key);
    game.physics.arcade.enable(this);
    this.direction = dir;
    this.speed = sp;
    this.hurttime = 0;
    if(hp)
        this.health = hp;
    this.scale.x *= dir;
    this.dead = false;
    this.collidetime = 0;
    this.body.velocity.x = this.direction * this.speed;
};
Inheritance_Manager.extend(Monster, Phaser.Sprite);
Monster.prototype.Update = function() {
        //与地面碰撞
        game.physics.arcade.collide(this, state.Map);
        game.physics.arcade.collide(this, state.Collision);
        game.physics.arcade.collide(this, state.EnemiesCollision);
        //转换方向
        this.body.velocity.x = this.direction * this.speed;
        if((this.body.blocked.left || this.body.blocked.right) && this.collidetime < game.time.now){
            this.direction *= -1;
            this.x -= this.direction * Math.abs(this.width);
            this.scale.x *= -1;
            this.collidetime = game.time.now + 200;
        }
        //与子弹碰撞
        game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
            var spark = state.group_effects.getFirstExists(false);
            spark.reset(bullet.body.x, bullet.body.y);
            spark.animations.play('hit_spark', 30, false, true);
            enemy.damage(player.da);
            enemy.hurttime = game.time.now + 100;
            bullet.kill();
        });
        if(this.health === 0){
            if(!this.dead){
                this.dead = true;
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(this.body.x, this.body.y);
                spark.anchor.x = 0;
                spark.animations.play('explosion', 30, false, true);
            }
        }

        if(this.hurttime > game.time.now){
            this.tint = 0xff0000;
        } else {
            this.tint = 0xffffff;
        }
};

var Zombie = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Zombie argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Zombie.baseConstructor.call(this, game, x, y - 64, key, direction, speed, health);
    state.group_zombie.add(this);

    this.body.gravity.y = 2000;
    this.body.collideWorldBounds = true;
};
Inheritance_Manager.extend(Zombie, Monster);

var Boss_hulk = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Boss_hulk argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Boss_hulk.baseConstructor.call(this, game, x, y, key, direction, speed, health);
};
Inheritance_Manager.extend(Boss_hulk, Monster);
Boss_hulk.prototype.Update = function() {

    if(this.hurttime > game.time.now){
        this.tint = 0xff0000;
    } else {
            this.tint = 0xffffff;
        }
};

var Boss_turtle = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Boss_turtle argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Boss_turtle.baseConstructor.call(this, game, x, y, key, direction, speed, health);
};
Inheritance_Manager.extend(Boss_turtle, Monster);
Boss_turtle.prototype.Update = function() {

    if(this.hurttime > game.time.now){
        this.tint = 0xff0000;
    } else {
            this.tint = 0xffffff;
        }
};

var Brainworm = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Brainworm argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Brainworm.baseConstructor.call(this, game, x + 128, y - 64, key, direction, speed, health);
    state.group_brainworm.add(this);
    this.player_in_range = false;
    this.attackstate = false;
    this.state = idle;
    this.bulletnumber = 0;
    this.maxbullet = 3;
    this.attacktime = 0;
    this.body.gravity.y = 2000;
    this.body.height = 80;
    this.dead = false;

    this.enemy_weapon = game.add.weapon(30, 'bullet', 'bullet1', state.group_enemy_bullet);
    this.enemy_weapon.addBulletAnimation('shoot', ['energy_bomb1', 'energy_bomb2'], 10);
    this.enemy_weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.enemy_weapon.bulletGravity.y = 2000;
    this.enemy_weapon.bulletSpeed = 1000;
    this.enemy_weapon.trackSprite(this, 0, -80, false);
    this.enemy_weapon.fireAngle = Phaser.ANGLE_LEFT + 45;
};
Inheritance_Manager.extend(Brainworm, Monster);
Brainworm.prototype.Update = function() {
        //与地面碰撞
        game.physics.arcade.collide(this, state.Map);
        game.physics.arcade.collide(this, state.Collision);
        //与子弹碰撞
        game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
                enemy.damage(player.da);
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(bullet.body.x, bullet.body.y);
                spark.animations.play('hit_spark', 30, false, true);
                enemy.hurttime = game.time.now + 100;
                bullet.kill();
        });

        if(this.health === 0){
            if(!this.dead){
                this.dead = true;
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(this.body.x, this.body.y);
                spark.anchor.x = 0;
                spark.animations.play('explosion', 30, false, true);
            }
        }
        if(this.hurttime > game.time.now){
            this.tint = 0xff0000;
        } else {
            this.tint = 0xffffff;
        }
        //发现猪脚，切换状态
        var distanceX = (this.x - player.x) / 64;
        var distanceY = Math.abs(this.y - player.y) / 64;
        switch(this.animations.currentFrame.index) {
            case 0: this.body.height = 80;  break;
            case 1: this.body.height = 96;  break;
            case 2: this.body.height = 112; break;
            case 3: this.body.height = 124; break;
        }
        if(distanceX < 8 && distanceX > 0){
            if(this.direction === right){
                this.direction = left;
                this.x -= this.direction * Math.abs(this.width);
                this.scale.x *= -1;
            this.enemy_weapon.fireAngle = Phaser.ANGLE_LEFT + 45;
            this.enemy_weapon.trackSprite(this, -20, -80, false);
            }
            this.player_in_range = true;
            if(!this.attackstate){
                this.attacktime = game.time.now + 800;
                this.attackstate = true;
            }
        } else if(distanceX > -8 && distanceX < 0){
            if(this.direction === left){
                this.direction = right;
                this.x -= this.direction * Math.abs(this.width);
                this.scale.x *= -1;
                this.enemy_weapon.trackSprite(this, 20, -80, false);
                this.enemy_weapon.fireAngle = Phaser.ANGLE_RIGHT - 45;
            }
            this.player_in_range = true;
            if(!this.attackstate){
                this.attacktime = game.time.now + 800;
                this.attackstate = true;
            }
        } else {
            this.player_in_range = false;
        }

        if(this.state === idle) {
            this.animations.play('idle');
            if(game.time.now > this.attacktime && this.player_in_range) {
                this.state = attack;
                this.attackstate = false;
            }
        } else {
            this.animations.play('attack', 10);
            if(this.animations.currentFrame.index === 2) {
                this.enemy_weapon.fire();
                this.bulletnumber++;
            }
            if(this.bulletnumber === 3){
                this.state = idle;
                this.bulletnumber = 0;
            }
        }
};

var Dripper = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Dripper argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        delay = arg[3];
    Dripper.baseConstructor.call(this, game, x + 6, y - 20, key, direction, speed);
    state.group_dripper.add(this);

    this.delaytime = game.time.now + delay;
    this.fire_interval = 0;
    this.state = idle;
    this.startfire = 0;

    this.enemy_weapon = game.add.weapon(30, 'bullet', 'bullet1', state.group_enemy_bullet);
    this.enemy_weapon.addBulletAnimation('drop', ['drop1', 'drop2'], 60, true);
    this.enemy_weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.enemy_weapon.bulletSpeed = 600;
    this.enemy_weapon.fireAngle = Phaser.ANGLE_DOWN;
    this.enemy_weapon.bulletAngleOffset = -90;
    this.enemy_weapon.trackSprite(this, 28, 32, false);
};
Inheritance_Manager.extend(Dripper, Monster);
Dripper.prototype.Update = function() {
    if(game.time.now > this.delaytime){
        this.startfire = 1;
    }
    if(this.startfire) {
        if(this.state === idle){
            this.animations.play('idle');
            if(game.time.now > this.fire_interval){
                this.fire_interval = game.time.now + 2500;
                this.state = attack;
            }
        }
        if(this.state === attack){
            this.animations.play('attack', 10);
            if(this.animations.currentFrame.index === 4){
                this.enemy_weapon.fire();
                this.state = done;
            }
        }
        if(this.state === done){
            this.animations.play('done', 10);
            if(this.animations.currentFrame.index === 8){
                this.state = idle;
            }
        }
    }
};

var Flyer = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Flyer argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Flyer.baseConstructor.call(this, game, x, y, key, direction, speed, health);
    state.group_flyer.add(this);
    this.directionX = direction;
    this.directionY = down;
    this.state = idle;
    this.dead = false;
};
Inheritance_Manager.extend(Flyer, Monster);
Flyer.prototype.Update = function() {
    game.physics.arcade.collide(this, state.Map);
    game.physics.arcade.collide(this, state.Collision);

    //与子弹碰撞
    game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
        var spark = state.group_effects.getFirstExists(false);
        spark.reset(bullet.body.x, bullet.body.y);
        spark.animations.play('hit_spark', 30, false, true);
        enemy.damage(player.da);
        enemy.hurttime = game.time.now + 100;
        bullet.kill();
    });
    if(this.health === 0){
        if(!this.dead){
            this.dead = true;
            var spark = state.group_effects.getFirstExists(false);
            spark.reset(this.body.x, this.body.y);
            spark.anchor.x = 0;
            spark.animations.play('explosion', 30, false, true);
        }
    }
    if(this.hurttime > game.time.now){
        this.tint = 0xff0000;
    } else {
            this.tint = 0xffffff;
        }
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    //发现猪脚，切换状态
    var distanceX = (player.x - this.x) / 64;
    var distanceY = (this.y - player.y) / 64;
    if(distanceX < 8 && distanceX > 0 && distanceY < 8 && distanceY > 0) {
        //第一象限
        if(this.directionX === left){
            this.x += this.directionX * Math.abs(this.width);
            this.scale.x *= -1;
        }
        this.state = attack;
        this.directionX = right;
        this.directionY = up;
    } else if(distanceX > -8 && distanceX < 0 && distanceY < 8 && distanceY > 0){
        //第二象限
        if(this.directionX === right){
            this.x += this.directionX * Math.abs(this.width);
            this.scale.x *= -1;
        }
        this.state = attack;
        this.directionX = left;
        this.directionY = up;
    } else if(distanceX > -8 && distanceX < 0 && distanceY > -8 && distanceY < 0){
        //第三象限
        if(this.directionX === right){
            this.x += this.directionX * Math.abs(this.width);
            this.scale.x *= -1;
        }
        this.state = attack;
        this.directionX = left;
        this.directionY = down;
    } else if(distanceX < 8 && distanceX > 0 && distanceY > -8 && distanceY < 0){
        //第四象限
        if(this.directionX === left){
            this.x += this.directionX * Math.abs(this.width);
            this.scale.x *= -1;
        }
        this.state = attack;
        this.directionX = right;
        this.directionY = down;
    } else {
        this.state = idle;
    }

    //攻击！
    if(this.state === attack){
        this.body.velocity.x = this.directionX * this.speed;
        this.body.velocity.y = this.directionY * this.speed;
        if(Math.abs(distanceX) > 8 || Math.abs(distanceY) > 8){
            //猪脚逃跑了！
            this.state = idle;
        }
    }
};

var Hopper = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Hopper argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Hopper.baseConstructor.call(this, game, x, y - 64, key, direction, speed, health);
    state.group_hopper.add(this);
    this.state = land;
    this.body.gravity.y = 2000;
    this.body.maxVelocity.y = 800;
    this.jump_interval = 0;
    this.dead = false;
};
Inheritance_Manager.extend(Hopper, Monster);
Hopper.prototype.Update = function() {
    //与地面碰撞
    game.physics.arcade.collide(this, state.Map);
    game.physics.arcade.collide(this, state.Collision);
    //转换方向

    switch(this.animations.currentFrame.index){
        case 0: this.height = 84; break;
        case 1: this.height = 80; break;
        case 2: this.height = 76; break;
    }

    if(this.state === idle){
        this.animations.play('idle');
        this.body.velocity.x = 0;
        if(game.time.now > this.jump_interval){
            this.state = jump;
        }
    } else if(this.state === jump){
        this.animations.play('jump', 10);
        if(this.animations.currentFrame.index === 2) {
        this.body.velocity.x = this.direction * this.speed;
        this.body.velocity.y = -800;
            this.state = fly;
        }
    } else if(this.state === fly) {
        this.animations.play('fly');
        this.body.velocity.x = this.direction * this.speed;
        if(this.body.onFloor()){
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.state = land;
        }
    } else if(this.state === land){
        this.animations.play('land');
        if(this.animations.currentFrame.index === 1) {
            this.jump_interval = game.time.now + 2000;
            this.state = idle;
        }
    }
    if((this.body.blocked.left || this.body.blocked.right) && this.collidetime < game.time.now){
        this.direction *= -1;
        this.x -= this.direction * Math.abs(this.width);
        this.scale.x *= -1;
        this.collidetime = game.time.now + 200;
    }
    //与子弹碰撞
    game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
        enemy.damage(player.da);
        var spark = state.group_effects.getFirstExists(false);
        spark.reset(bullet.body.x, bullet.body.y);
        spark.animations.play('hit_spark', 30, false, true);
        enemy.hurttime = game.time.now + 100;
        bullet.kill();
    });
    if(this.hurttime > game.time.now){
        this.tint = 0xff0000;
    } else {
            this.tint = 0xffffff;
        }
    if(this.health === 0){
        if(!this.dead){
            this.dead = true;
            var spark = state.group_effects.getFirstExists(false);
            spark.reset(this.body.x, this.body.y);
            spark.anchor.x = 0;
            spark.animations.play('explosion', 30, false, true);
        }
    }
};

var Runner = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Runner argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Runner.baseConstructor.call(this, game, x, y, key, direction, speed, health);
    state.group_runner.add(this);

    this.body.gravity.y = 2000;
    this.state = idle;
    this.dead = false;
};
Inheritance_Manager.extend(Runner, Monster);
Runner.prototype.Update = function() {
        game.physics.arcade.collide(this, state.Map);
        game.physics.arcade.collide(this, state.Collision);
        //与子弹碰撞
        game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
            var spark = state.group_effects.getFirstExists(false);
            spark.reset(bullet.body.x, bullet.body.y);
            spark.animations.play('hit_spark', 30, false, true);
            enemy.hurttime = game.time.now + 100;
            bullet.kill();
        });
        if(this.hurttime > game.time.now){
            this.tint = 0xff0000;
        } else {
            this.tint = 0xffffff;
        }

        if(this.health === 0){
            if(!this.dead){
                this.dead = true;
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(this.body.x, this.body.y);
                spark.anchor.x = 0;
                spark.animations.play('explosion', 30, false, true);
            }
        }
        this.body.velocity.x = 0;
        //转换方向
        if(this.state === walk){
            this.animations.play('walk', 10);
            this.body.velocity.x = this.direction * this.speed;
            if((this.body.blocked.left || this.body.blocked.right) && this.collidetime < game.time.now){
                this.direction *= -1;
                this.x -= this.direction * Math.abs(this.width);
                this.scale.x *= -1;
                this.collidetime = game.time.now + 200;
            }
        }
        //发现猪脚，切换状态
        var distanceX = (this.x - player.x) / 64;
        var distanceY = Math.abs(this.y - player.y) / 64;
        if(this.state === idle) {
            if(distanceX < 10 && distanceX > 0 && distanceY < 1.5){
                if(this.direction === right){
                    this.direction = left;
                    this.x -= this.direction * Math.abs(this.width);
                    this.scale.x *= -1;
                }
                this.state = walk;
            } else if(distanceX > -10 && distanceX < 0 && distanceY < 1.5){
                if(this.direction === left){
                    this.direction = right;
                    this.x -= this.direction * Math.abs(this.width);
                    this.scale.x *= -1;
                }
                this.state = walk;
            }
        }
};

var Shooter_walk = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Shooter_walk argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Shooter_walk.baseConstructor.call(this, game, x, y - 64, key, direction, speed, health);
    state.group_shooter.add(this);

    this.body.gravity.y = 2000;
    this.body.collideWorldBounds = true;
    this.body.width = 64;
    this.dead = false;
    //游戏属性
    this.state = walk;
    this.attacktime = 0;

    //子弹
    this.enemy_weapon = game.add.weapon(30, 'bullet', 'energy_bomb2', state.group_enemy_bullet);
    this.enemy_weapon.addBulletAnimation('fire', ['energy_bomb1', 'energy_bomb2'], 10, true);
    this.enemy_weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.enemy_weapon.bulletSpeed = 300;
    this.enemy_weapon.fireRate = 2000;
};
Inheritance_Manager.extend(Shooter_walk, Monster);
Shooter_walk.prototype.Update = function() {
        //与地面碰撞
        game.physics.arcade.collide(this, state.Map);
        game.physics.arcade.collide(this, state.Collision);
        game.physics.arcade.collide(this, state.EnemiesCollision);
        //与子弹碰撞
        game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
            enemy.damage(player.da);
            var spark = state.group_effects.getFirstExists(false);
            spark.reset(bullet.body.x, bullet.body.y);
            spark.animations.play('hit_spark', 30, false, true);
            enemy.hurttime = game.time.now + 100;
            bullet.kill();
        });
        if(this.health === 0){
            if(!this.dead){
                this.dead = true;
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(this.body.x, this.body.y);
                spark.anchor.x = 0;
                spark.animations.play('explosion', 30, false, true);
            }
        }
        if(this.hurttime > game.time.now){
            this.tint = 0xff0000;
        } else {
            this.tint = 0xffffff;
        }

        this.body.velocity.x = 0;
        //转换方向
        if(this.state === walk){
            this.animations.play('walk');
            this.body.velocity.x = this.direction * this.speed;
            if((this.body.blocked.left || this.body.blocked.right) && this.collidetime < game.time.now){
                this.direction *= -1;
                this.x -= this.direction * Math.abs(this.width);
                this.scale.x *= -1;
                this.collidetime = game.time.now + 200;
                if(this.direction === left){
                    this.enemy_weapon.fireAngle = Phaser.ANGLE_LEFT;
                    this.enemy_weapon.trackSprite(this, -132, 48, false);
                } else {
                    this.enemy_weapon.trackSprite(this, 132, 48, false);
                    this.enemy_weapon.fireAngle = Phaser.ANGLE_RIGHT;
                }
            }
        }
        //发现猪脚，切换状态
            var distanceX = (this.x - player.x) / 64;
            var distanceY = Math.abs(this.y - player.y) / 64;
        if(this.state === walk) {
            if((distanceX < 5 && distanceX > 0 && distanceY < 2.5 && this.direction === left) || 
               (distanceX > -5 && distanceX < 0 && distanceY < 2.5 && this.direction === right)){
                this.state = idle;
            }
        } else {
            if((this.direction === left && (distanceX > 5 || distanceX < 0) || distanceY > 2.5) || 
               (this.direction === right && (distanceX < -5 || distanceX > 0)|| distanceY > 2.5)){
                this.state = walk;
            }
        }
        if(this.state === idle){
            if(this.animations.currentFrame.index >= 10 || this.animations.currentFrame.index <= 5)
                this.animations.play('idle');
            if(this.attacktime < game.time.now){
                //站立一会儿后攻击
                this.attacktime = game.time.now + 2000;
                this.state = attack;
            }
        }
        if(this.state === attack){
            this.animations.play('shoot', 20, false);
            this.enemy_weapon.fire();
            this.state = idle;
        }
};

var Worm = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Worm argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    if(direction === left){
        Worm.baseConstructor.call(this, game, x + 64, y - 64, key, direction, speed, health);
    } else {
        Worm.baseConstructor.call(this, game, x, y - 64, key, direction, speed, health);
    }

    state.group_worm.add(this);

    this.body.height = 20;
    this.body.width = 48;
    this.body.gravity.y = 2000;
    this.dead = false;
    this.state = idle;
    this.invincible = true;
};
Inheritance_Manager.extend(Worm, Monster);
Worm.prototype.Update = function() {
        //与地面碰撞
        game.physics.arcade.collide(this, state.Map);
        game.physics.arcade.collide(this, state.Collision);
        //与子弹碰撞
        if(!this.invincible){
            game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
                enemy.damage(player.da);
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(bullet.body.x, bullet.body.y);
                spark.animations.play('hit_spark', 30, false, true);
                enemy.hurttime = game.time.now + 100;
                bullet.kill();
            });
            if(this.hurttime > game.time.now){
                this.tint = 0xff0000;
            } else {
            this.tint = 0xffffff;
        }
        }
        if(this.health === 0){
            if(!this.dead){
                this.dead = true;
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(this.body.x, this.body.y);
                spark.anchor.x = 0;
                spark.animations.play('explosion', 30, false, true);
            }
        }

        this.body.velocity.x = 0;
        //转换方向
        if(this.state === walk){
            this.animations.play('move', 10);
            this.body.velocity.x = this.direction * this.speed;
            if((this.body.blocked.left || this.body.blocked.right) && this.collidetime < game.time.now){
                this.direction *= -1;
                this.x -= this.direction * Math.abs(this.width);
                this.scale.x *= -1;
                this.collidetime = game.time.now + 200;
            }
        }
        //发现猪脚，切换状态
        var distanceX = (this.x - player.x) / 64;
        var distanceY = Math.abs(this.y - player.y) / 64;
        if(this.state === idle) {
            if(distanceX < 5 && distanceX > 0 && distanceY < 1.5){
                if(this.direction === right){
                    this.direction = left;
                    this.x -= this.direction * Math.abs(this.width);
                    this.scale.x *= -1;
                }
                this.animations.play('spawn', 10);
            } else if(distanceX > -5 && distanceX < 0 && distanceY < 1.5){
                if(this.direction === left){
                    this.direction = right;
                    this.x -= this.direction * Math.abs(this.width);
                    this.scale.x *= -1;
                }
                this.animations.play('spawn', 10);
            }
            if(this.animations.currentFrame.index === 10){
                this.animations.play('idle');
                this.state = walk;
                this.invincible = false;
                this.body.height = 40;
                this.body.width = 64;
            } else if(this.animations.currentFrame.index < 6){
                this.body.height = 24;
            } else if(this.animations.currentFrame.index < 7){
                this.body.height = 28;
            } else if(this.animations.currentFrame.index < 9){
                this.body.height = 36;
            }
        }
};

var Turtle = function(game, x, y, arg) {
    if(arg.length !== 4) console.error('Turtle argument length error!');
    var key = arg[0],
        direction = arg[1],
        speed = arg[2],
        health = arg[3];
    Turtle.baseConstructor.call(this, game, x + 64, y - 64, key, direction, speed, health);
    state.group_turtle.add(this);
    this.state = shell;
    this.player_in_range = false;
    this.attackstate = false;
    this.bulletnumber = 0;
    this.maxbullet = 2;
    this.invicible = true;
    this.fire_interval = 0;
    this.shelltime = 0;
    this.idletime = 0;
    this.dead = false;
    this.body.height = 60;
    this.body.gravity.y = 2000;


    this.enemy_weapon = game.add.weapon(30, 'bullet', 'bullet1', state.group_bullet);
    this.enemy_weapon.addBulletAnimation('fire', ['energy_bomb1', 'energy_bomb2'], 10, true);
    this.enemy_weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.enemy_weapon.bulletSpeed = 600;
    this.enemy_weapon.trackSprite(this, -32, -40, false);
    this.enemy_weapon.fireAngle = (this.direction === left ? Phaser.ANGLE_LEFT:Phaser.ANGLERIGHT);
};
Inheritance_Manager.extend(Turtle, Monster);
Turtle.prototype.Update = function() {
        //与地面碰撞
        game.physics.arcade.collide(this, state.Map);
        game.physics.arcade.collide(this, state.Collision);
        //与子弹碰撞
        game.physics.arcade.overlap(this, weapon.bullets, function(enemy, bullet){
            var spark;
            if(!enemy.invicible){
                enemy.damage(player.da);
                this.idletime = game.time.now + 100;
                if(enemy.state !== shell){
                    enemy.state = hide;
                    enemy.bulletnumber = 0;
                }
                spark = state.group_effects.getFirstExists(false);
                spark.reset(bullet.body.x, bullet.body.y);
                spark.animations.play('wall_spark', 30, false, true);
                enemy.hurttime = game.time.now + 100;
                bullet.kill();
            } else {
                spark = state.group_effects.getFirstExists(false);
                spark.reset(bullet.body.x, bullet.body.y);
                spark.animations.play('hit_spark', 30, false, true);
                bullet.kill();
            }
        });

        if(this.hurttime > game.time.now){
            this.tint = 0xff0000;
        } else {
            this.tint = 0xffffff;
        }
        if(this.health === 0){
            if(!this.dead){
                this.dead = true;
                var spark = state.group_effects.getFirstExists(false);
                spark.reset(this.body.x, this.body.y);
                spark.anchor.x = 0;
                spark.animations.play('explosion', 30, false, true);
            }
        }

        switch(this.animations.currentFrame.index) {
            case 2 : this.body.height = 60; break;
            case 1 : this.body.height = 76; break;
            case 0 : this.body.height = 84; break;
            case 6 : this.animations.play('idle');break;
            default : this.body.height = 92; break;
        }
        //发现猪脚，切换状态
        var distanceX = (this.x - player.x) / 64;
        var distanceY = Math.abs(this.y - player.y) / 64;
        if(distanceX < 5 && distanceX > 0){
            if(this.direction === right){
                this.direction = left;
                this.x -= this.direction * Math.abs(this.width);
                this.scale.x *= -1;
                this.enemy_weapon.fireAngle = Phaser.ANGLE_LEFT;
                this.enemy_weapon.trackSprite(this, -32, -40, false);
            }
            this.player_in_range = true;
        } else if(distanceX > -5 && distanceX < 0){
            if(this.direction === left){
                this.direction = right;
                this.x -= this.direction * Math.abs(this.width);
                this.scale.x *= -1;
                this.enemy_weapon.trackSprite(this, 32, -40, false);
                this.enemy_weapon.fireAngle = Phaser.ANGLE_RIGHT;
            }
            this.player_in_range = true;
        } else {
            this.player_in_range = false;
            this.attackstate = false;
        }

        if(this.state === shell){
            this.animations.play('shell');
            if(this.player_in_range && !this.attackstate) {
                this.attackstate = true;
                this.shelltime = game.time.now + 500;
            }
            if(this.shelltime < game.time.now && this.attackstate){
                //狗一会儿后站起来
                this.state = show;
                this.invicible = false;
            }
        } else if(this.state === show){
            this.animations.play('show', 20, false);
            if(this.animations.currentFrame.index === 0){
                this.idletime = game.time.now + 500;
                this.state = idle;
            }
        } else if(this.state === idle){
            this.animations.play('idle');
            if(game.time.now > this.idletime) {
                //发呆一会儿后攻击
                this.state = attack;
            }
        } else if(this.state === attack) {
            if(this.fire_interval < game.time.now){
                this.fire_interval = game.time.now + 500;
                this.animations.play('attack', 10, false);
                this.enemy_weapon.fire();
                this.bulletnumber++;
                if(this.bulletnumber === this.maxbullet){
                    this.bulletnumber = 0;
                    this.state = hide;
                    this.idletime = game.time.now + 500;
                }
            }
        } else if(this.state === hide){
            if(game.time.now > this.idletime){
                //发呆一会儿后藏起来
                this.animations.play('hide');
                if(this.animations.currentFrame.index === 2){
                    this.shelltime = game.time.now + 2000;
                    this.state = shell;
                    this.invicible = true;
                }
            }
        }
};


//为所有的类的诞生献上继承

var HashSearch = function(index, table, x, y, group, speed) {
    if(index < 201 || index === 220 || index > 227 && index < 233 || index > 239) return false;
    if(index < 220){
        ind = index - 201;
    } else if(index < 228) {
        ind = index - 202;
    } else if(index < 240) {
        ind = index - 207;
    }
    if(ind === 0){
        player = new createTable[ind].func(game, x * 64, y * 64, createTable[ind].arg);
        return true;
    }
    new createTable[ind].func(game, x * 64, y * 64, createTable[ind].arg);
    return true;
};


// 除了人物外的arg:[key, direction, speed]
var createTable = [
    { id:201, func:Player, arg:['player', 'gun', 300]},
    { id:202, func:EndZone, arg:['shooter']},
    { id:203, func:Zombie, arg:['zombie', right, 150, 8]},
    { id:204, func:Zombie, arg:['zombie', left, 150, 8]},
    { id:205, func:Shooter_walk, arg:['shooter', right, 150, 10]},
    { id:206, func:Shooter_walk, arg:['shooter', left, 150, 10]},
    { id:207, func:Hopper, arg:['hopper', left, 300, 8]},
    { id:208, func:Runner, arg:['runner', left, 600, 6]},
    { id:209, func:Flyer, arg:['flyer', right, 100, 7]},
    { id:210, func:Flyer, arg:['flyer', left, 100, 7]},
    { id:211, func:Boss_turtle, arg:['boss_turtle', left, 0]},
    { id:212, func:Turtle, arg:['turtle', right, 0, 10]},
    { id:213, func:Turtle, arg:['turtle', left, 0, 10]},
    { id:214, func:Coin, arg:['silver']},
    { id:215, func:Coin, arg:['gold']},
    { id:216, func:Coin, arg:['silver']},
    { id:217, func:Boss_hulk, arg:['boss_hulk', left, 600]},
    { id:218, func:Platform, arg:[1]},
    { id:219, func:Platform, arg:[2]},
    { id:221, func:Dripper, arg:['dripper', right, 0, 0]},
    { id:222, func:Dripper, arg:['dripper', right, 0, 500]},
    { id:223, func:Dripper, arg:['dripper', right, 0, 1000]},
    { id:224, func:Dripper, arg:['dripper', right, 0, 1500]},
    { id:225, func:Brainworm, arg:['brainworm', left, 0, 20]},
    { id:226, func:Worm, arg:['worm', left, 300, 9]},
    { id:227, func:Worm, arg:['worm', right, 300, 9]},
    { id:233, func:Platform, arg:[3]},
    { id:234, func:Platform, arg:[4]},
    { id:235, func:Water, arg:['face']},
    { id:236, func:Water, arg:['face']},
    { id:237, func:Water, arg:['inside']},
    { id:238, func:Light, arg:[]},
    { id:239, func:Cure, arg:[]}
];