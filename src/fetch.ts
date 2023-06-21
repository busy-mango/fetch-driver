/**
 * @author mango
 * @description fetch core
 */

import { isNil, isNonEmptyString, isObject } from '@busymango/is-esm';

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
  init?: RequestInit
): DriveOptions {
  if (isObject(first)) return first;
  return { api: first, data, ...init };
}

export default class FetchDriver {
  private middleware: DriveMiddleware[];

  constructor(middleware: DriveMiddleware[]) {
    this.middleware = middleware;
  }

  public use = (middleware: DriveMiddleware) => {
    this.middleware.push(middleware);
  }

  public request = async <T>(options: DriveOptions) => {
    const { api, data, ...init } = options;

    const context = new DriveContext<T>(api, data, init);

    const composed = compose<DriveContext>(
      this.middleware as Middleware<DriveContext>[]
    );

    await composed(context, async () => {
      context.initAPI();
      context.initBody();
      context.initMethod();
      const { options } = context;
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

  public drive: DriveFunc = async<T>(
    ...args: Parameters<typeof over>
  ) => {
    return (await this.request<T>(over(...args))).body;
  }
}
