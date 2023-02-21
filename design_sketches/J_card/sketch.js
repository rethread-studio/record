let data;

function preload() {
  data = loadJSON("supercollider_stats.json");
}

let res = 6; // <- CHANGE THIS NUMBER TO CHANGE RESOLUTION (6 for 300 dpi)
let w = 293*res, h = 111*res;
let wInside = 288*res, hInside = 101*res;
let wMargin = (w-wInside)/2, hMargin = (h-hInside)/2;


function setup() {
  createCanvas(w, h);
  pixelDensity(2);
  noLoop();
  noStroke();
  //console.log(data);
}

function draw() {
  background(0);
  
  /*
  let sum = 0;
  let max = 0;
  let thresh = 10;
  let count = 0;
  for (let word of data.all_words) {
    sum += word.occurrences;
    if (word.occurrences > max) max = word.occurrences;
    if (word.occurrences > thresh) count++
  }
  */
  
  shuffle(data.all_words, true);
  
  let nw = 695, nh = 103;
  let sx = wInside/nw;
  let sy = hInside/nh;
  let gap = sy/5;
  let ix = 0, iy = 0;
  let colors = ["#147600", "#69ff00"];
  for (let i = 0; i < data.all_words.length; i++) {
    let leftCorner = sy, rightCorner = sy;
    let l = data.all_words[i].occurrences;
    fill(colors[i%colors.length]);
    while (ix + l >= nw) {
      if (ix + l > nw) rightCorner = 0;
      rect(wMargin+ix*sx, hMargin+iy*sy+gap, (nw-ix)*sx, sy-2*gap, leftCorner, rightCorner, rightCorner, leftCorner);
      l -= (nw-ix);
      ix = 0;
      iy++;
      leftCorner = 0;
      rightCorner = sy;
    }
    rect(wMargin+ix*sx, hMargin+iy*sy+gap, l*sx, sy-2*gap, leftCorner, rightCorner, rightCorner, leftCorner);
    ix += l;
  }
}