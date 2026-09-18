import { GameEntity, StateMachine } from "yuka";
import { IdleState, WalkState, RunState } from "./States.js";

class Astro extends GameEntity {
  constructor(mixer, animations) {
    super();

    this.mixer = mixer;
    this.animations = animations; // Map or Object containing THREE.AnimationAction instances

    // 1. Initialize Yuka Finite State Machine
    this.stateMachine = new StateMachine(this);

    this.stateMachine.add("IDLE", new IdleState());
    this.stateMachine.add("WALK", new WalkState());
    this.stateMachine.add("RUN", new RunState());

    this.stateMachine.changeTo("IDLE");

    // 2. Configuration & Stats
    this.crossFadeDuration = 0.2; // Snappy 200ms animation blending
    this.energy = 100;
    this.deltaTime = 0;
  }

  // 🌟 Single Source of Truth: Dynamic getters query Yuka directly
  get isIdle() {
    return this.stateMachine.in("IDLE");
  }

  get isWalking() {
    return this.stateMachine.in("WALK");
  }

  get isRunning() {
    return this.stateMachine.in("RUN");
  }

  update(delta) {
    this.deltaTime = delta;

    // Advance Three.js skeletal animation keyframes
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Advance Yuka state logic
    this.stateMachine.update();

    return this;
  }
}

export { Astro };
