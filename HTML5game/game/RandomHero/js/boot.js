var bootState = function(game){
    this.preload = function () {
        game.load.bitmapFont('shop_font', 'fonts/shop.png', 'fonts/shop.fnt');       //字体文件
    };
    this.create = function () {
        game.state.start('loaderState');
    }
};