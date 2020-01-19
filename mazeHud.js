let directionLeft;
let directionRight;
let directionUp;
let directionDown;
let timerText;
let graphics;
let heartGroup;
let heartEmptyGroup;
let timerCounter = 30;

function setTimerCounter(duration = 30) {
    timerCounter = duration;
}

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
        this.load.image('backArrowHud', 'assets/Maze/arrow.png');
        this.load.atlas('coins', 'assets/Maze/coins.png', 'assets/Maze/coins.json');
        this.load.image('lordchaos', 'assets/Maze/Lord_chaos_Kaefer.png');
    }

    create() {
        this.add.text(70, 30, 'Münzen:', fontStyleTutorialText).setOrigin(0.5);
        this.add.text(365, 30, 'Zeit:', fontStyleTutorialText).setOrigin(0.5);
        timerText = this.add.text(435, 30, 30, fontStyleTutorialText).setOrigin(0.5);

        this.time.addEvent({
            delay: 1000,
            callback: function () {
                if (gameOver == false && startTimer == true && timerText != null) {
                    console.log('hallo');
                    timerCounter -= 1;
                    timerText.setText(timerCounter);
                    console.log(timerCounter);
                }
            },
            loop:true
        });

        let backArrowHud = this.add.image(40, 80, 'backArrowHud').setScale(0.3).setFlipX(true).setInteractive();

        this.input.addPointer(1);
        //Touch control
        let leftA = this.add.image(100, 700, 'leftArrow').setInteractive();
        leftA.depth = 100;
        leftA.alpha = 0.7;
        let rightA = this.add.image(300, 700, 'rightArrow').setInteractive();
        rightA.depth = 100;
        rightA.alpha = 0.7;
        let upA = this.add.image(500, 700, 'upArrow').setInteractive();
        upA.depth = 100;
        upA.alpha = 0.7;
        let downA = this.add.image(700, 700, 'downArrow').setInteractive();
        downA.depth = 100;
        downA.alpha = 0.7;

        rightA.on('pointerover', function (event) {
            directionRight = true;
        });
        rightA.on('pointerout', function (event) {
            directionRight = false;
        });

        leftA.on('pointerover', function (event) {
            directionLeft = true;
        });
        leftA.on('pointerout', function (event) {
            directionLeft = false;
        });

        upA.on('pointerover', function (event) {
            directionUp = true;
        });
        upA.on('pointerout', function (event) {
            directionUp = false;
        });

        downA.on('pointerover', function (event) {
            directionDown = true;
        });
        downA.on('pointerout', function (event) {
            directionDown = false;
        });

        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            if (gameObject == backArrowHud) {
                this.scene.start('LevelSelector');
                this.scene.stop('Maze');
            }
        }, this);

    }

    update() {

    }
}