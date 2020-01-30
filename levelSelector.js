//Map variables
let allMaps = [];

//Back Elements variables
let backArrow;
let backText;

// Enabled Thumbnails variables
let groupThumbLevels;
let arrayKeyThumb;
let gameObjectButtonsList;

// Disabled Thumbnails variables
let groupGrayThumb;
let arrayGroupGrayThumb;
let gameGrayObjectButtonsList;

//Auxiliary variables
let mapsNotLoaded = true;
let currentLevel;
let activeMap = [];

/**
 * Gets the map data from a CSV file
 * 
 * @param {*} data 
 */
function getMap(data) {
    $.ajax({
        type: "GET",
        url: data + ".csv",
        dataType: "text",
        success: function (data) {
            processData(data);
        }
    });
}

/**
 * Process the data
 * Step 1: Seperate the string by line breaks in save it into an array alpha
 * Step 2: Seperate each string in array alpha by commas and save it into  array beta
 * Step 3: Push array beta in array gamma and thus create a 2D array
 * Step 4: Create an array of 2D arrays
 * 
 * @param {*} rawData 
 */
function processData(rawData) {
    let formattedData = rawData.split(/\r\n|\n/);
    let xCoords = [];

    for (let i = 0; i < formattedData.length; i++) {
        let rowData = formattedData[i].split(',');
        let yCoords = [];
        for (let j = 0; j < rowData.length; j++) {
            yCoords.push(parseInt(rowData[j], 10));
        }
        xCoords.push(yCoords);
    }
    allMaps.push(xCoords);
}

class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelector' });
    }

    init(data){
        currentLevel = data.currentLevel;
    }

    preload() {

        this.load.image('backArrow', 'assets/LevelSelector/arrow.png');

        //Thumbnails        
        this.load.image('grayThumbnail', 'assets/LevelSelector/thumbLevelGray.png');
        for (let i = 1; i < 10; i++) {
            this.load.image('thumbLevel' + i, 'assets/LevelSelector/thumbLevel' + i + '.png');
        }

        //Map data
        this.load.image('backgroundLvlSelector', 'assets/LevelSelector/background.png');
        if (mapsNotLoaded) {
            for (let i = 1; i < 10; i++) {
                getMap('maps/map_' + i);
                activeMap.push(0);
            }
            mapsNotLoaded = false;
        }
    }

    create() {
        //Sort by map length, somehow the maps are getting mixed
        allMaps.sort(function (a, b) {
            return a.length - b.length;
        });

        this.add.image(400, 400, 'backgroundLvlSelector');
        
        //Back elements
        backArrow = this.add.image(100, 720, 'backArrow').setScale(0.5).setFlipX(true).setInteractive();
        backText = this.add.text(230, 720, 'Zurück', fontStyleContinueText).setOrigin(0.5).setInteractive();

        //Animation when clicking back
        backArrow.on('pointerdown', function(pointer){
            backArrow.setScale(0.45);
            backText.setScale(0.95);
        });
        backText.on('pointerdown', function(pointer){
            backArrow.setScale(0.45);
            backText.setScale(0.95);
        });
        this.input.on('pointerup', function(pointer){
            backArrow.setScale(0.5);
            backText.setScale(1);
        });

        //Enabled Thumbnails
        groupThumbLevels = this.add.group();
        arrayKeyThumb = ['thumbLevel1', 'thumbLevel2', 'thumbLevel3', 'thumbLevel4', 'thumbLevel5', 'thumbLevel6', 'thumbLevel7', 'thumbLevel8', 'thumbLevel9'];
        groupThumbLevels.createMultiple({
            key: arrayKeyThumb,
            gridAlign: { width: 3, height: 3, cellWidth: 250, cellHeight: 175, x: 162, y: 235 }
        });
        gameObjectButtonsList = groupThumbLevels.getChildren();
        
        //Disabled Thumbnails
        groupGrayThumb = this.add.group();
        arrayGroupGrayThumb = ['grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail'];
        groupGrayThumb.createMultiple({
            key: arrayGroupGrayThumb,
            setAlpha: {value: 0.5},
            gridAlign: { width: 3, height: 3, cellWidth: 250, cellHeight: 175, x: 162, y: 235 }
        });
        gameGrayObjectButtonsList = groupGrayThumb.getChildren();

        //Animation when selecting a level
        for (let i = 0; i < gameObjectButtonsList.length; i++) {
            gameObjectButtonsList[i].on('pointerdown', function (pointer) {
                gameObjectButtonsList[i].setScale(.95);
                gameObjectButtonsList[i].setTint(0xAAAAAA);
            });
            this.input.on('pointerup', function (pointer) {
                gameObjectButtonsList[i].setScale(1.0);
                gameObjectButtonsList[i].clearTint();
            });
        }

        //Initial situation
        gameObjectButtonsList[0].setInteractive();
        gameGrayObjectButtonsList[0].setVisible(false);
        activeMap[0] = 1;

        //Make all maps clickable until current map
        if(currentLevel != null){
            if(currentLevel == 9){
                currentLevel -= 1;
            }
            activeMap[currentLevel] = 1;
            for(let i = 0; i <= activeMap.length; i++){
                if(activeMap[i] == 1){
                    gameObjectButtonsList[i].setInteractive();
                    gameGrayObjectButtonsList[i].setVisible(false);
                } 
            }
        }
        
        //Start next scene
        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            for (let i = 0; i < gameObjectButtonsList.length; i++) {
                if (gameObject == gameObjectButtonsList[i]) {
                    this.scene.start('Maze', {map: allMaps[i], mapNumber: arrayKeyThumb[i] });
                }
            }
            if (gameObject == backArrow || gameObject == backText) {
                this.scene.start('Tutorial');
            }
        }, this);
    }
}

