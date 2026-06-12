import * as THREE from "three";
import Stats from "stats-gl";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Resources from "./Engine/Resources.js";
import Environment from "./World/Environment.js";

// Props
import Island from "./World/Island.js";
import Ocean from "./World/Ocean.js";
import Sky from "./World/Sky.js";

export default class Experience {
  constructor() {
    // 1. Core Config
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this);
    this.camera = new Camera(this);

    // perf monitor
    this.#initPerformanceMonitor();

    // 2. Resource Core Setup
    this.resources = new Resources(() => this.#initWorld());

    // Define all assets needed globally
    this.resources.load([
      {
        name: "islandTerrain",
        type: "glb",
        path: "/models/Island.glb",
      },
      { name: "oceanMesh", type: "glb", path: "/models/oceanPlane.glb" },
    ]);

    window.addEventListener("resize", () => this.#resize());
    this.#startLoop();
  }

  #initPerformanceMonitor() {
    this.stats = new Stats({
      trackGPU: true,
      logsPerSecond: 20,
    });

    document.body.appendChild(this.stats.dom);

    this.stats.init(this.renderer.instance);
  }

  #initWorld() {
    this.environment = new Environment(this);

    this.island = new Island(this);
    this.ocean = new Ocean(this);
    this.sky = new Sky(this);

    // Remove loading overlay
    document.querySelector(".progress-bar-container").style.display = "none";
    console.log("Dark World Spawned.");
  }

  #resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  #startLoop() {
    this.renderer.instance.setAnimationLoop((time) => {
      this.stats.begin();
      this.camera.update();

      if (this.ocean) {
        this.ocean.oceanMaterial.uniforms.uTime.value = time / 1000;
      }

      if (this.sky) {
        this.sky.update();
      }

      this.renderer.update();
      this.stats.end();
      this.stats.update();
    });
  }
}
