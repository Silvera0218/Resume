// CSS owns the two tactile icons, including their no-WebGL fallback.
const quiet=matchMedia('(prefers-reduced-motion: reduce)');
const ring=[[0,-20],[8,-18],[14,-14],[18,-8],[20,0],[18,8],[14,14],[8,18],[0,20],[-8,18],[-14,14],[-18,8],[-20,0],[-18,-8],[-14,-14],[-8,-18]];
for(const name of ['controller','profile']){
  const target=document.querySelector(`[data-sticker="${name}"]`);
  if(!target)continue;
  const link=target.closest('a'),art=target.querySelector('svg');
  target.classList.add('css-sticker');
  const object=document.createElement('span');object.className=`tactile-object ${name}-object`;
  target.append(object);
  if(name==='controller'){
    object.append(art);art.classList.add('controller-base');
    const masks=['circle(5.95% at 72.61% 48.84%)','circle(5.95% at 81.19% 57.43%)','circle(5.95% at 72.61% 66.34%)','circle(5.95% at 64.69% 57.43%)'];
    masks.forEach((mask,index)=>{
      const socket=document.createElement('span');socket.className='controller-socket';socket.style.clipPath=mask;object.append(socket);
      const cap=art.cloneNode(true);cap.classList.remove('controller-base');cap.classList.add('controller-cap');cap.style.clipPath=mask;cap.style.setProperty('--press-delay',`${index*45}ms`);object.append(cap);
    });
    const pulse=document.createElement('span');pulse.className='controller-ripple';
    for(let wave=0;wave<2;wave++)for(const [x,y] of ring){const dot=document.createElement('i');dot.style.setProperty('--dx',`${x}px`);dot.style.setProperty('--dy',`${y}px`);dot.style.setProperty('--wave-delay',`${wave*150}ms`);pulse.append(dot);}
    target.append(pulse);
  }else{
    for(const side of ['left','right']){const card=document.createElement('span');card.className=`profile-back profile-back-${side}`;object.append(card);}
    const front=document.createElement('span');front.className='profile-front';front.append(art);
    const foil=document.createElement('span');foil.className='profile-foil';front.append(foil);object.append(front);
  }
  let hover=false,focus=false,touch=false,frame=0;
  const disabled=()=>quiet.matches||document.body.classList.contains('fx-off');
  function burst(){
    if(name!=='controller'||disabled())return;
    target.classList.remove('is-pulsing');cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{frame=0;if(!disabled())target.classList.add('is-pulsing');});
  }
  function sync(){target.classList.toggle('is-engaged',hover||focus||touch);target.classList.toggle('is-held',touch);if(disabled())target.classList.remove('is-pulsing');}
  link.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;sync();burst();}});
  link.addEventListener('pointerleave',()=>{hover=false;touch=false;target.style.removeProperty('--foil-x');target.style.removeProperty('--foil-y');sync();});
  link.addEventListener('focus',()=>{focus=link.matches(':focus-visible');sync();if(focus)burst();});
  link.addEventListener('blur',()=>{focus=false;touch=false;sync();});
  link.addEventListener('pointerdown',()=>{touch=true;sync();burst();});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])link.addEventListener(event,()=>{touch=false;sync();});
  link.addEventListener('pointermove',event=>{if(name!=='profile'||event.pointerType!=='mouse'||disabled())return;const r=target.getBoundingClientRect();target.style.setProperty('--foil-x',`${Math.max(0,Math.min(100,(event.clientX-r.left)/r.width*100))}%`);target.style.setProperty('--foil-y',`${Math.max(0,Math.min(100,(event.clientY-r.top)/r.height*100))}%`);},{passive:true});
  target.addEventListener('animationend',event=>{if(event.animationName==='pixel-ring-out'&&event.target.style.getPropertyValue('--wave-delay')==='150ms')target.classList.remove('is-pulsing');});
  addEventListener('blur',()=>{hover=focus=touch=false;sync();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;hover=focus=touch=false;target.classList.remove('is-pulsing');sync();}});
  quiet.addEventListener('change',sync);new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
}
