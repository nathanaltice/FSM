// Nathan Altice
// Created: 6/9/20
// Finite State Machines
// Example 1 adapted from mkelly.me/blog/phaser-finite-state-machine

// DE-DANGER
'use strict';

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    pixelArt: true,
    zoom: 2,
    physics: {
        default: "arcade"
    },
    scene: [ FSMExample ]
};

// define game
const game = new Phaser.Game(config);

// global stuff