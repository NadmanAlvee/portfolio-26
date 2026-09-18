import * as THREE from "three";

// Props
import Island from "../props/Island.js";
import Ocean from "../props/Ocean.js";
import Sky from "../props/Sky.js";

export default class Environment {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;

    this.scene.background = new THREE.Color(0x141414);

    // this.island = new Island(this);
    // this.ocean = new Ocean(this);
    this.sky = new Sky(this);

    // debug green plane
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide }),
    );
    this.plane.rotation.x = Math.PI / 2;
    this.scene.add(this.plane);

    // this.island = new Island(this);
    // this.ocean = new Ocean(this);

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
