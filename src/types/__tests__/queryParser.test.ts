// src/types/__tests__/queryParser.test.ts
import { parseQueryParams } from '../../utils/queryParser';

describe('parseQueryParams', () => {
  it('returns empty object when input is undefined', () => {
    expect(parseQueryParams(undefined)).toEqual({});
  });

  it('parses numeric page and size correctly', () => {
    const result = parseQueryParams({ page: '2', size: '50' });
    expect(result.page).toBe(2);
    expect(result.size).toBe(50);
    expect(result.search).toBeUndefined();
  });

  it('parses numeric values when provided as numbers', () => {
    const result = parseQueryParams({ page: 3, size: 25 });
    expect(result.page).toBe(3);
    expect(result.size).toBe(25);
  });

  it('returns undefined for non-numeric page and size', () => {
    const result = parseQueryParams({ page: 'abc', size: '1e309' }); // 1e309 -> Infinity
    expect(result.page).toBeUndefined();
    expect(result.size).toBeUndefined();
  });

  it('trims and returns search string or undefined for empty', () => {
    expect(parseQueryParams({ search: '  hello  ' }).search).toBe('hello');
    expect(parseQueryParams({ search: '   ' }).search).toBeUndefined();
    expect(parseQueryParams({ search: '' }).search).toBeUndefined();
  });

  it('handles mixed types and extra keys gracefully', () => {
    const result = parseQueryParams({ page: '4', size: undefined, search: 'x', extra: 'ignored' } as any);
    expect(result.page).toBe(4);
    expect(result.size).toBeUndefined();
    expect(result.search).toBe('x');
  });

  it('handles zero and negative numeric strings', () => {
    expect(parseQueryParams({ page: '0' }).page).toBe(0);
    expect(parseQueryParams({ size: '-5' }).size).toBe(-5);
  });
});
