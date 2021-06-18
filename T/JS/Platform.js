class Platform extends Phaser.Scene{
    constructor(){
        super("Platform");
    }

        // FONCTION DE CHARGEMENT D'ASSETS --------------------------------------------------

    preload(){
        //Map
        this.load.image('Tiles', 'plan large.png');
        this.load.tilemapTiledJSON('Map', 'blackice.json');
        
        //Vie
        this.load.image('barre_de_vie_3hp', 'assets/barre_de_vie_3hp.png');
        this.load.image('barre_de_vie_2hp', 'assets/barre_de_vie_2hp.png');
        this.load.image('barre_de_vie_1hp', 'assets/barre_de_vie_1hp.png');

        this.load.image('game_over', 'assets/game_overV2.png');

        //Personnage
        this.load.spritesheet('dude', 'assets/spritesheet_perso.png', { frameWidth: 30, frameHeight: 45});


    } // FIN PRELOAD
    

    create(){
        
        // CREATION DE LA MAP   
        let Map = this.make.tilemap({ key: 'Map' });
        let Tileset = Map.addTilesetImage('plan large', 'Tiles');

        this.sol = Map.createStaticLayer('Calque 1', Tileset, 0, 0).setDepth(-1);
        this.piques = Map.createStaticLayer('Piques', Tileset, 0, 0).setDepth(0);
        
        // CREATION VARIABLE TOUCHES 
        this.cursors = this.input.keyboard.createCursorKeys();


        // CREATION PLAYER
        const spawnPoint = Map.findObject("Objects", obj => obj.name === "Spawn Point");
		this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude').setDepth(1);
        this.player.setCollideWorldBounds(true);
        
        // AJOUT COLLIDER ENTRE JOUEUR ET OBJETS DE LA MAP
        this.physics.add.collider(this.player, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.player, this.piques, this.death, null, this);
        this.piques.setCollisionByProperty({mortal:true});
        
        // AJOUT DES COLLIDERS 
        

        // AJOUT DE LA CONDITION DE CONNEXION D'UNE MANETTE 
        this.paddleConnected=false;

        this.input.gamepad.once('connected', function (pad) {
            this.paddleConnected = true;
            this.paddle = pad;
            });
        
        // CREATION ANIMATION JOUEUR
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 10 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'face',
            frames: this.anims.generateFrameNumbers('dude', { start: 15, end: 22 }),
            frameRate: 10,
        });
        
        this.anims.create({
            key: 'dos',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 14 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'reste_right',
            frames: [ {key: 'dude', frame: 12}],
        });

        this.anims.create({
            key: 'reste_left',
            frames: [{key: 'dude', frame: 10}],
        });

        this.anims.create({
            key: 'reste_face',
            frames: [{key: 'dude', frame: 15}],
        }); 

        this.anims.create({
            key: 'reste_dos',
            frames: [{key: 'dude', frame: 7}],
        });

        // AJOUT CAMERA 
        
        this.cameras.main.startFollow(this.player)
		this.cameras.main.setBounds(0,0,this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
		this.player.setCollideWorldBounds(true);

    } // FIN CREATE  
    
    // FONCTION UPDATE --------------------------------------------------

    update(){
        
        // CONTROLES CLAVIER ET MANETTE
        
            let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){   //Si une manette est connecté
            pad = this.input.gamepad.getPad(0);  //pad récupère les inputs du joueur
        }
        
    if (this.cursors.left.isDown || pad.left)
    {
        this.player.direction = 'left';
        this.player.setVelocityX(-300);
        this.player.anims.play('left', true);
        
    }
    else if (this.cursors.right.isDown || pad.right)
    {
        
        this.player.direction = 'right';
        this.player.setVelocityX(300);
        this.player.anims.play('right', true);

    }
    else
    {
        
        this.player.setVelocityX(0);
        
        if(this.player.direction == 'left'){
            this.player.anims.play('reste_left', true);
        }
        
        else if (this.player.direction == 'right'){
            this.player.anims.play('reste_right', true);
        }
  
    }
    
    if(this.cursors.up.isDown || pad.up)
    {
        this.player.direction = 'up';    
        this.player.setVelocityY(-300);
        this.player.anims.play('dos', true);
    
    }
    
        
    else if (this.cursors.down.isDown || pad.down)
    {
        
        this.player.direction = 'down';
        this.player.setVelocityY(300);
        this.player.anims.play('face', true);
    }
        
    else
    {
        
        this.player.setVelocityY(0);
        if (this.player.direction == 'up'){
            this.player.anims.play('reste_dos', true);
        }
        
        else if (this.player.direction == 'down'){
            this.player.anims.play('reste_face', true);
        } 
        
    }
      
        // UPDATE DE LA VIE AVEC CHANGEMENT VISIBLE DE CETTE DERNIERE
        
    if (vie == 3){
       this.hp.setTexture("barre_de_vie_3hp");
        
    }
    else if (vie == 2){
        this.hp.setTexture("barre_de_vie_2hp" );
        
    }
    
    else if (vie == 1){
        this.hp.setTexture("barre_de_vie_1hp");
    }
    
    else if (vie == 0){
        this.add.image(640, 360, 'game_over').setScrollFactor(0);
    }
        
        
    } // FIN UPDATE
    
    // AUTRES FONCTIONS 
    
    death(){
        this.player.setTint(0xff0000);
        this.physics.pause();
        this.gameOver = true;
    }
}