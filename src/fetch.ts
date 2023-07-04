/**
 * @author mango
 * @description fetch core
 */

import {
  isNil,
  isNumeric,
  isNonEmptyString,
  isObject,
} from '@busymango/is-esm';

import type {
  DriveFunc,
  DriveOptions,
  FirstParam,
  FetchContext,
  Middleware,
  DriveMiddleware,
} from './model';
import { compose } from './compose';
import DriveContext from './context';
import { getBodyType } from './utils';

export function over(
  first: FirstParam,
  data?: object,
  init?: RequestInit & {
    timeout?: number;
  }
): DriveOptions {
  if (isObject(first)) return first;
  return { api: first, data, ...init };
}

export default class FetchDriver {
  private middleware: DriveMiddleware[];

  constructor(middleware: DriveMiddleware[]) {
    this.middleware = middleware;
    this.drive.get = async<T>(...args: Parameters<typeof over>) => {
      return (await this.request<T>({ ...over(...args), method: 'GET' })).body;
    }
    this.drive.post = async<T>(...args: Parameters<typeof over>) => {
      return (await this.request<T>({ ...over(...args), method: 'POST' })).body;
    }
    this.drive.head = async<T>(...args: Parameters<typeof over>) => {
      return (await this.request<T>({ ...over(...args), method: 'HEAD' })).body;
    }
    this.drive.trace = async<T>(...args: Parameters<typeof over>) => {
      return (await this.request<T>({ ...over(...args), method: 'TRACE' })).body;
    }
    this.drive.delete = async<T>(...args: Parameters<typeof over>) => {
      return (await this.request<T>({ ...over(...args), method: 'DELETE' })).body;
    }
    this.drive.connect = async<T>(...args: Parameters<typeof over>) => {
      return (await this.request<T>({ ...over(...args), method: 'CONNECT' })).body;
    }
    this.drive.options = async<T>(...args: Parameters<typeof over>) => {
      return (await this.request<T>({ ...over(...args), method: 'OPTIONS' })).body;
    }
  }

  public use = (middleware: DriveMiddleware) => {
    this.middleware.push(middleware);
  }

  public request = async <T>(options: DriveOptions) => {
    const { api, data, timeout, ...init } = options;

    const context = new DriveContext<T>(api, data, init);

    const composed = compose<DriveContext>(
      this.middleware as Middleware<DriveContext>[]
    );

    await composed(context, async () => {
      context.initAPI();
      context.initBody();
      context.initMethod();
      const { options } = context;

      if (AbortController && isNumeric(timeout)) {
        const controller = new AbortController();
        context.options.signal = controller.signal;
        setTimeout(() => controller.abort(), timeout);
      }

      context.response = await fetch(api, options);
      context.responseType = getBodyType(context.response);

      const { response } = context;
      if (response.ok) {
        const { responseType: type } = context;
        
        if (isNonEmptyString(type)) {
          switch (type) {
            case 'json':
              context.body = (await response.json()) as T;
              break;
            case 'css':
            case 'xml':
            case 'html':
            case 'plain':
            case 'richtext':
            case 'javascript':
              context.body = (await response.text()) as T;
              break;
            default:
              break;
          }
        }
      }
    });

    if (isNil(context.response)) {
      throw new Error('fetch-driver get empty response')
    }

    return context as FetchContext<T>;
  }

  public drive = (async<T>(...args: Parameters<typeof over>) => {
    return (await this.request<T>(over(...args))).body;
  }) as DriveFunc
}
