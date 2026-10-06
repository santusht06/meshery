import { v4 as uuid } from 'uuid';

/**
 * generateTestName takes in test name and service mesh name
 * and generates a random name (if test name is an empty string or is falsy) or
 * will return the given name
 */
export const generateTestName = (name: string, meshName: string): string => {
  if (!name || name.trim() === '') {
    const mesh = meshName === '' || meshName === 'None' ? 'No mesh' : meshName;
    return `${mesh}_${new Date().getTime()}`;
  }

  return name;
};

export function generateUUID(): string {
  return uuid();
}

/**
 * Validates performance test duration string (e.g. "30s", "5m", "2h").
 * Requires a strictly positive integer followed by 'h', 'm', or 's'.
 */
export function isValidDuration(duration: string | null | undefined): boolean {
  if (!duration || typeof duration !== 'string') {
    return false;
  }
  const trimmed = duration.trim();
  const match = trimmed.match(/^(\d+)([hms])$/i);
  if (!match) {
    return false;
  }
  const num = parseInt(match[1], 10);
  return !isNaN(num) && num > 0;
}
