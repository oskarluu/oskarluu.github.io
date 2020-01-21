//Map variables
let map = [];
let mapNumber;
let walls;
let player;
let coins;
let lock;
let widthSprite;
let spacingSprite;
let exitNotFound;
let cameraGame;
let mapCreated

//HUD variables
let timer;
let lifeCounter;
let scoreCoinCounter = 0;
let levelFinishedBackButton;
let sceneHud;

//Player variables
let allowPlayerToMove;
let cursors;
let moveRight;
let moveLeft;
let movingSpeed;

//Adjust and scale variables
let adjustScale;
let adjustOffset;
let adjustSize
let adjustPlayerScale;

//Auxiliary variables
let exitXY;
let randomX;
let randomY;
let randomSite;
let maze;
let startTimer;
let levelFinished;
let endText

/**
 * Search a new position and change the position of the exit.
 * Possible spots: upper, right and lower edge
 */
function changeExit() {
    if (levelFinished == false) {

        exitNotFound = true;
        exitXY = getCurrentExitXY();
        randomX = Math.floor(Math.random() * (map.length - 1));
        randomY = Math.floor(Math.random() * (map.length - 1));
        randomSite = Math.floor(Math.random() * 3);

        while (exitNotFound) {
            switch (randomSite) {
                case 0:
                    if (map[1][randomX] == 1) {
                        switchExitPosition(exitXY[0], exitXY[1], randomX, 0);
                        creatMap();
                        exitNotFound = false;
                    }
                    break;
                case 1:
                    if (map[randomY][map.length - 2] == 1) {
                        switchExitPosition(exitXY[0], exitXY[1], map.length - 1, randomY);
                        creatMap();
                        exitNotFound = false;
                    }
                    break;
                case 2:
                    if (map[map.length - 2][randomX] == 1) {
                        switchExitPosition(exitXY[0], exitXY[1], randomX, map.length - 1);
                        creatMap();
                        exitNotFound = false;
                    }
                    break;
                default:
                    break;
            }
            exitNotFound = false;
        }
    }
}

/**
 * Switches values within a 2D array
 * 
 * @param {integer} oldX - Old X coordinate of the exit
 * @param {integer} oldY - Old Y coordinate of the exit
 * @param {integer} newX - New X coordinate of the exit
 * @param {integer} newY - New Y coordinate of the exit
 */
function switchExitPosition(oldX, oldY, newX, newY) {
    let tmp = map[oldY][oldX];
    map[oldY][oldX] = map[newY][newX];
    map[newY][newX] = tmp;
}

/**
 * Get the start position of the player
 * 
 * @return {integer} Y coordinate of player
 */
function getPlayerPos() {
    for (let y = 0; y < map.length; y++) {
        if (map[y][0] == 1) {
            return ((y * widthSprite) + spacingSprite);
        }
    }
}

/** Get current exit coordinates
 * 
 * @return {array|Integer[]} current exit coordinates
 */
function getCurrentExitXY() {
    for (let x = 0; x < map.length; x++) {
        if (map[0][x] == 9 || map[0][x] == 1) {
            return [x, 0];
        } else if (map[x][(map.length - 1)] == 9 || map[x][(map.length - 1)] == 1) {
            return [(map.length - 1), x];
        } else if (map[(map.length - 1)][x] == 9 || map[(map.length - 1)][x] == 1) {
            return [x, (map.length - 1)];
        }
    }
}

/**
 * Checks if player collides with coins, then increment score counter and disable the collected coin.
 * If 3 coins are collected then disable the lock
 * 
 * @param {Phaser.GameObjects.Gameobject} player - The player
 * @param {Phaser.GameObjects.Gameobject} coin - The coin which collides with the player
 *
 */
function collectCoin(player, coin) {
    coin.disableBody(true, true);
    let coinHud = sceneHud.add.image(150 + scoreCoinCounter * 40, 32, 'coin').setScale(0.5);
    coinHud.depth = 10;
    scoreCoinCounter += 1;
    if (scoreCoinCounter == 3) {
        let tmpXY = getCurrentExitXY();
        map[tmpXY[1]][tmpXY[0]] = 1;
        lock.getChildren().map(child => child.destroy());
        cameraGame.flash();
    }
}

/**
 * Creates map based on 2D array
 * 0 represents walls
 * 2 represents coins
 * 9 represents the lock
 */
function creatMap() {
    lock.clear(true);
    walls.clear(true);
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            if (map[y][x] == 0) {
                walls.create(x * widthSprite + spacingSprite, y * widthSprite + spacingSprite, 'tree').setScale(adjustScale).setSize(adjustSize, adjustSize, true).setOffset(adjustOffset, adjustOffset);
            } else if (map[y][x] == 2 && !mapCreated) {
                coins.create(x * widthSprite + spacingSprite, y * widthSprite + spacingSprite, 'coin').setScale(adjustScale).setSize(adjustSize, adjustSize, true).setOffset(adjustOffset, adjustOffset);
            } else if (map[y][x] == 9) {
                lock.create(x * widthSprite + spacingSprite, y * widthSprite + spacingSprite, 'lock').setScale(adjustScale).setSize(adjustSize, adjustSize, true).setOffset(adjustOffset, adjustOffset);
            }
        }
    }
    mapCreated = true;
}

class Maze extends Phaser.Scene {
    constructor() {
        super({ key: 'Maze' });
    }

    init(data) {
        map = data.map;
        mapNumber = data.mapNumber;
    }

