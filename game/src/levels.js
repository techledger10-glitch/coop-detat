// Level definitions for three stages

const LEVELS = [
    {
        name: 'Farmyard',
        description: 'Escape through the farmyard - watch for fences and hay bales',
        background: '#8B4513',
        stage: 0,
        hazards: [],
        obstacles: [
            { type: 'fence', x: 200, y: 0 },
            { type: 'fence', x: 400, y: 0 },
            { type: 'fence', x: 600, y: 0 },
            { type: 'haystack', x: 300, y: 300 },
            { type: 'haybale', x: 500, y: -100 }
        ],
        exits: [{ x: 1800, y: 0 }],
        farmerSpeed: 0.8,
        farmerVision: 80,
        cornCount: 10
    },
    {
        name: 'Barn',
        description: 'Navigate the dark barn - use crates and cover to hide',
        background: '#4A4A4A',
        stage: 1,
        hazards: [
            { type: 'knife', x: 400, y: -50, speed: 2, telegraphTime: 0.5 }
        ],
        obstacles: [
            { type: 'barn', x: 500, y: 0 },
            { type: 'crate', x: 300, y: 100 },
            { type: 'crate', x: 700, y: -100 }
        ],
        exits: [{ x: 1800, y: 100 }],
        farmerSpeed: 1.2,
        farmerVision: 100,
        cornCount: 15
    },
    {
        name: 'Kitchen',
        description: 'The kitchen is alive with danger - avoid the ovens and carving knives',
        background: '#2F2F2F',
        stage: 2,
        hazards: [
            { type: 'oven', x: 400, y: -30, cycleTime: 3, burstDuration: 0.5 },
            { type: 'oven', x: 800, y: 20, cycleTime: 2.5, burstDuration: 0.4 },
            { type: 'counter', x: 1000, y: -40 },
            { type: 'knife', x: 600, y: -20, speed: 3, telegraphTime: 0.4 }
        ],
        obstacles: [
            { type: 'counter', x: 500, y: 0 },
            { type: 'crate', x: 700, y: 100 },
            { type: 'exit', x: 1600, y: -30 }
        ],
        exits: [{ x: 1700, y: -30 }],
        farmerSpeed: 1.5,
        farmerVision: 120,
        cornCount: 20
    }
];

function getLevel(index) {
    return LEVELS[index] || LEVELS[0];
}

function getLevelCount() {
    return LEVELS.length;
}

export { LEVELS, getLevel, getLevelCount };