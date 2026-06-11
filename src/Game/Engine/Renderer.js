import * as THREE from "three";

export default class Renderer {
  constructor(experience) {
    this.experience = experience;
    this.domElement = document.body;

    this.instance = new THREE.WebGLRenderer({ antialias: true });
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.shadowMap.enabled = true;

    this.domElement.append(this.instance.domElement);
  }

  resize() {
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    this.instance.render(
      this.experience.scene,
      this.experience.camera.instance,
    );
  }
}
