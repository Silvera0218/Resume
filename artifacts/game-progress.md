# Desktop runner refinement

The desktop remains a clean sky with an automatic, silent endless platform scene at its bottom edge. No on-screen controls or standalone game window. W now triggers a jump while browsing the desktop.

Implemented: original six-pose courier atlas, aligned sprite feet, jump/landing poses, short landing compression and dust, jump-path rewards and pickup pops, occasional traversable bridges, distant plant parallax, bounded world recycling. Native reading windows retract to the launching icon/button before closing; reduced-motion fades and cancellation preserve usability.

Verification: actual simulation at desktop/mobile widths for ten minutes each, no recovery resets; bounded chunks and coordinates; pickups, landings, milestone crossings and all animation states exercised. Browser captures at 1324×758 and 390×844, nested detail/Escape/return-to-desktop/focus/reduced motion checked. No console errors or horizontal overflow. Forty-eight unpaused frames cover run, leap, landing and bridge traversal.

New art: dist/assets/courier-motion.png; generation and transparency cleanup via built-in image_gen. Prompt and source in adjacent JSON. Atlas cropping is metadata only; original image alpha is preserved.

Evidence: .impeccable/review/runner-polish-desktop.png, runner-polish-mobile.png, runner-motion.mp4, runner-motion/timing.json and window-return/000.png. These are local review outputs.

Skills applied: threejs-game-director; threejs-game-ui-designer and ui-patterns; threejs-gameplay-systems and game-feel/genre-design; threejs-qa-release; threejs-image-generator and system imagegen. Existing Canvas renderer retained for the 2D scene; no new rendering dependencies. An independent worker could not start because the collaboration service reported its thread limit; implementation and verification were completed in the main thread.

## Terrain and W input update

Design brief: a small sticker courier travels below the portfolio. The scene remains automatic by default; W lets visitors time an extra jump to collect a star or stomp an enemy. Reading windows pause play. No new game window, score HUD or audio.

Loop: move forward continuously, jump over crystal clusters and gaps, land on raised platforms, collect stars and bounce from enemies. A side collision flashes the courier briefly; a fall returns it to the next safe stretch. Rewards increment the existing pickup state. Short W buffering helps a press just before landing; held keys do not repeatedly jump.

Encounter plan: six authored patterns (steps, crystals, cloud ledge, mushroom platforms, low block, rest), three elevations, occasional bridges and three enemy behaviors (hopping slime, slow snail, pacing mushroom). Each encounter leaves a recovery stretch before the next gap. The stable pace suits an ambient portfolio scene; progression changes combinations and landmarks rather than increasing speed indefinitely.

Implementation: existing Canvas renderer, fixed 1/120-second updates, custom one-way platform and AABB enemy/hazard collision. All movement is deterministic. Terrain and enemy positions are derived from recycled chunks. Complete sticker caps preserve crop ratios; step supports and cloud drawing boxes align art with landing surfaces. No new runtime dependencies.

Verification: both viewport simulations ran ten minutes with zero recovery resets or side hits, all six patterns, multiple landing elevations, three enemy families and successful stomps. W tests cover immediate input, landing buffer, no double-jump/repeat, IME/editable/shortcut exclusions, pause clearing and partial texture loading. Browser W input increased manualJumps, changed the courier to an airborne pose, and respected reading pause. A 64-frame real-time browser sequence records traversal and contact; desktop and 320px HUD captures have no horizontal document overflow. Console errors: none observed.

Independent review found and verified corrections for cloud/step art-to-collider alignment; the partial-load fallback was also corrected and regression-tested. HUD and font work uses the provided reference screenshot; the linked video could not be fetched this round. Evidence: terrain-hud-desktop.png, pixel-hud-mobile.png, terrain-motion/timing.json and w-jump.json under .impeccable/review/.

Publication is tracked by the GitHub Pages workflow.
