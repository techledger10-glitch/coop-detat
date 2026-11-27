// HUD and screen rendering
import { getCamera, getCanvasWidth, getCanvasHeight, getRedFlashAlpha } from './camera.js';
import { getPlayer } from './player.js';
import { getFarmer, getChaseTime } from './farmer.js';
import { getState, isPlaying, isTitle, isPaused, isCaught, isEscaped } from './state.js';
import { getLevel } from './levels.js';

let hud = {
    score: 0,
    lives: 3,
    distance: 0
};

function getHud() {
    return hud;
}

function addScore(amount) {
    hud.score += amount;
}

function damagePlayer() {
    hud.lives--;
    if (hud.lives <= 0) {
        return 'caught';
    }
    return 'stage';
}

function resetHud() {
    hud = {
        score: 0,
        lives: 3,
        distance: 0
    };
}

function drawHUD(ctx) {
    ctx.save();
    
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, getCanvasWidth(), 40);
    
    // Score
    ctx.fillStyle = '#FFD700';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${hud.score}`, 10, 25);
    
    // Lives
    ctx.fillStyle = '#FF6B6B';
    ctx.textAlign = 'center';
    ctx.fillText(`Lives: ${hud.lives}`, getCanvasWidth() / 2, 25);
    
    // Distance / Exit
    ctx.fillStyle = '#4ECDC4';
    ctx.textAlign = 'right';
    ctx.fillText(`Distance: ${Math.floor(hud.distance)} / 100%`, getCanvasWidth() - 10, 25);
    
    ctx.restore();
}

function drawTitleScreen(ctx) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, getCanvasWidth(), getCanvasHeight());
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('COOP D\'ETAT', getCanvasWidth() / 2, 150);
    
    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = '#F5DEB3';
    ctx.fillText('A Turkey Escape Game', getCanvasWidth() / 2, 200);
    
    // Premise
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('A turkey escapes Thanksgiving dinner, chased by a farmer,', getCanvasWidth() / 2, 250);
    ctx.fillText('dodging the oven and the carving knife.', getCanvasWidth() / 2, 280);
    
    // Controls
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('CONTROLS', getCanvasWidth() / 2, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Arrow Keys: Move', getCanvasWidth() / 2, 370);
    ctx.fillText('Shift: Sprint (depletes stamina)', getCanvasWidth() / 2, 400);
    ctx.fillText('Space: Jump', getCanvasWidth() / 2, 430);
    ctx.fillText('Press SPACE to start', getCanvasWidth() / 2, 500);
    
    // Footer
    ctx.font = '14px Arial';
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('Created with procedural vector art', getCanvasWidth() / 2, getCanvasHeight() - 30);
}

function drawPauseScreen(ctx) {
    ctx.save();
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, getCanvasWidth(), getCanvasHeight());
    
    // Pause text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', getCanvasWidth() / 2, getCanvasHeight() / 2);
    
    ctx.font = '18px Arial';
    ctx.fillText('Press SPACE to resume', getCanvasWidth() / 2, getCanvasHeight() / 2 + 50);
    
    ctx.restore();
}

function drawEndScreen(ctx, result) {
    ctx.save();
    
    // Freeze frame effect
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = getRedFlashAlpha() || 0.3;
    ctx.fillRect(0, 0, getCanvasWidth(), getCanvasHeight());
    
    // End message
    ctx.globalAlpha = 1;
    ctx.fillStyle = result === 'caught' ? '#FF6B6B' : '#4ECDC4';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result === 'caught' ? 'CAUGHT!' : 'ESCAPED!', getCanvasWidth() / 2, 200);
    
    // Score
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Final Score: ${hud.score}`, getCanvasWidth() / 2, 260);
    
    // Restart prompt
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('Press R to restart', getCanvasWidth() / 2, getCanvasHeight() - 200);
    
    if (result === 'caught') {
        ctx.fillStyle = '#FF6B6B';
        ctx.fillText('The farmer got you!', getCanvasWidth() / 2, 300);
    } else {
        ctx.fillStyle = '#4ECDC4';
        ctx.fillText('You escaped Thanksgiving!', getCanvasWidth() / 2, 300);
    }
    
    ctx.restore();
}

function drawStaminaBar(ctx) {
    const player = getPlayer();
    const width = 150;
    const height = 15;
    const x = getCanvasWidth() - width - 10;
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

export {
    getHud, addScore, damagePlayer, resetHud,
    drawHUD, drawTitleScreen, drawPauseScreen, drawEndScreen,
    drawStaminaBar
};