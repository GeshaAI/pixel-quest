# pixel-quest
Pixel Quest — A free retro 2D platformer inspired by classic 8-bit games. Built with HTML5, JavaScript and Canvas for Android and desktop browsers.

## Browser release v0.4.0
Play: https://geshaai.github.io/pixel-quest/

One playable Emerald Hills level. Original Canvas graphics and synthesized sound;
no dependencies, external assets, paid APIs or backend.

- Walk/run, variable jump, coyote time, jump buffer, camera and multitouch.
- Grounded patrol enemies, stomp, gems, solid mystery blocks, heart/speed bonuses.
- Two visible checkpoints; Continue restores their item/enemy state and score.
- Main menu, level selector (1-1 only), pause/retry and sound toggle.
- Animated footsteps, facing direction, effects and pixelated parallax.
- Graceful operation when browser storage is unavailable.

Keyboard: arrows / A,D; Space / W / Up to jump; Shift to run; P to pause.
Touch: left/right and run/jump can be held simultaneously.

Run checks: `node tests/game.cjs` (Node 18+; no package installation).
These use the real game logic with a stub DOM/Canvas. The traversal test disables
enemies to isolate terrain clearance. They do not measure rendering, audio playback,
actual Android touch input or FPS. v0.4.0 still needs a real tablet playtest.

### Audit and remaining scope
The original v0.3 was retained and extended. Fixed floating enemies, incomplete
crate collisions, duplicated checkpoint collectibles, unsafe storage calls and
input surviving pause. Earlier `pq_save` records remain loadable; they did not
store item history, so that history cannot be reconstructed.

The 32-level campaign, six enemy types, bosses, hidden rooms, pipes, moving platforms,
additional powers, music and full animation set remain planned. APK work starts
after browser gameplay is complete and tested.
