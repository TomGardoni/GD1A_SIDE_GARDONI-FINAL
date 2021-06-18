var etatCam = false;
var compteurCam = 250;
var passe = false;
var untrucVivant = true;
class Platform extends Phaser.Scene{
    constructor(){
        super("Platform");
    }

        // FONCTION DE CHARGEMENT D'ASSETS --------------------------------------------------

    preload(){
        //Map
        this.load.image('Tiles', 'Tuiles.png');
        this.load.tilemapTiledJSON('Map', 'Map.json');
        

        //Background
        this.load.image('BG', 'assets/sky.png');
        this.load.image('para', 'assets/para.png');
        this.load.image('cache', 'assets/cache.png');

        //Vie
        this.load.image('barre_de_vie_3hp', 'assets/hp3.png');
        this.load.image('barre_de_vie_2hp', 'assets/hp2.png');
        this.load.image('barre_de_vie_1hp', 'assets/hp1.png');
        this.load.image('barre_de_vie_0hp', 'assets/hp0.png');
        this.load.image('game_over', 'assets/End.png');

        //PopUp
        this.load.image('popupcage', 'assets/popupcage.png');
        this.load.image('popupgants', 'assets/popupgants.png');
        this.load.image('popupsaut', 'assets/popupsaut.png');
        this.load.image('popupfincage', 'assets/popupfincage.png');
        this.load.image('popupcageferme', 'assets/popupcageferme.png');
        this.load.image('popupporte', 'assets/popupporte.png');

        //Personnage
        this.load.spritesheet('dude', 'assets/spritesheet_perso2.png', { frameWidth: 96, frameHeight: 119});
        this.load.image('fleche', 'assets/fleche.png');

        this.load.image('Ghost1', 'assets/fantome1.png');
        this.load.image('Ghost2', 'assets/fantome2.png');

        //ITEMS
        this.load.image('Boisson', 'assets/Boisson.png');
        this.load.image('Cage', 'assets/cage.png');
        this.load.image('Gants', 'assets/gb.png');
        this.load.image('Ressort', 'assets/djump.png');
        this.load.image('key', 'assets/cle.png');
        this.load.image('porte', 'assets/porte.png');


    } // FIN PRELOAD
    

