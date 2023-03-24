let originalImg, img, backCassetteLayer, frontCassetteLayer;
let s, shadow_offset;

const N_ANIM = 42; // number of frames of the animation
const N_PAUSE = 21; // number of frames of the pause between the animations
const N_FRAMES = 2*(N_ANIM + N_PAUSE); // total number of frames of 1 loop

let neon_green = "#69ff00";
let dark_green = "#147600";
let neon_pink = "#E80985";
let dark_pink = "#7C0087";

// from https://phpcoder.tech/check-if-folder-file-exists-using-javascript/
function checkFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
   
  if (xhr.status == "404") {
      return false;
  } else {
      return true;
  }
}

function preload() {
  if (checkFileExist("cassette_mask.png")) {
    originalImg = loadImage("cassette_mask.png");
  } else {
    originalImg = loadImage("design_sketches/cassette_animation/cassette_mask.png");
  }
}

function setup() {
  img = createImage(originalImg.width, originalImg.height);
  img.copy(originalImg, 0, 0, originalImg.width, originalImg.height, 0, 0, originalImg.width, originalImg.height);
  let size = min(600, windowWidth*0.9);
  img.resize(size, 0);
  let cnv = createCanvas(img.width, img.height);
  let cassetteDiv = select("#cassetteDiv");
  if (cassetteDiv) cnv.parent("cassetteDiv");
  frameRate(30);
  pixelDensity(2);
  noStroke();
  //image(img, 0, 0);
  //img.filter(INVERT);

  s = width/80;
  shadow_offset = width/200;

  backCassetteLayer = makeCassetteLayer(dark_green, shadow_offset);
  frontCassetteLayer = makeCassetteLayer(neon_green, 0);
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
  let t = frameCount%(N_ANIM+N_PAUSE)/N_ANIM;
  let x1 = width/3, x2 = width-x1, y1 = height/2, y2 = y1;
  let dMin = width/8, dMax = width/3;
  let d1 = map(sqrt(t), 0, 1, dMin, dMax), d2 = map(sq(t), 0, 1, dMax, dMin);

  let f = frameCount%N_FRAMES;
  if (f >= N_ANIM && f < N_ANIM + N_PAUSE) [d1, d2] = [dMax, dMin];
  if (f >= N_ANIM + N_PAUSE && f < 2*N_ANIM + N_PAUSE) [d1, d2] = [d2, d1];
  if (f >= 2*N_ANIM + N_PAUSE) [d1, d2] = [dMin, dMax];

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

function windowResized() {
  let size = min(600, windowWidth*0.9);
  if (size != width) {
    img = createImage(originalImg.width, originalImg.height);
    img.copy(originalImg, 0, 0, originalImg.width, originalImg.height, 0, 0, originalImg.width, originalImg.height);
    img.resize(size, 0);
    resizeCanvas(img.width, img.height);
    s = width/80;
    shadow_offset = width/200;

    backCassetteLayer.remove();
    frontCassetteLayer.remove();
    backCassetteLayer = makeCassetteLayer(dark_green, shadow_offset);
    frontCassetteLayer = makeCassetteLayer(neon_green, 0);
  }
}