var StartLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var size = cc.winSize;

		var startItem = new cc.MenuItemImage(
			res.Start_N_png, 
			res.Start_S_png, 
			(function(){

				// cc.director.replaceScene(cc.TransitionPageTurn(1, new PlayScene(), false));
				cc.director.runScene(new PlayScene());
			}), this);

		startItem.attr({
			x: size.width / 2,
			y: size.height / 2,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = new cc.Menu(startItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);

		this.bgSprite = new cc.Sprite(res.BackGround_png);
		this.bgSprite.attr({
			x: size.width / 2,
			y: size.height / 2
		});

		this.addChild(this.bgSprite, 0);

		return true;
	}
});

var StartScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		var layer = new StartLayer();
		this.addChild(layer);
	}
});
