let canvas;

const MENU = 'menu';
const PLAYING = 'playing';
const FINISHED = 'finished';

class Button{

constructor(args, caller){

    let id = args.id || 0;
    let txt = args.txt || '';
    let txtSize = args.txtSize || 20;
    let pos = args.pos || {x:0,y:0};
    let size = args.size || {x:10,y:10};
    let shape = args.shape || rect;
    let tcolor = args.tcolor || {r:255,g:255,b:255}
    let scolor = args.color || {r:0,g:0,b:0};
    let callback = args.callback || function(){};
    
    rectMode(CENTER);
    fill(scolor.r,scolor.g,scolor.b);
    shape(pos.x,pos.y,size.x,size.y);
    
    fill(tcolor.r,tcolor.g,tcolor.b);
    textAlign(CENTER);
    textSize(txtSize);
    text(txt,pos.x,pos.y);
    if(mouseX > pos.x - size.x/2 && mouseX < pos.x+size.x/2){
      if(mouseY > pos.y - size.y/2 && mouseY < pos.y+size.y/2){
        if(mouseIsPressed){
          callback(id, caller);
        }
      }
    }
  }
}

class Game{
  constructor(){
    this.current_mode = MENU;
    this.modes = {
      [MENU] : this.menu,
      [PLAYING] : this.playing,
      [FINISHED] : this.finished
    }
  }
  menu(self){
    new Button({txt:'Start',
                size:{x:width*0.2,y:height*0.1},
                callback: function(id, caller){
                  self.start();
                }, 
                color:{r:3, g:169, b:252},
                pos: {x:width/2,y:height/2}
               },self);
  }
  playing(self){
    
    
  }
  finished(self){
    
  }
  start(){
    if(this.current_mode == MENU || this.current_mode == FINISHED){
      this.current_mode = PLAYING;
    }
  }
  stop(){
    
  }
  check(){
    
  }
  run_mode(mode){
    this.modes[mode](this);
  }
  
  loop(){
    this.check();
    this.run_mode(this.current_mode);
  }
  
}

let game = new Game();

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
  game.loop();
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

