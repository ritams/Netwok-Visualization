class Vertex {
  constructor(pos) {
    this.pos = pos;

    this.r = 5;
    this.m = 10;
    this.color = "rgb(255, 0, 200)";
    this.vel = new V2d();
    this.acc = new V2d();
    this.dt = 0.1;
    this.adjv = [];
    this.locked = false;
    this.degree = 0;
  }

  setRadius(r) {
    this.r = r;
  }

  setMass(m) {
    this.m = m;
  }

  setColor(c) {
    this.color = c;
  }

  setDt() {
    this.dt = dt;
  }

  move() {
    this.pos.add(this.vel.mul(this.dt));
    this.vel.add(this.acc.mul(this.dt));
    this.acc.mul(0);
  }

  attract() {
    let x0 = 40;
    if (this.connected) {
      for (let i = 0; i < this.adjv.length; i++) {
        let dr = this.pos.dist(this.adjv[i].pos);
        let acc = this.pos.dir(this.adjv[i].pos).mul((dr - x0) * 4);
        this.acc.add(acc);
      }
    }
  }

  draw(pen) {
    pen.push();
    pen.noStroke();
    pen.fill(this.color);

    let r = map(this.degree, 0, 20, 10, 20);
    pen.circle(this.pos.x, this.pos.y, r);

    pen.pop();
  }
}

class Edge {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
    this.v1.connected = true;
    this.v2.connected = true;
    this.v1.degree++;
    this.v2.degree++;
    this.v1.adjv.push(v2);
    this.v2.adjv.push(v1);
  }

  draw(pen) {
    pen.stroke("blue");
    pen.setStrokeWeight(3);
    pen.line(this.v1.pos.x, this.v1.pos.y, this.v2.pos.x, this.v2.pos.y);
  }
}

class Graph {
  constructor(vertexList = [], edgeList = []) {
    this.vertexList = vertexList;
    this.edgeList = edgeList;
    this.adjMat = [];
  }

  draw(pen) {
    for (let vertex of this.vertexList) {
      vertex.draw(pen);
    }
    for (let edge of this.edgeList) {
      edge.draw(pen);
    }
  }

  // createAdjMat(){
  //   for
  // }

  animation() {}

  static randomGraph(
    vertexNo,
    edgeNo,
    width = canvas.width,
    height = canvas.height
  ) {
    let vertexList = [];
    let edgeList = [];

    for (let i = 0; i < vertexNo; i++) {
      let pos = new V2d(random(0, width), random(0, height));
      vertexList.push(new Vertex(pos));
    }

    let i, j;
    for (let k = 0; k < edgeNo; k++) {
      i = randint(0, vertexNo);
      j = randint(0, vertexNo);
      while (j == i) {
        j = randint(0, vertexNo);
      }
      edgeList.push(new Edge(vertexList[i], vertexList[j]));
    }

    let G = new Graph(vertexList, edgeList);
    return G;
  }

  static cycle(vertexNo, width = canvas.width, height = canvas.height) {
    let vertexList = [];
    let edgeList = [];

    for (let i = 0; i < vertexNo; i++) {
      let pos = new V2d(random(0, width), random(0, height));
      vertexList.push(new Vertex(pos));
    }

    for (let i = 0; i < vertexNo - 1; i++) {
      edgeList.push(new Edge(vertexList[i], vertexList[i + 1]));
    }
    edgeList.push(new Edge(vertexList[vertexNo - 1], vertexList[0]));

    let G = new Graph(vertexList, edgeList);
    return G;
  }

  static path(vertexNo, width = canvas.width, height = canvas.height) {
    let vertexList = [];
    let edgeList = [];

    for (let i = 0; i < vertexNo; i++) {
      let pos = new V2d(random(0, width), random(0, height));
      vertexList.push(new Vertex(pos));
    }

    for (let i = 0; i < vertexNo - 1; i++) {
      edgeList.push(new Edge(vertexList[i], vertexList[i + 1]));
    }

    let G = new Graph(vertexList, edgeList);
    return G;
  }
}

function repeal(vertexList) {
  for (let i = 0; i < vertexList.length - 1; i++) {
    for (let j = i + 1; j < vertexList.length; j++) {
      let dr = vertexList[i].pos.dist(vertexList[j].pos);
      let acc = vertexList[i].pos.dir(vertexList[j].pos).div((0.005 * dr) ** 2);
      vertexList[j].acc.add(acc);
      vertexList[i].acc.sub(acc);
    }
  }
}
