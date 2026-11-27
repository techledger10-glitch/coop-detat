// Camera and visual effects
import { getPlayer } from './player.js';

let camera = {
    x: 0,
    y: 0,
    shakeIntensity: 0,
    shakeTime: 0,
    featherBurst: false,
    featherX: 0,
    featherY: 0,
    redFlash: 0,
    squashX: 1,
    squashY: 1
};

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

function getCamera() {
    return camera;
}

function getCanvasWidth() {
    return CANVAS_WIDTH;
}

function getCanvasHeight() {
    return CANVAS_HEIGHT;
}

function updateCamera(dt) {
    const player = getPlayer();
    
    // Follow player horizontally - keep player in center of screen
    const targetX = player.x - CANVAS_WIDTH * 0.5;
    
    // Smooth camera movement
    camera.x += (targetX - camera.x) * 0.1;
    
    // Clamp to world bounds
    if (camera.x < 0) camera.x = 0;
    
    // Update shake
    if (camera.shakeTime > 0) {
        camera.shakeTime -= dt;
        if (camera.shakeTime <= 0) {
            camera.shakeIntensity = 0;
        }
    }
    
    // Update red flash
    if (camera.redFlash > 0) {
        camera.redFlash -= dt;
    }
}

function addScreenShake(intensity, duration) {
    camera.shakeIntensity = intensity;
    camera.shakeTime = duration;
}

function addFeatherBurst(x, y) {
    camera.featherBurst = true;
    camera.featherX = x;
    camera.featherY = y;
}

function addRedFlash(duration) {
    camera.redFlash = duration;
}

function getScreenShake() {
    if (camera.shakeIntensity > 0) {
        return camera.shakeIntensity * (0.5 + Math.random());
    }
    return 0;
}

function getRedFlashAlpha() {
    return camera.redFlash > 0 ? camera.redFlash * 0.5 : 0;
}

function worldToScreen(x, y) {
    return {
        x: x - camera.x + getScreenShake(),
        y: y - camera.y
    };
}

function screenToWorld(x, y) {
    return {
        x: x + camera.x,
        y: y + camera.y
    };
}

export {
    getCamera, getCanvasWidth, getCanvasHeight, updateCamera,
    addScreenShake, addFeatherBurst, addRedFlash,
    getScreenShake, getRedFlashAlpha, worldToScreen, screenToWorld
};