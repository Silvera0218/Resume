import {WebGLRenderer,Scene,OrthographicCamera,Group,PlaneGeometry,Mesh,MeshBasicMaterial,CanvasTexture,NearestFilter,SRGBColorSpace,DoubleSide} from 'three';

// 一个共享的透明 Three.js 画布，只在触碰、焦点或路由变化时绘制。
const host=document.querySelector('.site-header nav');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const image=new Image(),worldImage=new Image();
function loadImage(image,url){return new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});image.src=url;});}
Promise.all([loadImage(image,window.STICKER_ATLAS.url),loadImage(worldImage,window.WORLD_ATLAS.url)]).then(()=>{
  if(!image.naturalWidth)return;
  let renderer;
  try {renderer=new WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);
  renderer.domElement.className='sticker-icon-scene';renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
  const scene=new Scene(),camera=new OrthographicCamera();camera.position.z=100;
  const textures=new Map();
  function texture(name){
    if(textures.has(name))return textures.get(name);
    const atlas=window.STICKER_ATLAS.sprites[name]?window.STICKER_ATLAS:window.WORLD_ATLAS;
    const [x,y,w,h]=atlas.sprites[name],tile=document.createElement('canvas');tile.width=w;tile.height=h;tile.getContext('2d').drawImage(atlas===window.STICKER_ATLAS?image:worldImage,x,y,w,h,0,0,w,h);
    const map=new CanvasTexture(tile);map.colorSpace=SRGBColorSpace;map.magFilter=map.minFilter=NearestFilter;map.generateMipmaps=false;textures.set(name,map);return map;
  }
  function plane(name,size){const [, ,w,h]=window.STICKER_ATLAS.sprites[name]||window.WORLD_ATLAS.sprites[name],scale=size/Math.max(w,h);return new Mesh(new PlaneGeometry(w*scale,h*scale),new MeshBasicMaterial({map:texture(name),transparent:true,alphaTest:.04,side:DoubleSide,depthWrite:false}));}
  let frame=0,last=0;
  const items=[...host.querySelectorAll('.desktop-file')].map(link=>{
    const target=link.querySelector('[data-sticker]'),group=new Group(),name=target.dataset.sticker;
    const art=plane(name,54);group.add(art);scene.add(group);
    const item={link,target,group,art,name,hover:false,focus:false,touch:false,t:0,px:0,py:0};
    if(name==='folder'){
      item.papers=plane('documents',42);item.papers.position.z=1;group.add(item.papers);
      item.hinge=new Group();item.hinge.position.y=-22;group.add(item.hinge);
      item.cover=plane('folderOpen',54);item.cover.position.set(0,22,2);item.hinge.add(item.cover);
    }
    if(name==='notebook'&&worldImage.naturalWidth){
      item.openBook=plane('notebookOpen',58);item.openBook.position.z=-1;group.add(item.openBook);
      item.art.geometry.translate(24,0,0);item.art.position.x=-24;
    }
    const update=()=>{item.hover=link.matches(':hover');item.focus=link.matches(':focus-visible');animate();};
    link.addEventListener('pointerenter',update);link.addEventListener('pointerleave',()=>{item.hover=false;item.px=item.py=0;animate();});
    link.addEventListener('focus',update);link.addEventListener('blur',()=>{item.focus=false;animate();});
    link.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse')return;const r=target.getBoundingClientRect();item.px=(event.clientX-r.x)/r.width-.5;item.py=(event.clientY-r.y)/r.height-.5;animate();},{passive:true});
    link.addEventListener('pointerdown',()=>{item.touch=true;animate();});
    ['pointerup','pointercancel'].forEach(type=>link.addEventListener(type,()=>{item.touch=false;animate();}));
    return item;
  });
  host.classList.add('three-icons-ready');
  function layout(){
    const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);
    camera.left=-r.width/2;camera.right=r.width/2;camera.top=r.height/2;camera.bottom=-r.height/2;camera.near=.1;camera.far=200;camera.updateProjectionMatrix();
    for(const item of items){const box=item.target.getBoundingClientRect();item.baseX=box.x+box.width/2-r.x-r.width/2;item.baseY=r.height/2-(box.y+box.height/2-r.y);item.size=Math.min(box.width,box.height)/64;}
    animate();
  }
  function draw(time){
    frame=0;const dt=last?Math.min((time-last)/1000,.08):.016;last=time;let moving=false;
    const staticMotion=reduced.matches||document.body.classList.contains('fx-off');
    for(const item of items){
      const selected=item.link.getAttribute('aria-current')==='page',goal=item.hover||item.focus||item.touch?1:selected?.45:0;
      if(staticMotion)item.t=goal;else item.t+=(goal-item.t)*(1-Math.exp(-dt*15));
      if(Math.abs(item.t-goal)>.002)moving=true;else item.t=goal;
      item.group.position.set(item.baseX,item.baseY+item.t*4,0);
      item.group.scale.setScalar(item.size*(1+item.t*.08));
      item.group.rotation.set(staticMotion?0:item.py*-.25,staticMotion?0:item.px*.3,item.name==='controller'?-item.t*.08:0);
      if(item.papers){item.art.material.opacity=1-item.t;item.cover.material.opacity=item.t;item.papers.material.opacity=item.t;item.papers.position.y=5+item.t*24;item.papers.rotation.z=item.t*-.12;item.hinge.rotation.x=item.t*-.65;}
      if(item.openBook){item.art.rotation.y=-item.t*1.4;item.art.material.opacity=1-item.t;item.openBook.material.opacity=item.t;item.openBook.scale.x=.7+item.t*.3;}
    }
    renderer.render(scene,camera);if(moving&&!document.hidden)frame=requestAnimationFrame(draw);else last=0;
  }
  function animate(){if(!frame&&!document.hidden)frame=requestAnimationFrame(draw);}
  new ResizeObserver(layout).observe(host);addEventListener('resize',layout,{passive:true});addEventListener('portfolio-view-change',animate);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;items.forEach(i=>i.touch=false);}else animate();});
  reduced.addEventListener('change',animate);new MutationObserver(animate).observe(document.body,{attributes:true,attributeFilter:['class']});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;host.classList.remove('three-icons-ready');});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{host.classList.add('three-icons-ready');layout();});
  layout();
});
