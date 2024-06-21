import { describe, expect, it } from "vitest";

import DriveContext from "../src/context";

describe("DriveContext", () => {
  it("should initialize API correctly", () => {
    const api = "/api";
    const data = { param1: "value1", param2: "value2" };
    const context = new DriveContext(api, new URLSearchParams(data));
    context.init();
    expect(context.api).toStrictEqual("/api?param1=value1&param2=value2");
  });

  it("should initialize body correctly", () => {
    const data1 = { key: "value" };
    const context1 = new DriveContext("/api", data1);
    context1.init();
    expect(context1.options.body).toStrictEqual(JSON.stringify(data1));
    expect(context1.options.headers.get("Content-Type")).toStrictEqual(
      "application/json",
    );

    const data2 = new FormData();
    const context2 = new DriveContext("/api", data2);
    context2.init();
    expect(context2.options.body).toStrictEqual(data2);

    const data3 = new Uint16Array([12]);
    const context3 = new DriveContext("/api", data3);
    context3.init();
    expect(context3.options.body).toStrictEqual(data3);
  });

  it("should initialize method correctly", () => {
    const context1 = new DriveContext("/api");
    context1.init();
    expect(context1.options.method).toStrictEqual("GET");

    const context2 = new DriveContext("/api", { key: "value" });
    context2.init();
    expect(context2.options.method).toStrictEqual("POST");
  });
});
