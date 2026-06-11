import * as THREE from "three";

export default class Environment {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;

    this.scene.background = new THREE.Color(0x141414);
    this.#setLights();
  }

  #setLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    this.moonLight = new THREE.DirectionalLight("#a2b9ff", 1.5);
    this.moonLight.position.set(10, 20, 10);
    this.moonLight.castShadow = true;
    this.scene.add(this.moonLight);
  }
}
