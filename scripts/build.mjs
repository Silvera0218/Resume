import { build } from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
await build({entryPoints:['src/hud-controls.jsx','src/sticker-icons.js'],outdir:'dist/ui',bundle:true,minify:true,format:'iife',target:'es2022',define:{'process.env.NODE_ENV':'"production"'},legalComments:'linked'});
const licenses=await Promise.all(['react/LICENSE','react-dom/LICENSE','three/LICENSE'].map(async path=>`${path}\n\n${await readFile(`node_modules/${path}`,'utf8')}`));
await writeFile('dist/ui/LICENSES.txt',licenses.join('\n\n--------------------\n\n'));
