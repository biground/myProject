var Blaad = function (gameS, xS, yS) {
    Enemy.apply(this, [gameS, xS, yS, 'blaad']);
    this.game = gameS;
    this.x = xS;
    this.y = yS;
    this.health = 40;
    this.maxHealth = this.health;
    this.worth = 400;
    this.comboWorth = 12;
    this.rotationSpeed = 15;
    this.reverseRotation = false;
    this.nextReverse = 0;
    this.laserBeam = new Weapon.LaserBeam(this.game);
    this.shields = this.game.add.group();
    this.shields.create(new BlaadShield(this.game, this.x + 5, this.y - 5));
    this.shields.create(new BlaadShield(this.game, this.x + 11, this.y - 2));
    this.shields.create(new BlaadShield(this.game, this.x + 15, this.y + 5));
    this.shields.create(new BlaadShield(this.game, this.x + 11, this.y + 11));
    this.shields.create(new BlaadShield(this.game, this.x + 5, this.y + 14));
    this.shields.create(new BlaadShield(this.game, this.x - 1, this.y + 11));
    this.shields.create(new BlaadShield(this.game, this.x - 5, this.y + 5));
    this.shields.create(new BlaadShield(this.game, this.x - 1, this.y - 2));
    this.addChild(this.shields);
    this.idleAnimation = true; // Animation stuff doesn't work yet because you can't add animations to extended sprites. Gotta figure this out later.  //
    this.animations.add('standing', [0]);  //
    this.animations.add('idle', [1, 2, 3, 4, 5, 6, 7]);
    this.animations.add('damage', [8, 9, 10, 11]);
    this.animations.play('standing', 0, false);
 };
 Blaad.prototype = Object.create(Enemy.prototype);
Blaad.prototype.constructor = Blaad;
var BlaadShield = function (gameS, xS, yS) {
    Enemy.apply(this, [gameS, xS, yS, 'blaadShield']);
    this.game = gameS;
    this.x = xS;
    this.y = yS;
    this.health = 10;
    this.maxHealth = this.health;
    this.minorEnemy = true;
};
BlaadShield.prototype = Object.create(Enemy.prototype);
BlaadShield.prototype.constructor = BlaadShield;

