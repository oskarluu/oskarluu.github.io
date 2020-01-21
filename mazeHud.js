let backArrowHud;
let timerText;
let timerCounter;
let directionLeft;
let directionRight;
let directionUp;
let directionDown;
let leftArrow;
let rightArrow;
let upArrow;
let downArrow;


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
        //Touch arrows
        this.load.image('upArrow', 'assets/Maze/upArrow.png');
        this.load.image('rightArrow', 'assets/Maze/rightArrow.png');
        this.load.image('downArrow', 'assets/Maze/downArrow.png');
        this.load.image('leftArrow', 'assets/Maze/leftArrow.png');
        //HUD elements
        this.load.image('backArrowHud', 'assets/Maze/arrow.png');
        this.load.atlas('coins', 'assets/Maze/coins.png', 'assets/Maze/coins.json');
        this.load.image('lordchaos', 'assets/Maze/Lord_chaos_Kaefer.png');
        this.load.image('gameOver', './assets/Maze/gameOver.png');
        this.load.image('samVogel', 'assets/Maze/Sam_Vogel.png');

        setTimerCounter();
    }

    create() {
        this.add.text(70, 30, 'Münzen:', fontStyleTutorialText).setOrigin(0.5);
        this.add.text(365, 30, 'Zeit:', fontStyleTutorialText).setOrigin(0.5);
        timerText = this.add.text(435, 30, 30, fontStyleTutorialText).setOrigin(0.5);
        backArrowHud = this.add.image(40, 80, 'backArrowHud').setScale(0.3).setFlipX(true).setInteractive();

        
        //Second pointer
        this.input.addPointer(1);
        
        //Touch arrows configurations
        leftArrow = this.add.image(100, 700, 'leftArrow').setDepth(100).setAlpha(0.7).setInteractive();
        rightArrow = this.add.image(300, 700, 'rightArrow').setDepth(100).setAlpha(0.7).setInteractive();
        upArrow = this.add.image(500, 700, 'upArrow').setDepth(100).setAlpha(0.7).setInteractive();
        downArrow = this.add.image(700, 700, 'downArrow').setDepth(100).setAlpha(0.7).setInteractive();
        
        //Clock timer
        this.time.addEvent({
            delay: 1000,
            callback: function () {
                if (levelFinished == false && startTimer == true && timerText != null) {
                    timerCounter -= 1;
                    timerText.setText(timerCounter);
                }
            },
            loop:true
        });

        //Inputs
        rightArrow.on('pointerover', function (event) {
            directionRight = true;
        });
        rightArrow.on('pointerout', function (event) {
            directionRight = false;
        });

        leftArrow.on('pointerover', function (event) {
            directionLeft = true;
        });
        leftArrow.on('pointerout', function (event) {
            directionLeft = false;
        });

        upArrow.on('pointerover', function (event) {
            directionUp = true;
        });
        upArrow.on('pointerout', function (event) {
            directionUp = false;
        });

        downArrow.on('pointerover', function (event) {
            directionDown = true;
        });
        downArrow.on('pointerout', function (event) {
            directionDown = false;
        });

        //Animation back button
        backArrowHud.on('pointerdown', function(pointer){
            backArrowHud.setScale(0.25);
        });
        this.input.on('pointerup', function(pointer){
            backArrowHud.setScale(0.3);
        });

        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            if (gameObject == levelFinishedBackButton && levelFinished == true) {
                this.scene.stop('Maze');
                this.scene.start('LevelSelector', { currentLevel: mapNumber.charAt(mapNumber.length - 1) });
            } else if (gameObject == levelFinishedBackButton || gameObject == backArrowHud){
                this.scene.stop('Maze');
                this.scene.start('LevelSelector');
            }
        }, this);

    }

    update() {

    }
}