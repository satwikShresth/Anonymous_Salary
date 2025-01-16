export class LocalStore{
  #original = '';
  #value = $state();
  #key = '';

  constructor(key, value) {

    this.#key = key;
    this.#value = value;
    this.#original = value;

    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (item) this.#value = this.deserialize(item);
    }

    $effect(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(this.#key, this.serialize(this.#value));
      }
    });
  };

  serialize(value){
    return JSON.stringify(value);
  }

  deserialize(item){
    return JSON.parse(item);
  }

  clear(){
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.#key);
      }
    this.#value = this.#original;
  }

  get key() {return this.#key}

  get value() {return this.#value}

  set value(newValue) {
    this.#value = newValue;
  }

}

export function localStore(key, value) {
  return new LocalStore(key, value);
}
