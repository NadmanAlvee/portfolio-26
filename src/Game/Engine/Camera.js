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
    this.instance.position.set(0, 5, -3);

    this.controls = new OrbitControls(
      this.instance,
      this.experience.renderer.domElement,
    );

    this.controls.maxPolarAngle = Math.PI / 2.1;
    // this.controls.enablePan = false;
    // this.controls.minDistance = 80;
    // this.controls.maxDistance = 200;
  }

  resize() {
    this.instance.aspect = window.innerWidth / window.innerHeight;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