    create(){
        this.nbcle = 0;
        this.droite = false;
        this.recuper = 0;
        this.djump = false;
        this.box = false;
        this.jumpCount = 0;
        this.test = true;
        this.testB = true;
        this.immune = true;
        this.life = 3;
        this.HITTING = false;
        this.isDead = false;
        this.dash = true;            // Si le joueur possède le dash.
        this.timerDashOn = false;    // Lance le timer du dash.
        this.timerDash = 0;          // Timer du dash.
        this.directionDash = false;  // Donne la direction vers laquelle le dash doit être fait.
        this.lessgo = true;
        this.unlocked = false;
        this.etatCam = false;
        this.compteurCam = 250;
        this.passe = false;
        this.once = true;
        this.px = false;
        this.ps = false;
        this.pp = false;
        this.pf = false;
        this.pc = false;
        this.pg = false;
        

        this.add.image(0, 0, 'BG').setOrigin(0).setDepth(-2);
        this.add.image(0, 2120, 'cache').setOrigin(0).setDepth(3);

        // CREATION DE LA MAP   
        let Map = this.make.tilemap({ key: 'Map' });
        let Tileset = Map.addTilesetImage('Tuiles', 'Tiles');

        this.sol = Map.createLayer('Calque 1', Tileset, 0, 0).setDepth(-1);
        this.para = this.add.image(2500,1700,'para').setScrollFactor(0.8,1).setDepth(-2);
        this.piques = Map.createLayer('Piques', Tileset, 0, 0).setDepth(0);
       

        // CREATION VARIABLE TOUCHES 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursorSp = this.input.keyboard.addKey('SPACE');
        this.cursorDash = this.input.keyboard.addKey('A');
        this.hp = this.add.image(1700,100,'barre_de_vie_3hp').setScrollFactor(0);


        // CREATION PLAYER
        const spawnPoint = Map.findObject("Objects", obj => obj.name === "Spawn Point");
		this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude').setDepth(0);
        this.player.setCollideWorldBounds(true);

        this.flecheBack = this.add.image(1840, 250, 'fleche').setScrollFactor(0).setDepth(3);
        this.flecheBack.setTintFill(0x000000);
        this.fleche = this.add.image(this.flecheBack.x, this.flecheBack.y, 'fleche').setScrollFactor(0).setDepth(3);

        //CREATION ITEMS
        this.key = this.physics.add.staticGroup();

        this.physics.add.overlap(this.player, this.key, this.Recup, null,this);


        const Boisson1Sp = Map.findObject("Objects", obj => obj.name === "Boisson 1");
        const Boisson2Sp = Map.findObject("Objects", obj => obj.name === "Boisson 2");
        const Boisson3Sp = Map.findObject("Objects", obj => obj.name === "Boisson 3");
        const Boisson4Sp = Map.findObject("Objects", obj => obj.name === "Boisson 4");
        const Boisson5Sp = Map.findObject("Objects", obj => obj.name === "Boisson 5");
        
        this.boisson1 = this.physics.add.staticGroup();
        this.boisson2 = this.physics.add.staticGroup();
        this.boisson3 = this.physics.add.staticGroup();
        this.boisson4 = this.physics.add.staticGroup();
        this.boisson5 = this.physics.add.staticGroup();

        this.boisson1.create(Boisson1Sp.x, Boisson1Sp.y, 'Boisson').setDepth(0);
        this.boisson2.create(Boisson2Sp.x, Boisson2Sp.y, 'Boisson').setDepth(0);
        this.boisson3.create(Boisson3Sp.x, Boisson3Sp.y, 'Boisson').setDepth(0);
        this.boisson4.create(Boisson4Sp.x, Boisson4Sp.y, 'Boisson').setDepth(0);
        this.boisson5.create(Boisson5Sp.x, Boisson5Sp.y, 'Boisson').setDepth(0);

        this.physics.add.overlap(this.player,this.boisson1,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson2,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson3,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson4,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson5,this.recoltBois,null,this)

        const Djump = Map.findObject("Objects", obj => obj.name === "Double Saut");

        this.dsaut = this.physics.add.staticGroup();
        this.dsaut.create(Djump.x, Djump.y, 'Ressort').setDepth(0);
        this.physics.add.overlap(this.player,this.dsaut,this.deblocageSaut,null,this)

        const CageSp = Map.findObject("Objects", obj => obj.name === "Cage");

        this.cage = this.physics.add.staticGroup();
        this.untruc = this.cage.create(CageSp.x, CageSp.y, 'Cage').setDepth(1);
        

        const BoxeSp = Map.findObject("Objects", obj => obj.name === "Gants de boxe");

        this.boxer = this.physics.add.staticGroup();
        this.boxer.create(BoxeSp.x, BoxeSp.y, 'Gants').setDepth(0);
        this.physics.add.overlap(this.player,this.boxer,this.Boxing,null,this)

        const FT1 = Map.findObject("Objects", obj => obj.name === "Fantome 1");
        const FT2 = Map.findObject("Objects", obj => obj.name === "Fantome 2");
        const FT3 = Map.findObject("Objects", obj => obj.name === "Fantome 3");
        const FT4 = Map.findObject("Objects", obj => obj.name === "Fantome 4");

        this.ghost1 = this.physics.add.group();
        this.ghost2 = this.physics.add.group();
        this.ghost3 = this.physics.add.group();
        this.ghost4 = this.physics.add.group();

        this.ghost1.create(FT1.x, FT1.y, 'Ghost1').setDepth(0);
        this.ghost2.create(FT2.x, FT2.y, 'Ghost2').setDepth(0);
        this.ghost3.create(FT3.x, FT3.y, 'Ghost1').setDepth(0);
        this.ghost4.create(FT4.x, FT4.y, 'Ghost2').setDepth(0);

        this.physics.add.overlap(this.player,this.ghost1,this.hit,null,this)
        this.physics.add.overlap(this.player,this.ghost2,this.hit,null,this)
        this.physics.add.overlap(this.player,this.ghost3,this.hit,null,this)
        this.physics.add.overlap(this.player,this.ghost4,this.hit,null,this)
		

        var test = this;

		this.ghost1.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-300,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
                flipX:true,
				delay: 100,
				loop: -1
			});
		})
        this.ghost2.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-200,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
				delay: 100,
				loop: -1
			});
		})
        this.ghost3.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-200,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
				delay: 100,
				loop: -1
			});
		})
        this.ghost4.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-200,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
				delay: 100,
				loop: -1
			});
		})
        
        // AJOUT COLLIDER ENTRE JOUEUR ET OBJETS DE LA MAP
        this.physics.add.collider(this.player, this.piques, this.death, null, this);
        this.piques.setCollisionByProperty({mortal:true});

        this.physics.add.collider(this.player, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost1, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost2, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost3, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost4, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.player,this.untruc, this.bonjour,null,this);

        
        
        // AJOUT DES COLLIDERS 
        

        // AJOUT DE LA CONDITION DE CONNEXION D'UNE MANETTE 
        this.paddleConnected=false;

        this.input.gamepad.once('connected', function (pad) {
            this.paddleConnected = true;
            this.paddle = pad;
            });
        
        // CREATION ANIMATION JOUEUR
       
        this.anims.create({
            key: 'dash',
            frames: [{key : 'dude', frame : 25}],
            frameRate : 10
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
            frameRate: 10,
        });

       
        this.anims.create({
            key: 'face',
            frames: this.anims.generateFrameNumbers('dude', {start: 15, end: 20}),
            frameRate: 9,
        })
       
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('dude', {start: 21, end: 25}),
            frameRate: 5,
        })

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dude', {start: 9, end: 12}),
            frameRate: 1,
        })

        this.anims.create({
            key: 'fight',
            frames: this.anims.generateFrameNumbers('dude', {start: 13, end: 14}),
            frameRate: 1,
        })
        /*
        const debugGraphics = this.add.graphics().setAlpha(0.75);

        this.sol.renderDebug(debugGraphics, {
            tileColor: null, // couleur des tuiles snas collision
            collidingTileColor: new Phaser.Display.Color(134, 243, 0, 255), // couleur des tuiles en collision
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });

        this.piques.renderDebug(debugGraphics, {
            tileColor: null, // couleur des tuiles sans collision
            collidingTileColor: new Phaser.Display.Color(243, 134, 0, 255), // couleur des tuiles en collision
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
        */
        // AJOUT CAMERA 

        this.door = this.physics.add.group({allowGravity: false,immovable: true});

        this.door.create(5259, 750, 'porte').setDepth(0).setVisible(false);
        
        this.cameras.main.startFollow(this.player)
		this.cameras.main.setBounds(0,0,Map.widthInPixels, Map.heightInPixels);
        this.physics.world.setBounds(0,0, Map.widthInPixels, Map.heightInPixels);
		this.player.setCollideWorldBounds(true);
        this.para = this.add.image(2850,2000,'para').setScrollFactor(0.1);
    } // FIN CREATE  
    
    // FONCTION UPDATE --------------------------------------------------

    update(){
        const onGround = this.player.body.blocked.down;
        const speed = 400;
        
        console.log(this.directionDash)

        // CONTROLES CLAVIER ET MANETTE
        if (this.player.body.velocity.y > 950){
            this.player.setVelocityY(950);
        }
        
        let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){   //Si une manette est connecté
            pad = this.input.gamepad.getPad(0);  //pad récupère les inputs du joueur
        }
        
        if (this.cursors.left.isDown ) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown ) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }
      
       // Dash --------------------

        if (this.cursors.left.isDown) {     
            this.directionDash = true
        }

        if (this.cursors.right.isDown) {     
            this.directionDash = false
        }

        if(this.timerFleche > 0 && this.dash == false){
            this.timerFleche--;
            console.log(this.cropValue);
            if(this.cropValue > this.flecheBack.height || this.cropValue < this.flecheBack.height){this.cropValue = this.flecheBack.height;}
            else{this.cropValue = this.timerFleche;}
            // crée un sorte de jauge pour montrer au joueur si iel peux utiliser le dash ou non
            if(this.timerFleche%2 != 0){this.fleche.setCrop(0, this.cropValue, this.flecheBack.width, this.flecheBack.height);}
        } else if(this.timerFleche <= 0 && this.timerFleche > -1){
            this.timerFleche = this.timerFleche -0.1;
            this.fleche.setTintFill(0xffffff);
        } else{
            this.fleche.clearTint();
            this.fleche.setCrop(0, 0, this.flecheBack.width, this.flecheBack.height);
        }

        if (this.dash && Phaser.Input.Keyboard.JustDown(this.cursorDash)){
            this.timerDashOn = true;
            this.dash = false;
            this.timerFleche = this.flecheBack.height-1;
            this.dashTime = this.time.addEvent({ delay: 2500, callback: function(){this.dash = true}, callbackScope: this});
            console.log ('DASH!!!!!!' + this.directionDash);
        }



        if (this.timerDashOn){

            this.timerDash += 1

            if (this.directionDash){
                this.player.setVelocityX(-1000);
            }
            else{
                this.player.setVelocityX(1000);
            }
            

            if (this.timerDash >= 20){
                this.timerDashOn = false
                this.timerDash = 0
            }
        }

        // Allow player to jump only if on ground
        if (onGround && this.cursors.up.isDown && !this.djump){
            this.player.setVelocityY(-1200);
        }
          
        if ((this.player.body.touching.down || this.jumpCount < 2) && (this.cursors.up.isDown) && this.test && this.djump) {
            this.player.setVelocityY(-1200);
            
            this.test = false;
            this.jumpCount++;

            console.log(this.jumpCount)
        }

        if (this.cursors.up.isUp){
            this.test = true ; 
        }

        if (this.cursorSp.isDown && this.box){
            this.HITTING = true;
        }

        if (this.cursorSp.isUp){
            this.HITTING = false ;
        }

        if ( this.physics.world.overlap(this.player, this.door) && this.unlocked){
            combat = true;
            
            this.scene.start('boss')
        }
          

           // Update the animation
        if (onGround) {
            
            this.jumpCount = 1
            
            //Player Running if velocityX != 0 else Player Idle
        
        if (this.cursorSp.isDown && this.box)this.player.anims.play("fight", true);
        else if (this.player.body.velocity.x !== 0) this.player.anims.play("run", true);
        else if (this.isDead){this.player.anims.play("die", true);}
        else this.player.anims.play("face", true);
        } else {
            //Stopping Animation to play a Texture for the jump
            this.player.anims.play("jump", true);
          }
    
      
        // UPDATE DE LA VIE AVEC CHANGEMENT VISIBLE DE CETTE DERNIERE
   
        if (this.life == 3){
        this.hp.setTexture("barre_de_vie_3hp");
            
        }
        else if (this.life == 2){
            this.hp.setTexture("barre_de_vie_2hp" );
            
        }
        
        else if (this.life == 1){
            this.hp.setTexture("barre_de_vie_1hp");
        
        }
        
        else if (this.life == 0){
            this.hp.setTexture("barre_de_vie_0hp");
            
        }

        if (this.recuper == 1){
            if(!this.pc){
                this.pc = this.add.image(950,200,'popupcage').setScrollFactor(0);
                this.time.addEvent({ delay: 3000, callback: function(){this.pc.destroy();}, callbackScope: this});
            }
        }
 
}
        
     // FIN UPDATE
    
    // AUTRES FONCTIONS 
    deblocageSaut(player,saut){
        saut.destroy();
        this.djump = true;
        if(!this.ps){
            this.ps = this.add.image(950,200,'popupsaut').setScrollFactor(0);
            this.time.addEvent({ delay: 3000, callback: function(){this.ps.destroy();}, callbackScope: this});
        }
    }

    Boxing(player,boxe){
        boxe.destroy();
        this.box = true;
        if(!this.pg){
            this.pg = this.add.image(950,200,'popupgants').setScrollFactor(0);
            this.time.addEvent({ delay: 3000, callback: function(){this.pg.destroy();}, callbackScope: this});
        }
    }

    recoltBois(player,boisson){
        boisson.destroy();
        this.recuper += 1;
        if (this.recuper == 5){
            if(!this.pf){
                this.pf = this.add.image(950,200,'popupfincage').setScrollFactor(0);
                this.time.addEvent({ delay: 3000, callback: function(){this.pf.destroy();}, callbackScope: this});
            }
            this.untruc.destroy();
            this.recuper = 0;

        }
    }
    hit(player,ennemy){
        if (this.HITTING){
            ennemy.destroy();
            var key = this.key.create(ennemy.x,ennemy.y,'key')
        }
        else{

            if (!this.timerDashOn){
                if (this.immune){
                    this.life -= 1;
                    this.immune = false;
                    
                    if(this.life > 0){
                        this.effect = this.time.addEvent({ delay : 200, repeat: 9, callback: function(){player.visible = !player.visible;}, callbackScope: this});
                    }
    
                    this.ImmuneFrame = this.time.addEvent({ delay : 2000, callback: function(){this.immune = true}, callbackScope: this});
    
                }
            }
            
            
            
            if(this.life == 0){
                this.isDead = true
                this.player.anims.play("die", true);
                this.physics.pause();
                const cam = this.cameras.main;
                cam.fadeOut(1000);
        

                cam.once("camerafadeoutcomplete", ()=> {
                    cam.fadeIn(3000)
                    this.add.image(960, 540, 'game_over').setScrollFactor(0).setDepth(5);
                    this.gameOver = true;
                    this.time.addEvent({delay: 3500, callback: function(){const cam = this.cameras.main;

                        cam.fade(250, 0, 0, 0);
            
                        cam.once("camerafadeoutcomplete", () => {
                            this.scene.restart();
                        });}, callbackScope: this});
            })
            }
        }

    }

    Recup(player, key)
    {
        key.destroy();
        this.nbcle++
        if(this.nbcle == 4){
            if(!this.pp){
                this.pp = this.add.image(950,200,'popupporte').setScrollFactor(0);
                this.time.addEvent({ delay: 3000, callback: function(){this.pp.destroy();}, callbackScope: this});
            }
            this.unlocked = true;
        }
    }

    bonjour(){
        if (this.once){
            if(!this.px){
                this.pix = this.add.image(950,200,'popupcageferme').setScrollFactor(0);
                this.time.addEvent({ delay: 2000, callback: function(){this.pix.destroy();}, callbackScope: this});
            }
            this.once = false
        }
        else{
            this.time.addEvent({ delay: 2000, callback: function(){this.once = true}, callbackScope: this});
            this.time.addEvent({ delay: 2000, callback: function(){this.pix.destroy();}, callbackScope: this});
        }
    }
    
    death(){
        this.isDead = true
        this.player.anims.play("die", true);
        this.physics.pause();
        const cam = this.cameras.main;
        cam.fadeOut(1000);
        

        cam.once("camerafadeoutcomplete", ()=> {

            cam.fadeIn(3000)
            this.add.image(960, 540, 'game_over').setScrollFactor(0).setDepth(5);
            this.gameOver = true;
            this.time.addEvent({delay: 3500, callback: function(){const cam = this.cameras.main;

                cam.fade(250, 0, 0, 0);
    
                cam.once("camerafadeoutcomplete", () => {
                    this.scene.restart();
                });}, callbackScope: this});
        })
        
        
    }
}
