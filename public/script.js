let canvas;
let modes = {
  'start':start,
  'playing':playing,
  'ended':ended
}
let mode = 'start';

function start(){
  // console.log('Start');
}
function playing(){
  // console.log('Playing');
}
function ended(){
  // console.log('Ended');
}


function setup(){
  let c_size = 0;
  if(windowWidth>windowHeight){
    c_size = windowHeight/2;
  }else{
    c_size = windowWidth/2;
  }
  canvas = createCanvas(c_size, c_size);
  canvas.parent('canvas_holder');
}

function draw(){
  background(51);
  modes[mode]();
}

function windowResized(){
  let c_size = 0;
  if(windowWidth>windowHeight){
    c_size = windowHeight/2;
  }else{
    c_size = windowWidth/2;
  }
  resizeCanvas(c_size, c_size);
}