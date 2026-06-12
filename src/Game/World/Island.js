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
    // 3. Extract the 3D scene geometry from the GLTF file data
    this.mesh = this.resource?.scene;
    this.mesh.scale.set(4, 4, 4);

    // 4. Traverse the model to configure lighting behaviors
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Force the low-poly facets to cast and receive crisp shadows
        // child.castShadow = true;
        // child.receiveShadow = true;
        // Optional: Ensure the material recognizes the flat-shaded look
        // if (child.material) {
        //   child.material.flatShading = true;
        //   child.material.needsUpdate = true;
        // }
      }
    });

    // 5. Drop the island into the active scene
    if (this.mesh) {
      this.scene.add(this.mesh);
    }
  }
}
