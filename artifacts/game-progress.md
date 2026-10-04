# Desktop runner refinement

The desktop remains a clean sky with an automatic, silent endless platform scene at its bottom edge. No controls or standalone game window.

Implemented: original six-pose courier atlas, aligned sprite feet, jump/landing poses, short landing compression and dust, jump-path rewards and pickup pops, occasional traversable bridges, distant plant parallax, bounded world recycling. Native reading windows retract to the launching icon/button before closing; reduced-motion fades and cancellation preserve usability.

Verification: actual simulation at desktop/mobile widths for ten minutes each, no recovery resets; bounded chunks and coordinates; pickups, landings, milestone crossings and all animation states exercised. Browser captures at 1324×758 and 390×844, nested detail/Escape/return-to-desktop/focus/reduced motion checked. No console errors or horizontal overflow. Forty-eight unpaused frames cover run, leap, landing and bridge traversal.

New art: dist/assets/courier-motion.png; generation and transparency cleanup via built-in image_gen. Prompt and source in adjacent JSON. Atlas cropping is metadata only; original image alpha is preserved.

Evidence: .impeccable/review/runner-polish-desktop.png, runner-polish-mobile.png, runner-motion.mp4, runner-motion/timing.json and window-return/000.png. These are local review outputs.

Skills applied: threejs-game-director; threejs-game-ui-designer and ui-patterns; threejs-gameplay-systems and game-feel/genre-design; threejs-qa-release; threejs-image-generator and system imagegen. Existing Canvas renderer retained for the 2D scene; no new rendering dependencies. An independent worker could not start because the collaboration service reported its thread limit; implementation and verification were completed in the main thread.

Remaining implementation defects: none found in the requested checks. Publication is tracked by the GitHub Pages workflow.
