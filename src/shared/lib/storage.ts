// localStorage is unavailable in some contexts (private browsing, storage quota exceeded).
// These helpers swallow the error so callers stay clean.

export function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // intentionally ignored
  }
}
