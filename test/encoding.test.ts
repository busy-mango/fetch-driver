import { describe, expect, it } from "vitest";

import FetchDriver from "../src/fetch";

describe("external encoding", () => {
  const { drive, request } = new FetchDriver();

  describe("data uri", () => {
    it("should accept base64-encoded gif data uri", async () => {
      const { response } = await request({
        api: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
      });

      const { status, headers } = response;
      expect(status).toStrictEqual(200);
      expect(headers.get("Content-Type")).toStrictEqual("image/gif");

      const buffer = await response.arrayBuffer();
      expect(buffer.byteLength).toStrictEqual(35);
      expect(buffer).to.be.an.instanceOf(ArrayBuffer);
    });

    it("should accept data uri with specified charset", async () => {
      const { body, response } = await request<string>({
        api: "data:text/plain;charset=UTF-8;page=21,the%20data:1234,5678",
        parse: async (response, context) => {
          context.body = await response.text();
        },
      });

      const { status, headers } = response;

      expect(status).toStrictEqual(200);

      expect(headers.get("Content-Type")).toStrictEqual(
        "text/plain;charset=UTF-8;page=21",
      );

      expect(body).toStrictEqual("the data:1234,5678");
    });

    it("should accept data uri of plain text", async () => {
      const { body, response } = await request({
        api: "data:,Hello%20World!",
        parse: async (response, context) => {
          context.body = await response.text();
        },
      });

      const { status, headers } = response;

      expect(status).toStrictEqual(200);

      expect(headers.get("Content-Type")).toStrictEqual(
        "text/plain;charset=US-ASCII",
      );

      expect(body).toStrictEqual("Hello World!");

      const result = await drive("data:,Hello%20World!");

      expect(result).toStrictEqual("Hello World!");
    });
  });
});
