class CallbacksService {
  constructor() {
    this.callbacks = {};
  }

  register(id, fn) {
    this.callbacks[id] = fn;
    return id;
  }

  handle(id, args) {
    if (!this.callbacks[id]) {
      throw Error(`Callback ${id} not found in ${JSON.stringify(this.callbacks)}`);
    }
    return this.callbacks[id](args);
  }
}

export default CallbacksService;
