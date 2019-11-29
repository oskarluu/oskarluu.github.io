let allMaps = [];
let mapsNotLoaded = true;

class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelector', active: true});
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
        let dummy = groupThumbLevels.getChildren();
        for(let i= 0; i<dummy.length;i++) {
            let tint = dummy[i].tintTopLeft;
            dummy[i].on('pointerdown', function(pointer) {
                dummy[i].setScale(.95);
                dummy[i].tint = tint - 4000000;
            });
            this.input.on('pointerup', function(pointer) {
                dummy[i].setScale(1.0);
                dummy[i].tint = dummy[i].tint
            })
        }
        this.input.setHitArea(dummy);

        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            for(let i = 0; i< dummy.length; i++) {
                if(gameObject == dummy[i]) {
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
