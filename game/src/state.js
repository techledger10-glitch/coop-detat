// Game state machine
const STATES = {
    TITLE: 'title',
    PLAYING: 'playing',
    PAUSED: 'paused',
    CAUGHT: 'caught',
    ESCAPED: 'escaped'
};

let currentState = STATES.TITLE;
let stateData = {};

function getState() {
    return currentState;
}

function setState(newState, data = {}) {
    currentState = newState;
    stateData = data;
}

function isTitle() {
    return currentState === STATES.TITLE;
}

function isPlaying() {
    return currentState === STATES.PLAYING;
}

function isPaused() {
    return currentState === STATES.PAUSED;
}

function isCaught() {
    return currentState === STATES.CAUGHT;
}

function isEscaped() {
    return currentState === STATES.ESCAPED;
}

function getStateData() {
    return stateData;
}

function setStateData(key, value) {
    stateData[key] = value;
}

export {
    STATES, getState, setState, isTitle, isPlaying, isPaused,
    isCaught, isEscaped, getStateData, setStateData
};