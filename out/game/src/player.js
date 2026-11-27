// Player (turkey) character
import { isDown } from './input.js';
import { playFootstep, playGobble } from './audio.js';
import { GROUND_Y } from './levels.js';

let player = {
    x: 100,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    width: 20,
    height: 30,
    speed: 2,
    sprintSpeed: 4,
    jumpPower: 3,
    stamina: 100,
    maxStamina: 100,
    staminaRegen: 0.5,
    onGround: true,
    facing: 1,
    sprinting: false,
    hidden: false,
    animationTime: 0,
    visible: true
};

function getPlayer() {
    return player;
}

function updatePlayer(dt, level) {
    const moveSpeed = player.sprinting ? player.sprintSpeed : player.speed;
    
    // Horizontal movement
    if (isDown('ArrowLeft') || isDown('KeyA')) {
        player.vx = -moveSpeed;
        player.facing = -1;
    } else if (isDown('ArrowRight') || isDown('KeyD')) {
        player.vx = moveSpeed;
        player.facing = 1;
    } else {
        player.vx = 0;
    }
    
    // Sprint (Shift or 'ShiftLeft')
    if ((isDown('ShiftLeft') || isDown('ShiftRight') || isDown('KeyS')) && player.stamina > 0) {
        player.sprinting = true;
        player.stamina -= 2 * dt;
        if (player.stamina <= 0) {
            player.stamina = 0;
            player.sprinting = false;
        }
    } else {
        player.sprinting = false;
        // Regenerate stamina
        player.stamina += player.staminaRegen * dt;
        if (player.stamina > player.maxStamina) {
            player.stamina = player.maxStamina;
        }
    }
    
    // Jump
    if ((isDown('ArrowUp') || isDown('KeyW') || isDown('Space')) && player.onGround) {
        player.vy = -player.jumpPower;
        player.onGround = false;
        playGobble();
    }
    
    // Gravity
    if (!player.onGround) {
        player.vy += 0.3 * dt;
        if (player.vy > 5) player.vy = 5;
    } else {
        // Apply friction
        player.vx *= 0.9;
    }
    
    // Update position
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    
    // Simple ground collision (for now)
    if (player.y > GROUND_Y - player.height) {
        player.y = GROUND_Y - player.height;
        player.vy = 0;
        player.onGround = true;
    }
    
    // Keep within bounds
    if (player.x < 0) player.x = 0;
    if (player.x > 2000) player.x = 2000;
    
    // Update animation
    player.animationTime += dt;
    
    return true;
}

function damagePlayer() {
    player.stamina = 0;
    player.sprinting = false;
}

function resetPlayer() {
    player = {
        x: 100,
        y: GROUND_Y,
        vx: 0,
        vy: 0,
        width: 20,
        height: 30,
        speed: 2,
        sprintSpeed: 4,
        jumpPower: 3,
        stamina: 100,
        maxStamina: 100,
        staminaRegen: 0.5,
        onGround: true,
        facing: 1,
        sprinting: false,
        hidden: false,
        animationTime: 0,
        visible: true
    };
}

function setPlayerHidden(hidden) {
    player.hidden = hidden;
}

export { getPlayer, updatePlayer, damagePlayer, resetPlayer, setPlayerHidden };