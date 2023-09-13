/**
 * @author mango
 * @description fetch type define
 */

import mime from 'mime';

import {
  isBlob,
  isObject,
  isArrayBuffer,
  isArrayBufferLike,
  isArrayBufferView,
  isNonEmptyString,
} from '@busymango/is-esm';

export function isNonRawBodyInit(source: unknown): source is Exclude<
  BodyInit, string | URLSearchParams
> {
  if (!isObject(source)) return false;
  return isBlob(source)
    || isArrayBuffer(source)
    || isArrayBufferLike(source)
    || isArrayBufferView(source)
    || source instanceof FormData
    || source instanceof ReadableStream
  ;
};

export function downloader(href: string, download: string) {
  const element = document.createElement('a');
  document.body.appendChild(element);
  element.style.display = 'none';
  element.download = download;
  element.href = href;
  element.click();
  document.body.removeChild(element);
}

export function src2name (src: string): string {
  const [path] = src.split('?');
  return path.split('/').reverse()?.[0];
}

export function fields2search(fields: string[]): URLSearchParams {
  return new URLSearchParams(
    fields.filter(e => e.includes("=")).map(e => e.trim()).join('&'),
  );
};

export function getBodyType (response: Response): string | null {
  const { headers } = response;
  const type = headers.get('Content-Type');
  for (const iterator of type?.split(';') ?? []) {
    const extension = mime.getExtension(iterator);
    if (isNonEmptyString(extension)) return extension;
  }
  return null;
}
