define(function(require){
  var Renderer = function(canvas){
    var canvas = canvas;
    this.context = canvas.getContext("2d");
    this.size = {width: canvas.width, height: canvas.height};
  };

  Renderer.prototype.clear = function(){
    this.context.beginPath();
    this.context.clearRect(0, 0, this.size.width, this.size.height);
  };

  Renderer.prototype.drawImage = function(texture, x, y, width, height){
    if (typeof x === 'undefined') x = 0;
    if (typeof y === 'undefined') y = 0;
    if (typeof width === 'undefined') width = texture.width;
    if (typeof height === 'undefined') height = texture.height;

    this.context.drawImage(texture, 0, 0, texture.width, texture.height, x, y, width, height);
  };

  Renderer.textureFromColor = function(color){
    var texture = Renderer.createTexture();
    var ctx = texture.getContext("2d");
    texture.width = 1;
    texture.height = 1;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return texture;
  };

  Renderer.createTexture = function(width, height){
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  Renderer.createRenderer = function(width, height){
    return new Renderer(Renderer.createTexture(width, height));
  };

  Renderer.cloneTexture = function(texture, width, height){
    if (typeof width === 'undefined') width = texture.width;
    if (typeof height === 'undefined') height = texture.height;

    var newTexture = Renderer.createTexture(width, height);
    var renderer = new Renderer(newTexture);
    renderer.drawImage(texture, 0, 0, width, height);
    return newTexture;
  };

  return Renderer;
});
