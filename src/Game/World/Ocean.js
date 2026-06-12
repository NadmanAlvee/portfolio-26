import * as THREE from "three";

import vertexShader from "../Shaders/ocean/vertex.glsl?raw";
import fragmentShader from "../Shaders/ocean/fragment.glsl?raw";

export default class Ocean {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    if (this.resources.items.oceanMesh) {
      this.resource = this.resources.items.oceanMesh;
    }

    this.#initOcean();
  }

  #initOcean() {
    this.mesh = this.resource.scene;
    this.mesh.position.y = 0.12;
    this.mesh.scale.set(8, 8, 8);

    this.oceanMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      // wireframe: true,
    });

    this.mesh.children.forEach((child) => {
      if (child.isMesh) {
        child.material = this.oceanMaterial;
      }
    });

    this.scene.add(this.mesh);
  }
}
