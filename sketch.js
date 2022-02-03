var nuvem, nuvemimg
var chao ,chaoimg
var trex ,trex_running;
var chaoinv
var cac1, cac2, cac3, cac4, cac5, cac6
var cac
var trex_morto

var somorte
var somcheckpoint
var sompular

var caquitos
var nuvemgrupo

var estado_de_jogo = "jogando"

var pontuaçao = 0

var gameover, Fimg
var restart, ResImg

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  chaoimg = loadImage("ground2.png")
  nuvemimg = loadImage("cloud.png")
  trex_morto = loadAnimation("trex_collided.png")

  cac1 = loadImage("obstacle1.png")
  cac2 = loadImage("obstacle2.png")
  cac3 = loadImage("obstacle3.png")
  cac4 = loadImage("obstacle4.png")
  cac5 = loadImage("obstacle5.png")
  cac6 = loadImage("obstacle6.png")

  Fimg = loadImage("gameOver.png")
  ResImg = loadImage("restart.png")

  somorte = loadSound("die.mp3")
  somcheckpoint = loadSound("checkpoint.mp3")
  sompular = loadSound("jump.mp3")
}

function setup(){
  createCanvas(windowWidth, windowHeight)
  
  //crie um sprite de trex

  chao = createSprite (width/2, height-height/4, width*2, 30);
  chao.addImage("ground2",chaoimg)
  chao.x = chao.width/2

  trex = createSprite(80,400,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.7
  trex.addAnimation("esbugalhado", trex_morto);

  //trex.setCollided (0,0,circle)
  //trex.setCollider("circle", 0, 0, 20);

  trex.setCollider("rectangle", 0, 0, 20, 80, +45);

  chaoinv = createSprite(width/2, (height-height/4)+15, width, 1); //(700,420,3000,10)
  chaoinv.visible = false

  caquitos = new Group()
  nuvemgrupo = new Group()

  trex.debug = false
  //caquitos.debug = true

  gameover = createSprite(width/2, height/2, 20, 20)
  gameover.addImage("gameOver", Fimg)

  restart = createSprite(width/2, height/2+50, 10, 10)
  restart.addImage("restart", ResImg)
  restart.scale = 0.7
}

function nuvensfun(){

  if (frameCount % 80 == 0){
    nuvem = createSprite (width,height/4,50,30)
    nuvem.velocityX = -(3 + 3*pontuaçao/100)
    nuvem.addImage(nuvemimg)
    nuvem.y = Math.round (random (height/6,height/3))
    console.log(nuvem.y)
    nuvem.lifetime = 450

    nuvemgrupo.add(nuvem)
  }
}

function caquitofun(){
  if (frameCount % 80 == 0){
    cac = createSprite (width,(height-height/4)-10,10,10)
    cac.velocityX = -(5 + 3*pontuaçao/100)

    var rambo = Math.round (random (1, 6))
    console.log (rambo)

    switch (rambo){
      case 1: cac.addImage (cac1);
       break
      case 2: cac.addImage (cac2);
       break
      case 3: cac.addImage (cac3);
       cac.scale = 0.7
       break
      case 4: cac.addImage (cac4);
       cac.scale = 0.7
       break
      case 5: cac.addImage (cac5);
       cac.scale = 0.6
       break
      case 6: cac.addImage (cac6);
       cac.scale = 0.6
       break
      default: break
    }

    //cac.scale = 0.8
    cac.lifetime = 450

    caquitos.add(cac)
    cac.debug = false
  }
}

function reset (){
  pontuaçao = 0
  estado_de_jogo = "jogando"
  nuvemgrupo.destroyEach()
  caquitos.destroyEach()
  trex.changeAnimation("running", trex_running)
}

function draw(){
  background("white")
  drawSprites();

  textSize (18)
  text("Pontuação: " + pontuaçao, (width-width/8), height/8)


  if (estado_de_jogo === "jogando"){
    
    chao.velocityX = -(5 + 3*pontuaçao/100)
    nuvensfun()
    caquitofun()

    pontuaçao = pontuaçao + Math.round(getFrameRate()/60)
    
    if (pontuaçao > 0 && pontuaçao % 100 === 0) {

      somcheckpoint.play()
      console.log (pontuaçao)

    } 

    restart.visible = false
    gameover.visible = false

    if ((keyDown("space") || touches.length > 0) && trex.collide(chaoinv)){
      trex.velocityY = -10
      sompular.play()
      touches = []
    }

    if (trex.isTouching (caquitos)){
      estado_de_jogo = "final"
      somorte.play()
      //trex.velocityY = -12
    }

  }else if (estado_de_jogo == "final"){

    chao.velocityX = 0

    caquitos.setVelocityXEach(0)
    nuvemgrupo.setVelocityXEach(0)

    caquitos.setLifetimeEach (-1)
    nuvemgrupo.setLifetimeEach (-1)

    restart.visible = true
    gameover.visible = true

    trex.changeAnimation("esbugalhado", trex_morto)

    if (mousePressedOver (restart) || touches.length > 0){
      reset()
      touches = []
    }
  }

  
  trex.velocityY +=0.5

  trex.collide (chaoinv)

  //nuvem.lifetime = 70

  if (chao.x < width/4){
    chao.x = chao.width/2
  }
}