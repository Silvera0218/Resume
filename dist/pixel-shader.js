/* Original pixel-cloud sky shader. Four side faces form a continuous rotating
   environment; all faces sample the same world-space cloud field. No dependency. */
(() => {
  'use strict';
  window.createPixelField=canvas=>{
    const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
    if(!gl)return null;
    const vertex='attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.0,1.0);}';
    const fragment=`precision highp float;
      uniform vec2 uResolution;uniform float uTime;uniform float uNight;uniform float uNightTime;uniform float uMotion;
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
      vec3 starGlyph(vec2 cell,float yaw){
        float seed=hash(cell+43.0);
        if(seed<.925)return vec3(0.0);
        // Project each star's world anchor back to the view, then stamp a whole
        // screen-aligned pixel glyph. Perspective can move it, never shear its arms.
        vec2 anchor=(cell+vec2(.2+hash(cell+8.0)*.6,.2+hash(cell+19.0)*.6))/38.0;
        float squared=dot(anchor,anchor);
        float starY=(-.32*squared+sqrt(1.0+(1.0-.32*.32)*squared))/(1.0+squared);
        vec3 starRay=vec3(anchor.x*(starY+.32),starY,anchor.y*(starY+.32));
        starRay.xz=mat2(cos(yaw),sin(yaw),-sin(yaw),cos(yaw))*starRay.xz;
        vec2 projected=vec2(starRay.x/max(starRay.z,.01)/.7,(starRay.y/max(starRay.z,.01)-.9)/.5);
        projected.x/=uResolution.x/uResolution.y;
        vec2 star=abs(floor(gl_FragCoord.xy)-floor((projected+1.0)*.5*uResolution));
        float core=1.0-step(.5,max(star.x,star.y));
        float crossLight=(1.0-step(.5,min(star.x,star.y)))*(1.0-step(1.5,max(star.x,star.y)));
        float twinkle=.66+.34*sin(uTime*(.55+seed)+seed*60.0);
        float stars=step(.925,seed)*max(core,crossLight*step(.98,seed))*(.55+twinkle*.45)*step(0.0,starRay.z);
        return mix(vec3(.62,.76,1.0),vec3(1.0,.92,.73),hash(cell+90.0))*stars;
      }
      void main(){
        float pixel=mix(3.0,1.0,uNight);
        vec2 uv=(floor(gl_FragCoord.xy/pixel)*pixel+pixel*.5)/uResolution;
        vec2 screen=uv*2.0-1.0;screen.x*=uResolution.x/uResolution.y;
        vec3 ray=normalize(vec3(screen.x*.7,screen.y*.5+.9,1.0));
        float yaw=mix(uTime*.008,uNightTime*.004,uNight);ray.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*ray.xz;
        ray=cubeDirection(ray);
        vec2 world=ray.xz/(ray.y+.32)*3.6+vec2(uTime*.008,0.0);
        float density=clouds(world+vec2(8.0,3.0));
        float cloud=floor(smoothstep(.58,.69,density)*5.0)/5.0;
        float shadow=smoothstep(.53,.6,clouds(world+vec2(8.0,3.09)));
        vec3 sky=mix(vec3(.82,.92,.98),vec3(.59,.79,.94),uv.y);
        vec3 white=mix(vec3(.84,.91,.965),vec3(.99,.99,1.0),shadow);
        vec3 day=mix(sky,white,cloud*.88);
        if(uNight<=0.0){gl_FragColor=vec4(day,1.0);return;}
        // Celestial objects share the same world projection as the four sky faces.
        // No face-local UVs: stars and meteor trails continue through cube seams.
        vec2 space=ray.xz/(ray.y+.32);
        vec3 night=mix(vec3(.15,.23,.36),vec3(.035,.065,.145),uv.y);
        night+=vec3(.045,.04,.08)*pow(max(0.0,1.0-abs(space.x*.5+space.y-.8)),5.0);
        vec2 cell=floor(space*38.0);
        vec3 starlight=vec3(0.0);
        // Include neighboring anchors so a cross cannot be cut at a cell edge.
        for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){
          starlight=max(starlight,starGlyph(cell+vec2(float(x),float(y)),yaw));
        }
        night=mix(night,starlight,step(.001,max(starlight.r,max(starlight.g,starlight.b))));
        // A stepped crescent and soft moonlight, quantized by the pixel grid above.
        vec2 moonCenter=vec2(min(.82,uResolution.x/uResolution.y*.42),1.16);
        vec2 moonPoint=(ray.xy/max(ray.z,.01)-moonCenter)*vec2(1.0,1.4);
        float moonDistance=length(moonPoint);
        float disk=(1.0-step(.065,moonDistance))*step(0.0,ray.z);
        float shade=1.0-step(.061,length(moonPoint-vec2(.033,.019)));
        float crescent=disk*(1.0-shade);
        night+=vec3(.12,.14,.19)*exp(-moonDistance*19.0)*.35;
        night=mix(night,vec3(.96,.90,.72),crescent);
        // Brief showers with long quiet intervals, paused with the existing FX loop.
        float cycle=floor(uNightTime/14.0),flight=mod(uNightTime,14.0)-2.0;
        vec2 heading=normalize(vec2(.85,.32));
        vec2 start=vec2(mix(-.7,.25,hash(vec2(cycle,7))),mix(.5,.65,hash(vec2(cycle,11))));
        vec2 delta=space-(start+heading*flight*.68);
        float along=dot(delta,heading),side=abs(delta.x*heading.y-delta.y*heading.x);
        float trail=step(-.30,along)*(1.0-step(.006,side))*(1.0-step(0.0,along))*pow(clamp(1.0+along/.3,0.0,1.0),2.0);
        float head=1.0-step(.01,length(delta));
        float visible=step(0.0,flight)*(1.0-step(1.35,flight))*sin(clamp(flight/1.35,0.0,1.0)*3.14159)*uMotion;
        night+=vec3(.7,.8,1.0)*max(head,trail)*visible;
        gl_FragColor=vec4(mix(day,night,uNight),1.0);
      }`;
    const shaders=[];let program;
    function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw new Error('Sky shader compilation failed');}shaders.push(s);return s;}
    try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Sky shader linking failed');}
    catch{shaders.forEach(s=>gl.deleteShader(s));if(program)gl.deleteProgram(program);canvas.hidden=true;return null;}
    shaders.forEach(s=>gl.deleteShader(s));gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const resolution=gl.getUniformLocation(program,'uResolution'),timeUniform=gl.getUniformLocation(program,'uTime');
    const nightUniform=gl.getUniformLocation(program,'uNight'),nightTimeUniform=gl.getUniformLocation(program,'uNightTime'),motionUniform=gl.getUniformLocation(program,'uMotion');
    canvas.dataset.renderer='webgl-sky';
    let lost=false,lastFrame=null,elapsed=0,nightStart=0,moving=false;
    let night=document.documentElement.dataset.sky==='night';
    let blend=night?1:0,blendFrom=blend,blendAge=1;
    function paint(time){if(lost)return;gl.uniform1f(timeUniform,time);gl.uniform1f(nightUniform,blend);gl.uniform1f(nightTimeUniform,time-nightStart);gl.uniform1f(motionUniform,moving?1:0);gl.drawArrays(gl.TRIANGLES,0,6);}
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.hidden=true;});
    // A lost GPU context leaves the CSS sky visible until the next page load.
    canvas.addEventListener('webglcontextrestored',()=>{lost=true;canvas.hidden=true;});
    return{
      get available(){return !lost;},
      resize(width,height){if(lost)return;canvas.width=Math.ceil(width/3);canvas.height=Math.ceil(height/3);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolution,canvas.width,canvas.height);paint(elapsed);},
      render(time){
        const delta=lastFrame===null?0:Math.min(time-lastFrame,70)/1000;
        elapsed+=delta;lastFrame=time;moving=true;
        blendAge=Math.min(1,blendAge+delta/.95);
        const eased=blendAge*blendAge*(3-2*blendAge);
        blend=blendFrom+((night?1:0)-blendFrom)*eased;
        paint(elapsed);
      },
      setNight(value){
        if(night===value)return;
        if(value)nightStart=elapsed;
        night=value;blendFrom=blend;blendAge=moving?0:1;
        if(!moving)blend=night?1:0;
        paint(elapsed);
      },
      click(){},clear(){lastFrame=null;moving=false;blend=blendFrom=night?1:0;blendAge=1;paint(elapsed);}
    };
  };
})();
