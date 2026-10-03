(() => {
  'use strict';
  const views=[...document.querySelectorAll('main > section')];
  const titles={home:'游戏策划 · 作品手账',plans:'策划案作品集',demos:'游戏 Demo 集',resume:'我的简历',contact:'联系我'};
  const filenames={home:'portfolio.journal',plans:'design_documents.journal',demos:'playroom.journal',resume:'about_me.journal',contact:'a_letter.journal'};
  const labels={plans:'DESIGN DOCUMENTS',demos:'PLAYROOM',resume:'ABOUT ME',contact:'A LETTER'};
  const arrow='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M13 8H3m5-5L3 8l5 5"/></svg>';
  for(const [id,label] of Object.entries(labels)){
    const bar=document.createElement('div');bar.className='page-bar';
    bar.innerHTML=`<a href="#home">${arrow}<span>返回手账首页</span></a><span class="pixel">${label}</span>`;
    document.getElementById(id).prepend(bar);
  }
  const files=[...document.querySelectorAll('.desktop-file')];
  files.forEach((link,i)=>link.addEventListener('keydown',event=>{
    if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();const forward=['ArrowDown','ArrowRight'].includes(event.key);
    files[(i+(forward?1:files.length-1))%files.length].focus();
  }));
  function focusHeading(){
    const heading=document.querySelector('main > section:not([hidden]) h1,main > section:not([hidden]) h2');
    heading.tabIndex=-1;heading.focus({preventScroll:true});return heading;
  }
  function route(focus){
    const id=location.hash.slice(1),current=Object.hasOwn(titles,id)?id:'home';
    const dialog=document.querySelector('#detail-dialog');if(dialog.open)dialog.close();
    for(const view of views){view.hidden=view.id!==current;view.classList.remove('view-enter');if(!view.hidden)view.classList.add('view-enter');}
    document.querySelectorAll('.site-header nav a,.paper-tabs a,.header-contact').forEach(link=>{
      if(link.hash===`#${current}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    document.body.dataset.view=current;
    document.querySelector('#window-filename').textContent=filenames[current];
    document.title=current==='home'?(window.PORTFOLIO.name!=='姓名待填写'?`${window.PORTFOLIO.name} · 游戏策划作品集`:titles.home):`${titles[current]} · 作品手账`;
    if(focus){scrollTo({top:0,behavior:'instant'});focusHeading();}
  }
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();focusHeading().scrollIntoView({block:'start',behavior:'instant'});});
  addEventListener('hashchange',()=>route(true));route(false);
})();
