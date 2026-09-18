import { State } from "yuka";

const IDLE = "idle";
const WALK = "walk";
const RUN = "run";

class IdleState extends State {
  enter(astro) {
    const idle = astro.animations.get(IDLE);
    if (idle) {
      idle.enabled = true;
      idle.reset().fadeIn(astro.crossFadeDuration).play();
    }
  }

  execute(astro) {
    // Recover energy while standing still
    astro.energy = Math.min(100, astro.energy + astro.deltaTime * 10);
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
    // Drain energy slowly
    astro.energy = Math.max(0, astro.energy - astro.deltaTime * 5);
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
    // Drain energy faster
    astro.energy = Math.max(0, astro.energy - astro.deltaTime * 15);
  }

  exit(astro) {
    const run = astro.animations.get(RUN);
    if (run) run.fadeOut(astro.crossFadeDuration);
  }
}

export { IdleState, WalkState, RunState };
