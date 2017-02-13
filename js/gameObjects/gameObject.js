define(function(require){
  var Vector = require('../vector');
  var Rect = require('../rect');
  var GameObject = function(parent, frame){
    if (!frame)
      frame = new Rect(0, 0, 1, 1);
    this.frame = frame;
    this.parent = parent;
    this.children = [];
    this.renderObject = null;
    this.physics = null;
    this.animation = null;
    this.visible = true;
    this._removed = false;
    if (this.parent)
      this.parent.addChild(this);
  };

  GameObject.prototype.isRemoved = function(){
    return this._removed;
  };

  GameObject.prototype.remove = function(){
    this._removed = true;
    this.parent.removeChild(this);
    return this;
  };

  GameObject.prototype.addChild = function(child){
    if (child.parent != this)
      child.parent.removeChild(child);
    this.children.push(child);
    child.parent = this;
    return this;
  };

  GameObject.prototype.removeChild = function(child){
    ~(index = this.children.indexOf(child)) | this.children.splice(index, 1);
    return this;
  };

  GameObject.prototype.getGlobalPosition = function(){
    if (!this.parent)
    {
      return this.frame.getCenter();
    }
    else
    {
      var globalPosition = this.parent.getGlobalPosition();
      return new Vector(this.frame.x + globalPosition.x, this.frame.y + globalPosition.y);
    }
  };

  GameObject.prototype.animate = function(ticks){
    if (this.animation)
      this.renderObject = this.animation.animate(ticks);
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].animate(ticks);
    return this;
  };

  GameObject.prototype.render = function(renderer, localBasis, cameraPosition, cameraSize, noScaleCaching){
    if (this.visible && this.renderObject)
      this.renderObject.render(renderer, new Vector(this.frame.x + localBasis.x, this.frame.y + localBasis.y), this.frame.getSize(), cameraPosition, cameraSize, noScaleCaching);
    var newBasis = new Vector(
      localBasis.x + this.frame.x,
      localBasis.y + this.frame.y
    );
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].render(renderer, newBasis, cameraPosition, cameraSize);
    return this;
  };

  GameObject.prototype.keyDown = function(key){
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].keyDown(key);
    return this;
  };

  GameObject.prototype.handleKeyboardState = function(keys, dt){
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].handleKeyboardState(keys, dt);
    return this;
  };

  GameObject.prototype.processPhysics = function(dt){
    if (this.physics)
      this.physics.change(dt);
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++].processPhysics(dt);
    return this;
  };

  GameObject.prototype.detectCollisions = function(dt){
    var allColliders = [];
    this._collectColliders(allColliders);

    var len = allColliders.length;
    var i = 0;
    while (i < len) {
      var j = i + 1;
      while (j < len) {
        allColliders[i].physics.detectCollision(allColliders[j].physics, dt);
        ++j;
      }
      ++i;
    }
    return this;
  };

  GameObject.prototype._collectColliders = function(allColliders){
    if (this.physics)
      allColliders.push(this);
    var i = 0;
    var len = this.children.length;
    while (i < len)
      this.children[i++]._collectColliders(allColliders);
  };

  return GameObject;
});
