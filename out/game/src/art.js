// Procedural vector art for all game sprites
// Autumn palette: rust, wheat, deep brown, cream, olive
// All draw functions receive (x, y) where y is the feet position, and draw so the bottom of the sprite is at y

import { GROUND_Y } from './levels.js';

// Turkey: feet at y=18 in local coords at base size
const TURKEY_FOOT_OFFSET = 18;

function drawTurkey(ctx, x, y, size, facing, sprinting, hidden, animationTime) {
    const scale = size / 40;
    ctx.save();
    // y is feet position, need to offset so feet are at y
    ctx.translate(x, y - TURKEY_FOOT_OFFSET * scale);
    ctx.scale(scale, scale);
    
    const bodyColor = hidden ? '#654321' : '#8B4513';
    const featherColor = hidden ? '#8B4513' : '#CD853F';
    const orangeColor = hidden ? '#654321' : '#FF8C00';
    const redColor = '#B22222';
    const whiteColor = '#F5DEB3';
    const blackColor = '#2F1B0C';
    
    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(-10, 0, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chest feather (spreads when sprinting)
    const featherSpread = sprinting ? 1.5 : 1;
    ctx.fillStyle = featherColor;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        ctx.moveTo(-10, 0);
        ctx.bezierCurveTo(
            -10 + Math.cos(angle) * 8 * featherSpread,
            Math.sin(angle) * 6,
            -15 + Math.cos(angle) * 5 * featherSpread,
            Math.sin(angle) * 10,
            -18,
            0
        );
    }
    ctx.fill();
    
    // Tail (fan shaped when sprinting) - always attached to body
    ctx.fillStyle = featherColor;
    if (sprinting) {
        const fanAngle = 0.3;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 5) * fanAngle - fanAngle / 2;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.bezierCurveTo(-20, -3, -22, -8, -18, -12);
            ctx.bezierCurveTo(-22, -16, -20, -20, -15, -19);
            ctx.fill();
            ctx.restore();
        }
    } else {
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.bezierCurveTo(-18, -3, -20, -8, -16, -12);
        ctx.bezierCurveTo(-20, -16, -18, -20, -15, -19);
        ctx.fill();
    }
    
    // Neck
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(3, -1);
    ctx.bezierCurveTo(5, -8, 0, -10, -5, -8);
    ctx.fill();
    
    // Feet
    ctx.fillStyle = whiteColor;
    ctx.beginPath();
    ctx.moveTo(-5, 12);
    ctx.lineTo(-7, 18);
    ctx.lineTo(-3, 18);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// Farmer: feet at y=21 in local coords at base size
const FARMER_FOOT_OFFSET = 21;

