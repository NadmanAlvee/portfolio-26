import * as THREE from "three";

export default class Island {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    if (this.resources.items.islandTerrain) {
      this.resource = this.resources.items.islandTerrain;
    }

    this.#initMesh();
  }

  #initMesh() {
    // Extract the 3D scene geometry from the GLTF file data
    this.mesh = this.resource?.scene;
    this.mesh.scale.set(4, 4, 4);

    // Load the island into the scene
    if (this.mesh) {
      this.scene.add(this.mesh);
    }
  }
}
