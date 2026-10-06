import { describe, expect, it, vi } from 'vitest';

vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid-value',
}));

import { generateTestName, generateUUID, isValidDuration } from './helper';

describe('generateTestName', () => {
  it('returns the original name when one is supplied', () => {
    expect(generateTestName('my-test', 'istio')).toBe('my-test');
  });

  it('falls back to a "No mesh"-prefixed timestamped name for an empty mesh', () => {
    const name = generateTestName('', '');
    expect(name.startsWith('No mesh_')).toBe(true);
  });

  it('treats "None" the same as an empty mesh', () => {
    const name = generateTestName('', 'None');
    expect(name.startsWith('No mesh_')).toBe(true);
  });

  it('uses the supplied mesh name when generating a fallback', () => {
    const name = generateTestName('', 'linkerd');
    expect(name.startsWith('linkerd_')).toBe(true);
  });

  it('treats whitespace-only names as empty', () => {
    const name = generateTestName('   ', 'consul');
    expect(name.startsWith('consul_')).toBe(true);
  });
});

describe('generateUUID', () => {
  it('proxies to the uuid v4 implementation', () => {
    expect(generateUUID()).toBe('mocked-uuid-value');
  });
});

describe('isValidDuration', () => {
  it('accepts valid duration strings with s, m, or h suffixes', () => {
    expect(isValidDuration('30s')).toBe(true);
    expect(isValidDuration('5m')).toBe(true);
    expect(isValidDuration('1h')).toBe(true);
    expect(isValidDuration('120s')).toBe(true);
    expect(isValidDuration('  10S  ')).toBe(true);
    expect(isValidDuration('2M')).toBe(true);
    expect(isValidDuration('3H')).toBe(true);
  });

  it('rejects zero or negative durations', () => {
    expect(isValidDuration('0s')).toBe(false);
    expect(isValidDuration('0m')).toBe(false);
    expect(isValidDuration('0h')).toBe(false);
    expect(isValidDuration('00s')).toBe(false);
    expect(isValidDuration('-5s')).toBe(false);
  });

  it('rejects non-numeric values ending with valid units', () => {
    expect(isValidDuration('abcs')).toBe(false);
    expect(isValidDuration('testm')).toBe(false);
    expect(isValidDuration('s')).toBe(false);
    expect(isValidDuration('m')).toBe(false);
    expect(isValidDuration('h')).toBe(false);
  });

  it('rejects invalid or missing units and non-integer durations', () => {
    expect(isValidDuration('30')).toBe(false);
    expect(isValidDuration('30sec')).toBe(false);
    expect(isValidDuration('30min')).toBe(false);
    expect(isValidDuration('30x')).toBe(false);
    expect(isValidDuration('3.5s')).toBe(false);
  });

  it('rejects empty, null, and non-string inputs', () => {
    expect(isValidDuration('')).toBe(false);
    expect(isValidDuration('   ')).toBe(false);
    expect(isValidDuration(null)).toBe(false);
    expect(isValidDuration(undefined)).toBe(false);
    expect(isValidDuration(123 as unknown as string)).toBe(false);
  });
});