function drawFarmer(ctx, x, y, size, facing, animationTime) {
    const scale = size / 40;
    ctx.save();
    // y is feet position, need to offset so feet are at y
    ctx.translate(x, y - FARMER_FOOT_OFFSET * scale);
    ctx.scale(scale, scale);
    
    const brownColor = '#8B4513';
    const blueColor = '#4169E1';
    const redColor = '#B22222';
    const whiteColor = '#F5DEB3';
    const blackColor = '#2F1B0C';
    const grayColor = '#696969';
    
    // Head
    ctx.fillStyle = whiteColor;
    ctx.beginPath();
    ctx.arc(0, -12, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Hat
    ctx.fillStyle = redColor;
    ctx.fillRect(-7, -16, 14, 4);
    ctx.beginPath();
    ctx.arc(0, -16, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Facial hair
    ctx.fillStyle = blackColor;
    ctx.fillRect(-3, -6, 6, 2);
    
    // Body
    ctx.fillStyle = brownColor;
    ctx.beginPath();
    ctx.moveTo(-4, -5);
    ctx.lineTo(-6, 15);
    ctx.lineTo(6, 15);
    ctx.lineTo(4, -5);
    ctx.closePath();
    ctx.fill();
    
    // Shirt
    ctx.fillStyle = blueColor;
    ctx.beginPath();
    ctx.moveTo(-4, -5);
    ctx.lineTo(-4, 8);
    ctx.lineTo(4, 8);
    ctx.lineTo(4, -5);
    ctx.closePath();
    ctx.fill();
    
    // Arms with pitchfork
    ctx.save();
    if (facing > 0) {
        ctx.rotate(-0.5);
    }
    ctx.fillStyle = brownColor;
    ctx.fillRect(-facing * 8, 4, 10, 2);
    
    // Pitchfork
    ctx.fillStyle = grayColor;
    ctx.beginPath();
    ctx.moveTo(2, 4);
    ctx.lineTo(8, 4);
    ctx.lineTo(8, 3.5);
    ctx.lineTo(2, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(8, 2.5);
    ctx.lineTo(10, 2.5);
    ctx.lineTo(10, 5.5);
    ctx.lineTo(8, 5.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Legs
    ctx.fillStyle = brownColor;
    ctx.fillRect(-4, 15, 2, 6);
    ctx.fillRect(2, 15, 2, 6);
    
    // Feet
    ctx.fillStyle = blackColor;
    ctx.fillRect(-5, 21, 1, 1);
    ctx.fillRect(3, 21, 1, 1);
    
    ctx.restore();
}

function drawHayBale(ctx, x, y, size) {
    const scale = size / 20;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const yellowColor = '#F4D03F';
    const tanColor = '#D2B48C';
    
    ctx.fillStyle = yellowColor;
    ctx.fillRect(-10, -8, 20, 16);
    ctx.strokeStyle = tanColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(8, 0);
    ctx.moveTo(0, -6);
    ctx.lineTo(0, 6);
    ctx.stroke();
    
    ctx.restore();
}

function drawOven(ctx, x, y, size, glowing) {
    const scale = size / 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const grayColor = '#696969';
    const darkGray = '#2F2F2F';
    const orangeColor = '#FF4500';
    const glowColor = '#FFA500';
    const interiorColor = glowing ? '#FF6347' : '#4B0082';
    const tanColor = '#D2B48C';
    
    // Oven body
    ctx.fillStyle = grayColor;
    ctx.fillRect(-12, -10, 24, 24);
    
    // Door
    ctx.fillStyle = darkGray;
    ctx.fillRect(-10, -8, 16, 16);
    
    // Mouth (glowing when active)
    if (glowing) {
        const grad = ctx.createLinearGradient(10, -6, 15, -6);
        grad.addColorStop(0, orangeColor);
        grad.addColorStop(1, glowColor);
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle = interiorColor;
    }
    ctx.fillRect(10, -6, 4, 12);
    
    // Handle
    ctx.fillStyle = tanColor;
    ctx.fillRect(14, -2, 2, 4);
    
    ctx.restore();
}

// Carving Knife: feet at y=5 in local coords at base size
const KNIFE_FOOT_OFFSET = 5;

function drawCarvingKnife(ctx, x, y, size, spinning) {
    const scale = size / 40;
    ctx.save();
    // y is feet position, need to offset so feet are at y
    ctx.translate(x, y - KNIFE_FOOT_OFFSET * scale);
    ctx.scale(scale, scale);
    
    if (spinning) {
        ctx.rotate(Date.now() * 0.05);
    }
    
    const steelColor = '#C0C0C0';
    const handleColor = '#8B4513';
    const bladeColor = '#A9A9A9';
    const tanColor = '#D2B48C';
    
    // Blade
    ctx.fillStyle = bladeColor;
    ctx.fillRect(0, -20, 4, 10);
    
    // Sharp edge
    ctx.fillStyle = steelColor;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(6, -15);
    ctx.lineTo(0, -14);
    ctx.closePath();
    ctx.fill();
    
    // Handle
    ctx.fillStyle = handleColor;
    ctx.fillRect(0, -10, 4, 15);
    
    // Handle grip
    ctx.fillStyle = tanColor;
    ctx.fillRect(0, -5, 4, 5);
    
    ctx.restore();
}

function drawHayStack(ctx, x, y, size) {
    const scale = size / 30;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const yellowColor = '#F4D03F';
    const tanColor = '#D2B48C';
    
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = yellowColor;
        ctx.beginPath();
        ctx.moveTo(-15 + i * 10, 5);
        ctx.lineTo(-10 + i * 10, -20);
        ctx.lineTo(-20 + i * 10, -20);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
}

// Corn: feet at y=10 in local coords at base size
const CORN_FOOT_OFFSET = 10;

function drawCorn(ctx, x, y, size) {
    const scale = size / 30;
    ctx.save();
    // y is feet position, need to offset so feet are at y
    ctx.translate(x, y - CORN_FOOT_OFFSET * scale);
    ctx.scale(scale, scale);
    
    const yellowColor = '#FFD700';
    const goldColor = '#FFD700';
    
    // Corn cob
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 10);
    ctx.stroke();
    
    // Kernels
    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = yellowColor;
        const angle = (i / 10) * Math.PI * 2;
        const kernelX = Math.cos(angle) * 3;
        const kernelY = -15 + (i / 10) * 25;
        ctx.beginPath();
        ctx.moveTo(0, kernelY);
        ctx.lineTo(kernelX, kernelY - 2);
        ctx.lineTo(0, kernelY + 2);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
}

// Exit: feet at y=40 in local coords at base size
const EXIT_FOOT_OFFSET = 40;

function drawExit(ctx, x, y, size, opening) {
    const scale = size / 40;
    ctx.save();
    // y is feet position, need to offset so feet are at y
    ctx.translate(x, y - EXIT_FOOT_OFFSET * scale);
    ctx.scale(scale, scale);
    
    const brownColor = '#8B4513';
    const greenColor = '#228B22';
    const windowColor = '#87CEEB';
    
    // Barn door frame
    ctx.fillStyle = brownColor;
    ctx.fillRect(-8, -20, 16, 40);
    
    // Door (opening when stage complete)
    if (opening) {
        ctx.fillStyle = greenColor;
        ctx.fillRect(-2, -18, 12, 36);
    } else {
        ctx.fillStyle = brownColor;
        ctx.fillRect(-6, -18, 12, 36);
    }
    
    // Window
    ctx.strokeStyle = windowColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-3, -12, 6, 8);
    ctx.stroke();
    
    ctx.restore();
}

function drawBarn(ctx, x, y, size) {
    const scale = size / 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const brownColor = '#8B4513';
    const grayColor = '#696969';
    const darkGray = '#2F2F2F';
    
    // Barn body
    ctx.fillStyle = grayColor;
    ctx.fillRect(-20, -30, 40, 50);
    
    // Roof
    ctx.fillStyle = darkGray;
    ctx.beginPath();
    ctx.moveTo(-22, -30);
    ctx.lineTo(0, -45);
    ctx.lineTo(22, -30);
    ctx.closePath();
    ctx.fill();
    
    // Door
    ctx.fillStyle = brownColor;
    ctx.fillRect(-5, -10, 10, 40);
    
    // Chimney
    ctx.fillStyle = darkGray;
    ctx.fillRect(5, -40, 4, 10);
    
    ctx.restore();
}

function drawCounter(ctx, x, y, size) {
    const scale = size / 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const woodColor = '#8B4513';
    const darkWood = '#5D2906';
    
    // Counter top
    ctx.fillStyle = woodColor;
    ctx.fillRect(-15, -3, 30, 6);
    
    // Counter body
    ctx.fillStyle = darkWood;
    ctx.fillRect(-15, -3, 3, 15);
    ctx.fillRect(15, -3, 3, 15);
    
    // Edges
    ctx.strokeStyle = woodColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.stroke();
    
    ctx.restore();
}

function drawCrate(ctx, x, y, size) {
    const scale = size / 30;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const woodColor = '#8B4513';
    const darkWood = '#5D2906';
    
    // Crate
    ctx.fillStyle = woodColor;
    ctx.fillRect(-8, -6, 16, 12);
    
    // Boards
    ctx.strokeStyle = darkWood;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(8, 0);
    ctx.moveTo(-4, -6);
    ctx.lineTo(-4, 6);
    ctx.moveTo(4, -6);
    ctx.lineTo(4, 6);
    ctx.stroke();
    
    ctx.restore();
}

function drawFence(ctx, x, y, size) {
    const scale = size / 30;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const woodColor = '#8B4513';
    const darkWood = '#5D2906';
    
    // Posts
    ctx.fillStyle = darkWood;
    ctx.fillRect(-4, -15, 2, 30);
    ctx.fillRect(2, -15, 2, 30);
    
    // Rails
    ctx.fillStyle = woodColor;
    ctx.fillRect(-4, -10, 10, 3);
    ctx.fillRect(-4, -3, 10, 3);
    ctx.fillRect(-4, 4, 10, 3);
    
    ctx.restore();
}

function drawArrow(ctx, x, y, size, color) {
    const scale = size / 20;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-8, 8);
    ctx.lineTo(-4, 8);
    ctx.lineTo(-4, 20);
    ctx.lineTo(4, 20);
    ctx.lineTo(4, 8);
    ctx.lineTo(8, 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

export {
    drawTurkey, drawFarmer, drawHayBale, drawOven, drawCarvingKnife,
    drawHayStack, drawCorn, drawExit, drawBarn, drawCounter, drawCrate,
    drawFence, drawArrow
};