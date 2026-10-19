# pixel-quest
Pixel Quest — A free retro 2D platformer inspired by classic 8-bit games. Built with HTML5, JavaScript and Canvas for Android and desktop browsers.

## Browser release v0.6.0
Play: https://geshaai.github.io/pixel-quest/

Two playable levels: Emerald Hills and Dusk Trail. Original Canvas graphics and synthesized sound;
no dependencies, external assets, paid APIs or backend.

- Walk/run, variable jump, coyote time, jump buffer, camera and multitouch.
- Grounded patrol enemies, stomp, gems, solid mystery blocks, heart/speed bonuses.
- Two visible checkpoints; Continue restores their item/enemy state and score.
- Main menu, level selector (campaign starts at 1-1), pause/retry and sound toggle.
- Animated footsteps, facing direction, effects and pixelated parallax.
- Graceful operation when browser storage is unavailable.

Keyboard: arrows / A,D; Space / W / Up to jump; Shift to run; P to pause.
Touch: left/right and run/jump can be held simultaneously.

Run checks: `node tests/game.cjs` (Node 18+; no package installation).
These use the real game logic with a stub DOM/Canvas. The traversal test disables
enemies to isolate terrain clearance. They do not measure rendering, audio playback,
actual Android touch input or FPS. v0.6.0 graphics still need a real tablet playtest. The user confirmed both v0.4.1 levels are playable on their tablet.

### Audit and remaining scope
The existing v0.4 second level was retained while integrating the core fixes. Fixed floating enemies, incomplete
crate collisions, duplicated checkpoint collectibles, unsafe storage calls and
input surviving pause. Earlier `pq_save` records remain loadable; they did not
store item history, so that history cannot be reconstructed.

The 32-level campaign, six enemy types, bosses, hidden rooms, pipes, moving platforms,
additional powers, music and full animation set remain planned. APK work starts
after browser gameplay is complete and tested.

### v0.5.0 visual refresh
Original cached pixel sprites for the teal scout (goggles and orange scarf),
animated walking/air poses, beetles, gems and mystery blocks. Textured ground,
layered mountain/forest/cloud parallax, flowers, day/dusk sky, moon and stars.
Refreshed checkpoint flags, finish flag, powerups, menu and touch controls.
All artwork is generated locally through Canvas; no downloaded art or libraries.
Physics, collision shapes, level layouts and save format are preserved.

### v0.6.0 environment and character art
Cached organic oak canopies with layered leaf shading, smooth sky color, faceted
mountains, clouds with shadows, mist and small ambient motes. Four soil texture
variants per palette, mossy platforms, flowers, mushrooms and rocks. Larger scout
sprite, fluttering scarf, contact shadows and analytic running dust. All decorative
assets are original Canvas artwork; physics and platform placement are unchanged.
