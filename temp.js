let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let ctx = canvas.getContext("2d");

let origin = { x: 0, y: canvas.height };
let pen = new Pen(ctx, origin);

let vertexList = [];
for (let i = 0; i < 100; i++) {
  let pos = new V2d(
    random(100, canvas.width - 100),
    random(100, canvas.height - 100)
  );
  vertexList.push(new Vertex(pos));
}

let e = data.edges;
let edgeList = [];
for (let i = 0; i < e.length; i++) {
  edgeList.push(new Edge(vertexList[e[i][0]], vertexList[e[i][1]]));
}

window.name = "ritam";

// let edgeList = [];
// for (let i = 0; i < vertexList.length - 1; i++) {
//   for (let j = i + 1; j < vertexList.length; j++) {
//     edgeList.push(new Edge(vertexList[i], vertexList[j]));
//   }
// }
// edgeList.push(new Edge(vertexList[vertexList.length - 1], vertexList[0]));

// let G = Graph.randomGraph(30, 50);
// let vertexList = G.vertexList;
// let edgeList = G.edgeList;
// for (let i = 0; i < edgeList.length; i++) {
//   edgeList[i].draw(pen);
// }

// let G = Graph.randomGraph(20, 50, 1000, 700);
// pen.stroke("black");
// pen.setStrokeWeight(1);
// pen.noFill();
// G.draw(pen);

var mouse = new V2d();

window.addEventListener("mousemove", function(event) {
  let pos = pen.getxy(event.x, event.y);
  mouse = new V2d(pos.x, pos.y);
});

window.addEventListener("click", function() {
  for (let i = 0; i < vertexList.length; i++) {
    if (mouse.dist(vertexList[i].pos) < 10) {
      vertexList[i].locked = !vertexList[i].locked;
    }
  }
});

let img = new Image();
img.src = "man2.png";

let v1 = new V2d();
let v2 = new V2d(100, 100);
let count = 0;
let rnd = randint(0, 100);
let v = vertexList[rnd];

function animate() {
  window.requestAnimationFrame(animate);
  pen.clear();

  for (let i = 0; i < edgeList.length; i++) {
    edgeList[i].draw(pen);
  }
  repeal(vertexList);
  for (let i = 0; i < vertexList.length; i++) {
    vertexList[i].attract();
  }

  for (let i = 0; i < vertexList.length; i++) {
    if (vertexList[i].locked) {
      vertexList[i].pos = mouse;
      vertexList[i].acc.mul(0);
    } else {
      vertexList[i].move();
    }

    vertexList[i].draw(pen);
  }
  if (count % 4 == 0) {
    let n = v.adjv.length;
    v = v.adjv[randint(0, n)];
    count = 0;
  }
  let pos = v.pos;
  let temp = V2d.sub(pos, new V2d(10, -16));
  pen.image(img, temp, 20, 32);

  count++;
}

animate();
