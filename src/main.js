// Nathan Altice
// Created: 6/9/20
// Finite State Machines
// CharacterFSM example adapted from mkelly.me/blog/phaser-finite-state-machine, but refactored for separate Hero prefab

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
    scene: [ CharacterFSM ]
};

// define game
const game = new Phaser.Game(config);

// global stuff