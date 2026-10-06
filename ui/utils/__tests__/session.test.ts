import { beforeEach, describe, expect, it } from 'vitest';
import { loadStoredOrganization, loadStoredKeys } from '../session';

describe('loadStoredOrganization', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('returns null when currentOrg is not set in sessionStorage', () => {
    expect(loadStoredOrganization()).toBeNull();
  });

  it('returns valid organization object when correctly stored', () => {
    const org = { id: 'org-123', name: 'Layer5' };
    window.sessionStorage.setItem('currentOrg', JSON.stringify(org));
    expect(loadStoredOrganization()).toEqual(org);
  });

  it('recovers gracefully and clears storage on malformed JSON', () => {
    window.sessionStorage.setItem('currentOrg', '{"invalid": JSON');
    expect(loadStoredOrganization()).toBeNull();
    expect(window.sessionStorage.getItem('currentOrg')).toBeNull();
  });

  it('clears and returns null for string literal "undefined"', () => {
    window.sessionStorage.setItem('currentOrg', 'undefined');
    expect(loadStoredOrganization()).toBeNull();
    expect(window.sessionStorage.getItem('currentOrg')).toBeNull();
  });

  it('clears and returns null for string literal "null"', () => {
    window.sessionStorage.setItem('currentOrg', 'null');
    expect(loadStoredOrganization()).toBeNull();
    expect(window.sessionStorage.getItem('currentOrg')).toBeNull();
  });

  it('rejects non-object parsed values (e.g. number or boolean)', () => {
    window.sessionStorage.setItem('currentOrg', '12345');
    expect(loadStoredOrganization()).toBeNull();
    expect(window.sessionStorage.getItem('currentOrg')).toBeNull();
  });

  it('rejects organization objects with missing or non-string id', () => {
    window.sessionStorage.setItem('currentOrg', JSON.stringify({ name: 'No ID Org' }));
    expect(loadStoredOrganization()).toBeNull();
    expect(window.sessionStorage.getItem('currentOrg')).toBeNull();

    window.sessionStorage.setItem('currentOrg', JSON.stringify({ id: 123 }));
    expect(loadStoredOrganization()).toBeNull();
    expect(window.sessionStorage.getItem('currentOrg')).toBeNull();

    window.sessionStorage.setItem('currentOrg', JSON.stringify({ id: '   ' }));
    expect(loadStoredOrganization()).toBeNull();
    expect(window.sessionStorage.getItem('currentOrg')).toBeNull();
  });
});

describe('loadStoredKeys', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('returns null when keys is not set in sessionStorage', () => {
    expect(loadStoredKeys()).toBeNull();
  });

  it('returns array of keys when correctly stored', () => {
    const keys = [{ id: 'view-mesh', function: 'mesh' }];
    window.sessionStorage.setItem('keys', JSON.stringify(keys));
    expect(loadStoredKeys()).toEqual(keys);
  });

  it('recovers gracefully and clears storage on malformed JSON', () => {
    window.sessionStorage.setItem('keys', '[{"invalid": JSON');
    expect(loadStoredKeys()).toBeNull();
    expect(window.sessionStorage.getItem('keys')).toBeNull();
  });

  it('clears and returns null for string literal "undefined"', () => {
    window.sessionStorage.setItem('keys', 'undefined');
    expect(loadStoredKeys()).toBeNull();
    expect(window.sessionStorage.getItem('keys')).toBeNull();
  });

  it('clears and returns null for string literal "null"', () => {
    window.sessionStorage.setItem('keys', 'null');
    expect(loadStoredKeys()).toBeNull();
    expect(window.sessionStorage.getItem('keys')).toBeNull();
  });

  it('rejects non-array parsed values (e.g. object)', () => {
    window.sessionStorage.setItem('keys', JSON.stringify({ key: 'single' }));
    expect(loadStoredKeys()).toBeNull();
    expect(window.sessionStorage.getItem('keys')).toBeNull();
  });
});
