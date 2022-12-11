let canvas;
let monoSynth;

const COMP = 'computer';
const PLAYER = 'player';
const MENU = 'menu';
const PLAYING = 'playing';
const FINISHED = 'finished';

const palette = {
  480: {
    BACKGROUND: "#343631",
    BTN: "#366a82",
    CLICK: "#89d0ee",
    HIGHLIGHT: "#926f47",
    TEXT: "#ddf3fe",
  },
  4240:{
    BACKGROUND: "#111b1e",
    BTN: "#2f4c58",
    HIGHLIGHT: "#63a583",
    CLICK: "#6e93d6",
    TEXT: "#e4dbd9",
  },
  4567:{
    BACKGROUND: "#02315E",
    BTN: "#00457E",
    CLICK: "#2F70AF",
    HIGHLIGHT: "#806491",
    TEXT: "#B9848C",
  },
  4542:{
    BACKGROUND: "#0C151C",
    BTN: "#16354D",
    HIGHLIGHT: "#6B99C3",
    CLICK: "#D2D2D4",
    TEXT: "#E4E5EA",
  },
  4558:{
    BACKGROUND: "#513C2F",
    BTN: "#5A7A0A",
    HIGHLIGHT: "#83D350",
    CLICK: "#FAB036",
    TEXT: "#FDD48A",
  },
  4570:{
    BACKGROUND: "#212517",
    CLICK: "#DED3A6",
    HIGHLIGHT: "#759242",
    BTN: "#374709",
    TEXT: "#F2F2EF",
  },
  4564:{
    BACKGROUND: "#680003",
    CLICK: "#F5704A",
    BTN: "#BC0000",
    HIGHLIGHT: "#828D00",
    TEXT: "#EFB9AD",
  },
  4562:{
    BACKGROUND: "#2D4628",
    CLICK: "#FFA570",
    BTN: "#E83100",
    HIGHLIGHT: "#FF6933",
    TEXT: "#FAD074",
  },
  4556:{
    BACKGROUND: "#100102",
    CLICK: "#EA592A",
    BTN: "#4B1E19",
    HIGHLIGHT: "#C0587E",
    TEXT: "#FC8B5E",
  },
  328: {
    BACKGROUND: "#1f1d22",
    CLICK: "#f49b0d",
    BTN: "#554b54",
    HIGHLIGHT: "#cf5fa9",
    TEXT: "#baa6a7",
  },
  1195:{
    BACKGROUND: "#020A12",
    CLICK: "#075B7B",
    BTN: "#002E3F",
    HIGHLIGHT: "#501B2D",
    TEXT: "#F6386D",
  },
  4549:{
    BACKGROUND: "#081012",
    HIGHLIGHT: "#E0AB9A",
    BTN: "#4D8FC3",
    CLICK: "#EF8A84",
    TEXT: "#FFF3EB",
  },
}
var COLOR;
let lastClicked = 0;

const noteDict = {
  0:'C',
  1:'E',
  2:'G',
  3:'C',
  4:'E',
  5:'G',
  6:'C',
}

class Button{
  constructor(args, caller){

    let id = args.id || 0;
    let txt = args.txt || '';
    let txtSize = args.txtSize || 20;
    let pos = args.pos || {x:0,y:0};
    let size = args.size || {x:10,y:10};
    let shape = args.shape || rect;
    let tcolor = args.tcolor || color(255,255,255);
    let scolor = args.color || color(0,0,0);
    let callback = args.callback || function(){};
    
    rectMode(CENTER);
    fill(scolor);
    shape(pos.x,pos.y,size.x,size.y);
    
    fill(tcolor);
    textAlign(CENTER);
    textSize(txtSize);
    text(txt,pos.x,pos.y+Math.floor(txtSize/2)-3);
    if(mouseX > pos.x - size.x/2 && mouseX < pos.x+size.x/2){
      if(mouseY > pos.y - size.y/2 && mouseY < pos.y+size.y/2){
        if(mouseIsPressed){
          callback(id, caller, Date.now());
        }
      }
    }
  }
}

class Game{
  constructor(x, y){
    this.rows = y || 3;
    this.cols = x || 3;
    this.sq = this.cols*this.rows;
    this.score = 1;
    this.current_mode = MENU;
    this.colorMenu = false;
    this.modes = {
      [MENU] : this.menu,
      [PLAYING] : this.playing,
      [FINISHED] : this.finished
    }
    this.sequence = [];
    this.player_sequence = [];
    this.sequence_turn = COMP;
    this.onSequenceData = {
      player_completed: true,
      seq_playing: true,      
      seq_index: 0,
      seq_length: 0,
      seq_lastDisplay: 0,
      seq_holdTime: 500,
      seq_inBetweenTime: 600,
      seq_startAfterMenuTime: 300,
      seq_startAfterSequenceTime: 500,
      btn_debounce: 200,
    };
    this.button_status = [];
    for(let i=0;i<this.sq;i++){
      this.button_status.push({clicked: false, last_clicked: 0});
    }
  }
  
