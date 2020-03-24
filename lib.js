class Pen {
  constructor(ctx, origin = { x: 0, y: canvas.height }) {
    this.ctx = ctx;
    this.global = true;

    this.state = {
      origin: origin,
      originMain: origin,
      center: { x: 0, y: 0 },
      angle: 0,
      strokeWeight: 1,
      isFill: false,
      isStroke: true,
      strokeColor: "black",
      fillColor: "black",
      rectMode: "top",
      translation: { x: 0, y: 0 }
    };

    this.stateList = [this.state];
  }

  getxy(x, y) {
    let x_, y_;
    x_ = x + this.state.origin.x;
    y_ = this.state.origin.y - y;
    return { x: x_, y: y_ };
  }

  push() {
    this.ctx.save();
    this.pState = Object.assign({}, this.state);
    let origin = Object.assign({}, this.state.origin);
    this.pState.origin = origin;
    this.stateList.push(this.pState);
  }

  pop() {
    this.ctx.restore();
    this.state = Object.assign({}, this.stateList[this.stateList.length - 1]);
    this.stateList.push(this.state);
  }

  noFill() {
    this.state.isFill = false;
  }

  fill(color = this.state.fillColor) {
    this.state.fillColor = color;
    this.state.isFill = true;
  }

  noStroke() {
    this.state.isStroke = false;
  }

  stroke(color = this.state.strokeColor) {
    this.state.strokeColor = color;
    this.state.isStroke = true;
  }

  setStrokeWeight(weight) {
    this.state.strokeWeight = weight;
  }

  changeRectMode(mode) {
    this.state.rectMode = mode;
  }

  translate(x, y) {
    let pos = this.getxy(x, y);
    this.ctx.translate(pos.x, pos.y);
    this.state.origin = { x: 0, y: 0 };
    this.state.originMain = { x: pos.x, y: pos.y };
    this.state.translation = { x: pos.x, y: pos.y };
  }

  rotate(angle, x = 0, y = 0) {
    this.state.center = { x: 0, y: 0 };
    this.state.angle = angle;

    this.translate(x, y);
    this.ctx.rotate(radian(-angle));
    this.translate(-x, -y);
  }

  clear() {
    let topLeft = {
      x: -this.state.originMain.x,
      y: this.ctx.canvas.height - this.state.originMain.y
    };
    let pos = this.getxy(topLeft.x, topLeft.y);
    this.ctx.clearRect(
      pos.x,
      pos.y,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }

  trail(alpha = 0.5) {
    this.push();
    this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
    console.log(this.ctx.fillStyle);
    let topLeft = {
      x: -this.state.originMain.x,
      y: this.ctx.canvas.height - this.state.originMain.y
    };
    let pos = this.getxy(topLeft.x, topLeft.y);
    this.ctx.fillRect(
      pos.x,
      pos.y,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    this.pop();
  }

  line(x1, y1, x2, y2) {
    let pos1 = this.getxy(x1, y1);
    let pos2 = this.getxy(x2, y2);

    this.ctx.beginPath();
    this.ctx.moveTo(pos1.x, pos1.y);
    this.ctx.lineTo(pos2.x, pos2.y);
    this.ctx.strokeStyle = this.state.strokeColor;
    this.ctx.lineWidth = this.state.strokeWeight;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  path(vectors) {
    let pos = [];
    for (let i = 0; i < vectors.length; i++) {
      pos.push(this.getxy(vectors[i].x, vectors[i].y));
    }
    this.ctx.beginPath();
    this.ctx.moveTo(pos[0].x, pos[0].y);
    for (let i = 1; i < pos.length; i++) {
      this.ctx.lineTo(pos[i].x, pos[i].y);
    }
    this.ctx.strokeStyle = this.state.strokeColor;
    this.ctx.lineWidth = this.state.strokeWeight;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  rect(x, y, w, h) {
    if (this.state.rectMode == "top") {
      var pos = this.getxy(x, y);
    } else if (this.state.rectMode == "center") {
      x = x - w / 2;
      y = y + h / 2;
      var pos = this.getxy(x, y);
    }

    if (this.state.isFill) {
      this.ctx.fillStyle = this.state.fillColor;
      this.ctx.fillRect(pos.x, pos.y, w, h);
    }
    if (this.state.isStroke) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.state.strokeColor;
      this.ctx.lineWidth = this.state.strokeWeight;
      this.ctx.strokeRect(pos.x, pos.y, w, h);
    }
    this.ctx.closePath();
  }

  circle(x, y, r) {
    let pos = this.getxy(x, y);
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    this.ctx.closePath();

    if (this.state.isFill) {
      this.ctx.fillStyle = this.state.fillColor;
      this.ctx.fill();
    }
    if (this.state.isStroke) {
      this.ctx.strokeStyle = this.state.strokeColor;
      this.ctx.lineWidth = this.state.strokeWeight;
      this.ctx.stroke();
    }
  }

  arc(x, y, r, start, end) {
    start = -radian(start);
    end = -radian(end);
    let pos = this.getxy(x, y);
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, r, start, end, true);

    if (this.state.isFill) {
      this.ctx.fillStyle = this.state.fillColor;
      this.ctx.fill();
    }

    if (this.state.isStroke) {
      this.ctx.strokeStyle = this.state.strokeColor;
      this.ctx.lineWidth = this.state.strokeWeight;
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  sector(x, y, r, start, end) {
    start = -radian(start);
    end = -radian(end);
    let pos = vgetxy(x, y);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
    this.ctx.arc(pos.x, pos.y, r, start, end, true);
    this.ctx.closePath();

    if (this.state.isFill) {
      this.ctx.fillStyle = this.state.fillColor;
      this.ctx.fill();
    }

    if (this.state.isStroke) {
      this.ctx.strokeStyle = this.state.strokeColor;
      this.ctx.lineWidth = this.sstate.trokeWeight;
      this.ctx.stroke();
    }
  }

  segment(x, y, r, start, end) {
    start = -radian(start);
    end = -radian(end);
    let pos = this.getxy(x, y);
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, r, start, end, true);
    this.ctx.closePath();

    if (this.state.isFill) {
      this.ctx.fillStyle = this.state.fillColor;
      this.ctx.fill();
    }

    if (this.state.isStroke) {
      this.ctx.strokeStyle = this.state.strokeColor;
      this.ctx.lineWidth = this.state.strokeWeight;
      this.ctx.stroke();
    }
  }

  ellipse(x, y, a, b) {}

  triangle(x1, y1, x2, y2, x3, y3) {
    let pos1 = this.getxy(x1, y1);
    let pos2 = this.getxy(x2, y2);
    let pos3 = this.getxy(x3, y3);

    this.ctx.beginPath();
    this.ctx.moveTo(pos1.x, pos1.y);
    this.ctx.lineTo(pos2.x, pos2.y);
    this.ctx.lineTo(pos3.x, pos3.y);
    this.ctx.closePath();

    if (this.state.isFill) {
      this.ctx.fillStyle = this.state.fillColor;
      this.ctx.fill();
    }

    if (this.state.isStroke) {
      this.ctx.strokeStyle = this.state.strokeColor;
      this.ctx.lineWidth = this.state.strokeWeight;
      this.ctx.stroke();
    }
  }

  trace(dr, path) {
    let i, dist;
    let newPath = [path[0]];
    dist = 0;

    for (i = 0; i < path.length - 1; i++) {
      dist += path[i].dist(path[i + 1]);
      if (dist < dr) {
        newPath.push(path[i + 1]);
      } else {
        dist -= path[i].dist(path[i + 1]);
        break;
      }
    }
    if (path.length != newPath.length) {
      let v = path[i].dir(path[i + 1]).setMag(dr - dist);
      v.add(path[i]);
      newPath.push(v);
    }
    this.path(newPath);
  }
}

// some utiluty functions
// idependent of any class

function degree(rad) {
  return (180 / Math.PI) * rad;
}

function radian(deg) {
  return (Math.PI / 180.0) * deg;
}

function random(a = -1, b = 1) {
  return a + Math.random() * (b - a);
}
