import { State } from "yuka";

const IDLE = "IDLE";
const WALK = "WALK";
const RUN = "RUN";

class IdleState extends State {
  enter(astro) {
    const idle = astro.animations.get(IDLE);
    if (idle) {
      idle.enabled = true;
      idle.reset().fadeIn(astro.crossFadeDuration).play();
    }
  }

  execute(astro) {
    if (!astro.isIdle && astro.isWalking && !astro.isRunning) {
      astro.stateMachine.changeTo(WALK);
      return;
    }
    if (!astro.isIdle && !astro.isWalking && astro.isRunning) {
      astro.stateMachine.changeTo(RUN);
      return;
    }
  }

  exit(astro) {
    const idle = astro.animations.get(IDLE);
    if (idle) idle.fadeOut(astro.crossFadeDuration);
  }
}

class WalkState extends State {
  enter(astro) {
    const walk = astro.animations.get(WALK);
    if (walk) {
      walk.enabled = true;
      walk.reset().fadeIn(astro.crossFadeDuration).play();
    }
  }

  execute(astro) {
    if (astro.isIdle && !astro.isWalking && !astro.isRunning) {
      astro.stateMachine.changeTo(IDLE);
      return;
    }
    if (!astro.isIdle && !astro.isWalking && astro.isRunning) {
      astro.stateMachine.changeTo(RUN);
      return;
    }
  }

  exit(astro) {
    const walk = astro.animations.get(WALK);
    if (walk) walk.fadeOut(astro.crossFadeDuration);
  }
}

class RunState extends State {
  enter(astro) {
    const run = astro.animations.get(RUN);
    if (run) {
      run.enabled = true;
      run.reset().fadeIn(astro.crossFadeDuration).play();
    }
  }

  execute(astro) {
    if (astro.isIdle && !astro.isWalking && !astro.isRunning) {
      astro.stateMachine.changeTo(IDLE);
      return;
    }
    if (!astro.isIdle && astro.isWalking && !astro.isRunning) {
      astro.stateMachine.changeTo(WALK);
      return;
    }
  }

  exit(astro) {
    const run = astro.animations.get(RUN);
    if (run) run.fadeOut(astro.crossFadeDuration);
  }
}

export { IdleState, WalkState, RunState };
