let allMaps = [];
let mapsNotLoaded = true;

class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelector' });
    }

    preload() {

        for(let i= 1; i<10;i++) {
            this.load.image('thumbLevel' + i, 'assets/LevelSelector/thumbLevel'+i +'.png' );
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

        let groupThumbLevels = this.add.group();
        let arrayKeyThumb = ['thumbLevel1', 'thumbLevel2', 'thumbLevel3', 'thumbLevel4', 'thumbLevel5', 'thumbLevel6', 'thumbLevel7', 'thumbLevel8', 'thumbLevel9'];
        
        groupThumbLevels.createMultiple({
            key: arrayKeyThumb,
            setXY: { x: 200, y: 200 },
            gridAlign: { width: 3, height: 3, cellWidth: 250, cellHeight: 175, x: 162, y: 235 }
        });
        let gameObjectButtonsList = groupThumbLevels.getChildren();
        for(let i= 0; i<gameObjectButtonsList.length;i++) {
            let tint = gameObjectButtonsList[i].tintTopLeft;
            gameObjectButtonsList[i].on('pointerdown', function(pointer) {
                gameObjectButtonsList[i].setScale(.95);
                gameObjectButtonsList[i].tint = tint - 4000000;
            });
            this.input.on('pointerup', function(pointer) {
                gameObjectButtonsList[i].setScale(1.0);
                gameObjectButtonsList[i].tint = gameObjectButtonsList[i].tint
            })
        }
        this.input.setHitArea(gameObjectButtonsList);

        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            for(let i = 0; i< gameObjectButtonsList.length; i++) {
                if(gameObject == gameObjectButtonsList[i]) {
                    this.scene.start('Maze', {map: allMaps[i]});
                    this.scene.launch('MazeHud');
                }
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
