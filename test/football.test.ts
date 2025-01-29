import { describe, expect, it } from "vitest";

import FetchDriver from "../src/fetch";
import { createMiddleware } from "../src/utils";

const { request } = new FetchDriver([
  createMiddleware(async (_, next) => {
    await next();
  }),
]);

describe.only("Successful percentage request", () => {
  const host = "https://www.api-football.com";
  const iSrc = (api: string) => `${host}${api}`;

  it.only("should get percentage on received", async () => {
    const current = { percentage: 0 };
    await request({
      api: iSrc("/public/doc/openapi.yaml"),
      receiver: ({ percentage: cur }) => {
        const { percentage: pre } = current;
        current.percentage = Number(cur.toFixed(2));
        expect(cur >= pre && cur <= 100).toBeTruthy();
        console.log(current.percentage);
      },
    });
  });
});
