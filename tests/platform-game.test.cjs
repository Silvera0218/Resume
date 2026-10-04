const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('dist/platform-game.js','utf8');
function fixture(width,loaded=false) {
  let reading=false,nextId=1;const pending=new Map(),events={};
  let draws=0;
  const draw=new Proxy({drawImage(image,sx,sy,sw,sh,x,y,w,h){
    assert.ok(image.complete&&image.naturalWidth,'Rendering only uses ready images');
    assert.ok(sx>=0&&sy>=0&&sx+sw<=(image.src.includes('courier-motion')?1536:1448)&&sy+sh<=(image.src.includes('courier-motion')?1024:1086),'Crop stays inside the atlas');
    assert.ok(Math.abs(sw/sh-w/h)<.00001,'Sprites preserve their original aspect ratio');draws++;
  }}, {get:(target,key)=>target[key]||(()=>{}),set:(target,key,value)=>(target[key]=value,true)});
  function element(){return {dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},listeners:{},addEventListener(name,fn){this.listeners[name]=fn},setAttribute(){},focus(){},setPointerCapture(){}};}
  const elements={'platform-game':element()};
  const canvas=elements['platform-game'];Object.assign(canvas,{clientWidth:width,clientHeight:180,getContext:()=>draw});
  const reduced={matches:false,addEventListener(name,fn){events.reduceChange=fn}};
  const context={window:{STICKER_ATLAS:{url:'./assets/desktop-stickers-v2.png'},WORLD_ATLAS:{url:'./assets/world-stickers.png'}},Image:class{get complete(){return typeof loaded==='function'?loaded(this.src||''):loaded}get naturalWidth(){return this.complete?1448:0}addEventListener(){}},document:{body:element(),hidden:false,querySelector:s=>s==='dialog[open]'?(reading?{}:null):elements[s.slice(1)],querySelectorAll:()=>[],addEventListener(name,fn){events[name]=fn}},matchMedia:()=>reduced,MutationObserver:class{observe(){}},ResizeObserver:class{observe(){}},requestAnimationFrame:fn=>{const id=nextId++;pending.set(id,fn);return id},cancelAnimationFrame:id=>pending.delete(id),addEventListener:(name,fn)=>events[name]=fn};
  vm.runInNewContext(fs.readFileSync('dist/sticker-atlas.js','utf8'),context);
  vm.runInNewContext(fs.readFileSync('dist/world-atlas.js','utf8'),context);
  vm.runInNewContext(fs.readFileSync('dist/courier-atlas.js','utf8'),context);
  vm.runInNewContext(source,context);
  const states=new Set(),poses=new Set(),terrains=new Set(),enemyKinds=new Set(),feet=new Set();let time=0;
  return {get draws(){return draws},canvas,elements,pending,states,poses,terrains,enemyKinds,feet,
    key(options={}){let prevented=false;events.keydown({code:'KeyW',target:{},preventDefault(){prevented=true},...options});return prevented;},
    run(seconds){for(let n=0;n<seconds*60;n++){time+=1000/60;const callbacks=[...pending.values()];pending.clear();callbacks.forEach(fn=>fn(time));states.add(canvas.dataset.state);poses.add(canvas.dataset.pose);terrains.add(canvas.dataset.terrain);canvas.dataset.enemyKinds.split(',').forEach(k=>enemyKinds.add(k));if(canvas.dataset.grounded==='true')feet.add(canvas.dataset.feet);assert.ok(pending.size<=1,'Only one animation loop may run');}},read(value){reading=value;events['portfolio-view-change']();},motion(value){reduced.matches=value;events.reduceChange();},hidden(value){context.document.hidden=value;events.visibilitychange();},fx(value){context.document.body.classList.contains=()=>value;events['portfolio-view-change']();}};
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
  assert.ok(['steps','crystals','cloud','mushrooms','stump','rest'].every(t=>game.terrains.has(t)),'All terrain encounters are visited');
  assert.ok(game.feet.size>=4,'Raised terrain changes actual landing height');
  assert.ok(['slime','snail','mushroom'].every(k=>game.enemyKinds.has(k)),'All enemy families spawn');
  assert.ok(Number(game.canvas.dataset.stomps)>0,'Descending contact can defeat an enemy');
  assert.equal(Number(game.canvas.dataset.hits),0,'Autopilot clears hazards and enemies without side hits');
}
console.log('Runner: 10-minute mobile/desktop runs, six terrain patterns, raised landings, three enemy families, stomps, bounded world and pause behavior passed.');

const input=fixture(390);input.run(.1);
assert.equal(input.key(),true,'W is consumed while the desktop game is running');
assert.equal(input.canvas.dataset.manualJumps,'1','W launches immediately from the ground');
assert.equal(input.canvas.dataset.pose,'leap');
input.key();input.run(.15);assert.equal(input.canvas.dataset.manualJumps,'1','W cannot double-jump in midair');
for(const options of [{repeat:true},{isComposing:true},{ctrlKey:true},{metaKey:true},{altKey:true},{code:'Space'},{target:{isContentEditable:true}},{target:{closest:()=>({tagName:'INPUT'})}}])assert.equal(input.key(options),false,'Typing, repeated keys and shortcuts are untouched');
for(const pause of ['read','motion','hidden','fx']){input[pause](true);assert.equal(input.key(),false,`W is ignored during ${pause}`);input[pause](false);}
// A press just before landing is buffered, but a stale press during pause is discarded.
const buffered=fixture(390);buffered.run(.1);buffered.key();buffered.run(.74);buffered.key();buffered.run(.15);
assert.equal(buffered.canvas.dataset.manualJumps,'2','Landing consumes the short W input buffer');
const paused=fixture(390);paused.run(.1);paused.key();paused.run(.74);paused.key();paused.read(true);paused.read(false);paused.run(.15);
assert.equal(paused.canvas.dataset.manualJumps,'1','Closing a reading window does not replay a stale buffered press');
console.log('W: immediate jump, short landing buffer, no air jump/repeat, editable/modifier/IME exclusions, and pause guards passed.');

const textured=fixture(390,true);textured.run(32);assert.ok(textured.draws>0,'Loaded texture rendering is exercised across every terrain and enemy');

const partial=fixture(390,src=>!src.includes('desktop-stickers'));partial.run(12);assert.ok(partial.draws>0,'World-first loading keeps unavailable terrain caps on their fallback');
