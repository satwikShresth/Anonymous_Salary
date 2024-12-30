import {localStore} from "$lib/LocalStore.svelte"

export class FormData {
  #company = localStore("formData:company",""); 
  #position = localStore("formData:position",""); 
  #majors = localStore("formData:majors",[]); 
  #minors = localStore("formData:minors",[]); 
  #location = localStore("formData:location",""); 
  #workHours = localStore("formData:workHours",0); 
  #coopYear = localStore("formData:coopYear",""); 
  #coopCycle = localStore("formData:coopCycle",""); 
  #compensations = localStore("formData:compensations",[]); 
  #level = localStore("formData:level",""); 
  #source = localStore("formData:source",""); 
  #offerStatus = localStore("formData:offerStatus",""); 
  #otherNotes = localStore("formData:otherNotes","");
  #validValues = ['']

  constructor(validValues) {
    this.#validValues = validValues
    this.#coopYear.value = this.#validValues.coopYears[0];
    this.#coopCycle.value = this.#validValues.coopCycles[0];
    this.#level.value = this.#validValues.levels[0];
    this.#source.value = this.#validValues.sources[0];
    this.#offerStatus.value = this.#validValues.offerStatuses[0];
  }

  get company() {
    return this.#company.value;
  }
  get position() {
    return this.#position.value;
  }
  get majors() {
    return this.#majors.value;
  }
  get minors() {
    return this.#minors.value;
  }
  get location() {
    return this.#location.value;
  }
  get workHours() {
    return this.#workHours.value;
  }
  get coopYear() {
    return this.#coopYear.value;
  }
  get coopCycle() {
    return this.#coopCycle.value;
  }
  get compensations() {
    return this.#compensations.value;
  }
  get level() {
    return this.#level.value;
  }
  get source() {
    return this.#source.value;
  }
  get offerStatus() {
    return this.#offerStatus.value;
  }
  get otherNotes() {
    return this.#otherNotes.value;
  }

  set company(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Company name must be a non-empty string");
    }
    this.#company.value = value.trim();
  }

  set position(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Position must be a non-empty string");
    }
    this.#position.value = value.trim();
  }

  set majors(value) {
    if (
      !Array.isArray(value) ||
      value.some((m) => typeof m !== "string" || !m.trim())
    ) {
      throw new Error("Majors must be an array of non-empty strings");
    }
    this.#majors.value = value.map((m) => m.trim());
  }

  set minors(value) {
    if (!Array.isArray(value)) {
      throw new Error("Minors must be an array of strings");
    }
    this.#minors.value = value.map((m) => m.trim());
  }

  set location(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Location must be a non-empty string");
    }
    this.#location.value = value.trim();
  }

  set workHours(value) {
    if (typeof value !== "number" || value < 0 || value > 168) {
      throw new Error("Work hours must be between 0 and 168");
    }
    this.#workHours.value = Math.round(value);
  }

  set coopYear(value) {
    if (!this.#validValues.coopYears.includes(value)) {
      throw new Error(
        "Invalid co-op year. Must be one of: " +
          this.#validValues.coopYears.join(", "),
      );
    }
    this.#coopYear.value = value;
  }

  set coopCycle(value) {
    if (!this.#validValues.coopCycles.includes(value)) {
      throw new Error(
        "Invalid co-op cycle. Must be one of: " +
          this.#validValues.coopCycles.join(", "),
      );
    }
    this.#coopCycle.value = value;
  }

  set compensations(value) {
    if (
      !Array.isArray(value) ||
      !value.every(
        (c) =>
          typeof c === "object" &&
          this.#validValues.compensationTypes.includes(c.type) &&
          typeof c.amount === "number" &&
          c.amount >= 0,
      )
    ) {
      throw new Error(
        "Compensations must be valid compensation objects with type from: " +
          this.#validValues.compensationTypes.join(", "),
      );
    }
    this.#compensations.value = [...value];
  }

  set level(value) {
    if (!this.#validValues.levels.includes(value)) {
      throw new Error(
        "Invalid level. Must be one of: " + this.#validValues.levels.join(", "),
      );
    }
    this.#level.value = value;
  }

  set source(value) {
    if (!this.#validValues.sources.includes(value)) {
      throw new Error(
        "Invalid source. Must be one of: " + this.#validValues.sources.join(", "),
      );
    }
    this.#source.value = value;
  }

  set offerStatus(value) {
    if (!this.#validValues.offerStatuses.includes(value)) {
      throw new Error(
        "Invalid offer status. Must be one of: " +
          this.#validValues.offerStatuses.join(", "),
      );
    }
    this.#offerStatus.value = value;
  }

  set otherNotes(value) {
    if (typeof value !== "string") {
      throw new Error("Notes must be a string");
    }
    this.#otherNotes.value = value.trim();
  }
}
