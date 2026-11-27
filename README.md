# COOP D'ETAT: Turkey Escape Game

[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/techledger10-glitch/coop-detat/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/techledger10-glitch/coop-detat/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

Entered in the [make.fun turkey bounty](https://make.fun/bounty/turkey-run-game-01).


A 2D canvas game where a turkey escapes Thanksgiving dinner, chased by a farmer, dodging the oven and the carving knife.

## Game Description

**COOP D'ETAT** is a turkey escape game with:
- **Three escalating stages**: Farmyard, Barn, and Kitchen
- **Stealth mechanics**: Hide in hay, use cover, break line of sight
- **Dynamic AI**: Farmer patrols, notices via vision cone and noise, then searches
- **Hazards**: Throwing carving knives, bursting ovens
- **Stamina system**: Sprint to escape danger, but manage your stamina

## How to Play

### Controls
- **Arrow Keys** or **WASD**: Move the turkey
- **Shift**: Sprint (depletes stamina)
- **Space**: Jump
- **Escape**: Pause/Unpause
- **R**: Restart after being caught or escaping

### Gameplay
1. Start on the title screen and press SPACE to begin
2. Navigate through three stages, each more dangerous than the last:
   - **Stage 1 - Farmyard**: Open fields, fences, hay bales
   - **Stage 2 - Barn**: Dark corridors, crates, cover
   - **Stage 3 - Kitchen**: Bursting ovens, throwing knives, counters
3. Collect corn for points
4. Reach the exit to complete the stage
5. You have 3 lives - being caught costs a life and restarts the stage

### Tips
- **Sprint wisely**: Use it to escape the farmer when he's chasing
- **Hide strategically**: Duck behind hay bales or crates to break line of sight
- **Watch for telegraphs**: Knives have a warning phase, ovens glow before bursting
- **Manage stamina**: Don't sprint too long or you'll be exhausted when you need it most

## Technical Details

- **No libraries**: Pure JavaScript, no build step
- **ES modules**: Modern module system
- **Procedural art**: All graphics drawn with canvas paths
- **WebAudio**: Sound effects generated with oscillators (no audio files)
- **Static files**: Works offline in any desktop Chrome browser

## Running Locally

1. Start the static server:
   ```bash
   node serve.ts
   ```

2. Open in your browser:
   ```
   http://localhost:8080
   ```

3. Enjoy the game!

## Project Structure

```
game/
├── index.html          # Game entry point
└── src/
    ├── main.js         # Bootstrap and game loop
    ├── state.js        # Game state machine
    ├── input.js        # Keyboard input handling
    ├── audio.js        # WebAudio sound effects
    ├── art.js          # Procedural vector sprites
    ├── player.js       # Turkey character
    ├── farmer.js       # Chase AI
    ├── hazards.js      # Knives and ovens
    ├── levels.js       # Three stages
    ├── camera.js       # Viewport and effects
    ├── hud.js          # UI and screens
    └── screenshots.js  # Screenshot mode handler
```

## Development

This game was built as a competition entry for the turkey-escape-game-01 competition on make.fun. It demonstrates:
- Clean code organization with single-responsibility modules
- Procedural vector graphics
- WebAudio sound synthesis
- State machine pattern
- Fixed-timestep game loop
- AI behavior with patrol/chase/search states

## License

MIT License - see LICENSE file for details.