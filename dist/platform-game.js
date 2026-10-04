/* 全局页面下沿的原创像素平台小场景，无独立窗口和输入控件。 */
(() => {
  'use strict';
  const canvas = document.querySelector('#platform-game'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const stickerImage = new Image(); stickerImage.src = window.STICKER_ATLAS.url;
  stickerImage.addEventListener('load',()=>render());
  const worldImage = new Image(); worldImage.src = window.WORLD_ATLAS.url;
  worldImage.addEventListener('load',()=>render());
  const courierImage=new Image();courierImage.src=window.COURIER_ATLAS.url;
  courierImage.addEventListener('load',()=>render());
  if (!ctx) return;

  let chunks=[], nextChunk=0, offset=0;
  const themes=['grass','meadow','cloudLedge'];
  // Authored encounters alternate raised ground, steps, cloud ledges and rest stretches.
  const layouts=['steps','crystals','cloud','mushrooms','stump','rest'];
  function obstacles(c) {
    const x=c.start+160, y=floor-c.rise;
    switch(c.layout){
      case 'steps': return [{x,y:y-16,w:36,h:16,kind:'platform'},{x:x+36,y:y-32,w:36,h:32,kind:'platform'}];
      case 'crystals': return [{x,y:y-26,w:26,h:26,kind:'crystals',hazard:true}];
      case 'cloud': return [{x,y:y-36,w:72,h:18,kind:'cloudLedge'}];
      case 'mushrooms': return [{x,y:y-22,w:30,h:22,kind:'mushroom'},{x:x+44,y:y-30,w:30,h:30,kind:'mushroom'}];
      case 'stump': return [{x,y:y-24,w:42,h:24,kind:'platform'}];
      default: return [];
    }
  }
  function enemyBody(c) {
    const snail=c.enemyKind==='snail', hopper=c.enemyKind==='slime';
    const hop=hopper?Math.max(0,Math.sin(clock*3+c.id))*22:0;
    return {x:c.enemy+Math.sin(clock*(snail?.8:1.6)+c.id)*(snail?14:20),
      y:floor-c.rise-(snail?17:22)-hop,w:snail?26:24,h:snail?17:22,chunk:c};
  }
  function extendWorld() {
    while(!chunks.length || chunks.at(-1).end < player.x + canvas.width + 720) {
      const id=nextChunk++, start=chunks.length ? chunks.at(-1).end + [64,72,64][id%3] : 0;
      const length=[576,480,576,576,480,384][id%6];
      chunks.push({id,start,end:start+length,theme:themes[Math.floor(id/2)%3],layout:layouts[id%6],rise:[0,12,24,12,0,0][id%6],
        enemy:id%6===5?null:start+350,enemyKind:['slime','snail','mushroom'][id%3],bridge:id%4===3,
        collected:new Set(),defeated:false,passed:false});
    }
    chunks=chunks.filter(c=>c.end>camera-180);
    // Rebase the active world periodically; visual positions remain unchanged.
    if(camera>8192){const shift=chunks[0].start;offset+=shift;player.x-=shift;camera-=shift;
      for(const c of chunks){c.start-=shift;c.end-=shift;if(c.enemy!==null)c.enemy-=shift;}
      for(const p of particles)p.x-=shift;for(const p of pops)p.x-=shift;
    }
  }
  const player = {x:36,y:0,w:24,h:30,vx:0,vy:0,grounded:false,facing:1};
  let recoveries=0, landTime=0, anticipation=0, pickups=0, jumps=0, landings=0, milestones=0;
  let jumpBuffer=0, manualJumps=0, stomps=0, hits=0, invincible=0;
  let pops=[];
  let frame = 0, last = 0, accumulator = 0, clock = 0, camera = 0, floor = 0, particles = [];

  const palette = {b:'#526f8b',c:'#f2faff',d:'#a6cde9',p:'#e5afc8',e:'#354c65',s:'#a28ab7'};
  const character = [
    '...bb.....bb....','..bccb...bccb...','..bccccbbcccb...',
    '..bcccccccccb...','.bcccccccccccb..','.bcceccccceccb..',
    '.bcccccccccccb..','.bccpcccccpccb..','..bcccccccccb...',
    '...bdddddddb....','..bcccccccccb...', '..bcdcccccdcb...',
    '...bdddddddb....','....bsssssb.....','....bsb.bsb.....','...bbb...bbb....'
  ];
  function sprite(rows,x,y,size,colors) {
    rows.forEach((row,j) => [...row].forEach((color,i) => {if(colors[color]){ctx.fillStyle=colors[color];ctx.fillRect(Math.round(x)+i*size,Math.round(y)+j*size,size,size);}}));
  }
  function sticker(name,x,y,w,h) {
    const isWorld=Object.hasOwn(window.WORLD_ATLAS.sprites,name);
    const [sx,sy,sw,sh]=(isWorld?window.WORLD_ATLAS:window.STICKER_ATLAS).sprites[name];
    const scale=Math.min(w/sw,h/sh), dw=sw*scale, dh=sh*scale;
    ctx.drawImage(isWorld?worldImage:stickerImage,sx,sy,sw,sh,Math.round(x+(w-dw)/2),Math.round(y+h-dh),dw,dh);
  }
  function dimensions() {
    const oldFloor = floor;
    canvas.width = Math.max(280, Math.round(canvas.clientWidth));
    canvas.height = Math.max(208, Math.round(canvas.clientHeight));
    floor = canvas.height - 58;
    player.y += floor - oldFloor;
    ctx.imageSmoothingEnabled = false;
    render();
  }
  function reset(resume=true) {
    player.x=36; player.y=floor-player.h; player.vx=player.vy=0; player.grounded=true; player.facing=1;
    chunks=[];nextChunk=0;offset=0;clock=0;camera=0;particles=[];extendWorld();
    updateState(); render(); if(resume)sync();
  }
  function isReading() {return !!document.querySelector('dialog[open]');}
  function running() {return !document.hidden && !isReading() && !reduced.matches && !document.body.classList.contains('fx-off');}
  function updateState() {canvas.dataset.state=running()?'running':'paused';}
  function sync() {
    updateState();
    if (!running()) {cancelAnimationFrame(frame);frame=0;last=0;accumulator=0;jumpBuffer=0;render();}
    else if (!frame) {last=0;frame=requestAnimationFrame(tick);}
  }
  function jump(manual=false) {if(player.grounded){player.vy=-420;player.grounded=false;landTime=0;jumps++;if(manual)manualJumps++;dust(player.x+12,player.y+player.h);}}
  function dust(x,y){
    for(let i=0;i<4;i++)particles.push({x:x-5+i*3,y:y-2,vx:(i-2)*14,vy:-12-i*5,life:.24,color:'#f3efff'});
  }
  // Rewards trace the actual jump arc, with low pickups on the rest stretches.
  function stars(c){
    const hurdle=c.start+160;
    return [{x:c.start+78,height:c.rise+23},...[-20,16,52].map((dx,i)=>({x:hurdle+dx,height:c.rise+[75,91,42][i]})),
      {x:c.start+330,height:c.rise+66},{x:c.start+388,height:c.rise+40}];
  }
  function burst(x,y,color) {
    if(reduced.matches || document.body.classList.contains('fx-off'))return;
    for(let i=0;i<8;i++)particles.push({x,y,vx:(i%4-1.5)*42,vy:-50-(i%3)*20,life:.45,color});
    particles=particles.slice(-48);
  }
  function intersects(a,b) {return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;}
  function step(dt) {
    clock+=dt;landTime=Math.max(0,landTime-dt);invincible=Math.max(0,invincible-dt);
    extendWorld();
    const ground=chunks.map(c=>({x:c.start,y:floor-c.rise,w:c.end-c.start}));
    const bridges=chunks.filter(c=>c.bridge&&c.id>0).map(c=>({x:c.start-[64,72,64][c.id%3],y:floor-c.rise,w:[64,72,64][c.id%3]}));
    const blocks=chunks.flatMap(obstacles);
    const enemies=chunks.filter(c=>c.enemy!==null&&!c.defeated).map(enemyBody);
    player.vx=130;
    const gapDistance=chunks.filter((c,i)=>!chunks[i+1]?.bridge).reduce((nearest,c)=>c.end>player.x?Math.min(nearest,c.end-player.x-player.w):nearest,Infinity);
    const approachingGap=gapDistance<18;
    anticipation=player.grounded?Math.max(0,1-Math.abs(gapDistance-16)/18):0;
    const approachingBlock=blocks.concat(bridges).some(p=>p.x-player.x-player.w<42&&p.x-player.x-player.w>-8&&player.y+player.h>p.y+2);
    const approachingEnemy=enemies.some(e=>e.x-player.x-player.w<48&&e.x-player.x-player.w>-10);
    if(player.grounded&&jumpBuffer>0){jump(true);jumpBuffer=0;}
    else if(player.grounded&&(approachingGap||approachingBlock||approachingEnemy))jump();
    jumpBuffer=Math.max(0,jumpBuffer-dt);
    const previous={...player};
    player.x+=player.vx*dt;player.vy+=1000*dt;player.y+=player.vy*dt;player.grounded=false;
    const platforms=ground.concat(bridges,blocks.filter(p=>!p.hazard));
    for(const p of platforms)if(player.vy>=0&&previous.y+player.h<=p.y+1&&player.y+player.h>=p.y&&player.x+player.w>p.x&&player.x<p.x+p.w){player.y=p.y-player.h;player.vy=0;player.grounded=true;}
    if(player.grounded&&!previous.grounded&&previous.vy>100){landTime=.18;landings++;dust(player.x+12,player.y+player.h);}
    for(const enemy of enemies)if(intersects(player,enemy)){
      if(previous.vy>0&&previous.y+player.h<=enemy.y+8){enemy.chunk.defeated=true;player.vy=-260;player.grounded=false;stomps++;burst(enemy.x+12,enemy.y,'#dfabc7');}
      else hit(enemy.x+12,enemy.y);
    }
    for(const obstacle of blocks)if(obstacle.hazard&&intersects(player,obstacle))hit(obstacle.x+12,obstacle.y);
    for(const c of chunks){
      const items=stars(c);
      for(let i=0;i<items.length;i++){
        const {x,height}=items[i],y=floor-height;
        if(!c.collected.has(i)&&Math.abs(player.x+12-x)<23&&Math.abs(player.y+15-y)<25){
          c.collected.add(i);pickups++;pops.push({x,y,life:.38});burst(x,y,'#e7c776');
        }
      }
      if(c.id%7===6&&!c.passed&&player.x>c.start+260){c.passed=true;milestones++;burst(player.x,floor-36,'#b9ded0');}
    }
    for(const p of pops){p.life-=dt;p.y-=32*dt;}pops=pops.filter(p=>p.life>0);
    for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;}particles=particles.filter(p=>p.life>0);
    // An ambient runner continues forward even after an unexpected resize/collision.
    if(player.y>canvas.height+32){const landing=chunks.find(c=>c.end>player.x+48);player.x=Math.max(player.x,landing.start+12);player.y=floor-landing.rise-player.h;player.vy=0;player.grounded=true;recoveries++;}
    camera=Math.max(0,player.x-canvas.width*.32);
  }
  function hit(x,y){if(invincible)return;hits++;invincible=.8;burst(x,y,'#b6a4de');}
  function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const worldReady=worldImage.complete&&worldImage.naturalWidth;
    // A separate, slower layer gives the tiny diorama depth without filling the sky.
    if(worldReady){const travel=(offset+camera)*.38,first=Math.floor(travel/280);
      ctx.globalAlpha=.24;
      for(let i=first;i<first+Math.ceil(canvas.width/280)+2;i++)sticker(i%2?'shrub':'flowers',i*280-travel,floor-35,44,30);
      ctx.globalAlpha=1;
    }
    ctx.save();ctx.translate(-Math.round(camera),0);
    const ready=stickerImage.complete&&stickerImage.naturalWidth;
    for(const c of chunks){
      if(c.end<camera-100||c.start>camera+canvas.width+100)continue;
      const groundY=floor-c.rise;
      // Every terrain sticker is complete: whole tiles, original ratio, no segment clipping.
      for(let x=c.start;x<c.end;x+=96){
        if(worldReady)sticker(c.theme,x-3,groundY-3,102,58);
        else if(ready)sticker('platform',x,groundY-3,96,52);
        else {ctx.fillStyle='#a0d1c0';ctx.fillRect(x,groundY,96,6);ctx.fillStyle='#d2c8df';ctx.fillRect(x,groundY+6,96,38);}
      }
      if(c.bridge&&worldReady)sticker('bridge',c.start-[64,72,64][c.id%3]-10,groundY-28,[64,72,64][c.id%3]+20,49);
      if(worldReady){
        const props=['flowers','mailbox','shrub','sign'];
        sticker(props[c.id%props.length],c.start+54,groundY-36,40,36);
        sticker(props[(c.id+3)%props.length],c.end-70,groundY-28,32,28);
        if(c.id%7===6)sticker('checkpoint',c.start+260,groundY-64,78,64);
      }
      for(const p of obstacles(c)){
        if(p.kind==='platform'&&ready){
          // Build tall steps under a complete cap; never stretch the terrain sticker.
          if(p.h>20){ctx.fillStyle='#faf8ff';ctx.fillRect(p.x+2,p.y+14,p.w-4,p.h-14);ctx.fillStyle='#c9b9dc';ctx.fillRect(p.x+4,p.y+17,p.w-8,p.h-17);}
          sticker('platform',p.x-3,p.y-2,p.w+6,24);
        }
        else if(p.kind!=='platform'&&worldReady)sticker(p.kind,p.x-3,p.y-2,p.w+6,p.kind==='cloudLedge'?40:p.h+4);
        else{ctx.fillStyle=p.hazard?'#ad95d1':'#c7bddb';ctx.fillRect(p.x,p.y,p.w,p.h);}
      }
      const items=stars(c);
      for(let i=0;i<items.length;i++)if(!c.collected.has(i)){
        const x=items[i].x,y=floor-items[i].height+Math.sin(clock*2+i)*2;
        if(ready)sticker('star',x-10,y-10,20,20);else sprite(['..s..','.sss.','sssss','.s.s.'],x-5,y-5,2,{s:'#d2ad68'});
      }
      if(c.enemy!==null&&!c.defeated){
        const e=enemyBody(c),bob=Math.sin(clock*5+c.id)*1.2;
        ctx.fillStyle='rgba(74,108,120,.12)';ctx.fillRect(Math.round(e.x),groundY,26,2);
        if(c.enemyKind==='slime'?ready:worldReady)sticker(c.enemyKind,e.x-4,e.y-4-bob,e.w+8,e.h+4+bob);
        else{ctx.fillStyle='#e5bdd5';ctx.fillRect(e.x,e.y,e.w,e.h);}
        if(c.enemyKind==='mushroom'){
          ctx.fillStyle='#526077';ctx.fillRect(Math.round(e.x+9),Math.round(e.y+14-bob),2,3);ctx.fillRect(Math.round(e.x+16),Math.round(e.y+14-bob),2,3);
        }
      }
    }
    const shadowSurface = chunks.find(c=>player.x>=c.start-(c.bridge?72:0)&&player.x<c.end);
    if(shadowSurface){const surface=floor-shadowSurface.rise,height=Math.max(0,surface-player.y-player.h);ctx.fillStyle='rgba(74,108,120,'+Math.max(0,.18-height*.001)+')';ctx.beginPath();ctx.ellipse(player.x+12,surface+1,Math.max(6,16-height*.08),2.5,0,0,Math.PI*2);ctx.fill();}
    const feet=player.y+player.h;
    ctx.save();ctx.translate(Math.round(player.x+12),Math.round(feet));
    if(invincible>0)ctx.globalAlpha=Math.floor(invincible*12)%2?.5:1;
    const compression=landTime>0?.12*Math.sin(landTime/.18*Math.PI):anticipation*.06;
    ctx.scale(1+compression*.45,1-compression);
    if(!player.grounded)ctx.rotate(Math.max(-.06,Math.min(.06,player.vy*.00015)));
    const stride=Math.floor(clock*10)%4;
    const pose=landTime>.08?'land':player.grounded?'run'+stride:'leap';
    if(courierImage.complete&&courierImage.naturalWidth){
      const [sx,sy,sw,sh]=window.COURIER_ATLAS.sprites[pose],scale=46/351;
      const bob=player.grounded&&!landTime?(stride%2?-1:0):0;
      ctx.drawImage(courierImage,sx,sy,sw,sh,-sw*scale/2,-sh*scale+bob,sw*scale,sh*scale);
    }else if(worldReady){sticker(player.grounded?(stride%2?'runA':'runB'):'jump',-24,-44,48,44);}
    else if(ready)sticker('courier',-22,-40,44,40);
    else sprite(character,-16,-32,2,palette);
    ctx.restore();
    for(const p of pops){ctx.globalAlpha=Math.max(0,p.life/.38);if(ready){const size=20+(1-p.life/.38)*10;sticker('star',p.x-size/2,p.y-size/2,size,size);}}
    ctx.globalAlpha=1;
    for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.45);ctx.fillStyle=p.color;ctx.fillRect(Math.round(p.x/2)*2,Math.round(p.y/2)*2,3,3);}ctx.globalAlpha=1;
    ctx.restore();
    canvas.dataset.distance=String(Math.floor(offset+player.x));
    canvas.dataset.chunks=String(chunks.length);
    canvas.dataset.localX=String(Math.round(player.x));
    canvas.dataset.recoveries=String(recoveries);
    canvas.dataset.manualJumps=String(manualJumps);canvas.dataset.stomps=String(stomps);canvas.dataset.hits=String(hits);
    canvas.dataset.grounded=String(player.grounded);canvas.dataset.feet=String(Math.round(feet));
    canvas.dataset.terrain=chunks.find(c=>player.x>=c.start&&player.x<c.end)?.layout||'gap';
    canvas.dataset.enemyKinds=[...new Set(chunks.filter(c=>c.enemy!==null).map(c=>c.enemyKind))].join(',');
    canvas.dataset.pose=pose;canvas.dataset.pickups=String(pickups);canvas.dataset.jumps=String(jumps);canvas.dataset.landings=String(landings);canvas.dataset.milestones=String(milestones);
  }
  function tick(time) {
    frame=0;if(!running()){sync();return;}
    const elapsed=last?Math.min((time-last)/1000,.05):0;last=time;accumulator+=elapsed;
    while(accumulator>=1/120){step(1/120);accumulator-=1/120;}
    render();frame=requestAnimationFrame(tick);
  }
  document.addEventListener('visibilitychange',sync);addEventListener('portfolio-view-change',sync);
  document.addEventListener('keydown',event=>{
    const target=event.target;
    if(event.code!=='KeyW'||event.repeat||event.isComposing||event.altKey||event.ctrlKey||event.metaKey||!running())return;
    if(target?.isContentEditable||target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]'))return;
    event.preventDefault();
    if(player.grounded){jump(true);render();}else jumpBuffer=.12;
  });
  document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['open']}));
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',sync);
  new ResizeObserver(dimensions).observe(canvas);
  dimensions();reset();
})();
