// Hazards: thrown knives and bursting ovens
import { playKnifeWhoosh, playOvenRoar } from './audio.js';

let knives = [];
let ovens = [];
let corn = [];

function resetHazards() {
    knives = [];
    ovens = [];
    corn = [];
}

function spawnKnife(x, y, speed, telegraphTime) {
    knives.push({
        x,
        y,
        vx: speed,
        vy: 0,
        width: 8,
        height: 3,
        telegraph: telegraphTime,
        active: true,
        throwing: true
    });
    playKnifeWhoosh();
}

function updateKnives(dt) {
    for (let i = knives.length - 1; i >= 0; i--) {
        const knife = knives[i];
        if (!knife.active) continue;
        
        if (knife.telegraph > 0) {
            knife.telegraph -= dt;
        } else {
            knife.x += knife.vx * dt;
            knife.y += knife.vy * dt;
        }
        
        // Remove if far away
        if (knife.x < -100 || knife.x > 2500) {
            knives.splice(i, 1);
        }
    }
}

function spawnOven(x, y, cycleTime, burstDuration) {
    ovens.push({
        x,
        y,
        cycleTime,
        burstDuration,
        timer: 0,
        bursting: false,
        size: 30
    });
}

function updateOvens(dt) {
    for (let i = ovens.length - 1; i >= 0; i--) {
        const oven = ovens[i];
        oven.timer += dt;
        
        if (oven.timer >= oven.cycleTime) {
            oven.bursting = true;
            oven.burstTimer = oven.burstDuration;
            oven.timer = 0;
            playOvenRoar();
        }
        
        if (oven.bursting) {
            oven.burstTimer -= dt;
            if (oven.burstTimer <= 0) {
                oven.bursting = false;
                oven.timer = oven.cycleTime;
            }
        }
    }
}

function spawnCorn(x, y) {
    corn.push({
        x,
        y,
        width: 10,
        height: 8
    });
}

function updateCorn(dt) {
    for (let i = corn.length - 1; i >= 0; i--) {
        const c = corn[i];
        // Just exist for now
    }
}

function getKnives() {
    return knives;
}

function getOvens() {
    return ovens;
}

function getCorn() {
    return corn;
}

function checkKnifeCollision(player) {
    for (const knife of knives) {
        if (!knife.active) continue;
        if (knife.telegraph > 0) continue; // Can't hit during telegraph
        
        if (Math.abs(knife.x - player.x) < (knife.width + player.width) / 2 &&
            Math.abs(knife.y - player.y) < (knife.height + player.height) / 2) {
            return true;
        }
    }
    return false;
}

function checkOvenCollision(player) {
    for (const oven of ovens) {
        if (!oven.bursting) continue;
        
        if (Math.abs(oven.x - player.x) < oven.size &&
            Math.abs(oven.y - player.y) < oven.size) {
            return true;
        }
    }
    return false;
}

function checkCornCollection(player) {
    const collected = [];
    for (let i = corn.length - 1; i >= 0; i--) {
        const c = corn[i];
        if (Math.abs(c.x - player.x) < c.width &&
            Math.abs(c.y - player.y) < c.height) {
            collected.push(i);
            corn.splice(i, 1);
        }
    }
    return collected.length;
}

export {
    resetHazards, spawnKnife, spawnOven, spawnCorn,
    updateKnives, updateOvens, updateCorn,
    getKnives, getOvens, getCorn,
    checkKnifeCollision, checkOvenCollision, checkCornCollection
};