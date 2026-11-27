// Main game bootstrap and fixed-timestep loop
import { updateInput } from './input.js';
import { getState, setState, isTitle, isPlaying, isPaused, isCaught, isEscaped } from './state.js';
import { getPlayer, updatePlayer, resetPlayer } from './player.js';
import { getFarmer, updateFarmer, resetFarmer, setPatrolRoute, getChaseTime } from './farmer.js';
import { getCamera, updateCamera } from './camera.js';
import { getHud, resetHud, addScore, damagePlayer } from './hud.js';
import { getLevel, getLevelCount } from './levels.js';
import { resetHazards, updateKnives, updateOvens, updateCorn, getKnives, getOvens, getCorn } from './hazards.js';
import { parseUrlParams, getScreenshotMode, setupScreenshotScene, isScreenshotMode } from './screenshots.js';
import { drawTurkey, drawFarmer, drawHayBale, drawOven, drawCarvingKnife,
         drawHayStack, drawCorn, drawExit, drawBarn, drawCounter, drawCrate,
         drawFence } from './art.js';

const TICK_RATE = 60;
const TICK_INTERVAL = 1000 / TICK_RATE;

let lastTime = 0;
let accumulator = 0;
let running = true;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1280;
canvas.height = 720;

// Initialize game state
resetHud();
resetPlayer();
resetFarmer();
resetHazards();

// Parse URL for screenshot mode
parseUrlParams();

if (isScreenshotMode()) {
    setupScreenshotScene();
}

function gameLoop(timestamp) {
    if (!running) return;
    
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;
    
    updateInput();
    
    // Fixed timestep updates
    while (accumulator >= TICK_INTERVAL) {
        const dt = TICK_INTERVAL / 1000;
        
        if (isPlaying()) {
            updatePlayer(dt, getLevel(window.currentLevel || 0));
            updateFarmer(dt, getPlayer(), getLevel(window.currentLevel || 0));
            updateCamera(dt);
            updateKnives(dt);
            updateOvens(dt);
            updateCorn(dt);
            
            // Update HUD
            getHud().distance = (getPlayer().x / 2000) * 100;
            
            // Check collisions
            checkCollisions();
        }
        
        accumulator -= TICK_INTERVAL;
    }
    
    // Clear and render
    const state = getState();
    if (isTitle()) {
        // Title screen
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 1280, 720);
        drawTitleScreen(ctx);
    } else if (isPlaying()) {
        // Play state
        renderGame();
        drawHUD();
        drawStaminaBar();
    } else if (isPaused()) {
        renderGame();
        drawPauseScreen(ctx);
    } else if (isCaught() || isEscaped()) {
        renderGame();
        drawEndScreen(isCaught() ? 'caught' : 'escaped');
    }
    
    requestAnimationFrame(gameLoop);
}

function drawHUD() {
    const hud = getHud();
    ctx.save();
    
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, 1280, 40);
    
    // Score
    ctx.fillStyle = '#FFD700';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${hud.score}`, 10, 25);
    
    // Lives
    ctx.fillStyle = '#FF6B6B';
    ctx.textAlign = 'center';
    ctx.fillText(`Lives: ${hud.lives}`, 640, 25);
    
    // Distance / Exit
    ctx.fillStyle = '#4ECDC4';
    ctx.textAlign = 'right';
    ctx.fillText(`Distance: ${Math.floor(hud.distance)} / 100%`, 1270, 25);
    
    ctx.restore();
}

function drawStaminaBar() {
    const player = getPlayer();
    const width = 150;
    const height = 15;
    const x = 1270;
    const y = 10;
    
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, width, height);
    
    // Fill
    const fillWidth = (player.stamina / player.maxStamina) * width;
    ctx.fillStyle = player.sprinting ? '#FF4500' : '#228B22';
    ctx.fillRect(x, y, fillWidth, height);
    
    // Border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
}

function drawTitleScreen(ctx) {
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('COOP D\'ETAT', 640, 150);
    
    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = '#F5DEB3';
    ctx.fillText('A Turkey Escape Game', 640, 200);
    
    // Premise
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('A turkey escapes Thanksgiving dinner, chased by a farmer,', 640, 250);
    ctx.fillText('dodging the oven and the carving knife.', 640, 280);
    
    // Controls
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('CONTROLS', 640, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Arrow Keys: Move', 640, 370);
    ctx.fillText('Shift: Sprint (depletes stamina)', 640, 400);
    ctx.fillText('Space: Jump', 640, 430);
    ctx.fillText('Press SPACE to start', 640, 500);
    
    // Footer
    ctx.font = '14px Arial';
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('Created with procedural vector art', 640, 700);
}

function drawPauseScreen(ctx) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 1280, 720);
    
    // Pause text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', 640, 360);
    
    ctx.font = '18px Arial';
    ctx.fillText('Press SPACE to resume', 640, 420);
}

function drawEndScreen(ctx, result) {
    // Freeze frame effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, 1280, 720);
    
    // End message
    ctx.globalAlpha = 1;
    ctx.fillStyle = result === 'caught' ? '#FF6B6B' : '#4ECDC4';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result === 'caught' ? 'CAUGHT!' : 'ESCAPED!', 640, 200);
    
    // Score
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Final Score: ${getHud().score}`, 640, 260);
    
    // Restart prompt
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('Press R to restart', 640, 650);
    
    if (result === 'caught') {
        ctx.fillStyle = '#FF6B6B';
        ctx.fillText('The farmer got you!', 640, 300);
    } else {
        ctx.fillStyle = '#4ECDC4';
        ctx.fillText('You escaped Thanksgiving!', 640, 300);
    }
}

