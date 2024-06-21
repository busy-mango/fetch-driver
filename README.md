<h1 align="center">
  <b>
    Fetch Driver
  </b>
</h1>

<p align="center">fetch with middleware for the browser</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@busymango/fetch-driver.svg?style=flat-square)](https://www.npmjs.org/package/@busymango/fetch-driver)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@busymango/fetch-driver&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=@busymango/fetch-driver)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40busymango%2Ffetch-driver)
[![npm downloads](https://img.shields.io/npm/dm/@busymango/fetch-driver.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@busymango/fetch-driver)
<!-- [![gitter chat](https://img.shields.io/gitter/room/mzabriskie/axios.svg?style=flat-square)](https://gitter.im/mzabriskie/axios) -->
<!-- [![code helpers](https://www.codetriage.com/axios/axios/badges/users.svg)](https://www.codetriage.com/axios/axios) -->
<!-- [![Known Vulnerabilities](https://snyk.io/test/npm/axios/badge.svg)](https://snyk.io/test/npm/axios) -->
<!-- [![Build status](https://img.shields.io/github/actions/workflow/status/axios/axios/ci.yml?branch=v1.x&label=CI&logo=github&style=flat-square)](https://github.com/axios/axios/actions/workflows/ci.yml) -->
<!-- [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/axios/axios)
[![code coverage](https://img.shields.io/coveralls/mzabriskie/axios.svg?style=flat-square)](https://coveralls.io/r/mzabriskie/axios) -->

</div>

## Table of Contents

- [Features](#features)
- [Browser Support](#browser-support)
- [Installing](#installing)
  - [Package manager](#package-manager)
- [Example](#example)
  - [Creating](#creating)
  - [Use Promise](#use-promise)
  - [Use Async/Await](#use-async/await)
- [FetchDriver API](#fetchdriver-api)
- [Drive options](#drive-options)
- [Middleware](#middleware)
- [Abort fetch](#abort-fetch)
- [Promises](#promises)
- [License](#license)

## Roadmap

- [x] Make [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) from the browser
- [x] Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- [x] Intercept request and response
- [x] Transform request and response data
- [x] Automatic transforms for [JSON](https://www.json.org/json-en.html) data
<!-- - 🆕 Automatic data object serialization to `multipart/form-data` and `x-www-form-urlencoded` body encodings -->
<!-- - Client side support for protecting against [XSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) -->

## Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) |
--- | --- | --- | --- | --- |
 \>= 66 ✔ | >= 57 ✔ | >= 12.1 ✔ | >= 53 ✔ | >= 16 ✔ |

## Why onion model
 
The basic principle of the Onion Model is to process HTTP requests through a series of middleware. Each middleware can perform specific operations before or after the request reaches the target handler. When a request is sent to the server, it passes through each middleware in sequence before being returned to the client.

By adding, removing, or modifying middleware, the request processing flow can be easily adjusted. This allows developers to customize request handling based on specific requirements. 

The design of middleware allows them to be reused in different applications or projects. This saves development time and resources, and promotes code maintainability and scalability. 

The structure of the Onion Model makes it easier to test each middleware individually. This enables quick identification and resolution of issues, improving code quality and reliability. 

By adding logging and monitoring capabilities in appropriate middleware, it becomes possible to track, analyze, and monitor requests and responses. This helps diagnose issues, provide performance optimization, and enhance user experience. 

In summary, the Onion Model offers a structured and customizable approach to handling HTTP requests. Its benefits include flexibility, scalability, and code reusability, allowing developers to better organize and manage the request processing flow.


## Installing

### Package manager

Using npm:

```bash
$ npm install @busymango/fetch-driver
```

Using yarn:

```bash
$ yarn add @busymango/fetch-driver
```

Using pnpm:

```bash
$ pnpm add @busymango/fetch-driver
```

Once the package is installed, you can import the library using `import` approach:

```ts
import FetchDriver from '@busymango/fetch-driver';
```

## Example

### Creating

You need create a instance of driver with a custom config.

```ts
import FetchDriver from '@busymango/fetch-driver';

const driver = new FetchDriver();

const { drive } = driver;

export { drive };
```

### Use Promise

```ts
drive('/user?ID=12345').then(function (response) {
  // handle success
  console.log(response);
}).catch(function (error) {
  // handle error
  console.log(error);
}).finally(function () {
  // always executed
});

// Optionally the request above could also be done as
drive('/user', new URLSearchParams({
  ID: 12345
})).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
}).finally(function () {
  // always executed
});
```

### Use Async/Await

```ts
// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await driver('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

Performing a `POST` request

```ts
drive.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone'
}).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});
```

## FetchDriver API

Requests can be made by passing the relevant config to `fetch-driver`.

##### drive(options)

```ts
drive({
  method: 'post',
  api: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

##### drive(api[, data, init])

```ts
// Will send a POST request
drive('/user/12345', {
  firstName: 'Fred',
  lastName: 'Flintstone'
});
```

## Drive options

These are the available config options for making requests. Only the `api` is required. 

```ts
export type DriveOptions = RequestInit & {
  // `api` is the server URL that will be used for the request
  api: string;
  // `data` is the data to be sent as the request body
  data?: object;
}
```

## Middleware

Define general middleware

```ts
import { DriveMiddleware, FetchError } from '@busymango/fetch-driver'
import { catchMsg } from '@utils';

export const general: DriveMiddleware = async (context, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'AbortError') {
        const params = { code: -1, context };
        throw new FetchError('Fetch timeout', params)
      }
    }
  }

  const { response, body } = context;

  if (!response) {
    throw new FetchError(
      'NetWork Error',
      { context, code: 500 },
    )
  }

  const { status, ok } = response;
  const res: unknown = body ?? await response.text();
  
  if (ok !== true) {
    throw new FetchError(
      catchMsg(res),
      { context },
    );
  }
}
```

Use general middleware

```ts
import FetchDriver from '@busymango/fetch-driver';

import { general } from './middlewares';

const { drive } = new FetchDriver([general]);

export { drive };
```

### Abort fetch

```ts
await drive({
  api: '/user/12345',
  method: 'GET',
  timeout: 8000,
});
```

## Promises

fetch-driver depends on a native ES6 Promise implementation to be [supported](https://caniuse.com/promises).
If your environment doesn't support ES6 Promises, you can [polyfill](https://github.com/jakearchibald/es6-promise).

## License

[MIT](LICENSE)

是 fetch 的一个小包装器，旨在简化执行网络请求和处理响应的方式。
🪶 Small - core is less than 2KB g-zipped
<!-- 🪶 小 - 内核小于 2KB g-zipped -->
💡 Intuitive - lean API, handles errors, headers and (de)serialization
<!-- 💡 直观 - 精益 API，处理错误、标头和（反）序列化 -->
🧊 Immutable - every call creates a cloned instance that can then be reused safely
<!-- 🧊 不可变 - 每次调用都会创建一个克隆的实例，然后可以安全地重用该实例 -->
🔌 Modular - plug middlewares to intercept requests
<!-- 🔌 模块化 - 插入中间件以拦截请求 -->
<!-- 🧩 Isomorphic - compatible with modern browsers, Node.js 14+ and Deno
🧩 同构 - 与现代浏览器、Node.js 14+ 和 Deno 兼容 -->
🦺 Type safe - strongly typed, written in TypeScript
<!-- 🦺 类型安全 - 强类型，用 TypeScript 编写 -->
<!-- ✅ Proven - fully covered by unit tests and widely used
✅ 经过验证 - 完全覆盖在单元测试中并被广泛使用 -->
<!-- 💓 Maintained - alive and well for many years
💓 维护 - 活得很好很多年 -->

<!-- TODO:

use

utils.test
timeout.test
Onion.test
middleware.test
mini size -->