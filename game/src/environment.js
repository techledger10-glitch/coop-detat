// Draw environment for each stage
// This fills the 1280x720 frame with full stage backgrounds

function drawEnvironment(ctx, level, camera) {
    const camX = camera.x;
    
    if (level.stage === 0 || !level.stage) {
        // FARMYARD - Stage 1
        drawFarmyard(ctx, camX);
    } else if (level.stage === 1) {
        // BARN - Stage 2
        drawBarnInterior(ctx, camX);
    } else if (level.stage === 2) {
        // KITCHEN - Stage 3
        drawKitchen(ctx, camX);
    }
}

function drawFarmyard(ctx, camX) {
    // Graded sky: deep blue to warm amber
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
    skyGrad.addColorStop(0, '#1a3c6c'); // Deep blue
    skyGrad.addColorStop(0.3, '#4a6fa5'); // Light blue
    skyGrad.addColorStop(0.7, '#d98c45'); // Amber
    skyGrad.addColorStop(1, '#e1b16f'); // Warm sky
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1280, 720);
    
    // Low sun with glow (position based on camera)
    const sunX = (camX + 400) % 2000;
    const sunY = 150;
    const sunRadius = 40;
    
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius);
    sunGrad.addColorStop(0, '#fff9c4');
    sunGrad.addColorStop(1, '#ff9800');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Rolling field bands - three horizontal strips of autumn colors
    for (let i = 0; i < 3; i++) {
        const colors = ['#8fbc8f', '#b8860b', '#cd853f']; // Olive, goldenrod, peru
        ctx.fillStyle = colors[i];
        ctx.fillRect(-camX % 2000, 550 + i * 30, 2000, 25);
    }
    
    // Scattered stubble (thin lines)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for (let i = 0; i < 100; i++) {
        const x = (-camX % 2000) + Math.random() * 2000;
        const y = 600 + Math.random() * 20;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 3 + Math.random() * 4, y + 2 + Math.random() * 3);
        ctx.stroke();
    }
    
    // Distant barn silhouette with glowing window
    ctx.fillStyle = '#2f2f2f';
    ctx.beginPath();
    ctx.moveTo(300, 500);
    ctx.lineTo(500, 300);
    ctx.lineTo(700, 500);
    ctx.closePath();
    ctx.fill();
    
    // Barn window - lit
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(385, 380, 35, 25);
    
    // Rail fence running the length
    const fenceStart = (-camX * 0.5) % 100;
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 4;
    
    for (let x = fenceStart; x < 1280 + 200; x += 100) {
        // Vertical posts
        ctx.beginPath();
        ctx.moveTo(x, 480);
        ctx.lineTo(x, 530);
        ctx.stroke();
        
        // Horizontal rails
        ctx.beginPath();
        ctx.moveTo(x - 5, 500);
        ctx.lineTo(x + 5, 500);
        ctx.stroke();
    }
    
    // Hay bales in various positions
    const hayPositions = [
        [-camX % 2500 + 200, 450],
        [-camX % 2500 + 500, 470],
        [-camX % 2500 + 800, 430],
        [-camX % 2500 + 1100, 480],
        [-camX % 2500 + 1400, 440]
    ];
    
    for (const [hx, hy] of hayPositions) {
        if (hx > -50 && hx < 2330) {
            drawHayBaleSimple(ctx, hx, hy);
        }
    }
}

function drawHayBaleSimple(ctx, x, y) {
    const scale = 0.8;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const yellow = '#f4d03f';
    const tan = '#d2b48c';
    
    ctx.fillStyle = yellow;
    ctx.fillRect(-8, -2, 16, 4);
    
    ctx.strokeStyle = tan;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-7, -1);
    ctx.lineTo(7, -1);
    ctx.stroke();
    
    ctx.restore();
}

