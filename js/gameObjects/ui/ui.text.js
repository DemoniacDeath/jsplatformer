define(function(require){
  var UIElement = require('./ui.element');
  var Renderer = require('../../renderer');
  var RenderObject = require('../../renderObject');
  var UIText = function(parent, frame, text, color, font){
    UIElement.call(this, parent, frame);

    this.text = text;
    this.color = color;
    this.font = font;
    this.createRenderObject();
  };

  UIText.prototype = Object.create(UIElement.prototype);
  UIText.prototype.constructor = UIText;
  UIText.prototype.super = UIElement.prototype;

  UIText.prototype.createRenderObject = function(){
    var texture = Renderer.createTexture(1, this.frame.height);
    var ctx = texture.getContext("2d");
    ctx.font = this.font;
    texture.width = ctx.measureText(this.text).width;
    this.frame.width = texture.width;
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(this.text, 0, 0);
    this.renderObject = new RenderObject(texture);
  };
  return UIText;
});
