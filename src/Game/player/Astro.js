import { GameEntity, StateMachine } from "yuka";
import { IdleState, WalkState, RunState } from "./States.js";

class Astro extends GameEntity {
  constructor(mixer, animationMap) {
    super();

    this.mixer = mixer;
    this.animations = animationMap;

    // 1. Configuration & Stats
    this.crossFadeDuration = 0.5; //  200ms

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
    // Advance Yuka state logic
    this.stateMachine.update();

    // why?
    return this;
  }
}

export { Astro };
