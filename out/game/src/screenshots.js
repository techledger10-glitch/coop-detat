// Screenshot mode handler
import { setState, isPlaying, isCaught } from './state.js';
import { getLevel, GROUND_Y } from './levels.js';
import { resetPlayer, getPlayer } from './player.js';
import { resetFarmer, getFarmer, setFarmerSpeed, setFarmerVision, setPatrolRoute } from './farmer.js';
import { resetHazards, spawnKnife, spawnOven, spawnCorn } from './hazards.js';
import { resetHud, getHud, addScore } from './hud.js';
import { getCamera } from './camera.js';

let screenshotMode = null;
let screenshotSeed = 0;

function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const shot = params.get('shot');
    const seed = params.get('seed');
    if (shot) {
        screenshotMode = shot;
        if (seed) screenshotSeed = parseInt(seed, 10);
    }
}

function getScreenshotMode() {
    return screenshotMode;
}

function setupScreenshotScene() {
    if (!screenshotMode) return;
    
    if (screenshotMode === 'title') {
        setState('title');
        return;
    }
    
    if (screenshotMode === 'caught') {
        // Setup for caught screen
        setState('caught');
        resetHud();
        addScore(150);
        window.currentLevel = 0;
        return;
    }
    
    if (screenshotMode === 'escaped') {
        // Setup for escaped screen
        setState('escaped');
        resetHud();
        addScore(450);
        window.currentLevel = 2;
        return;
    }
    
    // For chase, kitchen, etc - setup play state
    setState('playing');
    window.currentLevel = screenshotMode === 'kitchen' ? 2 : 0;
    
    resetHud();
    addScore(120);
    
    resetPlayer();
    resetFarmer();
    resetHazards();
    
    getPlayer().x = screenshotMode === 'kitchen' ? 1200 : 300;
    getPlayer().y = GROUND_Y;
    
    setFarmerSpeed(1.2 + (window.currentLevel || 0) * 0.3);
    setFarmerVision(90 + (window.currentLevel || 0) * 15);
    
    if (screenshotMode === 'chase') {
        // Setup chase scene deliberately with fixed positions
        // Turkey running on the ground
        getPlayer().x = 400;
        getPlayer().y = GROUND_Y;
        
        // Farmer close behind with pitchfork raised
        getFarmer().x = 350;
        getFarmer().state = 'chase';
        getFarmer().lastSeenX = getPlayer().x;
        getFarmer().lastSeenY = getPlayer().y;
        
        setPatrolRoute([
            { x: 300, y: GROUND_Y },
            { x: 500, y: GROUND_Y }
        ]);
        
        // Thrown carving knife in the air (slightly above ground for dramatic effect)
        spawnKnife(380, GROUND_Y - 50, 2.5, 0.5);
        
        // Two ears of corn
        spawnCorn(320, GROUND_Y);
        spawnCorn(450, GROUND_Y);
    }
    
    if (screenshotMode === 'kitchen') {
        getPlayer().x = 1200;
        getPlayer().y = GROUND_Y;
        getFarmer().x = 1150;
        getFarmer().state = 'chase';
        
        spawnOven(1400, GROUND_Y, 3, 0.5);
        spawnKnife(1500, GROUND_Y, 2, 0.4);
    }
    
    addScore(50);
    
    const cam = getCamera();
    // Set camera to 40% from left edge (player.x - 0.4 * 1280)
    cam.x = getPlayer().x - 512;
}

function isScreenshotMode() {
    return screenshotMode !== null;
}

export {
    parseUrlParams, getScreenshotMode, setupScreenshotScene, isScreenshotMode
};