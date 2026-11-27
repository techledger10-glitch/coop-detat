// Keyboard input handling
const keys = new Set();
const justPressed = new Set();
const justReleased = new Set();

window.addEventListener('keydown', (e) => {
    if (!keys.has(e.code)) {
        justPressed.add(e.code);
    }
    keys.add(e.code);
});

window.addEventListener('keyup', (e) => {
    justReleased.add(e.code);
    keys.delete(e.code);
});

function updateInput() {
    justPressed.clear();
    justReleased.clear();
}

function isDown(code) {
    return keys.has(code);
}

function wasPressed(code) {
    return justPressed.has(code);
}

function wasReleased(code) {
    return justReleased.has(code);
}

export { keys, isDown, wasPressed, wasReleased, updateInput };