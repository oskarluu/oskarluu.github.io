let LevelSelector = this.scene.get('LevelSelector');
let Maze = this.scene.get('Maze');
let MazeHud = this.scene.get('MazeHud');

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    /*
    input: {
        activePointers: 2
    },
    */
    scene: [LevelSelector, Maze, MazeHud]
}

let game = new Phaser.Game(config);
