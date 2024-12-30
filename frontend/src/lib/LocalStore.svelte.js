export class LocalStore{
  #value = $state();
  #key = '';

  constructor(key, value) {
    this.#key = key;
    this.#value = value;

    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (item) this.#value = this.deserialize(item);
    }

  };

  serialize(value){
    return JSON.stringify(value);
  }

  deserialize(item){
    return JSON.parse(item);
  }

  get key() {return this.#key}

  get value() {return this.#value}

  set value(value) {
    console.log(this.#key,value)
    this.#value = value
    if (typeof window !== "undefined") {
      localStorage.setItem(this.#key, this.serialize(this.#value));
    }
  }
}

export function localStore(key, value) {
  return new LocalStore(key, value);
}
