// Screenshot mode handler
import { setState, isPlaying, isCaught } from './state.js';
import { getLevel } from './levels.js';
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
    getPlayer().y = screenshotMode === 'kitchen' ? 180 : 250;
    
    setFarmerSpeed(1.2 + (window.currentLevel || 0) * 0.3);
    setFarmerVision(90 + (window.currentLevel || 0) * 15);
    
    if (screenshotMode === 'chase') {
        getPlayer().x = 300;
        getFarmer().x = 250;
        getFarmer().state = 'chase';
        getFarmer().lastSeenX = getPlayer().x;
        getFarmer().lastSeenY = getPlayer().y;
        
        setPatrolRoute([
            { x: 200, y: 250 },
            { x: 400, y: 250 }
        ]);
        
        spawnKnife(380, 250, 2.5, 0.5);
    }
    
    if (screenshotMode === 'kitchen') {
        getPlayer().x = 1200;
        getPlayer().y = 180;
        getFarmer().x = 1150;
        getFarmer().state = 'chase';
        
        spawnOven(1400, 170, 3, 0.5);
        spawnKnife(1500, 190, 2, 0.4);
    }
    
    addScore(50);
    
    const cam = getCamera();
    cam.x = getPlayer().x - 300;
}

function isScreenshotMode() {
    return screenshotMode !== null;
}

export {
    parseUrlParams, getScreenshotMode, setupScreenshotScene, isScreenshotMode
};