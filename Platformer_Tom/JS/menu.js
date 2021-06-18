class Menu extends Phaser.Scene {
    constructor() {
        super('menu')
    }

    preload()
	{
		
        this.load.image('playbutton', './assets/adventure.png')
        this.load.image('menu', './assets/menu.png')
        this.load.image('options', './assets/options.png')
        this.load.image('exit', './assets/exit.png')
        this.load.image('touche', './assets/touche.png')
        this.load.image('chargement', './assets/chargement.png')
	}

    create() { //creating the menu screen

        //create images (z order)

        this.add.image(0, 0, 'menu').setOrigin(0).setDepth(0);

        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.6, 'playbutton').setDepth(1);
        let options = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.3, 'options').setDepth(1);
        let exit = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.1, 'exit').setDepth(1);
        this.image = this.add.image(1730,940,'chargement').setDepth(3).setVisible(false);

        //let commandButton = this.add.image(this.game.renderer.width -100 , this.game.renderer.height * 0.10, 'commandesbutton').setDepth(1).setScale(0.7);

        


        /* 
            PointerEvents:
                pointerover - hovering
                pointerout - not hovering
                pointerup - click and release
                pointerdown - just click
        */

        playButton.setInteractive();

        playButton.on("pointerup", () => {
            this.add.image(0,0,'touche').setOrigin(0).setDepth(2);
            this.image.setVisible(true)
            this.time.addEvent({delay: 3500, callback: function(){const cam = this.cameras.main;

                cam.fade(250, 0, 0, 0);
    
                cam.once("camerafadeoutcomplete", () => {
                    this.scene.start('Platform')
                });}, callbackScope: this});
            
            
        })

        options.setInteractive();

        options.on("pointerup", () => {
            this.scene.start('boss');
        })
        
        exit.setInteractive();

        exit.on("pointerup", () => {
           this.scene.remove()
        })

        //commandButton.setInteractive();

        //commandButton.on("pointerup", () => {
            //UNTRUC
            
        //})

    }

    update(){
        this.image.rotation += 0.05;
    }
}