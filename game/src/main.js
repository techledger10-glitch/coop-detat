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
import { drawEnvironment } from './environment.js';

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
    
    // Draw barn silhouette
    ctx.fillStyle = '#2F2F2F';
    ctx.beginPath();
    ctx.moveTo(200, 500);
    ctx.lineTo(400, 300);
    ctx.lineTo(600, 500);
    ctx.closePath();
    ctx.fill();
    
    // Barn door
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(285, 380, 150, 120);
    
    // Draw fence
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 10; i++) {
        ctx.fillRect(200 + i * 100, 500, 5, 50);
    }
    for (let i = 0; i < 11; i++) {
        ctx.fillRect(195 + i * 100, 500, 5, 10);
    }
    
    // Draw turkey in center
    drawTurkey(ctx, 640, 380, 30, 1, false, false, 0);
    
    // Title text
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
    // Background
    ctx.fillStyle = result === 'caught' ? '#8B4513' : '#2F2F2F';
    ctx.fillRect(0, 0, 1280, 720);
    
    if (result === 'caught') {
        // Draw sad farmer silhouette
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(200, 500);
        ctx.lineTo(400, 300);
        ctx.lineTo(600, 500);
        ctx.closePath();
        ctx.fill();
        
        // Draw fallen turkey (sad face)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(640, 500, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Sad eyes
        ctx.fillStyle = '#B22222';
        ctx.beginPath();
        ctx.arc(630, 495, 3, 0, Math.PI * 2);
        ctx.arc(650, 495, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Sad mouth
        ctx.strokeStyle = '#B22222';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(640, 505, 10, 0, Math.PI);
        ctx.stroke();
    } else {
        // Draw exit open
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(600, 400, 80, 100);
        
        // Draw happy turkey
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(640, 350, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Happy eyes
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(630, 345, 3, 0, Math.PI * 2);
        ctx.arc(650, 345, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Happy mouth
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(640, 355, 10, 0, Math.PI);
        ctx.stroke();
        
        // Lots of confetti
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C00', '#9B59B6', '#2ECC71', '#3498DB', '#E74C3C'];
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = colors[i % colors.length];
            const x = 640 + (i - 25) * 20 + Math.random() * 30;
            const y = 380 + Math.sin(i * 0.5) * 50 + Math.random() * 30;
            ctx.fillRect(x, y, 4, 4);
        }
    }
    
    // Freeze frame overlay
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
            drawCarvingKnife(ctx, knife.x - cam.x, knife.y, 15, knife.telegraph <= 0);
        }
    }
    
    for (const oven of getOvens()) {
        drawOven(ctx, oven.x - cam.x, oven.y, oven.size, oven.bursting);
    }
    
    for (const c of getCorn()) {
        drawCorn(ctx, c.x - cam.x, c.y, 20);
    }
    
    // Render player (turkey)
    drawTurkey(ctx, player.x - cam.x, player.y, 30, player.facing, 
               player.sprinting, player.hidden, player.animationTime);
    
    // Render farmer
    drawFarmer(ctx, farmer.x - cam.x, farmer.y, 35, farmer.facing, farmer.animationTime);
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