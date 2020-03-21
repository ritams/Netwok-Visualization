var dt = 0.1;
var damping = 0.5;

class Spring {
  constructor(k) {
    this.k = k;
  }

  add_mass(m1, m2) {
    if (m2.x >= m1.x) {
      this.m1 = m1;
      this.m2 = m2;
    } else {
      this.m1 = m2;
      this.m2 = m1;
    }

    this.eq_dis = 3 * (this.m1.mass + this.m2.mass);
    this.m1.springArray.push(this);
    this.m2.springArray.push(this);
    this.update_distance();
  }

  exchange_mass() {
    if (this.m2.x < this.m1.x) {
      var temp = this.m2;
      this.m2 = this.m1;
      this.m1 = temp;
    }
  }

  update_distance() {
    var dx = this.m2.x - this.m1.x;
    var dy = this.m2.y - this.m1.y;
    var dis = Math.sqrt(dx ** 2 + dy ** 2);
    this.dis = dis;
    this.dx = dx;
    this.dy = dy;
  }

  add_acc() {
    var force = this.k * (this.dis - this.eq_dis);
    var a1 = force / this.m1.mass;
    var a2 = force / this.m2.mass;
    var ax1 = (a1 * this.dx) / this.dis;
    var ax2 = (-a2 * this.dx) / this.dis;
    if (this.dy >= 0) {
      var ay1 = (a1 * Math.abs(this.dy)) / this.dis;
      var ay2 = (-a2 * Math.abs(this.dy)) / this.dis;
    } else {
      var ay1 = (-a1 * Math.abs(this.dy)) / this.dis;
      var ay2 = (a2 * Math.abs(this.dy)) / this.dis;
    }

    this.m1.ax = ax1;
    this.m1.ay = ay1;
    this.m2.ax = ax2;
    this.m2.ay = ay2;
  }

  draw(c) {
    c.beginPath();
    c.moveTo(this.m1.x, this.m1.y);
    c.lineTo(this.m2.x, this.m2.y);
    c.strokeStyle = "grey";
    c.lineWidth = 2;
    c.stroke();
    c.closePath();
  }
}

class Mass {
  constructor(mass, x, y, radius = 10, vx = 0, vy = 0) {
    this.mass = mass;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.springArray = [];
    this.color = "black";
    this.ocupancy = 0;
    // this.radius = 10 * this.mass ** (1 / 3);
  }

  move() {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.vx += (this.ax - damping * this.vx) * dt;
    this.vy += (this.ay - damping * this.vy) * dt;

    for (var i = 0; i < this.springArray.length; i++) {
      this.springArray[i].exchange_mass();
      this.springArray[i].update_distance();
    }
  }

  draw(c, count, relative = true) {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();

    c.fillStyle = "rgba(255, 0, 0, 1)";
    if (relative) {
      var frac = this.ocupancy / count;
      var h = frac * 1000;
    } else {
      var h = this.ocupancy;
    }
    // frac = numToString(frac);
    c.fillRect(this.x + this.radius, this.y - h, 5, h);
    c.fillStyle = "black";
    c.fillText(`${frac.toFixed(3)}`, this.x, this.y - h);
    c.fillStyle = "red";
  }
}
