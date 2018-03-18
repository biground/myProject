var	score = 0;
var scoreLabel = null;
var timeout = 0;
var timeoutLabel = null;
var PlayLayer = cc.Layer.extend({
	bgSprite: null,
	SushiSprites: null,
	ctor: function(){
		this._super();
		cc.spriteFrameCache.addSpriteFrames(res.Sushi_plist);
		this.SushiSprites = [];

		var size = cc.winSize;

		this.bgSprite = new cc.Sprite(res.BackGround_png);
		this.bgSprite.attr({
			x: size.width / 2,
			y: size.height / 2,
			rotation: 180
		});


		this.addChild(this.bgSprite, 0);
		this.schedule(this.update, 1, 16 * 1024, 1);

		scoreLabel = new cc.LabelTTF('score: ' + score, 'Arial', 20);
		scoreLabel.attr({
			x: size.width / 2 + 100,
			y: size.height - 20
		});

		this.addChild(scoreLabel, 5);

		timeoutLabel = cc.LabelTTF.create('' + timeout, 'arial', 30);
		timeoutLabel.x = 20;
		timeoutLabel.y = size.height - 20;
		this.addChild(timeoutLabel, 5);

		return true;
	},
	update: function(){
		this.addSushi();
		this.removeSushi();
		timeout++;
		timeoutLabel.setString('' + timeout);
	},
	addSushi: function(){
		var sushi = new SushiSprite(cc.spriteFrameCache.getSpriteFrame('sushi_1n.png'));
		var size = cc.winSize;

		var x = sushi.width / 2 + size.width / 2 * cc.random0To1();
		sushi.attr({
			x: x,
			y: size.height + 30
		})

		var dorpAction = cc.MoveTo.create(4, cc.p(sushi.x, -30));
		sushi.runAction(dorpAction);

		this.SushiSprites.push(sushi);

		this.addChild(sushi, 5);
	},
	removeSushi: function(){
		for(var i = 0;i < this.SushiSprites.length;i++) {
			if( 0 >= this.SushiSprites[i].y){
				this.SushiSprites[i].removeFromParent();
				this.SushiSprites[i] = undefined;
				this.SushiSprites.splice(i, 1);
				i--;
				score--;
				scoreLabel.setString('score: ' + score);
			}
		}
	}
});

var PlayScene = cc.Scene.extend({
	onEnter: function(){
		this._super();
		var layer = new PlayLayer();
		this.addChild(layer);
	}
});
