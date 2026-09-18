import * as THREE from "three";
import * as YUKA from "yuka";
import Stats from "stats-gl";
import Renderer from "./engine/Renderer.js";
import Camera from "./engine/Camera.js";
import Resources from "./engine/Resources.js";
import Environment from "./engine/Environment.js";

// Player
import Player from "./player/Player.js";

export default class Experience {
  constructor() {
    // Core Config
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this);

    this.controls = null; // orbit control placeholder
    this.camera = new Camera(this);

    // perf monitor
    this.#initPerformanceMonitor();

    // Yuka
    this.yukaTime = null; // yuka time placeholder
    this.entityManager = null; // entity manager placeholder
    this.#initYuka();

    // Resource Core Loading and initiating world wwhen done
    this.resources = new Resources(() => this.#startExperience());

    // Define all assets needed globally
    // resources.load expects an array of objects {name, type = ["glb", "gltf", "hdr"], path}
    this.resources.load([
      {
        name: "islandTerrain",
        type: "glb",
        path: "/models/props/Island.glb",
      },
      { name: "oceanMesh", type: "glb", path: "/models/props/oceanPlane.glb" },
      { name: "player", type: "gltf", path: "/models/player/Adventurer.gltf" },
    ]);

    // handle resize
    window.addEventListener("resize", () => this.#resize());

    // start animation
    this.#aniamtionLoop();
  }

  #startExperience() {
    // setup environment
    this.environment = new Environment(this);

    // setup playable model
    this.player = new Player(this);

    // Remove loading overlay
    document.querySelector(".progress-bar-container").style.display = "none";
    console.log("Dark World Spawned.");
  }

  // performance monitor
  #initPerformanceMonitor() {
    this.stats = new Stats({
      trackGPU: true,
      logsPerSecond: 20,
    });

    document.body.appendChild(this.stats.dom);

    this.stats.init(this.renderer.instance);
  }

  #initYuka() {
    this.yukaTime = new YUKA.Time();
    this.entityManager = new YUKA.EntityManager();
  }

  #resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  #aniamtionLoop() {
    this.renderer.instance.setAnimationLoop((time) => {
      this.stats.begin();
      this.camera.update();
      const delta = this.yukaTime.update().getDelta();

      if (this.ocean) {
        // animate water shaders
        this.ocean.oceanMaterial.uniforms.uTime.value = time / 1000;
      }

      if (this.sky) {
        // rotates stars
        this.sky.update();
      }

      if (this.player) this.player.update(delta);

      this.renderer.update();

      // stats
      this.stats.end();
      this.stats.update();
    });
  }
}
