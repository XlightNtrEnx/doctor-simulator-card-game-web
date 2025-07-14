export class State {
  /**
   * @type {(newValue: any) => void}
   */
  _callbacks = [];
  _value;

  constructor(initialValue) {
    this.value = initialValue;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.notifyAll();
  }

  notifyAll() {
    for (const cb of this._callbacks) cb(this.value);
  }

  /**
   *
   * @param {(newValue: any) => void} callback
   */
  subscribe(callback) {
    this._callbacks.push(callback);
  }
}
