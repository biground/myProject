var bootState = function(game){
    this.preload = function () {
        game.load.spritesheet('loading', 'image/loading.png', 300, 400);
    };
    this.create = function () {
        game.state.start('loaderState');
    }
};