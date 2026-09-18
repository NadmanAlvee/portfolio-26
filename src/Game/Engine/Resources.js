import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

export default class Resources {
  constructor(callback) {
    this.onReady = callback;
    this.items = {};

    // LoadingManager( onLoad : function, onProgress : function, onError : function )
    this.loadingManager = new THREE.LoadingManager(
      () => this.onReady(),
      (url, loaded, total) => this.#updateProgress(url, loaded, total),
      (url) => {
        console.error(` Failed to load asset: ${url}`);
        this.#handleLoadingError(url);
      },
    );

    this.#initLoaders();
  }

  #initLoaders() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.gltfLoader.setDRACOLoader(dracoLoader);

    this.hdrLoader = new HDRLoader(this.loadingManager);
  }

  #updateProgress(url, loaded, total) {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) progressBar.value = (loaded / total) * 100;
  }

  load(assetsList) {
    for (const asset of assetsList) {
      if (asset.type === "gltf" || asset.type === "glb") {
        this.gltfLoader.load(asset.path, (file) => {
          this.items[asset.name] = file;
        });
      } else if (asset.type === "hdr") {
        this.hdrLoader.load(asset.path, (texture) => {
          this.items[asset.name] = texture;
        });
      }
    }
  }

  #handleLoadingError(url) {
    const progressBarContainer = document.querySelector(
      ".progress-bar-container",
    );
    if (progressBarContainer) {
      progressBarContainer.innerHTML = `
      <div style="color: #ff4d4d; font-family: sans-serif; text-align: center;">
        <p>Failed to load game assets.</p>
        <small>Missing file: ${url}</small>
      </div>
    `;
    }
  }
}
