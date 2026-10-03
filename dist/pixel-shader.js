/* Original WebGL implementation. Interaction references: React Bits Pixel Blast
   https://reactbits.dev/backgrounds/pixel-blast (MIT + Commons Clause). No third-party source copied. */
(() => {
  'use strict';
  window.createPixelField = canvas => {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const vertex = `attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
    const fragment = `
      precision highp float;
      uniform vec2 uResolution;
      uniform vec2 uPointer;
      uniform vec2 uClick;
      uniform float uTime;
      uniform float uClickAge;
      uniform float uPixel;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 xy=gl_FragCoord.xy;
        vec2 cell=floor(xy/uPixel);
        vec2 center=(cell+0.5)*uPixel;
        float seed=hash(cell);
        float breathing=0.5+0.5*sin(uTime*0.5+seed*24.0+cell.x*0.06);
        float wave=0.5+0.5*sin(cell.x*0.09+cell.y*0.035-uTime*0.18);
        float nearPointer=1.0-smoothstep(0.0,140.0,distance(center,uPointer));
        float radius=max(uClickAge,0.0)*145.0;
        float ring=1.0-smoothstep(5.0,24.0,abs(distance(center,uClick)-radius));
        float ripple=ring*exp(-max(uClickAge,0.0)*2.0)*step(0.0,uClickAge)*step(uClickAge,3.0);
        float field=step(0.993,seed)*(0.10+breathing*0.22+wave*0.08);
        float interactive=step(0.89,seed)*(nearPointer*0.20+ripple*0.38);
        // Low-contrast, dithered orbital field inspired by Moonshot Careers.
        // Geometry and rendering are original; the readable left column stays quiet.
        vec2 q=(center-uResolution*vec2(0.73,0.52))/min(uResolution.x,uResolution.y);
        float angle=atan(q.y,q.x);
        float orbitRadius=0.43+sin(angle*3.0+uTime*0.10)*0.025;
        float band=exp(-pow((length(q)-orbitRadius)/0.065,2.0));
        float leftFade=smoothstep(0.25,0.65,center.x/uResolution.x);
        float threshold=fract(dot(mod(cell,4.0),vec2(0.25,0.625)));
        float dither=step(threshold,band*0.42)*step(0.30,seed);
        float orbit=dither*leftFade*(uResolution.x<800.0?0.045:0.12);
        vec2 local=abs(xy-center);
        float pixelSize=mix(1.0,2.0,step(0.997,seed));
        float square=step(max(local.x,local.y),pixelSize);
        vec3 color=mix(vec3(0.48,0.65,0.59),vec3(0.53,0.92,0.83),nearPointer+ripple*0.5);
        gl_FragColor=vec4(color,(field+interactive+orbit)*square);
      }`;
    const shaders = [];
    function compile(type, source) {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw new Error('Pixel shader compilation failed'); }
      shaders.push(shader); return shader;
    }
    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Pixel shader linking failed');
    } catch {
      shaders.forEach(shader=>gl.deleteShader(shader)); if(program)gl.deleteProgram(program); return null;
    }
    shaders.forEach(shader=>gl.deleteShader(shader));
    gl.useProgram(program);
    const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const uniforms=Object.fromEntries(['uResolution','uPointer','uClick','uTime','uClickAge','uPixel'].map(name=>[name,gl.getUniformLocation(program,name)]));
    let lost=false, clickTime=-10000, click=[-1000,-1000];
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.hidden=true;});
    canvas.addEventListener('webglcontextrestored',()=>{lost=true;canvas.hidden=true;});
    return {
      get available(){return !lost;},
      resize(width,height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);gl.uniform2f(uniforms.uResolution,width,height);gl.uniform1f(uniforms.uPixel,width<800?15:12);},
      click(x,y,time){click=[x,canvas.height-y];clickTime=time;},
      render(time,pointer){
        if(lost)return;
        gl.uniform1f(uniforms.uTime,time/1000);
        gl.uniform2f(uniforms.uPointer,pointer.x,canvas.height-pointer.y);
        gl.uniform2f(uniforms.uClick,...click);gl.uniform1f(uniforms.uClickAge,(time-clickTime)/1000);
        gl.drawArrays(gl.TRIANGLES,0,6);
      },
      clear(){if(!lost)gl.clear(gl.COLOR_BUFFER_BIT);}
    };
  };
})();
