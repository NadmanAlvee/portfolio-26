import * as THREE from "three";

export default class Sky {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;

    this.#createSkyDome();
    this.#createStarfield();
  }

  #createSkyDome() {
    const skyGeometry = new THREE.SphereGeometry(450, 32, 15);

    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTopColor: { value: new THREE.Color("#020208") },
        uBottomColor: { value: new THREE.Color("#003674") },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        varying vec3 vPosition;
        void main() {
          float h = normalize(vPosition).y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(uBottomColor, uTopColor, h), 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });

    this.skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(this.skyDome);
  }

  #createStarfield() {
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Distribute stars randomly over a spherical shell inside the sky dome
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 430;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      // Keep stars strictly in the upper sky hemisphere (above water level Y >= 0)
      positions[i * 3 + 1] = Math.abs(radius * Math.sin(phi) * Math.sin(theta));
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const starMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#ffffff"),
      size: 1.2,
      sizeAttenuation: false, // Keeps stars crisp and tiny regardless of camera zoom
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  update() {
    if (this.stars) {
      this.stars.rotation.y += 0.0003;
    }
  }
}
