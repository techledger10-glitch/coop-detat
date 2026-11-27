// Main game bootstrap and fixed-timestep loop
import { updateInput } from './input.js';
import { getState, setState, isTitle, isPlaying, isPaused, isCaught, isEscaped } from './state.js';
import { getPlayer, updatePlayer, resetPlayer } from './player.js';
import { getFarmer, updateFarmer, resetFarmer, setPatrolRoute, getChaseTime } from './farmer.js';
import { getCamera, updateCamera } from './camera.js';
import { getHud, resetHud, addScore, damagePlayer } from './hud.js';
import { getLevel, getLevelCount, GROUND_Y } from './levels.js';
import { resetHazards, updateKnives, updateOvens, updateCorn, getKnives, getOvens, getCorn } from './hazards.js';
import { parseUrlParams, getScreenshotMode, setupScreenshotScene, isScreenshotMode } from './screenshots.js';
import { drawTurkey, drawFarmer, drawHayBale, drawOven, drawCarvingKnife,
         drawHayStack, drawCorn, drawExit, drawBarn, drawCounter, drawCrate,
         drawFence } from './art.js';
import { drawEnvironment, drawRealBarn, drawWeatherVane, drawSilo } from './environment.js';

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
        drawEndScreen(ctx, isCaught() ? 'caught' : 'escaped');
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
    // Background gradient for sky
    const grad = ctx.createLinearGradient(0, 0, 0, 720);
    grad.addColorStop(0, '#8B4513');
    grad.addColorStop(1, '#654321');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);
    
    // Draw farm background (barn and fence)
    // Barn at x=60..320, base at y=545
    drawRealBarn(ctx, 190, 545, 260);
    // Barn window - lit
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(275, 415, 35, 25);
    // Weather vane
    drawWeatherVane(ctx, 190, 365, 260);
    // Silo for depth
    drawSilo(ctx, 500, 515, 100);
    
    // Rail fence running the full width at y=520..545
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    for (let x = 0; x < 1280 + 200; x += 100) {
        // Vertical posts
        ctx.beginPath();
        ctx.moveTo(x, 520);
        ctx.lineTo(x, 545);
        ctx.stroke();
        // Horizontal rails
        ctx.beginPath();
        ctx.moveTo(x - 5, 529);
        ctx.lineTo(x + 5, 529);
        ctx.stroke();
    }
    
    // Draw turkey standing at (640, 570), 120 px, looking at viewer
    drawTurkey(ctx, 640, GROUND_Y, 120, 1, false, false, 0);
    
    // Title text
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('COOP D\'ETAT', 640, 100);
    
    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = '#F5DEB3';
    ctx.fillText('A Turkey Escape Game', 640, 150);
    
    // Premise
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('A turkey escapes Thanksgiving dinner, chased by a farmer,', 640, 200);
    ctx.fillText('dodging the oven and the carving knife.', 640, 230);
    
    // Controls
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('CONTROLS', 640, 280);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Arrow Keys: Move', 640, 310);
    ctx.fillText('Shift: Sprint (depletes stamina)', 640, 340);
    ctx.fillText('Space: Jump', 640, 370);
    ctx.fillText('Press SPACE to start', 640, 500);
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
    if (result === 'caught') {
        drawCaughtScreen(ctx);
    } else {
        drawEscapedScreen(ctx);
    }
    
    // End message
    ctx.globalAlpha = 1;
    ctx.fillStyle = result === 'caught' ? '#FF6B6B' : '#4ECDC4';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result === 'caught' ? 'CAUGHT!' : 'ESCAPED!', 640, 100);
    
    // Score
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Final Score: ${getHud().score}`, 640, 150);
    
    // Restart prompt
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('Press R to restart', 640, 650);
}

function drawCaughtScreen(ctx) {
    // Background - farmyard at sunset
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
    skyGrad.addColorStop(0, '#8B4513');
    skyGrad.addColorStop(0.5, '#CD853F');
    skyGrad.addColorStop(1, '#654321');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1280, 720);
    
    // Draw barn silhouette
    ctx.fillStyle = '#2F2F2F';
    ctx.beginPath();
    ctx.moveTo(200, 500);
    ctx.lineTo(400, 300);
    ctx.lineTo(600, 500);
    ctx.closePath();
    ctx.fill();
    
    // Barn window - lit
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(385, 380, 35, 25);
    
    // Draw farmer at GROUND_Y (570) holding turkey
    const farmerY = GROUND_Y;
    drawFarmer(ctx, 640, farmerY, 150, 1, 0);
    
    // Turkey being held by farmer (offset to farmer's hands)
    // Turkey is X-eyed and comic - drawn larger
    drawTurkey(ctx, 640, farmerY, 100, -1, false, true, 0);
    
    // Add X eyes to turkey
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(635, GROUND_Y - 50, 4, 0, Math.PI * 2);
    ctx.arc(665, GROUND_Y - 50, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawEscapedScreen(ctx) {
    // Background - sunrise sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
    skyGrad.addColorStop(0, '#8B4513');
    skyGrad.addColorStop(0.3, '#FF8C00');
    skyGrad.addColorStop(0.6, '#FFD700');
    skyGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1280, 720);
    
    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 570, 1280, 150);
    
    // Draw the gate (exit) at GROUND_Y
    const gateX = 1100;
    const gateY = GROUND_Y;
    
    // Gate frame
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(gateX - 10, gateY - 50, 20, 50);
    
    // Gate is open (horizontal bar)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(gateX - 10, gateY, 20, 5);
    
    // Turkey escaping through gate - running
    drawTurkey(ctx, gateX + 30, GROUND_Y, 100, 1, true, false, 0);
    
    // Confetti - lots of it!
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C00', '#9B59B6', '#2ECC71', '#3498DB', '#E74C3C'];
    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = colors[i % colors.length];
        const x = 640 + (i - 50) * 15 + Math.random() * 20;
        const y = 380 + Math.sin(i * 0.5) * 50 + Math.random() * 100;
        ctx.fillRect(x, y, 4, 4);
    }
}

function renderGame() {
    const player = getPlayer();
    const farmer = getFarmer();
    const level = getLevel(window.currentLevel || 0);
    const cam = getCamera();
    
    // Draw environment background
    const envLevel = { stage: window.currentLevel || 0 };
    drawEnvironment(ctx, envLevel, cam);
    
    // Render obstacles
    for (const obs of (level.obstacles || [])) {
        if (obs.type === 'fence') {
            drawFence(ctx, obs.x - cam.x, 0, 30);
        } else if (obs.type === 'haystack') {
            drawHayStack(ctx, obs.x - cam.x, obs.y, 40);
        } else if (obs.type === 'barn') {
            drawBarn(ctx, obs.x - cam.x, obs.y, 80);
        } else if (obs.type === 'crate') {
            drawCrate(ctx, obs.x - cam.x, obs.y, 30);
        } else if (obs.type === 'counter') {
            drawCounter(ctx, obs.x - cam.x, obs.y, 40);
        } else if (obs.type === 'exit') {
            const isComplete = (window.currentLevel || 0) >= getLevelCount() - 1;
            drawExit(ctx, obs.x - cam.x, obs.y, 50, isComplete);
        }
    }
    
    // Render hazards
    for (const knife of getKnives()) {
        if (knife.active) {
            drawCarvingKnife(ctx, knife.x - cam.x, knife.y, 40, knife.telegraph <= 0);
        }
    }
    
    for (const oven of getOvens()) {
        drawOven(ctx, oven.x - cam.x, oven.y, oven.size, oven.bursting);
    }
    
    for (const c of getCorn()) {
        drawCorn(ctx, c.x - cam.x, c.y, 34);
    }
    
    // Render player (turkey) - scaled to ~100px tall
    drawTurkey(ctx, player.x - cam.x, player.y, 100, player.facing, 
               player.sprinting, player.hidden, player.animationTime);
    
    // Render farmer - scaled to ~150px tall
    drawFarmer(ctx, farmer.x - cam.x, farmer.y, 150, farmer.facing, farmer.animationTime);
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