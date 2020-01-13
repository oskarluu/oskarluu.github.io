let font = new FontFace('AhkioW05-Light', 'url(assets/Fonts/AhkioW05-Light.ttf)');
font.load().then(function (loaded_face) {
    document.fonts.add(loaded_face);
}).catch(function (error) {

});

let tutorialText;
let fontStyleContinueText = { fontFamily: 'AhkioW05-Light', fontSize: 64, stroke: '#000', strokeThickness: 10 };
let fontStyleTutorialText = { fontFamily: 'AhkioW05-Light', fontSize: 36, stroke: '#000', strokeThickness: 10 };

class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    preload() {
        this.load.image('backgroundTutorial', 'assets/Tutorial/background.png');
        this.load.image('continueArrow', 'assets/Tutorial/arrow.png');

        tutorialText = 'Willkommen beim Labyrinth!\nSammel alle Münzen, denn dadurch öffnest du das Schloss!\nDann musst du nur noch das Labyrinth verlassen,\naber Achtung! Du hast nur wenige Sekunden\ndir das Labyrinth einzuprägen\nund das Schloss wechselt ständig die Position!'

    }

    create() {
        this.add.image(400, 400, 'backgroundTutorial');
        this.add.text(400, 400, tutorialText, fontStyleTutorialText).setAlign('center').setOrigin(0.5);
        let continueArrow = this.add.image(700, 720, 'continueArrow').setScale(0.5).setInteractive();
        let continueText = this.add.text(570, 720, 'Weiter', fontStyleContinueText).setInteractive().setOrigin(0.5);

        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            if (gameObject == continueArrow || gameObject == continueText) {
                this.scene.start('LevelSelector');
            }
        }, this);
    }

    update() {

    }
}