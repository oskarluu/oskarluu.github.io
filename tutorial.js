//Import font
let font = new FontFace('AhkioW05-Light', 'url(assets/Fonts/AhkioW05-Light.ttf)');
font.load().then(function (loaded_face) {
    document.fonts.add(loaded_face);
}).catch(function (error) {

});

//Tutorial elements
let tutorialText;
let continueArrow;
let continueText;

//Font styles
let fontStyleContinueText;
let fontStyleTutorialText;

class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    preload() {
        this.load.image('backgroundTutorial', 'assets/Tutorial/background.png');
        this.load.image('continueArrow', 'assets/Tutorial/arrow.png');

        tutorialText = 'Willkommen im Irrgarten!\nSammle zuerst alle Münzen, \ndenn dadurch öffnest du das Schloss!\n Aber kannst du auch in jedem Level den Ausgang finden?\n Denn du hast nur wenig Zeit dir das Labyrinth anzuschauen\n und der Ausgang wechselt ständig seine Position.\n \n Sei aufmerksam!'
        fontStyleContinueText = { fontFamily: 'AhkioW05-Light', fontSize: 64, stroke: '#000', strokeThickness: 10 };
        fontStyleTutorialText = { fontFamily: 'AhkioW05-Light', fontSize: 36, stroke: '#000', strokeThickness: 10 };
    }

    create() {
        this.add.image(400, 400, 'backgroundTutorial');
        this.add.text(400, 400, tutorialText, fontStyleTutorialText).setAlign('center').setOrigin(0.5);
        continueArrow = this.add.image(700, 720, 'continueArrow').setScale(0.5).setInteractive();
        continueText = this.add.text(570, 720, 'Weiter', fontStyleContinueText).setInteractive().setOrigin(0.5);

        //Animation when clicking continue
        this.input.on('pointerdown', function(pointer){
            continueArrow.setScale(0.45);
            continueText.setScale(0.95);
        });
        this.input.on('pointerup', function(pointer){
            continueArrow.setScale(0.5);
            continueText.setScale(1);
        });

        //Input
        this.input.on('gameobjectup', function (pointer, gameObject, event) {
            if (gameObject == continueArrow || gameObject == continueText) {
                this.scene.start('LevelSelector');
            }
        }, this);
    }

    update() {

    }
}