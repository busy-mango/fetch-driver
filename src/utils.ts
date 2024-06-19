/**
 * @author mango
 * @description fetch type define
 */

import {
  isBlob,
  isObject,
  isFinite,
  isString,
  isFormData,
  isReadableStream,
  isBufferSource,
} from '@busymango/is-esm';

import DriveContext from './context';
import { ReceivedFunc } from './model';

export function isNonRawBodyInit(source: unknown): source is Exclude<
  BodyInit, string | URLSearchParams
> {
  if (!isObject(source)) return false;
  return isBlob(source)
    || isFormData(source)
    || isBufferSource(source)
    || isReadableStream(source);
};

export function isRawTextBody(type?: string) {
  switch (type) {
    case 'css':
    case 'xml':
    case 'html':
    case 'plain':
    case 'richtext':
    case 'javascript':
    return true;
  }
  return false;
}

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

export function iSearchParams(fields: string[]): URLSearchParams {
  return new URLSearchParams(
    fields.filter(e => e.includes('=')).map(e => e.trim()).join('&'),
  );
};

export async function driveBody<T>(
  response: Response,
  context: DriveContext<T>,
  extra: {
    onReceived?: ReceivedFunc<T>;
  } = {},
) {
  const { onReceived } = extra;

  const { body, ok, headers } = response;

  const { responseCharset, responseType } = context;

  if (ok) {
    const size = Number(headers.get('Content-Length'));
    const isShard = body && isFinite(size) && onReceived;
    const disposition = headers.get('Content-Disposition');
    const isAttchment = isString(disposition) && disposition.includes('attachment');
    
    if (isShard) {
      context.receivedBytes = 0;
      context.receivedChunk = new Uint8Array(0);

      const reader = body.getReader();
      const decoder = new TextDecoder(responseCharset);

      while (!context.receivedDone) {
        const { done, value } = await reader.read();

        if (value) {
          const { receivedChunk } = context;
          context.receivedBytes += value.length;
          context.receivedChunk = new Uint8Array(context.receivedBytes);
          context.receivedChunk.set(receivedChunk);
          context.receivedChunk.set(value, receivedChunk.length);
        }

        context.receivedDone = done;
        const { receivedBytes } = context;
        const denominator = size > 0 ? size : receivedBytes;
        onReceived(100 * receivedBytes / denominator, context);
      }

      if (isAttchment) {
        context.body = new Blob(
          [context.receivedChunk],
          { type: 'application/octet-stream' },
        ) as T;
        return;
      }

      if (responseType === 'json') {
        const json = decoder.decode(context.receivedChunk);
        context.body = JSON.parse(json) as T;
        return;
      }
    } else {
      if (isAttchment) {
        context.body = (await response.blob()) as T;
        return;
      }

      if (responseType === 'txt') {
        context.body = (await response.text()) as T;
        return;
      }

      if (responseType === 'json') {
        context.body = (await response.json()) as T;
        return;
      }

      if (isRawTextBody(responseType ?? undefined)) {
        context.body = (await response.text()) as T;
        return;
      }
    }
  }
}
