class V2d {
  // by default constract a zero vector
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // some static functions
  // adds two vectors and returns the sum
  static add(v1, v2) {
    let v = new V2d();
    v.x = v1.x + v2.x;
    v.y = v1.y + v2.y;

    return v;
  }

  // subtracts v2 from v1 and returns the result
  static sub(v1, v2) {
    let v = new V2d();
    v.x = v1.x - v2.x;
    v.y = v1.y - v2.y;

    return v;
  }

  // multiplies a vector "v" with a scalar "a" and returns the result
  static mul(v, a) {
    let temp = new V2d();
    temp.x = v.x * a;
    temp.y = v.y * a;

    return temp;
  }

  // divides a vector "v" by a scalar "a" and returns the result
  static div(v, a) {
    let temp = new V2d();
    temp.x = v.x / a;
    temp.y = v.y / a;

    return temp;
  }

  static randomVector() {
    let theta = random(0, 2 * Math.PI);
    let x = Math.cos(theta),
      y = Math.sin(theta);

    return new V2d(x, y);
  }

  static draw(pen, v1, v2) {
    console.log(v1, v2);
    pen.line(v1.x, v1.y, v2.x, v2.y);
  }

  // some method on instances
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(a) {
    this.x *= a;
    this.y *= a;
    return this;
  }

  div(a) {
    this.x /= a;
    this.y /= a;
    return this;
  }

  normalize() {
    var len = this.len();
    this.div(len);
    return this;
  }

  len() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  angle() {
    var theta = Math.atan(this.y / this.x);
    if (theta >= 0) {
      if (this.y >= 0) {
        return theta;
      } else {
        return Math.PI + theta;
      }
    } else {
      if (this.y > 0) {
        return Math.PI + theta;
      } else {
        return Math.PI * 2 + theta;
      }
    }
  }

  limit(a) {
    if (this.len() > a) {
      this.normalize().mul(a);
    }
    return this;
  }

  setMag(a) {
    this.normalize().mul(a);
    return this;
  }

  dist(v) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }

  dir(v) {
    return V2d.sub(v, this).normalize();
  }
}

function map(x, x1, x2, y1, y2) {
  let x_ = x2 - x1;
  let y_ = y2 - y1;
  let factor = y_ / x_;

  return (x - x1) * factor + y1;
}
