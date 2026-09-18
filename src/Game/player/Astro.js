import * as YUKA from "yuka";
import { GameEntity, StateMachine } from "yuka";
import { IdleState, WalkState, RunState } from "./States.js";

class Astro extends GameEntity {
  constructor(mixer, animationMap) {
    super();

    this.mixer = mixer;
    this.animations = animationMap;

    // 1. Configuration & Stats
    this.crossFadeDuration = 0.5; //  200ms

    // new: turning intent, set externally by Player each frame
    this.turnLeft = false;
    this.turnRight = false;
    this.heading = 0; // radians, source of truth for facing direction

    this.turnSpeed = 0.8; // rad/sec
    this.walkSpeed = 1; // units/sec
    this.runSpeed = 2.5;

    this.isIdle = false;
    this.isWalking = false;
    this.isRunning = false;

    // 2. Initialize Yuka Finite State Machine
    this.stateMachine = new StateMachine(this);
    this.stateMachine.add("IDLE", new IdleState());
    this.stateMachine.add("WALK", new WalkState());
    this.stateMachine.add("RUN", new RunState());

    this.stateMachine.changeTo("IDLE");
  }

  update(delta) {
    this.#handleMovement(delta);
    this.stateMachine.update();
    return this;
  }

  #handleMovement(delta) {
    if (this.turnLeft) this.heading += this.turnSpeed * delta;
    if (this.turnRight) this.heading -= this.turnSpeed * delta;
    this.rotation.fromEuler(0, this.heading, 0);

    if (this.isWalking || this.isRunning) {
      const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
      const forward = new YUKA.Vector3(0, 0, 1).applyRotation(this.rotation);
      this.position.add(forward.multiplyScalar(speed * delta));
    }
  }
}

export { Astro };