  menu(self){
    document.getElementById("memorize").className = "";
    document.getElementById("repeat").className = "";
    noFill();
    stroke(255);
    strokeWeight(3);
    rectMode(CENTER);
    // rect(width/2,height/2,width,height);
    strokeWeight(0.5);
    stroke(0);
    if(!self.colorMenu){
      new Button({txt:'Start',
                txtSize:width/20,
                tcolor:color(COLOR.TEXT),
                size:{x:width*0.2,y:height*0.1},
                callback: function(id, caller, timestamp){
                  if(Date.now()-lastClicked > 500){
                    userStartAudio();
                    for(let i=0;i<self.sq;i++){
                      self.button_status[i].last_clicked=timestamp-900;
                    }
                    self.onSequenceData.seq_lastDisplay = timestamp+2000;
                    self.start();
                  }
                }, 
                color:color(COLOR.BTN),
                pos: {x:width/2,y:height/2}
               },self);
    new Button({txt:'Select color',
                txtSize:width/30,
                tcolor:color(COLOR.TEXT),
                size:{x:width*0.2,y:height*0.075},
                callback: function(id, caller, timestamp){
                  self.colorMenu = true;
                }, 
                color:color(COLOR.BTN),
                pos: {x:9*width/10,y:height/20}
               },self);
    }
    else{
      let x = 0;
      let y = 0.2;
      for(let pal of Object.entries(palette)){
        let name = pal[0];
        let col = pal[1];

        fill(color(col.BACKGROUND));
        rect((0.5+x)*width/4,(0.4+y)*height/4, width*0.18,height*0.18);
        
        new Button({txt:"Select",
                    id:name,
                    txtSize:width/30,
                    tcolor:color(col.TEXT),
                    size:{x:width*0.1,y:height*0.1},
                    callback: function(id, caller, timestamp){
                      COLOR = palette[id];
                      storeItem('palette', palette[id]);
                      self.colorMenu = false;
                      self.onSequenceData.seq_lastDisplay = timestamp+500;
                    }, 
                    color:color(col.BTN),
                    pos: {x:(0.5+x)*width/4,y:(0.5+y)*height/4}
                  },self);

        fill(color(col.CLICK));
        rect((0.5+x)*width/4,(0.64+y)*height/4, width*0.1,height*0.03);

        fill(color(col.HIGHLIGHT));
        rect((0.5+x)*width/4,(0.15+y)*height/4, width*0.1,height*0.03);
        
        fill(255,255,255);
        textSize(width/40);
        text("Highlight",(0.5+x)*width/4,(0.18+y)*height/4);
        
        
        x++;
        if(x>4){
          x = 0;
          y++;
        }
      }
    }
  }

  click(x, y){
    let xidx;
    let yidx;
    
    if(x>=0 && y>=0){
      this.button_status[(y*this.rows)+x].last_clicked=Date.now();
      xidx = x;
      yidx = y;
    }else if (x>=0){
      this.button_status[x].last_clicked=Date.now();
      xidx = x%this.cols;
      yidx = Math.floor(x/this.rows);
    }
    let note = noteDict[xidx]+''+(5-yidx);
    let velocity = 0.3/(3-yidx);
    let time = 0;
    let dur = 1/3;
        
    monoSynth.play(note, velocity, time, dur);
    
  }
  
  playing_sequence(self){
    if(document.getElementById("repeat").className == "highlight-container"){
      if(Date.now() - self.onSequenceData.seq_lastDisplay > self.onSequenceData.seq_startAfterMenuTime){
        document.getElementById("memorize").className = "highlight-container";
        document.getElementById("repeat").className = "";
      }
    }else{
      document.getElementById("memorize").className = "highlight-container";
      document.getElementById("repeat").className = "";
    }
    if(self.onSequenceData.player_completed){
      self.sequence.push(getRandomInt(self.sq));
      self.onSequenceData.seq_length++;
      self.onSequenceData.player_completed = false;
    }
    self.onSequenceData.seq_playing = true;
    let idx = self.onSequenceData.seq_index;
    let len = self.onSequenceData.seq_length;
    let last = self.onSequenceData.seq_lastDisplay;
    let delay = self.onSequenceData.seq_holdTime;
    let playTime = self.onSequenceData.seq_inBetweenTime;
    if(Date.now() - last > playTime){
      if(len-1 >= idx){
        this.click(self.sequence[idx]);
        self.onSequenceData.seq_index++;
        self.onSequenceData.seq_lastDisplay = Date.now();
      }else{
        self.sequence_turn = PLAYER;
      }
    }
  }
  
  playing_player(self){
    document.getElementById("memorize").className = "";
    document.getElementById("repeat").className = "highlight-container";
    if(!areEqual(this.sequence, this.player_sequence)){
      this.stop();
    }else{
      if(exactlyEqual(this.sequence, this.player_sequence)){
        self.sequence_turn = COMP;
        self.onSequenceData.player_completed = true;
        self.onSequenceData.seq_index = 0;
        self.player_sequence = [];
        self.onSequenceData.seq_lastDisplay = Date.now()+self.onSequenceData.seq_startAfterSequenceTime;
        self.score++;
      }
    }
    if(this.player_sequence.length > this.sequence.length){
      this.stop();
    }
    this.onSequenceData.seq_playing = false;
  }
  
