let scoreText;
let directionLeft;
let directionRight;
let directionUp;
let directionDown;
let graphics;
class MazeHud extends Phaser.Scene {
    constructor() {
        super({ key: 'MazeHud' });
    }

    init(data) {

    }

    preload() {
        this.load.image('upArrow', 'assets/Maze/upArrow.png');
        this.load.image('rightArrow', 'assets/Maze/rightArrow.png');
        this.load.image('downArrow', 'assets/Maze/downArrow.png');
        this.load.image('leftArrow', 'assets/Maze/leftArrow.png');
        this.load.image('scoreText', 'assets/Maze/scoreText.png');
        this.load.atlas('coins', 'assets/Maze/coins.png', 'assets/Maze/coins.json');
    }

    create() {
        graphics = this.add.graphics();
        scoreText = this.add.image(70, 30, 'scoreText');
        console.log('Amounter of pointers: ' + this.input.manager.pointersTotal);
        this.input.addPointer(1);
        console.log('Amounter of pointers: ' + this.input.manager.pointersTotal);
        //Touch control
        let leftA = this.add.image(100, 700, 'leftArrow').setInteractive();
        leftA.depth = 100;
        leftA.alpha = 0.5;
        let rightA = this.add.image(300, 700, 'rightArrow').setInteractive();
        rightA.depth = 100;
        rightA.alpha = 0.5;
        let  upA = this.add.image(500, 700, 'upArrow').setInteractive();
        upA.depth = 100;
        upA.alpha = 0.5;
        let downA = this.add.image(700, 700, 'downArrow').setInteractive();
        downA.depth = 100;
        downA.alpha = 0.5;

        rightA.on('pointerover', function(event){
            directionRight = true;
        });
        rightA.on('pointerout', function(event){
            directionRight = false;
        });

        leftA.on('pointerover', function(event){
            directionLeft = true;
        });
        leftA.on('pointerout', function(event){
            directionLeft = false;
        });

        upA.on('pointerover', function(event){
            directionUp = true;
        });
        upA.on('pointerout', function(event){
            directionUp = false;
        });

        downA.on('pointerover', function(event){
            directionDown = true;
        });
        downA.on('pointerout', function(event){
            directionDown = false;
        });
        
    }

    update() {

        if (this.input.pointer1.isDown || this.input.pointer2.isDown)
        {
            graphics.clear();
        } else{
        }

        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(this.input.pointer1.x, this.input.pointer1.y, 64, 64);
    
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(this.input.pointer2.x, this.input.pointer2.y, 64, 64);

    }
}