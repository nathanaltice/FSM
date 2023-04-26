// Nathan Altice
// Created: 6/9/20
// Updated: 4/25/23 (Phaser 3.60)
// Finite State Machines
// CharacterFSM example adapted from mkelly.me/blog/phaser-finite-state-machine
// Refactored for Hero prefab, detangled scene code from hero code, added 'hurt' state

// DE-DANGER
'use strict';

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,     // for tinting
    width: 400,
    height: 300,
    pixelArt: true,
    zoom: 2,
    physics: {
        default: "arcade"
    },
    scene: [ CharacterFSM ]
};

const game = new Phaser.Game(config);