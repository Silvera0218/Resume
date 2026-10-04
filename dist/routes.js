(() => {
  'use strict';
  const views=[...document.querySelectorAll('main > section')];
  const titles={home:'游戏策划 · 作品手账',about:'自我介绍',plans:'策划作品',demos:'游戏原型',resume:'个人简历',contact:'联系我'};
  const filenames={home:'portfolio.journal',about:'about_me.card',plans:'design_documents.folder',demos:'playroom.console',resume:'resume.journal',contact:'a_letter.journal'};
  const journal=document.querySelector('#journal-dialog');
  let lastTrigger=null, returning=false, routeVersion=0;
  const arrow='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M13 8H3m5-5L3 8l5 5"/></svg>';
  for(const id of ['about','plans','demos','resume','contact']){
    const bar=document.createElement('div');bar.className='page-bar';
    bar.innerHTML=`<a href="#home">${arrow}<span>返回桌面</span></a>`;
    const section=document.getElementById(id);
    const heading=section.querySelector('.surface-heading,.section-heading');
    if(heading)heading.append(bar);else section.prepend(bar);
  }
  const files=[...document.querySelectorAll('.desktop-file')];
  files.forEach((link,i)=>link.addEventListener('keydown',event=>{
    if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();const forward=['ArrowDown','ArrowRight'].includes(event.key);
    files[(i+(forward?1:files.length-1))%files.length].focus();
  }));
  function focusHeading(){
    const heading=document.body.dataset.view==='home'?document.querySelector('.desktop-file[href="#about"]'):document.querySelector('main > section:not([hidden]) h1,main > section:not([hidden]) h2');
    if(heading.matches('h1,h2'))heading.tabIndex=-1;heading.focus({preventScroll:true});return heading;
  }
  async function route(focus){
    const version=++routeVersion;
    const id=location.hash.slice(1),current=Object.hasOwn(titles,id)?id:'home';
    const dialog=document.querySelector('#detail-dialog');
    if(current==='home'&&journal.open){
      returning=true;
      await Promise.all([window.closePortfolioWindow(journal),window.closePortfolioWindow(dialog)]);
      if(version!==routeVersion)return;
    }else if(dialog.open){await window.closePortfolioWindow(dialog);if(version!==routeVersion)return;}
    for(const view of views){view.hidden=view.id!==current;view.classList.remove('view-enter');if(!view.hidden)view.classList.add('view-enter');}
    document.querySelectorAll('.site-header nav a,.paper-tabs a,.header-contact').forEach(link=>{
      if(link.hash===`#${current}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    if(document.body.dataset.view!==current)journal.scrollTop=0;
    document.body.dataset.view=current;
    document.querySelector('#window-filename').textContent=filenames[current];
    document.body.classList.toggle('has-journal',current!=='home');
    if(current==='home') {if(journal.open)journal.close();}
    else {journal.setAttribute('aria-labelledby',`${current}-heading`);if(!journal.open||journal.dataset.windowPhase==='closing')window.openPortfolioWindow(journal,lastTrigger?.hash===`#${current}`?lastTrigger:document.querySelector(`.desktop-file[href="#${current}"]`));}
    document.title=current==='home'?(window.PORTFOLIO.name!=='姓名待填写'?`${window.PORTFOLIO.name} · 游戏策划作品集`:titles.home):`${titles[current]} · 作品手账`;
    if(focus){if(current==='home')scrollTo({top:0,behavior:'instant'});if(returning&&current==='home'&&lastTrigger){lastTrigger.focus({preventScroll:true});returning=false;}else focusHeading();}
    dispatchEvent(new Event('portfolio-view-change'));
  }
  document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(link&&!journal.contains(link)&&Object.hasOwn(titles,link.hash.slice(1)))lastTrigger=link;});
  function closeJournal(){returning=true;location.hash='home';}
  document.querySelector('#close-journal').addEventListener('click',closeJournal);
  journal.addEventListener('cancel',event=>{event.preventDefault();closeJournal();});
  journal.addEventListener('close',()=>{document.body.classList.remove('has-journal');});
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();focusHeading().scrollIntoView({block:'start',behavior:'instant'});});
  addEventListener('hashchange',()=>route(true));route(false);
})();
