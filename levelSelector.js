let allMaps = [];
let mapsNotLoaded = true;
let arrayGray;
let currentLevel;

class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelector' });
    }

    init(data){
        currentLevel = data.currentLevel;
    }

    preload() {

        this.load.image('backArrow', 'assets/LevelSelector/arrow.png');
        this.load.image('grayThumbnail', 'assets/LevelSelector/thumbLevelGray.png');

        for (let i = 1; i < 10; i++) {
            this.load.image('thumbLevel' + i, 'assets/LevelSelector/thumbLevel' + i + '.png');
        }

        this.load.image('backgroundLvlSelector', 'assets/LevelSelector/background.png');
        if (mapsNotLoaded) {
            for (let i = 1; i < 10; i++) {
                getMap('maps/map_' + i);
            }
            mapsNotLoaded = false;
        }
    }

    create() {
        allMaps.sort(function (a, b) {
            return a.length - b.length;
        });
        this.add.image(400, 400, 'backgroundLvlSelector');
        let backArrow = this.add.image(100, 720, 'backArrow').setScale(0.5).setFlipX(true).setInteractive();
        let backText = this.add.text(230, 720, 'Zurück', fontStyleContinueText).setOrigin(0.5).setInteractive();

        let groupThumbLevels = this.add.group();
        let arrayKeyThumb = ['thumbLevel1', 'thumbLevel2', 'thumbLevel3', 'thumbLevel4', 'thumbLevel5', 'thumbLevel6', 'thumbLevel7', 'thumbLevel8', 'thumbLevel9'];

        let groupGrayThumb = this.add.group();
        let arrayGroupGrayThumb = ['grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail','grayThumbnail'];

        groupThumbLevels.createMultiple({
            key: arrayKeyThumb,
            gridAlign: { width: 3, height: 3, cellWidth: 250, cellHeight: 175, x: 162, y: 235 }
        });

        groupGrayThumb.createMultiple({
            key: arrayGroupGrayThumb,
            setAlpha: {value: 0.5},
            gridAlign: { width: 3, height: 3, cellWidth: 250, cellHeight: 175, x: 162, y: 235 }
        });

        let gameObjectButtonsList = groupThumbLevels.getChildren();
        let gameGrayObjectButtonsList = groupGrayThumb.getChildren();

        for (let i = 0; i < gameObjectButtonsList.length; i++) {
            let tint = gameObjectButtonsList[i].tintTopLeft;
            gameObjectButtonsList[i].on('pointerdown', function (pointer) {
                gameObjectButtonsList[i].setScale(.95);
                gameObjectButtonsList[i].tint = tint - 4000000;
            });
            this.input.on('pointerup', function (pointer) {
                gameObjectButtonsList[i].setScale(1.0);
                gameObjectButtonsList[i].tint = gameObjectButtonsList[i].tint
            });
        }

        gameObjectButtonsList[0].setInteractive();
        gameGrayObjectButtonsList[0].setVisible(false);
        
        if(currentLevel != null){
            for(let i = 0; i <= parseInt(currentLevel); i++){
                gameObjectButtonsList[i].setInteractive();
                gameGrayObjectButtonsList[i].setVisible(false);
            }
        }

        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            for (let i = 0; i < gameObjectButtonsList.length; i++) {
                if (gameObject == gameObjectButtonsList[i]) {
                    this.scene.start('Maze', { map: allMaps[i], mapNumber: arrayKeyThumb[i] });
                }
            }
            if (gameObject == backArrow || gameObject == backText) {
                this.scene.start('Tutorial');
            }
        }, this);
    }
}

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

function processData(rawData) {
    let formattedData = rawData.split(/\r\n|\n/);
    let map = [];

    for (var i = 0; i < formattedData.length; i++) {
        var rowData = formattedData[i].split(',');
        var tmp = [];
        for (var j = 0; j < rowData.length; j++) {
            tmp.push(parseInt(rowData[j], 10));
        }
        map.push(tmp);
    }
    allMaps.push(map);
}
