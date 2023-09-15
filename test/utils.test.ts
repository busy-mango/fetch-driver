import { describe, it, expect } from 'vitest';
import {
  isNonRawBodyInit,
  toParams,
  src2name,
} from '../src/utils';

describe('isNonRawBodyInit', () => {
  it('should return true for Blob', () => {
    const blob = new Blob();
    expect(isNonRawBodyInit(blob)).toBe(true);
  });

  it('should return true for FormData', () => {
    const formData = new FormData();
    expect(isNonRawBodyInit(formData)).toBe(true);
  });

  it('should return true for ArrayBuffer', () => {
    const arrayBuffer = new ArrayBuffer(10);
    expect(isNonRawBodyInit(arrayBuffer)).toBe(true);
  });

  it('should return true for ReadableStream', () => {
    const readableStream = new ReadableStream();
    expect(isNonRawBodyInit(readableStream)).toBe(true);
  });

  it('should return true for ArrayBufferView', () => {
    const arrayBufferView = new Uint8Array();
    expect(isNonRawBodyInit(arrayBufferView)).toBe(true);
  });

  it('should return false for string', () => {
    const str = 'Hello';
    expect(isNonRawBodyInit(str)).toBe(false);
  });

  it('should return false for URLSearchParams', () => {
    const searchParams = new URLSearchParams();
    expect(isNonRawBodyInit(searchParams)).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isNonRawBodyInit(null)).toBe(false);
    expect(isNonRawBodyInit(undefined)).toBe(false);
    expect(isNonRawBodyInit(123)).toBe(false);
    expect(isNonRawBodyInit(true)).toBe(false);
  });
});

describe('src2name', () => {
  it('for a source string without query parameters', () => {
    expect(
      src2name('path/to/file.jpg'),
    ).toEqual('file.jpg');

    expect(
      src2name('path/to/file.jpg?param=value'),
    ).toEqual('file.jpg');
  });
  it('for a source string with multiple levels of directories', () => {
    expect(
      src2name('path/to/subdirectory/file.jpg?param=value'),
    ).toEqual('file.jpg');
  });
  it('for a source string with no file extension', () => {
    expect(
      src2name('path/to/file?param=value'),
    ).toEqual('file');
  });
  it('for an empty source string', () => {
    expect(
      src2name(''),
    ).toEqual('');
  });
  it('for a source string with only a file name', () => {
    expect(
      src2name('file.jpg'),
    ).toEqual('file.jpg');
  });
})


describe('fields2search', () => {
  it('test', () => {
    const string = ' charset=UTF-8';
    const source = toParams([string]);
    expect(source.get('charset')).toEqual('UTF-8');
  })
})
