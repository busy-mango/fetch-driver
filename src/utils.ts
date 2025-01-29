/**
 * @author mango
 * @description fetch type define
 */

import {
  isBlob,
  isBufferSource,
  isFormData,
  isReadableStream,
} from "@busymango/is-esm";

import type { DriveMiddleware } from "./model";

export function isNonRawBodyInit(
  source: unknown,
): source is Exclude<BodyInit, string | URLSearchParams> {
  return (
    isBlob(source) ||
    isFormData(source) ||
    isBufferSource(source) ||
    isReadableStream(source)
  );
}

export function isRawTextBody(type?: string) {
  switch (type) {
    case "css":
    case "xml":
    case "html":
    case "plain":
    case "richtext":
    case "javascript":
      return true;
  }
  return false;
}

export function downloader(href: string, download: string) {
  const element = document.createElement("a");
  document.body.appendChild(element);
  element.style.display = "none";
  element.download = download;
  element.href = href;
  element.click();
  document.body.removeChild(element);
}

export function src2name(src: string): string {
  const [path] = src.split("?");
  return path.split("/").reverse()?.[0];
}

export function createMiddleware<T = unknown>(middleware: DriveMiddleware<T>) {
  return middleware;
}
