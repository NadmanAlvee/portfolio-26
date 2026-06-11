import * as THREE from "three";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Resources from "./Engine/Resources.js";
import Environment from "./World/Environment.js";

// Props
import Island from "./World/Island.js";

export default class Experience {
  constructor() {
    // 1. Core Config
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this);
    this.camera = new Camera(this);

    // 2. Resource Core Setup
    this.resources = new Resources(() => this.#initWorld());

    // Define all assets needed globally
    this.resources.load([
      {
        name: "islandTerrain",
        type: "glb",
        path: "/models/Island.glb",
      },
      { name: "oceanMesh", type: "glb", path: "/models/Ocean.glb" },
    ]);

    // 3. System Events
    window.addEventListener("resize", () => this.#resize());
    this.#startLoop();
  }

  #initWorld() {
    // Fired automatically when assets load completely
    this.environment = new Environment(this);

    this.axesHelper = new THREE.AxesHelper(10);
    this.scene.add(this.axesHelper);

    this.island = new Island(this);

    // Remove loading overlay safely from the UI
    document.querySelector(".progress-bar-container").style.display = "none";
    console.log("Dark World Spawned.");
  }

  #resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  #startLoop() {
    this.renderer.instance.setAnimationLoop(() => {
      this.camera.update();

      this.renderer.update();
    });
  }
}
