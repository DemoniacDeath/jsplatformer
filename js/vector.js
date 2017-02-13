define(function(require){
  var Vector = function(x, y){
    this.x = x;
    this.y = y;
  };

  Vector.prototype.add = function(vector){
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  Vector.prototype.multiply = function(scalar){
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };

  Vector.prototype.copy = function(){
    return new Vector(this.x, this.y);
  };

  Vector.add = function(vector, vector2){
    return vector.copy().add(vector2);
  };

  Vector.multiply = function(vector, scalar){
    return vector.copy().multiply(scalar);
  };

  Vector.zero = function(){
    return new Vector(0, 0);
  };

  return Vector;
});
