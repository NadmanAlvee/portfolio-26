export default class InputController {
  constructor() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      shift: false,
      space: false,
    };

    this.#addEventListeners();
  }

  #addEventListeners() {
    window.addEventListener("keydown", (event) =>
      this.#handleKey(event.code, true),
    );
    window.addEventListener("keyup", (event) =>
      this.#handleKey(event.code, false),
    );
  }

  #handleKey(code, isPressed) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = isPressed;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = isPressed;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = isPressed;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = isPressed;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.shift = isPressed;
        break;
      case "Space":
        this.keys.space = isPressed;
        break;
    }
  }
}