  playing(self){
    switch(self.sequence_turn){
      case COMP:
        self.playing_sequence(self);
        break;
      case PLAYER:
        self.playing_player(self);
        break;
      default:
        break;
    }
    for(let i=0;i<self.sq;i++){
      let indx = i%self.cols;
      let indy = Math.floor(i/self.rows);

      if (Date.now() - self.button_status[i].last_clicked > self.onSequenceData.seq_holdTime){
        self.button_status[i].clicked = false;
      }else{
        self.button_status[i].clicked = true;
      }

      let c = color(COLOR.BTN);
      if(self.button_status[i].clicked){
        c = color(COLOR.CLICK);
      }
      
      new Button({
                id: i,
                size:{x:(width/self.cols)-(width/(100*self.cols)),y:(height/self.rows)-(height/(100*self.rows))},
                tcolor:color(COLOR.TEXT),
                callback: function(id, caller, timestamp){
                  if(!self.onSequenceData.seq_playing){
                    if(!self.button_status[i].clicked){
                      if(timestamp - self.button_status[i].last_clicked > self.onSequenceData.btn_debounce){
                        self.button_status[i].last_clicked = timestamp;
                        self.onSequenceData.seq_lastDisplay = timestamp;
                        self.button_status[i].clicked = true;
                        self.player_sequence.push(id);

                        
                        let note = noteDict[indx]+''+(5-indy);
                        let velocity = 0.3/(3-indy);
                        let time = 0;
                        let dur = 1/3;
                            
                        monoSynth.play(note, velocity, time, dur);
                        
                      }
                    }
                  }
                }, 
                color: c,
                pos: {x:(0.5+indx)*width/self.cols,y:(0.5+indy)*height/self.rows}
               },self);
    }

    textAlign(CENTER);
    let txtSize = 3*width/20;
    textSize(txtSize);
    fill(color(COLOR.TEXT));
    stroke(0);
    text(self.score,width/2,(height/2)+txtSize/2);
    
  }
  
  finished(self){
    new Button({txt:'Play Again',
                txtSize:width/20,
                tcolor:color(COLOR.TEXT),
                size:{x:width*0.3,y:height*0.1},
                callback: function(id, caller, timestamp){
                  if(Date.now()-self.onSequenceData.seq_lastDisplay > 500){
                    game = new Game();
                    lastClicked = Date.now();
                  }
                }, 
                color: color(COLOR.BTN),
                pos: {x:width/2,y:height/2}
               },self);
    
    textAlign(CENTER);
    textSize(1.5*width/20);
    fill(255);
    text("Your score: "+self.score,width/2,(height/3)+15);
  }
  
  start(){
    if(this.current_mode == MENU || this.current_mode == FINISHED){
      this.current_mode = PLAYING;
    }
  }
  
  stop(){
    if(this.current_mode == PLAYING){
      this.current_mode = FINISHED;
    }
  }
    
  run_mode(mode){
    this.modes[mode](this);
  }
  
  loop(){
    this.run_mode(this.current_mode);
  }
  
}

let game = new Game(3, 3);

function setup(){
  let c_size = returnSize();
  canvas = createCanvas(c_size, c_size);
  canvas.parent('canvas_holder');

  COLOR = getItem('palette') || palette[4549];

  monoSynth = new p5.MonoSynth();
  
  document.querySelector(':root').style.setProperty('--highlight', color(COLOR.HIGHLIGHT).toString('#rrggbb'));
  document.querySelector(':root').style.setProperty('--background', color(COLOR.BACKGROUND).toString('#rrggbb'));
}

function draw(){
  background(color(COLOR.BACKGROUND));
  document.querySelector(':root').style.setProperty('--highlight', color(COLOR.HIGHLIGHT).toString('#rrggbb'));
  document.querySelector(':root').style.setProperty('--background', color(COLOR.BACKGROUND).toString('#rrggbb'));
  game.loop();
}

function windowResized(){
  let c_size = returnSize();
  resizeCanvas(c_size, c_size);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function areEqual(array1, array2) {
  if(array1.length >= array2.length){
    for(let i=0;i<array2.length;i++){
      if(array1[i] != array2[i]){
        return false;
      }
    }
  }
  return true;
}

function exactlyEqual(array1, array2) {
  if (array1.length === array2.length) {
    return array1.every((element, index) => {
      if (element === array2[index]) {
        return true;
      }

      return false;
    });
  }

  return false;
}

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function objRGB(obj){
  return color(obj.r,obj.g,obj.b);
}

function returnSize(){
  let scale = 1.8;
  if(isMobile()){
      scale = 1.2;
  }
  let c_size = 0;
  if(windowWidth>windowHeight){
    c_size = windowHeight/scale;
  }else{
    c_size = windowWidth/scale;
  }
  return c_size;
}
