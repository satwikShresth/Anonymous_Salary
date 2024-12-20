export function loadState<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

export function saveState<T>(key: string, state: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

export function clearState(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Failed to clear state:', err);
  }
}
