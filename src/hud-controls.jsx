import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';

export function HudButton({id,label,children,appearance='keycap',...props}) {
  if(appearance==='paper')return <button id={id} className="paper-close" type="button" aria-label={label} title="关闭详情 · Esc" {...props}>{children}</button>;
  return <button id={id} className="button hud-button close-button" type="button" aria-label={label} {...props}><span className="keycap-face">{children}<span className="pixel keycap-legend">ESC</span></span></button>;
}
const closeIcon=<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8"/></svg>;
for(const [host,id,label,content] of [
  ['journal-window-controls','close-journal','关闭档案窗口',closeIcon],
  ['detail-window-controls','close-dialog','关闭详情',closeIcon]
]) {
  const root=document.getElementById(host);
  if(root)flushSync(()=>createRoot(root).render(<HudButton id={id} label={label} appearance={id==='close-dialog'?'paper':'keycap'}>{content}</HudButton>));
}
