export default class InputController {
  constructor() {
    this.keys = {
      forward: false,
      left: false,
      right: false,

      shift: false,
      space: false,
    };

    this.#addEventListeners();
  }

  #addEventListeners() {
    window.addEventListener("keydown", (event) => {
      this.#handleKey(event.code, true);
    });
    window.addEventListener("keyup", (event) =>
      this.#handleKey(event.code, false),
    );
  }

  #handleKey(code, isPressed) {
    if (code === "KeyW" || code === "ArrowUp") {
      this.keys.forward = isPressed;
    }
    if (code === "KeyA" || code === "ArrowLeft") {
      this.keys.left = isPressed;
    }
    if (code === "KeyD" || code === "ArrowRight") {
      this.keys.right = isPressed;
    }
    if (code === "ShiftLeft" || code === "ShiftRight") {
      this.keys.shift = isPressed;
    }
    if (code === "Space") {
      this.keys.space = isPressed;
    }
  }
}
