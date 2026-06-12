import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class Camera {
  constructor(experience) {
    this.experience = experience;

    this.instance = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.instance.position.set(0, 100, 150);

    this.controls = new OrbitControls(
      this.instance,
      this.experience.renderer.domElement,
    );
  }

  resize() {
    this.instance.aspect = window.innerWidth / window.innerHeight;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
