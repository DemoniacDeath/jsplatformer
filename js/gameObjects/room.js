define(function(require){
  var GameObject = require('./gameObject');
  var Solid = require('./solid');
  var Rect = require('../rect');
  var Room = function(parent, frame, width, damageVelocityThreshold, damageVelocityMultiplier){
    GameObject.call(this, parent, frame);

    this.width = width;
    this.ceiling = new Solid(this, new Rect(
        0,
        -this.frame.height / 2 + this.width / 2,
        this.frame.width,
        this.width), damageVelocityThreshold, damageVelocityMultiplier);
    this.wallLeft = new Solid(this, new Rect(
        -this.frame.width / 2 + this.width / 2,
        0,
        this.width,
        this.frame.height - this.width * 2), damageVelocityThreshold, damageVelocityMultiplier);
    this.wallRight = new Solid(this, new Rect(
        this.frame.width / 2 - this.width / 2,
        0,
        this.width,
        this.frame.height - this.width * 2), damageVelocityThreshold, damageVelocityMultiplier);
    this.floor = new Solid(this, new Rect(
        0,
        this.frame.height / 2 - this.width / 2,
        this.frame.width,
        this.width), damageVelocityThreshold, damageVelocityMultiplier);
  };

  Room.prototype = Object.create(GameObject.prototype);
  Room.prototype.constructor = Room;
  Room.prototype.super = GameObject.prototype;
  return Room;
});
