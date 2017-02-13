//TODO: fix ALL the collision glitches
define(function(require){
  var Vector = require('./vector');
  var Rect = require('./rect');
  var Renderer = require('./renderer');
  var RenderObject = require('./renderObject');
  var Animation = require('./animation');
  var PhysicsState = require('./physicsState');
  var GameObject = require('./gameObjects/gameObject');
  var Camera = require('./gameObjects/camera');
  var Player = require('./gameObjects/player');
  var Solid = require('./gameObjects/solid');
  var Room = require('./gameObjects/room');
  var Consumable = require('./gameObjects/consumable');
  var UIElement = require('./gameObjects/ui/ui.element');
  var UIBar = require('./gameObjects/ui/ui.bar');
  var UIText = require('./gameObjects/ui/ui.text');
  return function(gameCanvas, uiCanvas, resources){
    const gridSquareSize = 40;
    const gravityForce = 33 * gridSquareSize;
    const itemChance = 0.16;
    const worldWidth = 40;
    const worldHeight = 30;
    const damageVelocityThreshold = 22.5 * gridSquareSize;
    const damageVelocityMultiplier = 0.4 / gridSquareSize;
    const speed = 7.8 * gridSquareSize;
    const jumpSpeed = 15 * gridSquareSize;
    const consumablePowerSpeedBoost = 0.06 * gridSquareSize;
    const consumablePowerJumpSpeedBoost = 0.06 * gridSquareSize;

    PhysicsState.gravityForce = gravityForce;

    this.resources = resources;
    this.gameCanvas = gameCanvas;
    this.uiCanvas = uiCanvas;
    this.renderer = new Renderer(gameCanvas);
    this.uiRenderer = new Renderer(uiCanvas);
    this.gameTimerDelay = 15;
    this.gameTimerInterval = null;
    this.keyboardState = {};
    this.lastTick = 0;
    this.world = new GameObject(null, new Rect(0, 0, worldWidth * gridSquareSize, worldHeight * gridSquareSize));
    this.camera = new Camera(this.world, new Rect(0, 0, this.renderer.size.width, this.renderer.size.height));
    this.ui = new UIElement(null, new Rect(0, 0, this.renderer.size.width, this.renderer.size.height));

    this.createWorld = function(){
      var player = new Player(this.world, new Rect(
        0,
        this.world.frame.height/4,
        gridSquareSize,
        2*gridSquareSize));
      player.speed = speed;
      player.jumpSpeed = jumpSpeed;
      player.idleAnimation = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.idle));
      player.moveAnimationRight = Animation.withSpeedAndImage(1/15, this.resources.move, 40, 80, 6);
      player.moveAnimationLeft = Animation.withSpeedAndImage(1/15, this.resources.move_l, 40, 80, 6);
      player.moveAnimation = player.moveAnimationRight;
      player.jumpAnimation = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.jump));
      player.crouchAnimationRight = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch));
      player.crouchAnimationLeft = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch_l));
      player.crouchAnimation = player.crouchAnimationRight;
      player.crouchMoveAnimationRight = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch));
      player.crouchMoveAnimationLeft = Animation.withSingleRenderObject(RenderObject.fromImage(this.resources.crouch_l));
      player.crouchMoveAnimation = player.crouchMoveAnimationRight;
      player.animation = player.idleAnimation;
      player.addChild(this.camera);

      var room = new Room(this.world, new Rect(0, 0, this.world.frame.width, this.world.frame.height), gridSquareSize, damageVelocityThreshold, damageVelocityMultiplier);
      room.ceiling.renderObject = RenderObject.fromColor('#000');
      room.wallLeft.renderObject = RenderObject.fromColor('#000');
      room.wallRight.renderObject = RenderObject.fromColor('#000');
      room.floor.renderObject = RenderObject.fromColor('#000');

      var count = ~~(worldWidth * worldHeight * itemChance);
      // var count = 0;
      var powerCount = ~~(count/2);
      player.maxPower = powerCount;
      var x = worldWidth - 2;
      var y = worldHeight - 2;
      var rndX, rndY;
      var takenX = [];
      var takenY = [];
      for (var i = 0; i < count; i++)
      {
        var taken = false;
        do {
          taken = false;
          rndX = rand(0, x - 1);
          rndY = rand(0, y - 1);
          for (var j = 0; j <= i; j++)
          {
            if (rndX == takenX[j] && rndY == takenY[j])
            {
              taken = true;
              break;
            }
          }
        } while(taken);

        takenX[i] = rndX;
        takenY[i] = rndY;

        var rect = new Rect(
          this.world.frame.width / 2 - gridSquareSize * 1.5 - rndX * gridSquareSize,
          this.world.frame.height / 2 - gridSquareSize * 1.5 - rndY * gridSquareSize,
          gridSquareSize,
          gridSquareSize);

        var gameObject;
        if (powerCount > 0)
        {
          gameObject = new Consumable(this.world, rect, consumablePowerSpeedBoost, consumablePowerJumpSpeedBoost);
          gameObject.renderObject = RenderObject.fromColor('#0f0');
          powerCount--;
        }
        else
        {
          gameObject = new Solid(this.world, rect, damageVelocityThreshold, damageVelocityMultiplier);
          gameObject.renderObject = RenderObject.fromImage(this.resources.brick);
        }
      }

      // var l = 20;
      // for (var i = 0; i < l; i++){
      //   var rect = new Rect(
      //     -this.world.frame.width / 2 + (l+0.5-i) * gridSquareSize,
      //     this.world.frame.height / 2 - (i + 1.5) * gridSquareSize,
      //     gridSquareSize,
      //     gridSquareSize
      //     );
      //   var gameObject = new Solid(this.world, rect, damageVelocityThreshold, damageVelocityMultiplier);
      //   gameObject.renderObject = RenderObject.fromImage(this.resources.brick);
      // }

      // var l = worldHeight - 2;
      // l-=2;
      // for (var i = 0; i < l; i++)
      // {
      //   var rect = new Rect(
      //     -1 * gridSquareSize,
      //     (worldHeight / 2 - i - 1.5) * gridSquareSize,
      //     gridSquareSize,
      //     gridSquareSize
      //     );
      //   var gameObject = new Solid(this.world, rect, damageVelocityThreshold, damageVelocityMultiplier);
      //   gameObject.renderObject = RenderObject.fromImage(this.resources.brick);
      //   rect = new Rect(
      //     1 * gridSquareSize,
      //     (-worldHeight / 2 + i + 1.5) * gridSquareSize,
      //     gridSquareSize,
      //     gridSquareSize
      //     );
      //   gameObject = new Solid(this.world, rect, damageVelocityThreshold, damageVelocityMultiplier);
      //   gameObject.renderObject = RenderObject.fromImage(this.resources.brick);
      // }

      this.deathText = new UIText(this.ui, new Rect(0, 0, 0, 60), "You died! Game over!", '#f00', "48px monospace");
      this.deathText.visible = false;

      this.winText = new UIText(this.ui, new Rect(0, 0, 0, 60), "Congratulations! You won!", '#0f0', "48px monospace");
      this.winText.visible = false;

      this.healthBarHolder = new UIElement(this.ui, new Rect(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10,
        120, 12));
      this.healthBarHolder.renderObject = RenderObject.fromColor('#000');

      this.healthBar = new UIBar(this.ui, new Rect(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10,
        116, 8));
      this.healthBar.renderObject = RenderObject.fromColor('#f00');
      this.healthBar.setValue(100);

      this.powerBarHolder = new UIElement(this.ui, new Rect(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10,
        120, 12));
      this.powerBarHolder.renderObject = RenderObject.fromColor('#000');

      this.powerBar = new UIBar(this.ui, new Rect(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10,
        116, 9));
      this.powerBar.renderObject = RenderObject.fromColor('#0f0');
      this.powerBar.setValue(0);

      player.deathText = this.deathText;
      player.winText = this.winText;
      player.healthBar = this.healthBar;
      player.powerBar = this.powerBar;
    };

    this.run = function(){
      this.createWorld();
      this.lastTick = Date.now();
      this.gameTimerTick = this.gameTimerTick.bind(this);
      this.gameTimerTick();
    };

    this.gameTimerTick = function(){
      var ticks = Date.now();
      var dt = (ticks - this.lastTick) / 1000;
      dt = (dt > 0.02) ? 0.02 : dt;//prevent some freaky glitches with running out of the walls
      this.lastTick = ticks;

      this.world.animate(Animation.getTicks());

      this.renderer.clear();
      this.world.render(this.renderer, this.world.frame.getCenter(), this.camera.getGlobalPosition(), this.camera.frame.getSize());

      this.uiRenderer.clear();
      this.ui.render(this.uiRenderer, this.ui.frame.getCenter(), Vector.zero(), this.camera.originalSize);

      this.world.handleKeyboardState(this.keyboardState, dt)
        .processPhysics(dt)
        .detectCollisions(dt)
      ;

      requestAnimFrame(this.gameTimerTick.bind(this));
    };

    this.keyDown = function(e){
      this.keyboardState[e.code] = true;
      this.world.keyDown(e.code);
    };

    this.keyUp = function(e){
      delete this.keyboardState[e.code];
    };

    this.resize = function(){
      this.renderer.size = {width: this.gameCanvas.width, height: this.gameCanvas.height};
      this.uiRenderer.size = {width: this.uiCanvas.width, height: this.uiCanvas.height};
      this.camera.setSize(this.renderer.size);
      this.ui.frame.setSize(this.renderer.size);
      var healthBarNewCenter = new Vector(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10);
      var powerBarNewCenter = new Vector(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10);
      this.healthBar.frame.setCenter(healthBarNewCenter);
      this.healthBarHolder.frame.setCenter(healthBarNewCenter);
      this.healthBar.resetOriginalFrame(new Rect(
        -this.renderer.size.width / 2 + 64,
        -this.renderer.size.height / 2 + 10,
        116, 8));
      this.healthBar.setValue(this.healthBar.getValue());
      this.powerBar.frame.setCenter(powerBarNewCenter);
      this.powerBarHolder.frame.setCenter(powerBarNewCenter);
      this.powerBar.resetOriginalFrame(new Rect(
        this.renderer.size.width / 2 - 64,
        -this.renderer.size.height / 2 + 10,
        116, 8));
      this.powerBar.setValue(this.powerBar.getValue());
    };

    this.debugRuler = function(x,y,l,text){
      var ruler = new GameObject(this.world, new Rect(x+l/2,y,l,1));
      ruler.renderObject = RenderObject.fromColor('#0f0');
      if (text)
        var label = new UIText(ruler, new Rect(l, 0, 0, 6), text, '#0f0', "6px monospace");
    };
  };
});

