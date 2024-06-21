// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  downloader,
  isNonRawBodyInit,
  isRawTextBody,
  src2name,
} from "../src/utils";

describe("isNonRawBodyInit", () => {
  it("should return true for Blob", () => {
    const blob = new Blob();
    expect(isNonRawBodyInit(blob)).toBe(true);
  });

  it("should return true for FormData", () => {
    const formData = new FormData();
    expect(isNonRawBodyInit(formData)).toBe(true);
  });

  it("should return true for ArrayBuffer", () => {
    const arrayBuffer = new ArrayBuffer(10);
    expect(isNonRawBodyInit(arrayBuffer)).toBe(true);
  });

  it("should return true for ReadableStream", () => {
    const readableStream = new ReadableStream();
    expect(isNonRawBodyInit(readableStream)).toBe(true);
  });

  it("should return true for ArrayBufferView", () => {
    const arrayBufferView = new Uint8Array();
    expect(isNonRawBodyInit(arrayBufferView)).toBe(true);
  });

  it("should return false for string", () => {
    const str = "Hello";
    expect(isNonRawBodyInit(str)).toBe(false);
  });

  it("should return false for URLSearchParams", () => {
    const searchParams = new URLSearchParams();
    expect(isNonRawBodyInit(searchParams)).toBe(false);
  });

  it("should return false for non-object values", () => {
    expect(isNonRawBodyInit(null)).toBe(false);
    expect(isNonRawBodyInit(undefined)).toBe(false);
    expect(isNonRawBodyInit(123)).toBe(false);
    expect(isNonRawBodyInit(true)).toBe(false);
  });
});

describe("downloader function", () => {
  beforeEach(() => {
    // Create a spy on document.createElement to mock the anchor element
    vi.spyOn(document, "createElement").mockReturnValue(
      document.createElement("a"),
    );
  });

  afterEach(() => {
    // Restore document.createElement to its original implementation
    vi.restoreAllMocks();
  });

  it("should create and click a hidden anchor element with download attribute", () => {
    const mockElement = document.createElement("a");
    const href = "https://vitest.dev/logo.svg";
    const download = "file.txt";

    // Mock necessary properties and methods
    mockElement.style.display = "none";
    mockElement.download = download;
    mockElement.href = href;

    // Mock document.body.appendChild and document.body.removeChild methods
    const appendChildSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation((e) => e);
    const removeChildSpy = vi
      .spyOn(document.body, "removeChild")
      .mockImplementation((e) => e);

    // Spy on click method of the mock element
    const clickSpy = vi
      .spyOn(mockElement, "click")
      .mockImplementation(() => {});

    // Call the downloader function
    downloader(href, download);

    // Assert expectations
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockElement.style.display).toBe("none");
    expect(mockElement.download).toBe(download);
    expect(mockElement.href).toBe(href);
    expect(appendChildSpy).toHaveBeenCalledWith(mockElement);
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalledWith(mockElement);
  });
});

describe("isRawTextBody function", () => {
  it("should return true for supported types", () => {
    expect(isRawTextBody("css")).toBe(true);
    expect(isRawTextBody("xml")).toBe(true);
    expect(isRawTextBody("html")).toBe(true);
    expect(isRawTextBody("plain")).toBe(true);
    expect(isRawTextBody("richtext")).toBe(true);
    expect(isRawTextBody("javascript")).toBe(true);
  });

  it("should return false for unsupported types", () => {
    expect(isRawTextBody("json")).toBe(false);
    expect(isRawTextBody("pdf")).toBe(false);
    expect(isRawTextBody("image/jpeg")).toBe(false);
    expect(isRawTextBody("application/octet-stream")).toBe(false);
    expect(isRawTextBody("text")).toBe(false);
    expect(isRawTextBody(undefined)).toBe(false);
  });

  it("should return false when type is not provided", () => {
    expect(isRawTextBody()).toBe(false);
  });
});

describe("src2name", () => {
  it("for a source string without query parameters", () => {
    expect(src2name("path/to/file.jpg")).toEqual("file.jpg");

    expect(src2name("path/to/file.jpg?param=value")).toEqual("file.jpg");
  });
  it("for a source string with multiple levels of directories", () => {
    expect(src2name("path/to/subdirectory/file.jpg?param=value")).toEqual(
      "file.jpg",
    );
  });
  it("for a source string with no file extension", () => {
    expect(src2name("path/to/file?param=value")).toEqual("file");
  });
  it("for an empty source string", () => {
    expect(src2name("")).toEqual("");
  });
  it("for a source string with only a file name", () => {
    expect(src2name("file.jpg")).toEqual("file.jpg");
  });
});
