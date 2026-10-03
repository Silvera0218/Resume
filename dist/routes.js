(() => {
  'use strict';
  const views = [...document.querySelectorAll('main > section')];
  const titles = {home:'游戏策划 · 作品档案',plans:'策划案作品集',demos:'游戏 Demo 集',resume:'我的简历',contact:'联系我'};
  const stages = {plans:['01','DESIGN ARCHIVE'],demos:['02','THE PLAYROOM'],resume:['03','PLAYER PROFILE'],contact:['04','GET IN TOUCH']};
  let explored = [];
  try { const saved=JSON.parse(sessionStorage.getItem('portfolio-explored') || '[]');if(Array.isArray(saved))explored=[...new Set(saved.filter(id=>['plans','demos','resume'].includes(id)))]; } catch {}
  const links = [...document.querySelectorAll('.save-slot')];
  const portals=[['plans','档案库','34%','40%'],['demos','试玩室','74%','56%'],['resume','角色档案','49%','78%']];
  portals.forEach(([id,label,x,y],i)=>{
    const portal=document.createElement('a');portal.href=`#${id}`;portal.className='world-portal';portal.style.left=x;portal.style.top=y;
    portal.setAttribute('aria-label',`${label}：${titles[id]}`);portal.innerHTML=`<span class="portal-beacon pixel" aria-hidden="true">${i+1}</span><span class="portal-label">${label}</span>`;
    document.querySelector('.screen-viewport').append(portal);
  });
  const arrow = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M13 8H3m5-5L3 8l5 5"/></svg>';
  for (const [id,[number,label]] of Object.entries(stages)) {
    const bar=document.createElement('div');bar.className='page-bar';
    bar.innerHTML=`<a href="#home">${arrow}<span>返回大厅</span></a><span class="pixel">STAGE ${number} / ${label}</span><span class="stage-indicator" aria-hidden="true"></span>`;
    document.getElementById(id).prepend(bar);
  }
  function progress() {
    document.querySelector('#explore-count').textContent=`0${explored.length} / 03`;
    document.querySelectorAll('.explore-lights i').forEach((el,i)=>el.classList.toggle('complete',explored.includes(['plans','demos','resume'][i])));
  }
  function select(link) {
    links.forEach(el=>el.classList.toggle('active',el===link));
    document.querySelector('.start-button').href=link.hash;
  }
  links.forEach((link,i)=>{
    link.addEventListener('focus',()=>select(link));
    link.addEventListener('pointerenter',()=>select(link));
    link.addEventListener('keydown',event=>{
      if (!['ArrowDown','ArrowUp'].includes(event.key)) return;
      event.preventDefault();links[(i+(event.key==='ArrowDown'?1:links.length-1))%links.length].focus();
    });
  });
  function route(focus) {
    const id=location.hash.slice(1);
    const current=Object.hasOwn(titles,id)?id:'home';
    const dialog=document.querySelector('#detail-dialog');if(dialog.open)dialog.close();
    for(const view of views) {
      view.hidden=view.id!==current;view.classList.remove('view-enter');
      if(!view.hidden) {view.classList.add('view-enter');view.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('revealed'));}
    }
    document.querySelectorAll('.site-header nav a').forEach(link=>{if(link.hash===`#${current}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.body.dataset.view=current;
    if(current!=='home')document.title=`${titles[current]} · 游戏策划作品集`;
    else document.title=window.PORTFOLIO.name!=='姓名待填写'?`${window.PORTFOLIO.name} · 游戏策划作品集`:titles.home;
    if(['plans','demos','resume'].includes(current)&&!explored.includes(current)) {explored.push(current);try{sessionStorage.setItem('portfolio-explored',JSON.stringify(explored));}catch{}}
    progress();
    if(focus) {scrollTo({top:0,behavior:'instant'});const heading=document.querySelector(`#${current} h1,#${current} h2`);heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }
  addEventListener('hashchange',()=>route(true));route(false);
})();
