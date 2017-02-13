define(function(require){
  var Vector = require('./vector');
  var Rect = require('./rect');
  var Renderer = require('./renderer');
  var RenderObject = function(texture){
    this.texture = texture;
    this.cachedScaledTextures = {};
  };

  RenderObject.prototype.render = function(renderer, position, size, cameraPosition, cameraSize, noScaleCaching){
    if (!Rect.overlapArea(position.x, position.y, size.width, size.height, cameraPosition.x, cameraPosition.y, cameraSize.width, cameraSize.height))
      return;
    var renderPosition = new Vector(
      Math.round(position.x - size.width / 2 - cameraPosition.x + cameraSize.width / 2),
      Math.round(position.y - size.height / 2 - cameraPosition.y + cameraSize.height / 2)
    );
    var x = Math.round(renderer.size.width * (renderPosition.x / cameraSize.width));
    var y = Math.round(renderer.size.height * (renderPosition.y / cameraSize.height));
    var width = Math.round(renderer.size.width * (size.width / cameraSize.width));
    var height = Math.round(renderer.size.height * (size.height / cameraSize.height));
    var texture = noScaleCaching ? this.texture : this.getScaledTexture(width, height);
    renderer.drawImage(texture, x, y, width, height);
  };

  RenderObject.prototype.getScaledTexture = function(width, height){
    if (width == this.texture.width && height == this.texture.height)
      return this.texture;
    var scaleKey = width+','+height;
    if (!this.cachedScaledTextures[scaleKey]){
      this.cachedScaledTextures[scaleKey] = Renderer.cloneTexture(this.texture, width, height);
    }
    return this.cachedScaledTextures[scaleKey];
  };

  RenderObject.fromColor = function(color){
    return new RenderObject(Renderer.textureFromColor(color));
  };

  RenderObject.fromImage = function(image){
    return new RenderObject(Renderer.cloneTexture(image));
  };
  return RenderObject;
});
