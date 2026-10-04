/* Restore before first paint; one state drives the status key and sky renderer. */
(() => {
  'use strict';
  const root = document.documentElement;
  let mode = 'day';
  try { if (localStorage.getItem('portfolio-sky') === 'night') mode = 'night'; } catch {}
  root.dataset.sky = mode;
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('#sky-toggle');
    const label = toggle.querySelector('[data-sky-label]');
    function apply() {
      root.dataset.sky = mode;
      toggle.setAttribute('aria-pressed', String(mode === 'night'));
      toggle.title = mode === 'night' ? '切换到日间天空' : '切换到夜间星空';
      label.textContent = mode === 'night' ? '夜间' : '日间';
      document.querySelector('meta[name="theme-color"]').content = mode === 'night' ? '#15233e' : '#c7e8f8';
      window.dispatchEvent(new CustomEvent('portfolio-sky-change', {detail: mode}));
    }
    toggle.addEventListener('click', () => {
      mode = mode === 'day' ? 'night' : 'day';
      try { localStorage.setItem('portfolio-sky', mode); } catch {}
      apply();
    });
    apply();
  });
})();
