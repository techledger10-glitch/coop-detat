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
        // All positions are in screen space after camera is applied
        
        // Set camera to 0 so world positions = screen positions
        const cam = getCamera();
        cam.x = 0;
        
        // Turkey: feet at (500, 570), 100 px tall, facing right, running
        getPlayer().x = 500;
        getPlayer().y = GROUND_Y;
        
        // Farmer: feet at (250, 570), 150 px tall, facing right, chasing
        getFarmer().x = 250;
        getFarmer().state = 'chase';
        getFarmer().lastSeenX = getPlayer().x;
        getFarmer().lastSeenY = getPlayer().y;
        
        // Thrown carving knife in the air at (390, 380)
        spawnKnife(390, 380, 2.5, 0.5);
        
        // Three ears of corn at (700, 550), (800, 550), (900, 550)
        spawnCorn(700, GROUND_Y);
        spawnCorn(800, GROUND_Y);
        spawnCorn(900, GROUND_Y);
    }
    
    if (screenshotMode === 'kitchen') {
        // Set camera to 0 so world positions = screen positions
        const cam = getCamera();
        cam.x = 0;
        
        // Turkey on the tiled floor at (500, 570)
        getPlayer().x = 500;
        getPlayer().y = GROUND_Y;
        
        // Oven with glowing mouth at (300, 400..570)
        spawnOven(300, GROUND_Y, 3, 0.5);
        
        // Carving knife in the air at (420, 380)
        spawnKnife(420, 380, 2, 0.4);
        
        // Counter run along the back (handled in drawKitchen)
        // Pans hanging (handled in drawKitchen)
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