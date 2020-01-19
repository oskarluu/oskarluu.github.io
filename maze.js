//Map variable
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
//HUD variable
let timer;
let lifeCounter;
let scoreCoinCounter = 0;
let gameOverBackButton;
let sceneHud;
//Player variable
let allowPlayerToMove;
let cursors;
let moveRight;
let moveLeft;
//Adjust variable
let adjustScale;
let adjustOffset;
let adjustSize
let adjustPlayerScale;
//Auxiliary variable
let exitXY;
let randomX;
let randomY;
let randomSite;
let gameOver;
let maze;
let startTimer;

//Dynamic exit methods
function changeExit() {
    if(gameOver == false){

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

//Switch Exit function inside map array
function switchExitPosition(x, y, sx, sy) {
    let tmp = map[y][x];
    map[y][x] = map[sy][sx];
    map[sy][sx] = tmp;
}

//Get the X and Y Coords for player
function getPlayerPos() {
    for (let y = 0; y < map.length; y++) {
        if (map[y][0] == 1) {
            return ((y * widthSprite) + spacingSprite);
        }
    }
}

//Get current exit coords
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

//Checks if player collects coins, increment score counter, unlocks lock, adds (spinning) coins to hud
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

//Create map elements
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

        this.load.image('gameOver', './assets/Maze/gameOver.png');

        sceneHud = this.scene.get('MazeHud');
        maze = this.scene.scene;

        exitNotFound = true;
        moveRight = false;
        moveLeft = false;
        mapCreated = false;
        gameOver = false;
        startTimer = false;

        widthSprite = 800 / map.length;
        spacingSprite = 800 / (map.length * 2);
        switch (widthSprite) {
            case 40:
                adjustScale = 0.5;
                adjustOffset = 20;
                adjustSize = 40;
                adjustPlayerScale = adjustScale * 0.6;
                break;
            case 50:
                adjustScale = 0.625;
                adjustOffset = (16);
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
        getPlayerPos();
        setTimerCounter();
    }

    create() {
        console.log(map);
        console.log(mapNumber);
        this.add.image(400, 400, 'backgroundMaze');

        //Static
        walls = this.physics.add.staticGroup();
        coins = this.physics.add.staticGroup();
        lock = this.physics.add.staticGroup();
        //Creates map based on 2-D-Array
        creatMap();

        //Dynamic
        player = this.physics.add.sprite(spacingSprite, getPlayerPos(), 'dog').setScale(adjustPlayerScale);

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

        allowPlayerToMove = false;
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

        this.time.addEvent({
            delay: 4000,
            callback: changeExit,
            loop: true
        });
        this.time.addEvent({
            delay: 1000,
            callback: function () {
                if (timerCounter == 0 && gameOver == false) {
                    allowPlayerToMove = false;
                    sceneHud.add.image(400,400,'gameOver').setDepth(99);
                    sceneHud.add.text(400, 330, 'Die Zeit ist leider abgelaufen!\nVersuche es noch einmal!', fontStyleTutorialText).setAlign('center').setOrigin(0.5).setDepth(99);
                    sceneHud.add.image(350, 430, 'lordchaos').setScale(0.2).setDepth(99);
                    gameOverBackButton = sceneHud.add.image(450,430, 'backArrowHud').setScale(0.3).setDepth(99).setInteractive();
                    cameraGame.setZoom(1);
                    cameraGame.flash();
                    setTimerCounter();
                    startTimer = false;
                }
            },
            loop: true
        });

        cursors = this.input.keyboard.createCursorKeys();

        sceneHud.input.on('gameobjectup', function (pointer, gameObject, event) {
            if (gameObject == gameOverBackButton) {
                gameOver = true;
            }
        }, this);
    }

    update() {
        let movingSpeed = 250;
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

        if (!moveRight && allowPlayerToMove && (cursors.right.isDown || directionRight)) {
            player.toggleFlipX();
            moveRight = true;
            moveLeft = false;
        } else if (!moveLeft && allowPlayerToMove && (cursors.left.isDown || directionLeft)) {
            player.toggleFlipX();
            moveLeft = true;
            moveRight = false;
        }

        if (player.x > 800 || player.y < 0 || player.y > 800) {
            let tmp = getCurrentExitXY();
            map[tmp[1]][tmp[0]] = 9;
            scoreCoinCounter = 0;
            sceneHud.scene.stop();
            this.scene.start('LevelSelector', {currentLevel: mapNumber.charAt(mapNumber.length-1)});
        }
        
        if(gameOver){
            sceneHud.scene.stop();
            this.scene.start('LevelSelector');
        }

        if (player.x < 800 / (2 * map.length)) {
            player.setCollideWorldBounds(true);
        } else {
            player.setCollideWorldBounds(false);
        }
    }
}