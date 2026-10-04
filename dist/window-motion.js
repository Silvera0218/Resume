/* Expand a native dialog from its actual launcher, without changing its layout. */
(() => {
  const active = new WeakMap();
  window.openPortfolioWindow = (dialog, trigger) => {
    active.get(dialog)?.cancel();
    const source = (trigger?.querySelector('.sticker-icon') || trigger)?.getBoundingClientRect();
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    const target = dialog.getBoundingClientRect();
    const quiet = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('fx-off');
    const frames = quiet || !source ? [{opacity:0},{opacity:1}] : [
      {opacity:.25, transform:`translate(${source.left + source.width / 2 - target.left - target.width / 2}px,${source.top + source.height / 2 - target.top - target.height / 2}px) scale(${source.width / target.width},${source.height / target.height})`, borderRadius:'18px'},
      {opacity:1, transform:'translate(0,0) scale(1)', borderRadius:getComputedStyle(dialog).borderRadius}
    ];
    const animation = dialog.animate(frames, {duration:quiet ? 100 : 420, easing:'cubic-bezier(.16,1,.3,1)'});
    active.set(dialog, animation);
  };
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => active.get(dialog)?.cancel()));
})();
