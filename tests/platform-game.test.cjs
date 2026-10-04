const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('dist/platform-game.js','utf8');
function fixture(width,loaded=false) {
  let reading=false,nextId=1;const pending=new Map(),events={};
  let draws=0;
  const draw=new Proxy({drawImage(image,sx,sy,sw,sh,x,y,w,h){
    assert.ok(sx>=0&&sy>=0&&sx+sw<=(image.src.includes('courier-motion')?1536:1448)&&sy+sh<=(image.src.includes('courier-motion')?1024:1086),'Crop stays inside the atlas');
    assert.ok(Math.abs(sw/sh-w/h)<.00001,'Sprites preserve their original aspect ratio');draws++;
  }}, {get:(target,key)=>target[key]||(()=>{}),set:(target,key,value)=>(target[key]=value,true)});
  function element(){return {dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},listeners:{},addEventListener(name,fn){this.listeners[name]=fn},setAttribute(){},focus(){},setPointerCapture(){}};}
  const elements={'platform-game':element()};
  const canvas=elements['platform-game'];Object.assign(canvas,{clientWidth:width,clientHeight:180,getContext:()=>draw});
  const reduced={matches:false,addEventListener(name,fn){events.reduceChange=fn}};
  const context={window:{STICKER_ATLAS:{url:'./assets/desktop-stickers-v2.png'},WORLD_ATLAS:{url:'./assets/world-stickers.png'}},Image:class{complete=loaded;naturalWidth=loaded?1448:0;addEventListener(){}},document:{body:element(),hidden:false,querySelector:s=>s==='dialog[open]'?(reading?{}:null):elements[s.slice(1)],querySelectorAll:()=>[],addEventListener(name,fn){events[name]=fn}},matchMedia:()=>reduced,MutationObserver:class{observe(){}},ResizeObserver:class{observe(){}},requestAnimationFrame:fn=>{const id=nextId++;pending.set(id,fn);return id},cancelAnimationFrame:id=>pending.delete(id),addEventListener:(name,fn)=>events[name]=fn};
  vm.runInNewContext(fs.readFileSync('dist/sticker-atlas.js','utf8'),context);
  vm.runInNewContext(fs.readFileSync('dist/world-atlas.js','utf8'),context);
  vm.runInNewContext(fs.readFileSync('dist/courier-atlas.js','utf8'),context);
  vm.runInNewContext(source,context);
  const states=new Set(),poses=new Set();let time=0;
  return {get draws(){return draws},canvas,elements,pending,states,poses,run(seconds){for(let n=0;n<seconds*60;n++){time+=1000/60;const callbacks=[...pending.values()];pending.clear();callbacks.forEach(fn=>fn(time));states.add(canvas.dataset.state);poses.add(canvas.dataset.pose);assert.ok(pending.size<=1,'Only one animation loop may run');}},read(value){reading=value;events['portfolio-view-change']();},motion(value){reduced.matches=value;events.reduceChange();},hidden(value){context.document.hidden=value;events.visibilitychange();}};
}
for(const width of [390,1324]) {
  const game=fixture(width);game.run(42);
  const before=Number(game.canvas.dataset.distance);game.run(558);
  assert.ok(Number(game.canvas.dataset.distance)>before+60000,'Endless run keeps moving beyond the old finish');
  assert.ok(Number(game.canvas.dataset.chunks)<=10,'Old chunks and their collected items are recycled');
  assert.ok(Number(game.canvas.dataset.localX)<11000,'World coordinates are rebased');
  assert.equal(Number(game.canvas.dataset.recoveries),0,'Generated gaps and obstacles are traversable without recovery');
  assert.ok(Number(game.canvas.dataset.pickups)>100,'Rewards are actually collected');
  assert.ok(Number(game.canvas.dataset.landings)>100,'Landing feedback follows real contact');
  assert.ok(game.poses.has('land')&&game.poses.has('leap')&&game.poses.has('run3'),'Animation visits run, jump and landing poses');
  assert.ok(Number(game.canvas.dataset.milestones)>0,'Landmarks are crossed');
  assert.deepEqual([...game.states],['running'],`No finish or reset at width ${width}`);
  game.read(true);assert.equal(game.canvas.dataset.state,'paused');assert.equal(game.pending.size,0);
  game.read(false);assert.equal(game.canvas.dataset.state,'running');
  game.motion(true);assert.equal(game.pending.size,0);assert.equal(game.canvas.dataset.state,'paused');
  game.motion(false);assert.equal(game.canvas.dataset.state,'running');
  game.hidden(true);assert.equal(game.pending.size,0);game.hidden(false);assert.equal(game.pending.size,1);
  assert.equal(game.canvas.listeners.keydown,undefined,'Ambient scene has no keyboard controls');
}
console.log('Ambient platform scene: 10-minute endless run, bounded chunks, coordinate rebasing, single loop, reading/reduced-motion/background pause and no controls passed.');

const textured=fixture(390,true);textured.run(2);assert.ok(textured.draws>0,'Loaded texture rendering is exercised');
