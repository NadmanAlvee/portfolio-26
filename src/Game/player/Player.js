import * as THREE from "three";
import { EntityManager } from "yuka";
import { Astro } from "./Astro.js";
import InputController from "./InputController.js";

export default class Player {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.entityManager = new EntityManager();
    this.input = new InputController();
    this.resource = this.resources.items.player;

    this.#initCharacter();
  }

  #initCharacter() {
    this.mesh = this.resource.scene;
    this.mesh.scale.set(1, 1, 1);
    this.mesh.position.set(0, 0, 0); // Island spawn point
    this.scene.add(this.mesh);

    // Build Three.js Animation Mixer
    this.mixer = new THREE.AnimationMixer(this.mesh);
    this.animations = new Map();

    // Store GLTF clips in a searchable Map for Astro
    this.resource.animations.forEach((clip) => {
      const action = this.mixer.clipAction(clip);

      // 🌟 FIX 1: Explicitly force clip actions to loop infinitely
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;

      this.animations.set(clip.name.toLowerCase(), action);
    });

    // Instantiate Yuka Astro class
    this.astro = new Astro(this.mixer, this.animations);

    // Bridge Yuka position/rotation to the Three.js mesh
    this.astro.setRenderComponent(this.mesh, (entity, renderComponent) => {
      renderComponent.position.copy(entity.position);
      renderComponent.quaternion.copy(entity.rotation);
    });

    this.entityManager.add(this.astro);
  }

  update(delta) {
    if (!this.astro) return;

    // 1. Handle movement vector and state transition requests
    this.#handleInput(delta);

    // 🌟 FIX 2: Only call Yuka's EntityManager update!
    // This automatically calls astro.update(delta) once under the hood.
    this.entityManager.update(delta);
  }

  #handleInput(delta) {
    const keys = this.input.keys;

    // Evaluate 3D directional vector
    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.forward) moveDir.z -= 1;
    if (keys.backward) moveDir.z += 1;
    if (keys.left) moveDir.x -= 1;
    if (keys.right) moveDir.x += 1;

    const isMoving = moveDir.lengthSq() > 0;

    if (isMoving) {
      moveDir.normalize();

      // Determine movement speed based on shift key
      const speed = keys.shift ? 6.0 : 3.0;

      // Update Yuka entity position in 3D space
      this.astro.position.x += moveDir.x * speed * delta;
      this.astro.position.z += moveDir.z * speed * delta;

      // Smoothly rotate character toward movement direction
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      const targetRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        targetAngle,
      );
      this.mesh.quaternion.slerp(targetRotation, 10 * delta);
      this.astro.rotation.copy(this.mesh.quaternion);

      // Request state change
      if (keys.shift) {
        this.astro.stateMachine.changeTo("RUN");
      } else {
        this.astro.stateMachine.changeTo("WALK");
      }
    } else {
      this.astro.stateMachine.changeTo("IDLE");
    }
  }
}
