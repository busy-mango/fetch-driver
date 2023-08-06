import { describe, it, expect } from 'vitest';
import { fields2search } from '../src/utils';

describe('fields2search', () => {
  it('test', () => {
    const string = ' charset=UTF-8';
    const source = fields2search([string]);
    expect(source.get('charset')).toEqual('UTF-8');
  })
})