function renderGame() {
    const player = getPlayer();
    const farmer = getFarmer();
    const level = getLevel(window.currentLevel || 0);
    const cam = getCamera();
    
    // Background
    ctx.fillStyle = level.background || '#8B4513';
    ctx.fillRect(0, 0, 1280, 720);
    
    // Render obstacles
    for (const obs of (level.obstacles || [])) {
        if (obs.type === 'fence') {
            drawFence(obs.x - cam.x, 0, 30);
        } else if (obs.type === 'haystack') {
            drawHayStack(obs.x - cam.x, obs.y, 40);
        } else if (obs.type === 'barn') {
            drawBarn(obs.x - cam.x, obs.y, 80);
        } else if (obs.type === 'crate') {
            drawCrate(obs.x - cam.x, obs.y, 30);
        } else if (obs.type === 'counter') {
            drawCounter(obs.x - cam.x, obs.y, 40);
        } else if (obs.type === 'exit') {
            const isComplete = (window.currentLevel || 0) >= getLevelCount() - 1;
            drawExit(obs.x - cam.x, obs.y, 50, isComplete);
        }
    }
    
    // Render hazards
    for (const knife of getKnives()) {
        if (knife.active) {
            drawCarvingKnife(knife.x - cam.x, knife.y, 15, knife.telegraph <= 0);
        }
    }
    
    for (const oven of getOvens()) {
        drawOven(oven.x - cam.x, oven.y, oven.size, oven.bursting);
    }
    
    for (const c of getCorn()) {
        drawCorn(c.x - cam.x, c.y, 20);
    }
    
    // Render player (turkey)
    drawTurkey(player.x - cam.x, player.y, 30, player.facing, 
               player.sprinting, player.hidden, player.animationTime);
    
    // Render farmer
    drawFarmer(farmer.x - cam.x, farmer.y, 35, farmer.facing, farmer.animationTime);
}

function checkCollisions() {
    const player = getPlayer();
    const farmer = getFarmer();
    
    // Check farmer collision
    const dist = Math.hypot(farmer.x - player.x, farmer.y - player.y);
    if (dist < (farmer.width + player.width) / 2) {
        const result = damagePlayer();
        if (result === 'caught') {
            setState('caught');
        } else {
            // Reset stage
            window.currentLevel = 0;
            resetPlayer();
            resetFarmer();
            resetHazards();
            resetHud();
            addScore(50);
        }
    }
}

// Input handling
window.addEventListener('keydown', (e) => {
    if (isScreenshotMode()) return;
    
    if (isTitle() && (e.code === 'Space' || e.code === 'Enter')) {
        setState('playing');
        window.currentLevel = 0;
        resetPlayer();
        resetFarmer();
        resetHazards();
        resetHud();
        addScore(50);
        return;
    }
    
    if (isPlaying() && e.code === 'Escape') {
        setState('paused');
        return;
    }
    
    if (isPaused() && e.code === 'Escape') {
        setState('playing');
        return;
    }
    
    if ((isCaught() || isEscaped()) && e.code === 'KeyR') {
        // Reset game
        window.currentLevel = 0;
        resetPlayer();
        resetFarmer();
        resetHazards();
        resetHud();
        setState('title');
        return;
    }
});

// Start the game loop
requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    gameLoop(timestamp);
});