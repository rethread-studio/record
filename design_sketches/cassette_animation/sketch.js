let img, backCassetteLayer, frontCassetteLayer;
let s, shadow_offset;

const N_FRAMES = 42;

let neon_green = "#69ff00";
let dark_green = "#147600";
let neon_pink = "#E80985";
let dark_pink = "#7C0087";

function preload() {
  img = loadImage("cassette_mask.png");
}

function setup() {
  img.resize(600, 0);
  createCanvas(img.width, img.height);
  frameRate(30);
  pixelDensity(4);
  noStroke();
  //image(img, 0, 0);
  //img.filter(INVERT);

  s = width/80;
  shadow_offset = width/200;

  backCassetteLayer = makeCassetteLayer(dark_green, shadow_offset);
  frontCassetteLayer = makeCassetteLayer(neon_green, shadow_offset);
}

function draw() {
  clear();
  //background(0);

  image(backCassetteLayer, 0, 0);

  drawWheels(dark_pink, shadow_offset);
  drawWheels(neon_pink, 0);

  image(frontCassetteLayer, 0, 0);
}

function makeCassetteLayer(col, offset) {
  let grph = createGraphics(width, height);
  grph.noStroke();

  for (let x = 0; x < width; x += s) {
    for (let y = 0; y < height-s; y += s) {
      let colVal = img.get(x+s/2, y+s/2)[0];
      if (colVal < 120) {
        let leftCorners = s, rightCorners = s;
        let colLeft = img.get(x-s/2, y+s/2)[0];
        if (colLeft < 120) leftCorners = 0;
        let colRight = img.get(x+3*s/2, y+s/2)[0];
        if (colRight < 120) rightCorners = 0;
        
        grph.fill(col);
        grph.rect(x+offset, y+offset, s+1, s-2, leftCorners, rightCorners, rightCorners, leftCorners);
      }
    }
  }

  return grph;
}

function drawWheels(col, offset) {
  let t = (frameCount%N_FRAMES)/N_FRAMES;
  let x1 = width/3, x2 = width-x1, y1 = height/2, y2 = y1;
  let dMin = width/8, dMax = width/3;
  let d1 = map(t, 0, 1, dMin, dMax), d2 = map(t, 0, 1, dMax, dMin);
  if (frameCount%(2*N_FRAMES) < N_FRAMES) [d1, d2] = [d2, d1];

  for (let x = 0; x < width; x += s) {
    for (let y = 0; y < height-s; y += s) {
      let inCircle = isInCircle(x+s/2, y+s/2, x1, y1, d1/2, x2, y2, d2/2);
      if (inCircle) {
        let leftCorners = s, rightCorners = s;
        let inCircleLeft = isInCircle(x-s/2, y+s/2, x1, y1, d1/2, x2, y2, d2/2);
        if (inCircleLeft) leftCorners = 0;
        let inCircleRight = isInCircle(x+3*s/2, y+s/2, x1, y1, d1/2, x2, y2, d2/2);
        if (inCircleRight) rightCorners = 0;
        
        fill(col);
        rect(x+offset, y+offset, s+1, s-2, leftCorners, rightCorners, rightCorners, leftCorners);
      }
    }
  }
}

// return true if (x, y) is inside the circle of center (x1, y1) and radius r1 or the circle of center (x2, y2) and radius r2
function isInCircle(x, y, x1, y1, r1, x2, y2, r2) {
  return mag(x-x1, y-y1) < r1 || mag(x-x2, y-y2) < r2;
}

function keyPressed() {
    if (key === 's') {
        saveGif("cassette.gif", 2*N_FRAMES, {delay: 0, units: "frames"});
    }
    if (key == " ") {
      if (isLooping()) {
        noLoop();
      } else {
        loop();
      }
    }
}