import {localStore} from "$lib/LocalStore.svelte"

export function FormData(validValues) {
  let company = localStore("formData:company", "");
  let position = localStore("formData:position", "");
  let majors = localStore("formData:majors", []);
  let minors = localStore("formData:minors", []);
  let location = localStore("formData:location", "");
  let workHours = localStore("formData:workHours", 0);
  console.log(validValues.coopYears)
  let coopYear = localStore("formData:coopYear", validValues.coopYears[0]);
  let coopCycle = localStore("formData:coopCycle", validValues.coopCycles[0]);
  let compensations = localStore("formData:compensations", []);
  let level = localStore("formData:level", validValues.levels[0]);
  let source = localStore("formData:source", validValues.sources[0]);
  let offerStatus = localStore("formData:offerStatus", validValues.offerStatuses[0]);
  let otherNotes = localStore("formData:otherNotes", "");

  return {
    get company() { return company.value; },
    set company(value) {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error("Company name must be a non-empty string");
      }
      company.value = value.trim();
    },

    get position() { return position.value; },
    set position(value) {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error("Position must be a non-empty string");
      }
      position.value = value.trim();
    },

    get majors() { return majors.value; },
    set majors(value) {
      if (!Array.isArray(value) || value.some(m => typeof m !== "string" || !m.trim())) {
        throw new Error("Majors must be an array of non-empty strings");
      }
      majors.value = value.map(m => m.trim());
    },

    get minors() { return minors.value; },
    set minors(value) {
      if (!Array.isArray(value)) {
        throw new Error("Minors must be an array of strings");
      }
      minors.value = value.map(m => m.trim());
    },

    get location() { return location.value; },
    set location(value) {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error("Location must be a non-empty string");
      }
      location.value = value.trim();
    },

    get workHours() { return workHours.value; },
    set workHours(value) {
      if (typeof value !== "number" || value < 0 || value > 168) {
        throw new Error("Work hours must be between 0 and 168");
      }
      workHours.value = Math.round(value);
    },

    get coopYear() { return coopYear.value; },
    set coopYear(value) {
      if (!validValues.coopYears.includes(value)) {
        throw new Error("Invalid co-op year");
      }
      coopYear.value = value;
    },

    get coopCycle() { return coopCycle.value; },
    set coopCycle(value) {
      if (!validValues.coopCycles.includes(value)) {
        throw new Error("Invalid co-op cycle");
      }
      coopCycle.value = value;
    },

    get compensations() { return compensations.value; },
    set compensations(value) {
      if (!Array.isArray(value) || !value.every(c => typeof c === "object" && validValues.compensationTypes.includes(c.type) && typeof c.amount === "number" && c.amount >= 0)) {
        throw new Error("Invalid compensations");
      }
      compensations.value = [...value];
    },

    get level() { return level.value; },
    set level(value) {
      if (!validValues.levels.includes(value)) {
        throw new Error("Invalid level");
      }
      level.value = value;
    },

    get source() { return source.value; },
    set source(value) {
      if (!validValues.sources.includes(value)) {
        throw new Error("Invalid source");
      }
      source.value = value;
    },

    get offerStatus() { return offerStatus.value; },
    set offerStatus(value) {
      if (!validValues.offerStatuses.includes(value)) {
        throw new Error("Invalid offer status");
      }
      offerStatus.value = value;
    },

    get otherNotes() { return otherNotes.value; },
    set otherNotes(value) {
      if (typeof value !== "string") {
        throw new Error("Notes must be a string");
      }
      otherNotes.value = value.trim();
    }
  };
}

