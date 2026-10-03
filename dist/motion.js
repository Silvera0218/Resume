/* A quiet pixel field. Native Canvas; no runtime dependency. */
(() => {
  'use strict';
  const canvas = document.querySelector('#pixel-particles');
  const context = canvas.getContext('2d');
  const fieldCanvas = document.querySelector('#pixel-field');
  const field = window.createPixelField?.(fieldCanvas);
  const toggle = document.querySelector('#fx-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let wanted = true;
  try { wanted = localStorage.getItem('portfolio-fx') !== 'off'; } catch {}
  let enabled = false, frame = 0, lastPaint = 0, lastMove = 0;
  let width = innerWidth, height = innerHeight, motes = [], sparks = [];
  const pointer = { x: -1000, y: -1000 };
  const colors = ['#629dc2', '#b092b1', '#8e9dc6'];
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    field?.resize(width,height);
    motes = Array.from({ length: width < 800 ? 16 : 32 }, (_, i) => ({
      x: Math.random() * width, y: Math.random() * height,
      size: i % 7 === 0 ? 4 : 2, phase: Math.random() * 6.28,
      speed: .003 + Math.random() * .005, color: colors[i % 3]
    }));
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastPaint = 0; sparks = []; context?.clearRect(0,0,width,height); field?.clear(); }
  function sync() {
    enabled = !!context && wanted && !preference.matches;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.title = preference.matches ? '系统已开启减少动态效果' : enabled ? '关闭像素动效' : '开启像素动效';
    document.body.classList.toggle('fx-off', !enabled);
    if (!enabled || document.hidden) stop();
    else if (!frame) frame = requestAnimationFrame(draw);
  }
  function draw(time) {
    if (!enabled || document.hidden) { stop(); return; }
    frame = requestAnimationFrame(draw);
    if (time - lastPaint < 32) return;
    const delta = Math.min(time - (lastPaint || time), 70); lastPaint = time;
    context.clearRect(0, 0, width, height);
    field?.render(time,pointer);
    const seconds = time / 1000;
    for (const mote of motes) {
      mote.y -= delta * mote.speed;
      if (mote.y < -8) mote.y = height + 8;
      const drift = Math.sin(seconds * .23 + mote.phase) * 12;
      const distance = Math.hypot(pointer.x - mote.x, pointer.y - mote.y);
      const light = Math.max(0, 1 - distance / 160);
      context.globalAlpha = .12 + (Math.sin(seconds * .65 + mote.phase) + 1) * .1 + light * .25;
      context.fillStyle = mote.color;
      context.fillRect(Math.round((mote.x + drift)/2)*2, Math.round(mote.y/2)*2, mote.size, mote.size);
    }
    sparks = sparks.filter(p => p.life > 0);
    for (const p of sparks) {
      p.life -= delta; p.x += p.vx * delta; p.y += p.vy * delta;
      context.globalAlpha = Math.max(0,p.life/p.duration) * .6;
      context.fillStyle = p.color;
      context.fillRect(Math.round(p.x/4)*4, Math.round(p.y/4)*4, p.size, p.size);
    }
    context.globalAlpha = 1;
  }
  function emit(x,y,count,burst) {
    if (!enabled || document.hidden) return;
    for(let i=0;i<count;i++) {
      const angle = i/count * Math.PI * 2, speed = burst ? .025 + Math.random()*.045 : .012;
      const duration = burst ? 550 : 300;
      sparks.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-.008,life:duration,duration,size:burst?4:2,color:colors[i%3]});
    }
    sparks = sparks.slice(-60);
  }
  document.addEventListener('pointermove', event => {
    if(event.pointerType !== 'mouse' || !enabled || !finePointer.matches) return;
    pointer.x=event.clientX; pointer.y=event.clientY;
    if(performance.now()-lastMove>80) {lastMove=performance.now();emit(event.clientX,event.clientY,1,false);}
    const cover=event.target.closest('.document-cover');
    if(cover) {const r=cover.getBoundingClientRect();cover.style.setProperty('--rx',`${(.5-(event.clientY-r.top)/r.height)*2}deg`);cover.style.setProperty('--ry',`${((event.clientX-r.left)/r.width-.5)*2}deg`);}
  },{passive:true});
  document.addEventListener('pointerout',event=>{if(!event.relatedTarget){pointer.x=-1000;pointer.y=-1000;}});
  document.querySelectorAll('.document-cover').forEach(cover=>cover.addEventListener('pointerleave',()=>{cover.style.removeProperty('--rx');cover.style.removeProperty('--ry');}));
  document.addEventListener('click',event=>{
    if(enabled && !event.target.closest('#fx-toggle'))field?.click(event.clientX,event.clientY,performance.now());
    if(!event.target.closest('a,button') || event.target.closest('#fx-toggle,[disabled],[aria-disabled=true]'))return;
    if(event.detail===0){const r=event.target.getBoundingClientRect();emit(r.left+r.width/2,r.top+r.height/2,12,true);}
    else emit(event.clientX,event.clientY,12,true);
  });
  toggle.addEventListener('click',()=>{
    wanted=preference.matches?false:!wanted;
    try{localStorage.setItem('portfolio-fx',wanted?'on':'off');}catch{}
    sync();
    const toast=document.querySelector('#toast');
    toast.textContent=preference.matches?'已遵循系统设置，减少动态效果':enabled?'像素动效已开启':'像素动效已关闭';
    toast.classList.add('visible');clearTimeout(toggle.toastTimer);toggle.toastTimer=setTimeout(()=>toast.classList.remove('visible'),1800);
  });
  addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);
  preference.addEventListener('change',sync);
  resize();sync();
})();
