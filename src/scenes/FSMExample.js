class FSMExample extends Phaser.Scene {
    constructor() {
        super("fsmexampleScene");

        this.heroVelocity = 100;    // in pixels
        this.dashCooldown = 300;    // in ms
    }

    preload() {
        this.load.spritesheet('hero', 'https://cdn.glitch.com/59aa1c5f-c16d-41a1-bfd2-09072e84a538%2Fhero.png?1551136698770', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image('bg', 'https://cdn.glitch.com/59aa1c5f-c16d-41a1-bfd2-09072e84a538%2Fbg.png?1551136995353');
    }

    create() {
        // background
        this.add.image(200, 200, 'bg');

        // hero
        this.hero = this.physics.add.sprite(200, 150, 'hero', 0);
        this.hero.direction = 'down';

        // state machine managing hero
        this.heroFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            swing: new SwingState(),
            dash: new DashState(),
        }, [this, this.hero]);

        // animations (walking)
        this.anims.create({
            key: 'walk-down',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
        });
        this.anims.create({
            key: 'walk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
        });
        this.anims.create({
            key: 'walk-up',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
        });
        this.anims.create({
            key: 'walk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
        });

        // animations (swinging)
        this.anims.create({
            key: 'swing-down',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 16, end: 19 }),
        });
        this.anims.create({
            key: 'swing-up',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 20, end: 23 }),
        });
        this.anims.create({
            key: 'swing-right',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 24, end: 27 }),
        });
        this.anims.create({
            key: 'swing-left',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('hero', { start: 28, end: 31 }),
        });

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys();
    }

    update() {
        // handle hero actions
        this.heroFSM.step();

    }
}

// hero-specific state classes
class IdleState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`walk-${hero.direction}`);
        hero.anims.stop();
    }

    execute(scene, hero) {
        // make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys;

        // transition to swing if pressing space
        if(space.isDown) {
            this.stateMachine.transition('swing');
            return;
        }

        // transition to dash if pressing shift
        if(shift.isDown) {
            this.stateMachine.transition('dash');
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
        // make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys;

        // transition to swing if pressing space
        if(space.isDown) {
            this.stateMachine.transition('swing');
            return;
        }

        // transition to dash if pressing shift
        if(shift.isDown) {
            this.stateMachine.transition('dash');
            return;
        }

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }

        // handle movement
        hero.setVelocity(0);
        if(up.isDown) {
            hero.setVelocityY(-scene.heroVelocity);
            hero.direction = 'up';
        } else if(down.isDown) {
            hero.setVelocityY(scene.heroVelocity);
            hero.direction = 'down';
        }
        if(left.isDown) {
            hero.setVelocityX(-scene.heroVelocity);
            hero.direction = 'left';
        } else if(right.isDown) {
            hero.setVelocityX(scene.heroVelocity);
            hero.direction = 'right';
        }

        // handle animation
        hero.anims.play(`walk-${hero.direction}`, true);
    }
}

class SwingState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`swing-${hero.direction}`);
        hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
    }
}

class DashState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`swing-${hero.direction}`);
        switch(hero.direction) {
            case 'up':
                hero.setVelocityY(-scene.heroVelocity * 3);
                break;
            case 'down':
                hero.setVelocityY(scene.heroVelocity * 3);
                break;
            case 'left':
                hero.setVelocityX(-scene.heroVelocity * 3);
                break;
            case 'right':
                hero.setVelocityX(scene.heroVelocity * 3);
                break;
        }

        // set a short delay before going back to idle
        scene.time.delayedCall(scene.dashCooldown, () => {
            this.stateMachine.transition('idle');
        });
    }
}