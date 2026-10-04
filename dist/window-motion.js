/* Native windows keep their focus trap until the return animation has finished. */
(() => {
  const states = new WeakMap();
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('fx-off');
  function stop(dialog) {
    const state=states.get(dialog);
    state?.animation?.cancel();
    state?.resolve?.(false);
    states.delete(dialog);
  }
  function iconFrame(dialog, trigger) {
    const source=(trigger?.querySelector('.sticker-icon') || trigger)?.getBoundingClientRect();
    const target=dialog.getBoundingClientRect();
    if(!source || !source.width || !source.height)return null;
    return {opacity:0,transform:`translate(${source.left+source.width/2-target.left-target.width/2}px,${source.top+source.height/2-target.top-target.height/2}px) scale(${source.width/target.width},${source.height/target.height})`,borderRadius:'18px'};
  }
  window.openPortfolioWindow = (dialog, trigger) => {
    stop(dialog);
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;
    const quiet=reduced(), from=quiet?null:iconFrame(dialog,trigger);
    const state={trigger,phase:'opening'};states.set(dialog,state);dialog.dataset.windowPhase='opening';
    state.animation=dialog.animate([from || {opacity:0},{opacity:1,transform:'none',borderRadius:getComputedStyle(dialog).borderRadius}],{duration:quiet?100:420,easing:'cubic-bezier(.16,1,.3,1)'});
    state.animation.finished.then(()=>{if(states.get(dialog)===state){state.phase='open';dialog.dataset.windowPhase='open';}},()=>{});
  };
  window.closePortfolioWindow = dialog => {
    if(!dialog.open)return Promise.resolve(true);
    const prior=states.get(dialog);
    if(prior?.phase==='closing')return prior.promise;
    const computed=getComputedStyle(dialog), from={opacity:computed.opacity,transform:computed.transform,borderRadius:computed.borderRadius};
    const trigger=prior?.trigger;
    stop(dialog);
    const quiet=reduced(), to=quiet?null:iconFrame(dialog,trigger);
    const state={trigger,phase:'closing'};
    state.promise=new Promise(resolve=>{state.resolve=resolve});
    states.set(dialog,state);dialog.dataset.windowPhase='closing';
    state.animation=dialog.animate([quiet?{opacity:from.opacity}:from,to || {opacity:0}],{duration:quiet?90:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
    state.animation.finished.then(()=>{
      if(states.get(dialog)!==state)return;
      states.delete(dialog);dialog.dataset.windowPhase='closed';dialog.close();state.animation.cancel();state.resolve(true);
    },()=>{if(states.get(dialog)===state){states.delete(dialog);state.resolve(false);}});
    return state.promise;
  };
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{stop(dialog);dialog.dataset.windowPhase='closed';}));
})();