function drawBarnInterior(ctx, camX) {
    // Dark timber walls with plank lines
    ctx.fillStyle = '#2f2f2f';
    ctx.fillRect(-camX, 0, 2000, 720);
    
    // Plank lines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    for (let x = -camX; x < 1280 + 500; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 720);
        ctx.stroke();
    }
    
    // Shaft of light from high window (center of screen)
    const lightX = 640;
    const lightGrad = ctx.createRadialGradient(lightX, 100, 0, lightX, 100, 200);
    lightGrad.addColorStop(0, '#fff9c480');
    lightGrad.addColorStop(1, '#ffd54f00');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.arc(lightX, 100, 200, 0, Math.PI * 2);
    ctx.fill();
    
    // Straw on floor
    ctx.fillStyle = '#f4d03f';
    for (let i = 0; i < 50; i++) {
        const x = (-camX * 0.5) % 300 + Math.random() * 300;
        const y = 600 + Math.random() * 30;
        ctx.fillRect(x, y, 4 + Math.random() * 8, 2);
    }
    
    // Crates
    for (let i = 0; i < 5; i++) {
        const cx = (-camX * 0.3) % 400 + Math.random() * 400;
        const cy = 500 + Math.random() * 100;
        drawCrateSimple(ctx, cx, cy);
    }
    
    // Hanging lantern
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(900, 400, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Lantern chain
    ctx.strokeStyle = '#8b8b8b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(900, 415);
    ctx.lineTo(900, 450);
    ctx.stroke();
}

function drawCrateSimple(ctx, x, y) {
    const scale = 0.7;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    const wood = '#8b4513';
    const dark = '#5d2906';
    
    ctx.fillStyle = wood;
    ctx.fillRect(-8, -6, 16, 12);
    
    ctx.strokeStyle = dark;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-7, -3);
    ctx.lineTo(7, -3);
    ctx.moveTo(-4, -6);
    ctx.lineTo(-4, 6);
    ctx.moveTo(4, -6);
    ctx.lineTo(4, 6);
    ctx.stroke();
    
    ctx.restore();
}

function drawKitchen(ctx, camX) {
    // Dark background with warm highlights
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 1280, 720);
    
    // Tiled floor with perspective
    const tileSize = 60;
    const tileColors = ['#4a4a4a', '#3a3a3a'];
    
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 20; col++) {
            const x = col * tileSize - camX * 0.3;
            const y = 550 + row * tileSize * 0.5 - camX * 0.1;
            
            if (x > -tileSize && x < 1280 + tileSize && y > 0 && y < 720) {
                ctx.fillStyle = tileColors[(row + col) % 2];
                ctx.fillRect(x, y, tileSize + tileSize * 0.5, tileSize * 0.5);
                
                // Grout lines
                ctx.strokeStyle = '#2a2a2a';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, tileSize + tileSize * 0.5, tileSize * 0.5);
            }
        }
    }
    
    // Counter run along back wall
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(0, 450, 400, 40);
    
    // Drawer lines
    ctx.strokeStyle = '#5d2906';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 100, 450);
        ctx.lineTo(i * 100, 490);
        ctx.stroke();
    }
    
    // Big range with two oven doors
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(500, 430, 200, 80);
    
    // Oven doors
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(520, 450, 70, 40);
    ctx.fillRect(610, 450, 70, 40);
    
    // Glowing oven mouths (active when bursting)
    const ovenGlow = '#ff6b6b';
    const glowGrad = ctx.createRadialGradient(555, 470, 0, 555, 470, 25);
    glowGrad.addColorStop(0, ovenGlow);
    glowGrad.addColorStop(1, '#4a0000');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(555, 470, 25, 0, Math.PI * 2);
    ctx.fill();
    
    const glowGrad2 = ctx.createRadialGradient(645, 470, 0, 645, 470, 25);
    glowGrad2.addColorStop(0, ovenGlow);
    glowGrad2.addColorStop(1, '#4a0000');
    ctx.fillStyle = glowGrad2;
    ctx.beginPath();
    ctx.arc(645, 470, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Hanging pans
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(750, 420, 8, 20);
    ctx.fillRect(780, 415, 8, 20);
    
    // Carving block
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(850, 500, 40, 30);
    
    // Carving knife (throwing)
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(870, 490, 6, 16);
}

export { drawEnvironment };