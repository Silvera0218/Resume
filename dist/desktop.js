/* Physical material cues and movable peripheral windows. The reading sheet stays anchored. */
(() => {
  'use strict';
  const desktopInput = matchMedia('(min-width: 961px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const surfaces = [...document.querySelectorAll('[data-movable]')];

  // A deterministic, low-contrast paper fibre tile, generated once rather than animated.
  const tile = document.createElement('canvas');
  tile.width = tile.height = 128;
  const ink = tile.getContext('2d');
  if (ink) {
    let seed = 218;
    const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
    const pixels = ink.createImageData(128, 128);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const value = 98 + Math.floor(random() * 75);
      pixels.data[i] = value; pixels.data[i + 1] = value - 5; pixels.data[i + 2] = value - 12;
      pixels.data[i + 3] = Math.floor(random() * 14);
    }
    ink.putImageData(pixels, 0, 0);
    ink.strokeStyle = 'rgba(132,119,101,.035)';
    for (let i = 0; i < 36; i++) {
      const x = random() * 128, y = random() * 128;
      ink.beginPath(); ink.moveTo(x, y); ink.lineTo(x + 1 + random() * 3, y + random() * 2); ink.stroke();
    }
    document.documentElement.style.setProperty('--paper-grain', `url("${tile.toDataURL()}")`);
  }

  for (const surface of surfaces) {
    const handle = surface.querySelector('[data-drag-handle]');
    let x = 0, y = 0, drag = null, lightFrame = 0;
    let lightX = 25, lightY = 0;
    const place = () => {
      surface.style.setProperty('--window-x', `${Math.round(x)}px`);
      surface.style.setProperty('--window-y', `${Math.round(y)}px`);
    };
    const finish = () => {
      const active = drag; drag = null;
      surface.classList.remove('is-dragging');
      if (active && handle.hasPointerCapture(active.id)) handle.releasePointerCapture(active.id);
    };
    const reset = () => { finish(); x = y = 0; place(); };
    const move = (nextX, nextY) => {
      const bounds = surface.getBoundingClientRect();
      // Keep title handles reachable and auxiliary objects near their original desktop zone.
      const baseLeft = bounds.left - x, baseTop = bounds.top - y;
      x = Math.max(Math.max(-160, 12 - baseLeft), Math.min(Math.min(160, innerWidth - bounds.width - 12 - baseLeft), nextX));
      y = Math.max(Math.max(-140, 12 - baseTop), Math.min(Math.min(140, innerHeight - 52 - baseTop), nextY));
      place();
    };
    const sync = () => {
      reset();
      handle.tabIndex = desktopInput.matches ? 0 : -1;
      if (desktopInput.matches) {
        handle.setAttribute('role', 'group');
        handle.setAttribute('aria-roledescription', '可移动窗口');
        handle.setAttribute('aria-label', `${surface.dataset.movable}。方向键移动，Enter 或 Escape 复位。`);
        handle.title = '拖动窗口 · 方向键移动 · Enter 复位';
      } else {
        handle.removeAttribute('role'); handle.removeAttribute('aria-label'); handle.removeAttribute('aria-roledescription'); handle.removeAttribute('title');
      }
    };
    handle.addEventListener('pointerdown', event => {
      if (!desktopInput.matches || event.button !== 0) return;
      event.preventDefault(); handle.focus({preventScroll:true});
      finish(); drag = {id:event.pointerId, px:event.clientX, py:event.clientY, x, y};
      handle.setPointerCapture(event.pointerId); surface.classList.add('is-dragging');
    });
    handle.addEventListener('pointermove', event => {
      if (drag && drag.id === event.pointerId) move(drag.x + event.clientX - drag.px, drag.y + event.clientY - drag.py);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => handle.addEventListener(type, finish));
    handle.addEventListener('keydown', event => {
      if (!desktopInput.matches) return;
      if (['Enter', 'Escape'].includes(event.key)) {event.preventDefault(); reset(); return;}
      const step = {ArrowLeft:[-12,0], ArrowRight:[12,0], ArrowUp:[0,-12], ArrowDown:[0,12]}[event.key];
      if (step) {event.preventDefault(); move(x + step[0], y + step[1]);}
    });
    surface.addEventListener('pointermove', event => {
      if (!desktopInput.matches || event.pointerType !== 'mouse' || reducedMotion.matches || document.body.classList.contains('fx-off')) return;
      const bounds = surface.getBoundingClientRect();
      lightX = (event.clientX - bounds.left) / bounds.width * 100;
      lightY = (event.clientY - bounds.top) / bounds.height * 100;
      if (!lightFrame) lightFrame = requestAnimationFrame(() => {
        lightFrame = 0;
        surface.style.setProperty('--light-x', `${lightX}%`); surface.style.setProperty('--light-y', `${lightY}%`);
      });
    }, {passive:true});
    surface.addEventListener('pointerleave', () => {
      cancelAnimationFrame(lightFrame); lightFrame = 0;
      surface.style.removeProperty('--light-x'); surface.style.removeProperty('--light-y');
    });
    addEventListener('blur', finish);
    addEventListener('resize', reset, {passive:true});
    document.addEventListener('visibilitychange', () => {if (document.hidden) finish();});
    desktopInput.addEventListener('change', sync);
    sync();
  }
})();
