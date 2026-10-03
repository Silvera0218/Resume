/* Original pixel-cloud sky shader. Four side faces form a continuous rotating
   environment; all faces sample the same world-space cloud field. No dependency. */
(() => {
  'use strict';
  window.createPixelField=canvas=>{
    const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
    if(!gl)return null;
    const vertex='attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.0,1.0);}';
    const fragment=`precision highp float;
      uniform vec2 uResolution;uniform float uTime;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float clouds(vec2 p){return noise(p)*.58+noise(p*2.0+17.0)*.28+noise(p*4.0+31.0)*.14;}
      vec3 cubeDirection(vec3 ray){
        // Four vertical skybox faces (+X,-X,+Z,-Z), projected from one camera.
        // Shared world coordinates keep the cloud field continuous at each seam.
        float a=max(abs(ray.x),abs(ray.z));vec3 face=ray/a;
        if(abs(ray.x)>abs(ray.z))face.x=sign(ray.x);else face.z=sign(ray.z);
        return normalize(face);
      }
      void main(){
        vec2 uv=(floor(gl_FragCoord.xy/3.0)*3.0+1.5)/uResolution;
        vec2 screen=uv*2.0-1.0;screen.x*=uResolution.x/uResolution.y;
        vec3 ray=normalize(vec3(screen.x*.7,screen.y*.5+.9,1.0));
        float yaw=uTime*.008;ray.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*ray.xz;
        ray=cubeDirection(ray);
        vec2 world=ray.xz/(ray.y+.32)*3.6+vec2(uTime*.008,0.0);
        float density=clouds(world+vec2(8.0,3.0));
        float cloud=floor(smoothstep(.58,.69,density)*5.0)/5.0;
        float shadow=smoothstep(.53,.6,clouds(world+vec2(8.0,3.09)));
        vec3 sky=mix(vec3(.82,.92,.98),vec3(.59,.79,.94),uv.y);
        vec3 white=mix(vec3(.84,.91,.965),vec3(.99,.99,1.0),shadow);
        gl_FragColor=vec4(mix(sky,white,cloud*.88),1.0);
      }`;
    const shaders=[];let program;
    function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw new Error('Sky shader compilation failed');}shaders.push(s);return s;}
    try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Sky shader linking failed');}
    catch{shaders.forEach(s=>gl.deleteShader(s));if(program)gl.deleteProgram(program);canvas.hidden=true;return null;}
    shaders.forEach(s=>gl.deleteShader(s));gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const resolution=gl.getUniformLocation(program,'uResolution'),timeUniform=gl.getUniformLocation(program,'uTime');
    canvas.dataset.renderer='webgl-sky';
    let lost=false,lastFrame=null,elapsed=0;
    function paint(time){if(lost)return;gl.uniform1f(timeUniform,time);gl.drawArrays(gl.TRIANGLES,0,6);}
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.hidden=true;});
    // A lost GPU context leaves the CSS sky visible until the next page load.
    canvas.addEventListener('webglcontextrestored',()=>{lost=true;canvas.hidden=true;});
    return{
      get available(){return !lost;},
      resize(width,height){if(lost)return;canvas.width=Math.ceil(width/3);canvas.height=Math.ceil(height/3);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolution,canvas.width,canvas.height);paint(elapsed);},
      render(time){if(lastFrame!==null)elapsed+=Math.min(time-lastFrame,70)/1000;lastFrame=time;paint(elapsed);},
      click(){},clear(){lastFrame=null;paint(elapsed);}
    };
  };
})();
