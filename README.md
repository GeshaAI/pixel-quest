# pixel-quest
Pixel Quest — A free retro 2D platformer inspired by classic 8-bit games. Built with HTML5, JavaScript and Canvas for Android and desktop browsers.

## Browser release v0.8.0
Play: https://geshaai.github.io/pixel-quest/

Three playable levels: Emerald Hills, Dusk Trail and Crystal Caverns. Original Canvas graphics and synthesized sound;
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
actual Android touch input or FPS. v0.8.0 content still needs a real tablet playtest. The user confirmed both v0.4.1 levels are playable on their tablet.

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

### v0.7.0 illustrated asset pass
Two original generated day/dusk backgrounds, an eight-pose transparent scout
atlas, and terrain/stone/crate/gem/beetle art are now bundled as local WebP assets.
No runtime generation service or external image host is required. Artwork loads
with the menu; missing/blocked images retain the earlier procedural art.
The level selector can also start 1-2 for art review. Physics and saved progress
formats are preserved.

Asset provenance: original AI-generated game art produced with the built-in
image-generation tool for this project; no Nintendo assets. Original-resolution
outputs are packaged as WebP for delivery. See assets/ART.md for prompts.

### v0.8.0 Crystal Caverns
- Campaign transitions 1-1 → 1-2 → 1-3; direct level selection for all three.
- Original crystal cavern background and four-pose bat artwork.
- Three horizontal moving platforms: ride, jump off, and pass through from below.
- Bats patrol bounded corridors, avoid stone/crate walls, and can be stomped.
- An upper alcove near tile 66 leads to a separate secret room. Tap the existing
  run button (⚡) or press E while near the doorway; use the same input to exit.
- Eight gems and one extra life, with persistent loot state that prevents farming.
- Continue from inside the room resumes safely in the main cavern with rewards.

Validation: 33 Node checks, including input-driven traversal of the third level
and of the complete secret-room route. Terrain route tests disable enemies; enemy
flight, wall avoidance and stomps are checked separately. Physical Android FPS
and full playthrough with enemies still require a tablet playtest.

The fourth level and first boss are planned next; this is not a completed world
or the full 32-level campaign. No APK work has started.
