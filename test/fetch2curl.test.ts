import { describe, expect, it } from "vitest";

import { fetch2curl, generate } from "../src/fetch2curl";

const iGeneratedHeaderChecker = (init: RequestInit["headers"]) => {
  const headers = new Headers(init);
  const res = generate.header({ headers: init });

  expect(res).toMatch(new RegExp('( -H ".*?: .*?")+'));

  headers.forEach((val, key) => {
    if (key === "content-length") {
      expect(
        res?.includes(`-H "${key}: ${val}"`) ||
          res?.includes(`-H "${key.toLowerCase()}: ${val}"`),
      ).toBeFalsy();
    } else {
      expect(
        res?.includes(`-H "${key}: ${val}"`) ||
          res?.includes(`-H "${key.toLowerCase()}: ${val}"`),
      ).toBeTruthy();
    }
  });
};

describe("Generate method param", () => {
  it("No method", () => {
    expect(generate.method({})).toStrictEqual("-X GET");
  });
  it("POST", () => {
    expect(
      generate.method({
        method: "post",
      }),
    ).toStrictEqual("-X POST");
  });
  it("PUT", () => {
    const option = {
      method: "Put",
    };
    expect(generate.method(option)).toStrictEqual("-X PUT");
  });
  it("GET", () => {
    const option = {
      method: "GET",
    };
    expect(generate.method(option)).toStrictEqual("-X GET");
  });
  it("PATCH", () => {
    const option = {
      method: "PATCH",
    };
    expect(generate.method(option)).toStrictEqual("-X PATCH");
  });
  it("DELETE", () => {
    const option = {
      method: "DELETE",
    };
    expect(generate.method(option)).toStrictEqual("-X DELETE");
  });
  it("HEAD", () => {
    const option = {
      method: "HEAD",
    };
    expect(generate.method(option)).toStrictEqual("-X HEAD");
  });
  it("OPTIONS", () => {
    const option = {
      method: "OPTIONS",
    };
    expect(generate.method(option)).toStrictEqual("-X OPTIONS");
  });
  it("Unknown method", () => {
    const option = {
      method: "xxxx",
    };
    expect(generate.method(option)).toStrictEqual("-X GET");
  });
});

describe("Generate header param", () => {
  it("No Header Options", () => {
    expect(generate.header({})).toBeUndefined();
  });

  const headers: HeadersInit = {
    Accept: "application/json, text/plain, */*",
    "User-Agent": "axios/0.18.0",
    "X-Test": "TestVal",
  };

  it("correctly parses Headers from object without encoding", () => {
    iGeneratedHeaderChecker(headers);
  });

  it("correctly parses Headers from object with encoding", () => {
    iGeneratedHeaderChecker({
      ...headers,
      "accept-encoding": "gzip",
    });
  });

  it("omits content-length Header when parsing headers from object", () => {
    iGeneratedHeaderChecker({
      ...headers,
      "content-length": "12345",
    });
  });
});

describe("Generate body param", () => {
  it("No Body", () => {
    expect(generate.body({})).toBeUndefined();
  });
  it("String Body", () => {
    expect(generate.body({ body: "a" })).toEqual("--data-binary 'a'");
  });
  it("Number Body", () => {
    expect(generate.body({ body: (12345)?.toString() })).toEqual(
      "--data-binary '12345'",
    );
  });
  it("Object Body", () => {
    const options = {
      test: "test:",
      testNumber: 12345,
      testDate: new Date(1609251707077),
      testQuotes: `'test'`,
    };
    expect(
      generate.body({
        body: JSON.stringify(options),
      }),
    ).toEqual(
      `--data-binary '{"test":"test:","testNumber":12345,"testDate":"2020-12-29T14:21:47.077Z","testQuotes":"'\\''test'\\''"}'`,
    );
  });
});

describe("Generate Compress param", () => {
  it("No compression", () => {
    expect(generate.compress({})).toEqual("");
  });
  it("Have compression", () => {
    expect(
      generate.compress({
        headers: new Headers({
          "accept-encoding": "gzip",
        }),
      }),
    ).toEqual(" --compressed");
  });
});

describe("fetch to curl", () => {
  const host = "https://google.com/";
  it("url and empty options", () => {
    expect(fetch2curl(new URL(host))).toStrictEqual(`curl "${host}" -X GET`);
  });

  it("url string and Request Object", () => {
    expect(fetch2curl(host, { method: "POST" })).toStrictEqual(
      `curl "${host}" -X POST`,
    );
  });

  it("Request Object only", () => {
    expect(fetch2curl(host, { method: "POST" })).toStrictEqual(
      `curl "${host}" -X POST`,
    );
  });
});

describe("fetch2curl - FormData", () => {
  it("should handle FormData with string fields", () => {
    const src = "http://localhost/api/submit";

    const formData = new FormData();
    formData.append("username", "john_doe");
    formData.append("email", "john@example.com");

    // formData.append(
    //   "avatar",
    //   new Blob(["image data"], { type: "image/png" }),
    //   "avatar.png",
    // );

    expect(
      fetch2curl(src, {
        method: "POST",
        body: formData,
        headers: {
          "User-Agent": "TestAgent",
        },
      }),
    ).toBe(
      `curl "${src}" -X POST -H "user-agent: TestAgent" -F "username=john_doe" -F "email=john@example.com"`,
    );
  });
});
