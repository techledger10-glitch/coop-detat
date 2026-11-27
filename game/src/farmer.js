// Farmer AI with patrol, vision, chase, and search behavior
import { playFootstep, playChaseMotif } from './audio.js';
import { GROUND_Y } from './levels.js';

let farmer = {
    x: 50,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    width: 25,
    height: 40,
    speed: 0.8,
    facing: 1,
    state: 'patrol', // patrol, chase, search, giveup
    patrolRoute: [],
    patrolIndex: 0,
    sightLine: 0,
    lastSeenX: 0,
    lastSeenY: 0,
    lastSeenTime: 0,
    searchRadius: 100,
    searchTimer: 0,
    animationTime: 0,
    noiseLevel: 0
};

let chaseTime = 0;

function getFarmer() {
    return farmer;
}

function updateFarmer(dt, player, level) {
    const dist = Math.hypot(player.x - farmer.x, player.y - farmer.y);
    const canSee = checkVision(player);
    const makeNoise = farmer.noiseLevel > 0;
    
    if (canSee || makeNoise) {
        farmer.state = 'chase';
        farmer.lastSeenX = player.x;
        farmer.lastSeenY = player.y;
        farmer.lastSeenTime = 0;
        chaseTime += dt;
        playChaseMotif();
    } else if (farmer.state === 'chase') {
        farmer.lastSeenTime += dt;
        if (farmer.lastSeenTime > 2) {
            farmer.state = 'search';
            farmer.searchTimer = 0;
        }
    } else if (farmer.state === 'search') {
        farmer.searchTimer += dt;
        if (farmer.searchTimer > 3 || dist > farmer.searchRadius * 2) {
            farmer.state = 'patrol';
            chaseTime = 0;
        }
    }
    
    // Patrol behavior
    if (farmer.state === 'patrol') {
        if (farmer.patrolRoute.length > 0) {
            const target = farmer.patrolRoute[farmer.patrolIndex];
            const toTarget = Math.hypot(target.x - farmer.x, target.y - farmer.y);
            if (toTarget < 10) {
                farmer.patrolIndex = (farmer.patrolIndex + 1) % farmer.patrolRoute.length;
            }
            const targetX = farmer.patrolRoute[farmer.patrolIndex].x;
            const targetY = farmer.patrolRoute[farmer.patrolIndex].y;
            const angle = Math.atan2(targetY - farmer.y, targetX - farmer.x);
            farmer.vx = Math.cos(angle) * farmer.speed;
            farmer.vy = Math.sin(angle) * farmer.speed;
            farmer.facing = farmer.vx > 0 ? 1 : -1;
        }
    }
    
    // Chase behavior
    if (farmer.state === 'chase') {
        const angle = Math.atan2(player.y - farmer.y, player.x - farmer.x);
        farmer.vx = Math.cos(angle) * farmer.speed * (1 + chaseTime * 0.1);
        farmer.vy = Math.sin(angle) * farmer.speed * (1 + chaseTime * 0.1);
        farmer.facing = farmer.vx > 0 ? 1 : -1;
    }
    
    // Search behavior
    if (farmer.state === 'search') {
        const angle = Math.atan2(farmer.lastSeenY - farmer.y, farmer.lastSeenX - farmer.x);
        farmer.vx = Math.cos(angle) * farmer.speed * 0.5;
        farmer.vy = Math.sin(angle) * farmer.speed * 0.5;
        farmer.facing = farmer.vx > 0 ? 1 : -1;
    }
    
    // Update position
    farmer.x += farmer.vx * dt;
    farmer.y += farmer.vy * dt;
    
    // Ground collision
    if (farmer.y > GROUND_Y - farmer.height) {
        farmer.y = GROUND_Y - farmer.height;
        farmer.vy = 0;
    }
    
    // Update animation
    farmer.animationTime += dt;
    
    return true;
}

function checkVision(player) {
    // Simple line-of-sight check
    const dx = farmer.x - player.x;
    const dy = farmer.y - player.y;
    const dist = Math.hypot(dx, dy);
    
    return dist < farmer.sightLine * 1.5;
}

function setPatrolRoute(points) {
    farmer.patrolRoute = points;
    farmer.patrolIndex = 0;
}

function setFarmerSpeed(speed) {
    farmer.speed = speed;
}

function setFarmerVision(vision) {
    farmer.sightLine = vision;
}

function getChaseTime() {
    return chaseTime;
}

function resetFarmer() {
    farmer = {
        x: 50,
        y: GROUND_Y,
        vx: 0,
        vy: 0,
        width: 25,
        height: 40,
        speed: 0.8,
        facing: 1,
        state: 'patrol',
        patrolRoute: [],
        patrolIndex: 0,
        sightLine: 80,
        lastSeenX: 0,
        lastSeenY: 0,
        lastSeenTime: 0,
        searchRadius: 100,
        searchTimer: 0,
        animationTime: 0,
        noiseLevel: 0
    };
    chaseTime = 0;
}

export {
    getFarmer, updateFarmer, setPatrolRoute, setFarmerSpeed, setFarmerVision,
    getChaseTime, resetFarmer
};