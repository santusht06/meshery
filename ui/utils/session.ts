export interface StoredOrganization {
  id: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * Safely parses and validates the currently selected organization from sessionStorage.
 * If the stored value is malformed or invalid, it removes the entry and returns null.
 */
export function loadStoredOrganization(): StoredOrganization | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem('currentOrg');
  if (!raw || raw === 'undefined' || raw === 'null') {
    if (raw === 'undefined' || raw === 'null') {
      try {
        window.sessionStorage.removeItem('currentOrg');
      } catch {
        // Ignore storage access errors
      }
    }
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.id === 'string' &&
      parsed.id.trim() !== ''
    ) {
      return parsed as StoredOrganization;
    }
    window.sessionStorage.removeItem('currentOrg');
    return null;
  } catch (err) {
    console.warn('Failed to parse currentOrg from sessionStorage; clearing stored value:', err);
    try {
      window.sessionStorage.removeItem('currentOrg');
    } catch {
      // Ignore storage access errors
    }
    return null;
  }
}

/**
 * Safely parses and validates the user ability keys array from sessionStorage.
 * If the stored value is malformed or not an array, it removes the entry and returns null.
 */
export function loadStoredKeys(): Array<{
  id?: string;
  function?: string;
  [key: string]: unknown;
}> | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem('keys');
  if (!raw || raw === 'undefined' || raw === 'null') {
    if (raw === 'undefined' || raw === 'null') {
      try {
        window.sessionStorage.removeItem('keys');
      } catch {
        // Ignore storage access errors
      }
    }
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    window.sessionStorage.removeItem('keys');
    return null;
  } catch (err) {
    console.warn('Failed to parse keys from sessionStorage; clearing stored value:', err);
    try {
      window.sessionStorage.removeItem('keys');
    } catch {
      // Ignore storage access errors
    }
    return null;
  }
}
