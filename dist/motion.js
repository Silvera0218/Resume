(() => {
  'use strict';
  const canvas = document.querySelector('#pixel-particles');
  const context = canvas.getContext('2d');
  const toggle = document.querySelector('#fx-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let wanted = true;
  try { wanted = localStorage.getItem('portfolio-fx') !== 'off'; } catch {}
  let enabled = wanted && !preference.matches;
  let frame = 0, lastTime = 0, lastMove = 0;
  let particles = [];
  const colors = ['#508d73','#a5cb76','#83c6b0','#e0cd74'];
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * ratio);
    canvas.height = Math.round(innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function clear() {
    cancelAnimationFrame(frame); frame = 0; particles = []; lastTime = 0;
    context.clearRect(0, 0, innerWidth, innerHeight);
  }
  function sync() {
    enabled = wanted && !preference.matches;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.title = preference.matches ? '系统已开启减少动态效果' : enabled ? '关闭像素动效' : '开启像素动效';
    document.body.classList.toggle('fx-off', !enabled);
    if (!enabled) clear();
  }
  function draw(time) {
    const delta = Math.min((time - (lastTime || time)) / 16.67, 2.5); lastTime = time;
    context.clearRect(0, 0, innerWidth, innerHeight);
    particles = particles.filter(p => p.life > 0);
    for (const p of particles) {
      p.x += p.vx * delta; p.y += p.vy * delta; p.vy += .08 * delta; p.life -= delta;
      context.globalAlpha = Math.max(0, p.life / p.maxLife);
      context.fillStyle = p.color;
      context.fillRect(Math.round(p.x / 3) * 3, Math.round(p.y / 3) * 3, p.size, p.size);
    }
    context.globalAlpha = 1;
    if (particles.length) frame = requestAnimationFrame(draw);
    else { frame = 0; lastTime = 0; }
  }
  function emit(x, y, count, burst) {
    if (!enabled || document.hidden) return;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * .4;
      const speed = burst ? 1.6 + Math.random() * 2 : .3 + Math.random() * .6;
      const life = burst ? 28 + Math.random() * 18 : 15 + Math.random() * 12;
      particles.push({x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed-(burst?1.2:0),life,maxLife:life,size:burst?6:3,color:colors[i%colors.length]});
    }
    particles = particles.slice(-90);
    if (!frame) frame = requestAnimationFrame(draw);
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !enabled || performance.now() - lastMove < 35) return;
    lastMove = performance.now(); emit(event.clientX, event.clientY, 2, false);
    const cover = event.target.closest('.document-cover');
    if (cover) { const rect = cover.getBoundingClientRect(); cover.style.setProperty('--rx', `${(0.5-(event.clientY-rect.top)/rect.height)*3}deg`);cover.style.setProperty('--ry', `${((event.clientX-rect.left)/rect.width-0.5)*3}deg`);cover.style.setProperty('--light-x',`${(event.clientX-rect.left)/rect.width*100}%`);cover.style.setProperty('--light-y',`${(event.clientY-rect.top)/rect.height*100}%`); }
  }, {passive:true});
  document.querySelectorAll('.document-cover').forEach(el => el.addEventListener('pointerleave', () => {el.style.removeProperty('--rx');el.style.removeProperty('--ry');}));
  document.addEventListener('click', event => {
    if (event.target.closest('#fx-toggle,[disabled],[aria-disabled=true]')) return;
    if (event.detail === 0) { const rect = event.target.getBoundingClientRect(); emit(rect.left+rect.width/2,rect.top+rect.height/2,12,true); }
    else emit(event.clientX,event.clientY,16,true);
  });
  toggle.addEventListener('click', () => {
    if (preference.matches) { wanted = false; } else wanted = !wanted;
    try { localStorage.setItem('portfolio-fx', wanted ? 'on' : 'off'); } catch {}
    sync();
    const toast = document.querySelector('#toast');
    toast.textContent = preference.matches ? '已遵循系统设置，减少动态效果' : enabled ? '像素动效已开启' : '像素动效已关闭';
    toast.classList.add('visible');clearTimeout(toggle.toastTimer);toggle.toastTimer=setTimeout(()=>toast.classList.remove('visible'),1800);
  });
  addEventListener('resize', resize, {passive:true});
  document.addEventListener('visibilitychange', () => {if(document.hidden)clear();});
  preference.addEventListener('change', sync);
  resize(); sync();
  if (enabled) {
    const wipe = document.createElement('div'); wipe.className = 'screen-wipe';wipe.setAttribute('aria-hidden','true');
    for (let i=0;i<32;i++) { const cell=document.createElement('span');cell.style.setProperty('--delay',`${Math.floor(i/8)*40+(i%8)*25}ms`);wipe.append(cell); }
    document.querySelector('.screen-viewport').append(wipe);setTimeout(()=>wipe.remove(),900);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('revealed');observer.unobserve(entry.target);}
    }),{threshold:.08});
    document.querySelectorAll('.section-heading,.plan-card,.demo-card,.profile-summary,.resume-details').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});
  }
})();
