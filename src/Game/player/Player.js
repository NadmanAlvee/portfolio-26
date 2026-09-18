import * as THREE from "three";
import { Astro } from "./Astro.js";
import InputController from "./InputController.js";

export default class Player {
  constructor(experience) {
    this.experience = experience;
    this.worldScene = this.experience.scene;
    this.resources = this.experience.resources;

    this.entityManager = this.experience.entityManager;

    this.input = new InputController();

    this.playerGltf = this.resources.items.player;

    this.instance = this.playerGltf.scene;
    this.instance.animations = this.playerGltf.animations;

    this.#initCharacter();
  }

  #initCharacter() {
    // 1. Add Player to World
    this.instance.scale.set(1, 1, 1);
    this.instance.position.set(0, 0, 0); // Island spawn point
    this.worldScene.add(this.instance);

    // 2. Map Animation Actions with their name in this.animations eg. this.animations[0] = {"WALK", WalkAction}
    this.mixer = new THREE.AnimationMixer(this.instance);
    this.animations = new Map();

    this.instance.animations.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      action.play();
      action.enabled = false;
      this.animations.set(clip.name.toUpperCase(), action);

      // action.setLoop(THREE.LoopRepeat, Infinity);
      // action.clampWhenFinished = false;
    });

    // debug
    console.log(this.animations);

    // 3. Instantiate Yuka Astro class
    this.astro = new Astro(this.mixer, this.animations);
    this.entityManager.add(this.astro);

    // Bridge Yuka position/rotation to the Three.js mesh
    this.astro.setRenderComponent(this.instance, (entity, renderComponent) => {
      renderComponent.position.copy(entity.position);
      renderComponent.quaternion.copy(entity.rotation);
    });
  }

  #handleInput(delta) {
    const inputs = this.input.keys;

    this.astro.turnLeft = inputs.left;
    this.astro.turnRight = inputs.right;

    if (inputs.forward) {
      this.astro.isRunning = inputs.shift;
      this.astro.isWalking = !inputs.shift;
      this.astro.isIdle = false;
    } else {
      this.astro.isIdle = true;
      this.astro.isWalking = false;
      this.astro.isRunning = false;
    }
  }

  update(delta) {
    if (!this.astro) return;

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.#handleInput(delta);
  }
}
