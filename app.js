var canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var c = canvas.getContext("2d");

// function to choose random location from the canvas
function pick_location(radius) {
  var pos = {
    x: undefined,
    y: undefined
  };
  pos.x = 100 + Math.random() * (canvas.width - 200);
  pos.y = 100 + Math.random() * (canvas.height - 200);
  return pos;
}

function randint(low, high) {
  rnd = Math.floor(low + Math.random() * (high - low));
  return rnd;
}

var n = 50;
var edges = data.edges;
var x = data.x;
var y = data.y;

var G = new jsnx.Graph();
G.addEdgesFrom(edges);
var pos = {
  x: undefined,
  y: undefined
};
var massArray = [];
for (var i = 0; i < n; i++) {
  var m = G.degree(i);
  var radius = 10;
  // pos = pick_location(radius);
  pos.x = x[i];
  pos.y = y[i];
  var mass = new Mass(10, pos.x, pos.y, radius);
  massArray.push(mass);
}

var springArray = [];
for (var i = 0; i < edges.length; i++) {
  var j = edges[i][0];
  var k = edges[i][1];
  var spring = new Spring(1);
  spring.add_mass(massArray[j], massArray[k]);
  springArray.push(spring);
}

class Walker {
  constructor(pos) {
    this.pos = pos;
  }
  walk(G, massArray) {
    massArray[this.pos].color = "rgba(11, 149, 241, 0.699)";
    var nbr = G.neighbors(this.pos);
    this.pos = nbr[randint(0, nbr.length)];
    massArray[this.pos].color = "rbga(255, 0, 0, 1)";
    massArray[this.pos].ocupancy += 1;
  }
}

var mouse = {
  x: undefined,
  y: undefined
};
window.addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

var walker = new Walker(randint(0, n));

var count = 1;
var frameCount = 0;
var delay = 0;
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (delay < 0) {
    if (frameCount == 4) {
      walker.walk(G, massArray);
      frameCount = 0;
      count += 1;
    }
    for (var i = 0; i < springArray.length; i++) {
      springArray[i].add_acc();
      springArray[i].draw(c);
    }
    for (var i = 0; i < massArray.length; i++) {
      massArray[i].draw(c, count, true);
      massArray[i].move();
    }

    frameCount += 1;
  } else {
    delay -= 1;
  }
}

animate();
