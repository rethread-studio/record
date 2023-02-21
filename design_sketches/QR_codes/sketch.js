let qr_img;
let margin = 50;
let shadow_offset = 4;

let myFont;

let neon_green = "#69ff00";
let dark_green = "#147600";
let neon_pink = "#E80985";
let dark_pink = "#7c0087";

function preload() {
  let el = document.getElementsByTagName("img")[0];
  let url = el.src;
  qr_img = loadImage(url);
  el.remove();
}

function setup() {
  createCanvas(qr_img.width+2*margin, qr_img.width+2*margin);
  pixelDensity(4);
  //background(255);
  //image(qr_img, margin, margin);
  noStroke();
  noLoop();
}

function draw() {
  
  let n = 33;
  let s = qr_img.width/n;
  
  for (let i = 0; i < n; i++) {
    let x = i*s;
    for (let j = 0; j < n; j++) {
      if ((i < 7 && j < 7) || (i < 7 && j > n-8) || (i > n-8 && j < 7)) continue;
      let y = j*s;
      let col = qr_img.get(x+s/2, y+s/2)[0];
      if (col < 10) {
        let leftCorners = s, rightCorners = s;
        if (i > 0) {
          let colLeft = qr_img.get(x-s/2, y+s/2)[0];
          if (colLeft < 10) leftCorners = 0;
        }
        if (i < n-1) {
          let colRight = qr_img.get(x+3*s/2, y+s/2)[0];
          if (colRight < 10) rightCorners = 0;
        }
        
        fill(dark_green);
        rect(x+margin+shadow_offset, y+margin+shadow_offset, s+1, s-2, leftCorners, rightCorners, rightCorners, leftCorners);
        fill(neon_green);
        rect(x+margin, y+margin, s+1, s-2, leftCorners, rightCorners, rightCorners, leftCorners);
      }
    }
  }
  
  for (let [x0, y0] of [[0, 0], [(n-7)*s, 0], [0, (n-7)*s]]) {
    let offset = shadow_offset;
    for (let c of [dark_green, neon_green]) {
      fill(c);
      rect(x0+margin+offset, y0+margin+offset, 7*s, s, s);
      rect(x0+margin+offset, y0+margin+offset, s, 7*s, s);
      rect(x0+margin+offset, y0+margin+6*s+offset, 7*s, s, s);
      rect(x0+margin+6*s+offset, y0+margin+offset, s, 7*s, s);
      rect(x0+margin+2*s+offset, y0+margin+2*s+offset, 3*s, 3*s, s/2);
      offset = 0;
    }
  }
}