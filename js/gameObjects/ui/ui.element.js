define(function(require){
  var GameObject = require('../gameObject');
  var UIElement = function(parent, frame){
    GameObject.call(this, parent, frame);
  };

  UIElement.prototype = Object.create(GameObject.prototype);
  UIElement.prototype.constructor = UIElement;
  UIElement.prototype.super = UIElement.prototype;
  return UIElement;
});
