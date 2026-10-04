/* 全局页面下沿的原创像素平台小场景，无独立窗口和输入控件。 */
(() => {
  'use strict';
  const canvas = document.querySelector('#platform-game'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const stickerImage = new Image(); stickerImage.src = window.STICKER_ATLAS.url;
  stickerImage.addEventListener('load',()=>render());
  const worldImage = new Image(); worldImage.src = window.WORLD_ATLAS.url;
  worldImage.addEventListener('load',()=>render());
  if (!ctx) return;

  let chunks=[], nextChunk=0, offset=0;
  const themes=['grass','meadow','cloudLedge'];
  function extendWorld() {
    while(!chunks.length || chunks.at(-1).end < player.x + canvas.width + 720) {
      const id=nextChunk++, start=chunks.length ? chunks.at(-1).end + [64,72,64][id%3] : 0;
      const length=[480,384,576,480,576][id%5];
      chunks.push({id,start,end:start+length,theme:themes[Math.floor(id/2)%3],block:id%3===1?null:start+160,
        enemy:id%3===1?start+180:null,collected:new Set(),defeated:false});
    }
    chunks=chunks.filter(c=>c.end>camera-180);
    // Rebase the active world periodically; visual positions remain unchanged.
    if(camera>8192){const shift=chunks[0].start;offset+=shift;player.x-=shift;camera-=shift;
      for(const c of chunks){c.start-=shift;c.end-=shift;if(c.block!==null)c.block-=shift;if(c.enemy!==null)c.enemy-=shift;}
      for(const p of particles)p.x-=shift;
    }
  }
  const player = {x:36,y:0,w:24,h:30,vx:0,vy:0,grounded:false,facing:1};
  let recoveries=0;
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
    canvas.height = Math.max(180, Math.round(canvas.clientHeight));
    floor = canvas.height - 52;
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
    if (!running()) {cancelAnimationFrame(frame);frame=0;last=0;accumulator=0;render();}
    else if (!frame) {last=0;frame=requestAnimationFrame(tick);}
  }
  function jump() {if(player.grounded){player.vy=-420;player.grounded=false;}}
  function burst(x,y,color) {
    if(reduced.matches || document.body.classList.contains('fx-off'))return;
    for(let i=0;i<8;i++)particles.push({x,y,vx:(i%4-1.5)*42,vy:-50-(i%3)*20,life:.45,color});
    particles=particles.slice(-48);
  }
  function intersects(a,b) {return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;}
  function step(dt) {
    clock+=dt;
    extendWorld();
    const ground=chunks.map(c=>[c.start,c.end]);
    const blockPositions=chunks.flatMap(c=>c.block===null?[]:[c.block]);
    const enemies=chunks.filter(c=>c.enemy!==null&&!c.defeated).map(c=>({x:c.enemy+Math.sin(clock*1.6+c.id)*10,y:floor-16,w:22,h:16,chunk:c}));
    player.vx=130;
    const approachingGap=ground.some(([,end])=>player.x+player.w>=end-16&&player.x<end);
    const approachingBlock=blockPositions.some(x=>x-player.x-player.w<42&&x-player.x-player.w>-8);
    const approachingEnemy=enemies.some(e=>e.x-player.x-player.w<48&&e.x-player.x-player.w>-10);
    if(player.grounded&&(approachingGap||approachingBlock||approachingEnemy))jump();
    const previous={...player};
    player.x+=player.vx*dt;player.vy+=1000*dt;player.y+=player.vy*dt;player.grounded=false;
    const platforms=ground.map(([x,end])=>({x,y:floor,w:end-x})).concat(blockPositions.map(x=>({x,y:floor-18,w:36})));
    for(const p of platforms)if(player.vy>=0&&previous.y+player.h<=p.y+1&&player.y+player.h>=p.y&&player.x+player.w>p.x&&player.x<p.x+p.w){player.y=p.y-player.h;player.vy=0;player.grounded=true;}
    for(const enemy of enemies)if(intersects(player,enemy)){enemy.chunk.defeated=true;player.vy=-260;burst(enemy.x+11,enemy.y,'#dfabc7');}
    for(const c of chunks)for(let i=0;i<3;i++){
      const x=c.start+100+i*96,y=floor-54;
      if(!c.collected.has(i)&&Math.abs(player.x+12-x)<24&&Math.abs(player.y+15-y)<26){c.collected.add(i);burst(x,y,'#dab775');}
    }
    for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;}particles=particles.filter(p=>p.life>0);
    // An ambient runner continues forward even after an unexpected resize/collision.
    if(player.y>canvas.height+32){const landing=chunks.find(c=>c.end>player.x+48);player.x=Math.max(player.x,landing.start+12);player.y=floor-player.h;player.vy=0;player.grounded=true;recoveries++;}
    camera=Math.max(0,player.x-canvas.width*.32);
  }
  function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();ctx.translate(-Math.round(camera),0);
    const worldReady=worldImage.complete&&worldImage.naturalWidth;
    const ready=stickerImage.complete&&stickerImage.naturalWidth;
    for(const c of chunks){
      if(c.end<camera-100||c.start>camera+canvas.width+100)continue;
      // Every terrain sticker is complete: whole tiles, original ratio, no segment clipping.
      for(let x=c.start;x<c.end;x+=96){
        if(worldReady)sticker(c.theme,x,floor-3,96,52);
        else if(ready)sticker('platform',x,floor-3,96,52);
        else {ctx.fillStyle='#a0d1c0';ctx.fillRect(x,floor,96,6);ctx.fillStyle='#d2c8df';ctx.fillRect(x,floor+6,96,38);}
      }
      if(worldReady){
        const props=['flowers','mushroom','mailbox','shrub','snail','crystals','sign'];
        sticker(props[c.id%props.length],c.start+62,floor-30,34,30);
        sticker(props[(c.id+3)%props.length],c.end-70,floor-28,32,28);
        if(c.id%7===6)sticker('checkpoint',c.start+260,floor-54,66,54);
      }
      if(c.block!==null){if(ready)sticker('platform',c.block,floor-18,36,20);else{ctx.fillStyle='#c7bddb';ctx.fillRect(c.block,floor-18,36,18);}}
      for(let i=0;i<3;i++)if(!c.collected.has(i)){
        const x=c.start+100+i*96,y=floor-54+Math.sin(clock*2+i)*2;
        if(ready)sticker('star',x-10,y-10,20,20);else sprite(['..s..','.sss.','sssss','.s.s.'],x-5,y-5,2,{s:'#d2ad68'});
      }
      if(c.enemy!==null&&!c.defeated){const x=c.enemy+Math.sin(clock*1.6+c.id)*10;
        if(ready)sticker('slime',x-2,floor-18,26,18);else{ctx.fillStyle='#e5bdd5';ctx.fillRect(x,floor-16,22,16);}}
    }
    const shadowSurface = chunks.some(c=>player.x>=c.start&&player.x<c.end);
    if(shadowSurface){ctx.fillStyle='rgba(74,108,120,.16)';ctx.fillRect(player.x-3,floor-1,30,3);}
    ctx.save();ctx.translate(Math.round(player.x+12),Math.round(player.y));if(player.facing<0)ctx.scale(-1,1);
    if(worldReady){const pose=player.grounded?(Math.floor(clock*9)%2?'runA':'runB'):'jump';sticker(pose,-19,-8,38,38);}
    else if(stickerImage.complete&&stickerImage.naturalWidth){const lift=player.grounded&&player.vx?Math.floor(clock*9)%2:0;sticker('courier',-18,-6-lift,36,36);}
    else {sprite(character,-16,-2,2,palette);if(player.grounded&&player.vx&&Math.floor(clock*9)%2){ctx.fillStyle=palette.s;ctx.fillRect(-10,28,8,2);}}
    ctx.restore();
    for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.45);ctx.fillStyle=p.color;ctx.fillRect(Math.round(p.x/2)*2,Math.round(p.y/2)*2,3,3);}ctx.globalAlpha=1;
    ctx.restore();
    canvas.dataset.distance=String(Math.floor(offset+player.x));
    canvas.dataset.chunks=String(chunks.length);
    canvas.dataset.localX=String(Math.round(player.x));
    canvas.dataset.recoveries=String(recoveries);
  }
  function tick(time) {
    frame=0;if(!running()){sync();return;}
    const elapsed=last?Math.min((time-last)/1000,.05):0;last=time;accumulator+=elapsed;
    while(accumulator>=1/120){step(1/120);accumulator-=1/120;}
    render();frame=requestAnimationFrame(tick);
  }
  document.addEventListener('visibilitychange',sync);addEventListener('portfolio-view-change',sync);
  document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['open']}));
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',sync);
  new ResizeObserver(dimensions).observe(canvas);
  dimensions();reset();
})();
