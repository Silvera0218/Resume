const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const controller = fs.readFileSync('dist/sky-mode.js', 'utf8');
function page(saved, blocked = false) {
  const root = {dataset:{}}, attrs = {}, listeners = {}, label = {}, meta = {}, events = [];
  const button = {querySelector:()=>label, setAttribute:(k,v)=>attrs[k]=v, addEventListener:(k,v)=>listeners[k]=v};
  const storage = {getItem(){if(blocked) throw Error(); return saved;},setItem(k,v){if(blocked) throw Error(); saved=v;}};
  vm.runInNewContext(controller, {document:{documentElement:root,addEventListener:(k,v)=>listeners[k]=v,querySelector:s=>s==='#sky-toggle'?button:meta},localStorage:storage,window:{dispatchEvent:e=>events.push(e)},CustomEvent:class{constructor(type, options){this.type=type;this.detail=options.detail;}}});
  return {root,attrs,label,meta,events,get saved(){return saved;},ready:()=>listeners.DOMContentLoaded(),click:()=>listeners.click()};
}
const restored=page('night');
assert.equal(restored.root.dataset.sky,'night','Restore sky before DOM content loads');
restored.ready(); assert.equal(restored.attrs['aria-pressed'],'true');
restored.click(); assert.equal(restored.saved,'day'); assert.equal(restored.label.textContent,'日间');
assert.equal(restored.events.at(-1).detail,'day');
restored.click(); assert.equal(restored.saved,'night'); assert.equal(restored.meta.content,'#15233e');
const blocked=page(null,true); blocked.ready(); blocked.click();
assert.equal(blocked.root.dataset.sky,'night','Storage restrictions do not disable the control');

// Check the shader lifecycle at the pause boundary, where theme changes must repaint
// without restarting motion or accumulating the time spent in a background tab.
const uniforms = {}, gpuEvents = {};
const gl = new Proxy({
  createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),
  getShaderParameter:()=>true,getProgramParameter:()=>true,
  getUniformLocation:(_,name)=>name,uniform1f:(name,value)=>uniforms[name]=value
}, {get:(o,k)=>o[k]||(()=>{})});
const canvas={dataset:{},getContext:()=>gl,addEventListener:(k,v)=>gpuEvents[k]=v};
const context={window:{},document:{documentElement:{dataset:{sky:'night'}}}};
vm.runInNewContext(fs.readFileSync('dist/pixel-shader.js','utf8'),context);
const sky=context.window.createPixelField(canvas);
sky.resize(1324,758); assert.equal(uniforms.uNight,1); assert.equal(uniforms.uMotion,0);
sky.render(1000); sky.render(1040); assert.equal(uniforms.uMotion,1);
sky.clear(); const pausedTime=uniforms.uTime;
assert.equal(uniforms.uMotion,0,'Paused sky hides meteors');
sky.setNight(false); assert.equal(uniforms.uNight,0); assert.equal(uniforms.uMotion,0);
sky.setNight(true); assert.equal(uniforms.uNightTime,0,'A new night starts its own sky rotation');
sky.render(60000); assert.equal(uniforms.uTime,pausedTime,'Resume ignores background elapsed time');
sky.setNight(false);
assert.equal(uniforms.uNight,1,'Animated switches start from the currently rendered sky');
sky.render(60040);
const partial=uniforms.uNight;
assert.ok(partial>0&&partial<1,'Day and night are blended during the transition');
sky.setNight(true);
assert.equal(uniforms.uNight,partial,'Reversing mid-transition does not jump');
for(let t=60080;t<=61120;t+=40)sky.render(t);
assert.equal(uniforms.uNight,1,'The reversed transition reaches its target');
gpuEvents.webglcontextlost({preventDefault(){}});
assert.equal(sky.available,false); assert.equal(canvas.hidden,true);
sky.setNight(false); // CSS fallback can still change after context loss.
console.log('Sky mode: persistence, storage restrictions, smooth switching/reversal, pause/resume and GPU fallback passed.');
