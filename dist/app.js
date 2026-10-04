(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const $ = (selector, root = document) => root.querySelector(selector);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = (value) => {
    if (!value || typeof value !== 'string') return '';
    try { const parsed = new URL(value, location.href); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''; } catch { return ''; }
  };
  const assetUrl = value => safeUrl(value);
  const bind = (selector, value) => document.querySelectorAll(selector).forEach(el => {el.textContent = value || '待填写';});
  bind('[data-name]', data.name); bind('[data-role]', data.role); bind('[data-introduction]', data.introduction);
  bind('[data-city]', data.city); bind('[data-education]', data.education); bind('[data-email]', data.email);
  bind('.placeholder-copy', data.about);
  document.title = data.name && data.name !== '姓名待填写' ? `${data.name} · 游戏策划作品集` : '游戏策划 · 作品档案';
  const words = ['SYSTEM\nDESIGN', 'GAME\nECONOMY', 'GAME\nANALYSIS'];
  $('#plan-list').innerHTML = data.plans.map((plan, i) => `<article class="plan-card" id="plan-document-${i}"><div class="document-cover">${assetUrl(plan.cover) ? `<img class="cover-image" src="${escape(assetUrl(plan.cover))}" alt="${escape(plan.title)}封面" loading="lazy">` : `<span class="pixel cover-word">${words[i % words.length].replace('\n', '<br>')}</span><span class="cover-bottom"><span class="cover-tag">DESIGN DOC</span></span>`}</div><div class="document-copy"><div class="meta"><span>${escape(plan.category)}</span><span>${safeUrl(plan.documentUrl) ? '附完整文档' : '附件待添加'}</span></div><h3 tabindex="-1">${escape(plan.title)}</h3><p>${escape(plan.summary)}</p><button class="text-button" type="button" data-detail="${escape(plan.id)}" data-kind="plan">${plan.goal || safeUrl(plan.documentUrl) ? '打开策划案' : '打开内容提纲'}</button></div></article>`).join('');
  $('#plan-index').innerHTML = data.plans.map((plan, i) => `<button type="button" data-document="${i}" aria-controls="plan-document-${i}"><svg width="15" height="18" viewBox="0 0 16 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M2 1h8l4 4v14H2zM10 1v5h4M5 10h6M5 14h5"/></svg><span>${escape(plan.category)}</span></button>`).join('');
  $('#plan-index').addEventListener('click', event => {
    const trigger = event.target.closest('[data-document]'); if (!trigger) return;
    const sheet = document.getElementById(trigger.getAttribute('aria-controls'));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('fx-off');
    sheet.scrollIntoView({block:'nearest',behavior:reduced ? 'instant' : 'smooth'});
    sheet.querySelector('h3').focus({preventScroll:true});
  });
  $('#demo-list').innerHTML = data.demos.map((demo, i) => `<article class="demo-card" data-demo-index="${i}"><div class="demo-screen">${assetUrl(demo.cover) ? `<img class="cover-image" src="${escape(assetUrl(demo.cover))}" alt="${escape(demo.title)}实机截图" loading="lazy">` : `<div class="demo-placeholder"><div class="pixel-frame" aria-hidden="true"></div><span>截图或演示待添加</span></div>`}</div><div class="demo-body"><span class="demo-category">${escape(demo.category)}</span><h3>${escape(demo.title)}</h3><p>${escape(demo.summary)}</p><div class="demo-actions">${safeUrl(demo.playUrl) ? `<a class="button primary" href="${escape(safeUrl(demo.playUrl))}" target="_blank" rel="noopener noreferrer">在线试玩</a>` : '<span class="pending-attachment">试玩地址待添加</span>'}<button class="text-button" type="button" data-detail="${escape(demo.id)}" data-kind="demo">${demo.goal ? '原型说明' : '内容提纲'}</button></div></div></article>`).join('');
  const categories = [...new Set(data.demos.map(demo => demo.category).filter(Boolean))];
  $('#demo-filters').innerHTML = `<button type="button" data-demo-filter="" aria-pressed="true" aria-controls="demo-list">全部</button>${categories.map(category => `<button type="button" data-demo-filter="${escape(category)}" aria-pressed="false" aria-controls="demo-list">${escape(category)}</button>`).join('')}`;
  let demoCategory = '';
  function filterDemos() {
    const query = $('#demo-search').value.trim().toLocaleLowerCase();
    let visible = 0;
    document.querySelectorAll('#demo-list .demo-card').forEach(card => {
      const demo = data.demos[Number(card.dataset.demoIndex)];
      const matches = (!demoCategory || demo.category === demoCategory) && [demo.title, demo.category, demo.summary, demo.engine].join(' ').toLocaleLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visible++;
    });
    $('#demo-count').textContent = `显示 ${visible} / ${data.demos.length} 份原型资料`;
    $('#demo-empty').hidden = visible !== 0;
    document.querySelectorAll('[data-demo-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoFilter === demoCategory)));
  }
  $('#demo-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-demo-filter]'); if (!button) return;
    demoCategory = button.dataset.demoFilter; filterDemos();
  });
  $('#demo-search').addEventListener('input', filterDemos);
  $('#reset-demo-filters').addEventListener('click', () => {demoCategory = ''; $('#demo-search').value = ''; filterDemos(); $('#demo-search').focus();});
  filterDemos();
  const completedPlans = data.plans.filter(p => p.goal || safeUrl(p.documentUrl)).length;
  const completedDemos = data.demos.filter(d => safeUrl(d.playUrl)).length;
  if (completedPlans) $('#plans .section-status').textContent = `${completedPlans} 份策划案`;
  if (completedDemos) $('#demos .section-status').textContent = `${completedDemos} 个可试玩原型`;
  const fields = (items) => `<div class="detail-body">${items.map(([name,value,hint]) => `<section class="detail-field"><h3>${name}</h3><p>${escape(value || hint)}</p></section>`).join('')}</div>`;
  const dialog = $('#detail-dialog'); let lastTrigger;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-detail]'); if(!trigger) return;
    lastTrigger = trigger;
    const kind = trigger.dataset.kind; const item = (kind === 'plan' ? data.plans : data.demos).find(p => p.id === trigger.dataset.detail); if(!item) return;
    $('#dialog-kind').textContent = kind === 'plan' ? '策划笔记' : '原型笔记';
    dialog.dataset.kind = kind;
    const sectionFields = kind === 'plan' ? [['设计目标',item.goal,'待填写：目标玩家、具体问题与设计目标。'],['核心循环',item.loop,'待填写：玩家行为、规则响应与奖励反馈。'],['系统规则',item.rules,'待填写：流程、条件、数值与边界情况。'],['验证与迭代',item.validation,'待填写：测试方式、观察结果与调整依据。']] : [['验证目标',item.goal,'待填写：这个原型要验证的设计假设。'],['操作与玩法',item.controls,'待填写：输入方式、目标与核心规则。'],['职责与工具', [item.role,item.engine].filter(Boolean).join(' / '),'待填写：个人贡献、引擎与开发工具。'],['测试与迭代',item.iteration,'待填写：测试反馈、修改内容与结论。']];
    const attachments = (kind === 'plan' ? [['阅读完整文档',item.documentUrl]] : [['在线试玩',item.playUrl],['下载 Demo',item.downloadUrl],['观看演示',item.videoUrl]]).filter(([,url]) => safeUrl(url));
    $('#dialog-content').innerHTML = `<header class="detail-heading"><span class="tape" aria-hidden="true"></span><span class="pixel-sticker ${kind === 'plan' ? 'sticker-folder' : 'sticker-stars'} detail-sticker" aria-hidden="true"></span><h2 id="dialog-title">${escape(item.title)}</h2><p class="dialog-status">${escape(item.category)}${item.goal ? '' : ' · 内容待补充'}</p><p class="detail-summary">${escape(item.summary)}</p></header>${fields(sectionFields)}<footer class="detail-attachments">${attachments.length ? `<h3>附件与链接</h3><div class="detail-actions">${attachments.map(([label,url]) => `<a class="detail-link" href="${escape(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label}<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 13 13 3M3 3h10v10"/></svg></a>`).join('')}</div>` : '<p class="detail-pending">附件待添加</p>'}</footer>`;
    document.body.style.overflow = 'hidden'; window.openPortfolioWindow(dialog,trigger); $('#close-dialog').focus();
  });
  $('#close-dialog').addEventListener('click', () => window.closePortfolioWindow(dialog));
  dialog.addEventListener('click', event => {if(event.target === dialog) {const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) window.closePortfolioWindow(dialog);}});
  dialog.addEventListener('cancel', event => {event.preventDefault();window.closePortfolioWindow(dialog);});
  dialog.addEventListener('close', () => {document.body.style.overflow = ''; lastTrigger?.focus();});
  const resumeUrl = safeUrl(data.resumeUrl); const download = $('#resume-download');
  if(resumeUrl) {download.href = resumeUrl; download.target = '_blank'; download.rel = 'noopener noreferrer'; download.removeAttribute('aria-disabled'); download.textContent = '下载简历 PDF';}
  const email = typeof data.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? data.email : '';
  if(email) {const contact = $('#contact-email');contact.href = `mailto:${email}`;contact.removeAttribute('aria-disabled');contact.textContent='邮件联系';}
  $('#print-resume').addEventListener('click', () => window.print());
  document.addEventListener('keydown', event => {if (event.key.toLowerCase() === 'c' && !event.altKey && !event.ctrlKey && !event.metaKey && !dialog.open && !event.target.closest('input,textarea,[contenteditable="true"]')) {event.preventDefault(); location.hash = 'contact';}});
  if(data.skills.length) {$('#skill-list').innerHTML = data.skills.map(s => `<span>${escape(s)}</span>`).join('');}
  if(data.experience.length) {$('#experience-list').innerHTML = data.experience.map(e => `<section class="experience-entry"><h4>${escape(e.title)}</h4><p>${escape(e.period)}</p><p>${escape(e.description)}</p></section>`).join('');}
  document.querySelectorAll('[aria-disabled="true"]').forEach(a => {a.tabIndex = -1;});
  document.querySelectorAll('.save-slot').forEach(link => link.addEventListener('click', () => {document.querySelectorAll('.save-slot').forEach(a => a.classList.remove('active'));link.classList.add('active');}));
  document.querySelectorAll('.text-button').forEach(button => button.insertAdjacentHTML('beforeend','<svg class="action-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 13 13 3M3 3h10v10"/></svg>'));
})();
