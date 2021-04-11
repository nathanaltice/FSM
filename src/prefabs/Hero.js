// Hero prefab
class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame); // call Sprite parent class
        scene.add.existing(this);           // add Hero to existing scene
        scene.physics.add.existing(this);   // add physics body to scene

        // set properties
        this.direction = direction; 
        this.heroVelocity = 100;    // in pixels
        this.dashCooldown = 300;    // in ms
        this.hurtTimer = 500;       // in ms
        this.body.setCollideWorldBounds(true);
    }
}

// hero-specific state classes
class IdleState extends State {
    enter(scene, hero) {
        hero.body.setVelocity(0);
        hero.anims.play(`walk-${hero.direction}`);
        hero.anims.stop();
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys;
        const HKey = scene.keys.HKey;

        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('swing');
            return;
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('dash');
            return;
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt');
            return;
        }

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('move');
            return;
        }
    }
}

class MoveState extends State {
    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys;
        const HKey = scene.keys.HKey;

        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('swing');
            return;
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('dash');
            return;
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt');
            return;
        }

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }

        // handle movement
        hero.body.setVelocity(0);
        if(up.isDown) {
            hero.body.setVelocityY(-hero.heroVelocity);
            hero.direction = 'up';
        } else if(down.isDown) {
            hero.body.setVelocityY(hero.heroVelocity);
            hero.direction = 'down';
        }
        if(left.isDown) {
            hero.body.setVelocityX(-hero.heroVelocity);
            hero.direction = 'left';
        } else if(right.isDown) {
            hero.body.setVelocityX(hero.heroVelocity);
            hero.direction = 'right';
        }

        // handle animation
        hero.anims.play(`walk-${hero.direction}`, true);
    }
}

class SwingState extends State {
    enter(scene, hero) {
        hero.body.setVelocity(0);
        hero.anims.play(`swing-${hero.direction}`);
        hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
    }
}

class DashState extends State {
    enter(scene, hero) {
        hero.body.setVelocity(0);
        hero.anims.play(`swing-${hero.direction}`);
        switch(hero.direction) {
            case 'up':
                hero.body.setVelocityY(-hero.heroVelocity * 3);
                break;
            case 'down':
                hero.body.setVelocityY(hero.heroVelocity * 3);
                break;
            case 'left':
                hero.body.setVelocityX(-hero.heroVelocity * 3);
                break;
            case 'right':
                hero.body.setVelocityX(hero.heroVelocity * 3);
                break;
        }

        // set a short delay before going back to idle
        scene.time.delayedCall(hero.dashCooldown, () => {
            this.stateMachine.transition('idle');
        });
    }
}

class HurtState extends State {
    enter(scene, hero) {
        hero.body.setVelocity(0);
        hero.anims.play(`walk-${hero.direction}`);
        hero.anims.stop();
        hero.setTint(0xFF0000);     // turn red

        // set recovery timer
        scene.time.delayedCall(hero.hurtTimer, () => {
            hero.clearTint();
            this.stateMachine.transition('idle');
        });
    }
}