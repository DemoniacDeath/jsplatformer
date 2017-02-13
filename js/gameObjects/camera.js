define(function(require){
  var GameObject = require('./gameObject');
  var Camera = function(parent, frame){
    GameObject.call(this, parent, frame);

    this.originalSize = {width: frame.width, height: frame.height};
  };

  Camera.prototype = Object.create(GameObject.prototype);
  Camera.prototype.constructor = Camera;
  Camera.prototype.super = GameObject.prototype;

  Camera.prototype.setSize = function(size){
    this.originalSize = size;
    this.frame.setSize(size);
  };

  Camera.prototype.handleKeyboardState = function(keys) {
    if (keys['KeyZ'])
    {
      this.frame.width = this.originalSize.width * 2;
      this.frame.height = this.originalSize.height * 2;
    }
    else
    {
      this.frame.width = this.originalSize.width;
      this.frame.height = this.originalSize.height;
    }
  };
  return Camera;
});
