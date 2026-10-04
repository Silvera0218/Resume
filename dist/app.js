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
  $('#plan-list').innerHTML = data.plans.map((plan, i) => `<article class="plan-card"><div class="document-cover">${assetUrl(plan.cover) ? `<img class="cover-image" src="${escape(assetUrl(plan.cover))}" alt="${escape(plan.title)}封面" loading="lazy">` : `<span class="pixel cover-word">${words[i % words.length].replace('\n', '<br>')}</span><span class="cover-bottom"><span class="cover-tag">DESIGN DOC</span><span>封面待添加</span></span>`}</div><div class="meta"><span>${escape(plan.category)}</span><span>${plan.documentUrl ? '策划作品' : '内容待填写'}</span></div><h3>${escape(plan.title)}</h3><p>${escape(plan.summary)}</p><button class="text-button" type="button" data-detail="${escape(plan.id)}" data-kind="plan">${plan.goal || plan.documentUrl ? '查看策划案' : '查看内容提纲'}</button></article>`).join('');
  $('#demo-list').innerHTML = data.demos.map(demo => `<article class="demo-card"><div class="demo-screen">${assetUrl(demo.cover) ? `<img class="cover-image" src="${escape(assetUrl(demo.cover))}" alt="${escape(demo.title)}实机截图" loading="lazy">` : `<div class="demo-placeholder"><div class="pixel-frame" aria-hidden="true"></div><span class="pixel">COMING SOON</span><span>截图或演示待添加</span></div>`}</div><div class="demo-body"><div class="demo-topline"><h3>${escape(demo.title)}</h3><span class="demo-category">${escape(demo.category)}</span></div><p>${escape(demo.summary)}</p><div class="demo-actions">${safeUrl(demo.playUrl) ? `<a class="button primary" href="${escape(safeUrl(demo.playUrl))}" target="_blank" rel="noopener noreferrer">在线试玩</a>` : '<button class="button" type="button" disabled>试玩地址待添加</button>'}<button class="text-button" type="button" data-detail="${escape(demo.id)}" data-kind="demo">${demo.goal ? '查看原型说明' : '查看内容提纲'}</button></div></div></article>`).join('');
  const completedPlans = data.plans.filter(p => p.goal || safeUrl(p.documentUrl)).length;
  const completedDemos = data.demos.filter(d => safeUrl(d.playUrl)).length;
  if (completedPlans) $('#plans .section-status').textContent = `${completedPlans} 份策划案`;
  if (completedDemos) $('#demos .section-status').textContent = `${completedDemos} 个可试玩原型`;
  function linkButton(label, value, pending) {const url = safeUrl(value); return url ? `<a class="button primary" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : `<button class="button" disabled type="button">${pending}</button>`;}
  const fields = (items) => `<div class="detail-grid">${items.map(([name,value,hint]) => `<section class="detail-field"><h3>${name}</h3><p>${escape(value || hint)}</p></section>`).join('')}</div>`;
  const dialog = $('#detail-dialog'); let lastTrigger;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-detail]'); if(!trigger) return;
    lastTrigger = trigger;
    const kind = trigger.dataset.kind; const item = (kind === 'plan' ? data.plans : data.demos).find(p => p.id === trigger.dataset.detail); if(!item) return;
    $('#dialog-kind').textContent = kind === 'plan' ? 'DESIGN DOCUMENT' : 'GAME PROTOTYPE';
    const sectionFields = kind === 'plan' ? [['设计目标',item.goal,'待填写：目标玩家、具体问题与设计目标。'],['核心循环',item.loop,'待填写：玩家行为、规则响应与奖励反馈。'],['系统规则',item.rules,'待填写：流程、条件、数值与边界情况。'],['验证与迭代',item.validation,'待填写：测试方式、观察结果与调整依据。']] : [['验证目标',item.goal,'待填写：这个原型要验证的设计假设。'],['操作与玩法',item.controls,'待填写：输入方式、目标与核心规则。'],['职责与工具', [item.role,item.engine].filter(Boolean).join(' / '),'待填写：个人贡献、引擎与开发工具。'],['测试与迭代',item.iteration,'待填写：测试反馈、修改内容与结论。']];
    $('#dialog-content').innerHTML = `<h2 id="dialog-title">${escape(item.title)}</h2><div class="dialog-status">${item.goal ? escape(item.category) : '内容提纲 · 项目待补充'}</div><p>${escape(item.summary)}</p>${fields(sectionFields)}<div class="detail-actions">${kind === 'plan' ? linkButton('阅读完整文档',item.documentUrl,'文档附件待添加') : [linkButton('在线试玩',item.playUrl,'试玩地址待添加'),linkButton('下载 Demo',item.downloadUrl,'下载文件待添加'),linkButton('观看演示',item.videoUrl,'演示视频待添加')].join('')}</div>`;
    document.body.style.overflow = 'hidden'; window.openPortfolioWindow(dialog,trigger); $('#close-dialog').focus();
  });
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {if(event.target === dialog) {const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();}});
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
