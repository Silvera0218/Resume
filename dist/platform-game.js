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
  function extendWorld() {
    while(!chunks.length || chunks.at(-1).end < player.x + canvas.width + 720) {
      const id=nextChunk++, start=chunks.length ? chunks.at(-1).end + [64,72,64][id%3] : 0;
      const length=[480,384,576,480,576][id%5];
      chunks.push({id,start,end:start+length,theme:themes[Math.floor(id/2)%3],block:id%3===1?null:start+160,
        enemy:id%3===1?start+180:null,bridge:id%4===3,collected:new Set(),defeated:false,passed:false});
    }
    chunks=chunks.filter(c=>c.end>camera-180);
    // Rebase the active world periodically; visual positions remain unchanged.
    if(camera>8192){const shift=chunks[0].start;offset+=shift;player.x-=shift;camera-=shift;
      for(const c of chunks){c.start-=shift;c.end-=shift;if(c.block!==null)c.block-=shift;if(c.enemy!==null)c.enemy-=shift;}
      for(const p of particles)p.x-=shift;for(const p of pops)p.x-=shift;
    }
  }
  const player = {x:36,y:0,w:24,h:30,vx:0,vy:0,grounded:false,facing:1};
  let recoveries=0, landTime=0, anticipation=0, pickups=0, jumps=0, landings=0, milestones=0;
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
    if (!running()) {cancelAnimationFrame(frame);frame=0;last=0;accumulator=0;render();}
    else if (!frame) {last=0;frame=requestAnimationFrame(tick);}
  }
  function jump() {if(player.grounded){player.vy=-420;player.grounded=false;jumps++;dust(player.x+12,floor);}}
  function dust(x,y){
    for(let i=0;i<4;i++)particles.push({x:x-5+i*3,y:y-2,vx:(i-2)*14,vy:-12-i*5,life:.24,color:'#f3efff'});
  }
  // Rewards trace the actual jump arc, with low pickups on the rest stretches.
  function stars(c){
    const hurdle=c.block===null?c.enemy:c.block;
    return [{x:c.start+78,height:23},...[-20,16,52].map((dx,i)=>({x:hurdle+dx,height:[75,91,42][i]}))];
  }
  function burst(x,y,color) {
    if(reduced.matches || document.body.classList.contains('fx-off'))return;
    for(let i=0;i<8;i++)particles.push({x,y,vx:(i%4-1.5)*42,vy:-50-(i%3)*20,life:.45,color});
    particles=particles.slice(-48);
  }
  function intersects(a,b) {return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;}
  function step(dt) {
    clock+=dt;landTime=Math.max(0,landTime-dt);
    extendWorld();
    const ground=chunks.map(c=>[c.start,c.end]);
    const bridges=chunks.filter(c=>c.bridge&&c.id>0).map(c=>({x:c.start-[64,72,64][c.id%3],y:floor,w:[64,72,64][c.id%3]}));
    const blockPositions=chunks.flatMap(c=>c.block===null?[]:[c.block]);
    const enemies=chunks.filter(c=>c.enemy!==null&&!c.defeated).map(c=>({x:c.enemy+Math.sin(clock*1.6+c.id)*10,y:floor-16,w:22,h:16,chunk:c}));
    player.vx=130;
    const gapDistance=chunks.filter((c,i)=>!chunks[i+1]?.bridge).reduce((nearest,c)=>c.end>player.x?Math.min(nearest,c.end-player.x-player.w):nearest,Infinity);
    const approachingGap=gapDistance<16;
    anticipation=player.grounded?Math.max(0,1-Math.abs(gapDistance-16)/18):0;
    const approachingBlock=blockPositions.some(x=>x-player.x-player.w<42&&x-player.x-player.w>-8);
    const approachingEnemy=enemies.some(e=>e.x-player.x-player.w<48&&e.x-player.x-player.w>-10);
    if(player.grounded&&(approachingGap||approachingBlock||approachingEnemy))jump();
    const previous={...player};
    player.x+=player.vx*dt;player.vy+=1000*dt;player.y+=player.vy*dt;player.grounded=false;
    const platforms=ground.map(([x,end])=>({x,y:floor,w:end-x})).concat(bridges,blockPositions.map(x=>({x,y:floor-18,w:36})));
    for(const p of platforms)if(player.vy>=0&&previous.y+player.h<=p.y+1&&player.y+player.h>=p.y&&player.x+player.w>p.x&&player.x<p.x+p.w){player.y=p.y-player.h;player.vy=0;player.grounded=true;}
    if(player.grounded&&!previous.grounded&&previous.vy>100){landTime=.18;landings++;dust(player.x+12,player.y+player.h);}
    for(const enemy of enemies)if(intersects(player,enemy)){enemy.chunk.defeated=true;player.vy=-260;burst(enemy.x+11,enemy.y,'#dfabc7');}
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
    if(player.y>canvas.height+32){const landing=chunks.find(c=>c.end>player.x+48);player.x=Math.max(player.x,landing.start+12);player.y=floor-player.h;player.vy=0;player.grounded=true;recoveries++;}
    camera=Math.max(0,player.x-canvas.width*.32);
  }
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
      // Every terrain sticker is complete: whole tiles, original ratio, no segment clipping.
      for(let x=c.start;x<c.end;x+=96){
        if(worldReady)sticker(c.theme,x-3,floor-3,102,58);
        else if(ready)sticker('platform',x,floor-3,96,52);
        else {ctx.fillStyle='#a0d1c0';ctx.fillRect(x,floor,96,6);ctx.fillStyle='#d2c8df';ctx.fillRect(x,floor+6,96,38);}
      }
      if(c.bridge&&worldReady)sticker('bridge',c.start-[64,72,64][c.id%3]-10,floor-28,[64,72,64][c.id%3]+20,49);
      if(worldReady){
        const props=['flowers','mushroom','mailbox','shrub','snail','crystals','sign'];
        sticker(props[c.id%props.length],c.start+54,floor-36,40,36);
        sticker(props[(c.id+3)%props.length],c.end-70,floor-28,32,28);
        if(c.id%7===6)sticker('checkpoint',c.start+260,floor-64,78,64);
      }
      if(c.block!==null){if(ready)sticker('platform',c.block,floor-18,36,20);else{ctx.fillStyle='#c7bddb';ctx.fillRect(c.block,floor-18,36,18);}}
      const items=stars(c);
      for(let i=0;i<items.length;i++)if(!c.collected.has(i)){
        const x=items[i].x,y=floor-items[i].height+Math.sin(clock*2+i)*2;
        if(ready)sticker('star',x-10,y-10,20,20);else sprite(['..s..','.sss.','sssss','.s.s.'],x-5,y-5,2,{s:'#d2ad68'});
      }
      if(c.enemy!==null&&!c.defeated){const x=c.enemy+Math.sin(clock*1.6+c.id)*10;
        if(ready){const bob=Math.sin(clock*5+c.id)*1.5;sticker('slime',x-4,floor-20-bob,30,20+bob);}else{ctx.fillStyle='#e5bdd5';ctx.fillRect(x,floor-16,22,16);}}
    }
    const shadowSurface = chunks.some(c=>player.x>=c.start-(c.bridge?72:0)&&player.x<c.end);
    if(shadowSurface){const height=Math.max(0,floor-player.y-player.h);ctx.fillStyle='rgba(74,108,120,'+(0.18-height*.001)+')';ctx.beginPath();ctx.ellipse(player.x+12,floor+1,Math.max(6,16-height*.08),2.5,0,0,Math.PI*2);ctx.fill();}
    const feet=player.y+player.h;
    ctx.save();ctx.translate(Math.round(player.x+12),Math.round(feet));
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
    canvas.dataset.pose=pose;canvas.dataset.pickups=String(pickups);canvas.dataset.jumps=String(jumps);canvas.dataset.landings=String(landings);canvas.dataset.milestones=String(milestones);
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
