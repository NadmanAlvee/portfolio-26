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

    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();

    this.controls = new OrbitControls(
      this.instance,
      this.experience.renderer.domElement,
    );

    this.controls.maxPolarAngle = Math.PI / 2.1;
    this.controls.enablePan = false;
    // this.controls.minDistance = 80;
    // this.controls.maxDistance = 200;
  }

  resize() {
    this.instance.aspect = window.innerWidth / window.innerHeight;
    this.instance.updateProjectionMatrix();
  }

  _calculateIdealOffset() {
    const idealOffset = new THREE.Vector3(2, 2, 3);
    idealOffset.applyQuaternion(this.experience.player.instance.quaternion);
    idealOffset.add(this.experience.player.instance.position);
    return idealOffset;
  }

  _calculateIdealLookAt() {
    const idealLookAt = new THREE.Vector3(0, 0, 0);
    idealLookAt.applyQuaternion(this.experience.player.instance.quaternion);
    idealLookAt.add(this.experience.player.instance.position);
    return idealLookAt;
  }

  update(delta) {
    this.controls.update();

    const idealOffset = this._calculateIdealOffset();
    const idealLookAt = this._calculateIdealLookAt();

    this.currentPosition.copy(idealOffset);
    this.currentLookAt.copy(idealLookAt);

    this.instance.position.copy(this.currentPosition);
    this.instance.lookAt(this.currentLookAt);
  }
}