    preload() {
        //World elements
        this.load.image('backgroundMaze', './assets/Maze/background.png');
        this.load.image('tree', './assets/Maze/tree.png');
        this.load.image('coin', './assets/Maze/coin.png');
        this.load.image('lock', './assets/Maze/lock.png');

        //Characters
        this.load.image('dog', './assets/Maze/dog.png');

        //Scenes
        sceneHud = this.scene.get('MazeHud');
        maze = this.scene.scene;

        //Variables
        exitNotFound = true;
        moveRight = false;
        moveLeft = false;
        mapCreated = false;
        startTimer = false;
        levelFinished = false;
        movingSpeed = 250;
        widthSprite = 800 / map.length;
        spacingSprite = 800 / (map.length * 2);
        scoreCoinCounter = 0;

        //Scaling of elements based on the width of one sprite
        switch (widthSprite) {
            case 40:
                adjustScale = 0.5;
                adjustOffset = 20;
                adjustSize = 40;
                adjustPlayerScale = adjustScale * 0.6;
                break;
            case 50:
                adjustScale = 0.625;
                adjustOffset = 16;
                adjustSize = 50;
                adjustPlayerScale = adjustScale * 0.6;
                break;
            case 80:
                adjustScale = 1;
                adjustOffset = 0;
                adjustSize = 80;
                adjustPlayerScale = adjustScale * 0.6;
                break;
            default:
                break;
        }
    }

    create() {
        this.add.image(400, 400, 'backgroundMaze');

        //Generate map
        walls = this.physics.add.staticGroup();
        coins = this.physics.add.staticGroup();
        lock = this.physics.add.staticGroup();
        creatMap();

        //Set player
        player = this.physics.add.sprite(spacingSprite, getPlayerPos(), 'dog').setScale(adjustPlayerScale);
        allowPlayerToMove = false;

        //Collides and overlaps
        this.physics.add.collider(player, walls);
        this.physics.add.collider(player, lock);
        this.physics.add.overlap(player, coins, collectCoin, null, this);

        //Camera settings
        cameraGame = this.cameras.main;
        cameraGame.flash();
        cameraGame.setBounds(0, 0, 800, 800);

        //Minimap
        this.cameras.add(320, -320, 800, 800).setZoom(0.15);

        //Game start delay
        this.time.addEvent({
            delay: 3000,
            callback: function () {
                cameraGame.flash();
                cameraGame.setZoom(2);
                cameraGame.startFollow(player, true, 0.09, 0.09);
                maze.scene.launch('MazeHud');
                startTimer = true;
                allowPlayerToMove = true;
            }
        });

        //Change exit timer
        this.time.addEvent({
            delay: 4000,
            callback: changeExit,
            loop: true
        });

        //Checks if clock timer hits 0 or game is finished
        this.time.addEvent({
            delay: 1000,
            callback: function () {
                if (timerCounter == 0 && levelFinished == false || levelFinished == true && timerCounter != 30) {
                    allowPlayerToMove = false;
                    sceneHud.add.image(400, 400, 'gameOver').setDepth(99);
                    if (levelFinished == true) {
                        endText = 'Du hast das Level geschafft!\nAb zum nächsten Level!'
                        sceneHud.add.image(350, 430, 'samVogel').setScale(0.1).setDepth(99);
                    } else {
                        sceneHud.add.image(350, 430, 'lordchaos').setScale(0.2).setDepth(99);
                        endText = 'Die Zeit ist leider abgelaufen!\nVersuche es noch einmal!';
                    }
                    sceneHud.add.text(400, 330, endText, fontStyleTutorialText).setAlign('center').setOrigin(0.5).setDepth(99);
                    levelFinishedBackButton = sceneHud.add.image(450, 430, 'backArrowHud').setScale(0.3).setDepth(99).setInteractive();
                    
                    levelFinishedBackButton.on('pointerdown', function(pointer){
                        levelFinishedBackButton.setScale(0.25);
                    });

                    cameraGame.setZoom(1);
                    cameraGame.flash();
                    setTimerCounter();
                    startTimer = false;
                }
            },
            loop: true
        });

        this.input.on('pointerup', function(pointer){
            levelFinishedBackButton.setScale(0.3);
        });

        //keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        //Player movement
        if (allowPlayerToMove) {
            if (cursors.right.isDown || directionRight) {
                player.setVelocityX(movingSpeed);
            } else if (cursors.left.isDown || directionLeft) {
                player.setVelocityX(-movingSpeed);
            } else if (cursors.up.isDown || directionUp) {
                player.setVelocityY(-movingSpeed);
            } else if (cursors.down.isDown || directionDown) {
                player.setVelocityY(movingSpeed);
            } else {
                player.setVelocityX(0);
                player.setVelocityY(0);
            }
        }

        //Player image flip conditions
        if (!moveRight && allowPlayerToMove && (cursors.right.isDown || directionRight)) {
            player.toggleFlipX();
            moveRight = true;
            moveLeft = false;
        } else if (!moveLeft && allowPlayerToMove && (cursors.left.isDown || directionLeft)) {
            player.toggleFlipX();
            moveLeft = true;
            moveRight = false;
        }

        //Winning conditions and 
        if (player.x > 800 || player.y < 0 || player.y > 800) {
            let tmp = getCurrentExitXY();
            map[tmp[1]][tmp[0]] = 9;
            levelFinished = true;
        }

        //World bounderies
        if (player.x < 800 / (2 * map.length)) {
            player.setCollideWorldBounds(true);
        } else {
            player.setCollideWorldBounds(false);
        }
    }
}