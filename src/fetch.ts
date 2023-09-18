/**
 * @author mango
 * @description fetch core
 */

import { isObject } from '@busymango/is-esm';

import type {
  DriveFunc,
  DriveOptions,
  DriveMiddleware,
  FirstParam,
  FetchContext,
  Middleware,
  ExtraOptions,
} from './model';
import { compose } from './compose';
import DriveContext from './context';
import { driveBody } from './utils';

function over<T>(
  first: FirstParam<T>,
  data?: object,
  init?: RequestInit & ExtraOptions<T>,
): DriveOptions<T> {
  if (isObject(first)) return first;
  return { api: first, data, ...init };
}

type DriveParams<T> = Parameters<typeof over<T>>;

export default class FetchDriver {
  private middleware: DriveMiddleware[];

  constructor(middleware: DriveMiddleware[] = []) {
    this.middleware = middleware;

    this.drive.get = async<T>(...args: DriveParams<T>) => {
      return (await this.request({ ...over(...args), method: 'GET' })).body;
    }

    this.drive.post = async<T>(...args: DriveParams<T>) => {
      return (await this.request({ ...over(...args), method: 'POST' })).body;
    }

    this.drive.head = async<T>(...args: DriveParams<T>) => {
      return (await this.request({ ...over(...args), method: 'HEAD' })).body;
    }

    this.drive.trace = async<T>(...args: DriveParams<T>) => {
      return (await this.request({ ...over(...args), method: 'TRACE' })).body;
    }

    this.drive.delete = async<T>(...args: DriveParams<T>) => {
      return (await this.request({ ...over(...args), method: 'DELETE' })).body;
    }

    this.drive.connect = async<T>(...args: DriveParams<T>) => {
      return (await this.request({ ...over(...args), method: 'CONNECT' })).body;
    }
    
    this.drive.options = async<T>(...args: DriveParams<T>) => {
      return (await this.request({ ...over(...args), method: 'OPTIONS' })).body;
    }
  }

  public request = async<T>({
    api,
    use,
    data,
    parse,
    timeout,
    onReceived,
    ...init
  }: DriveOptions<T>) => {
    const context = new DriveContext<T>(api, data, init);

    const composed = compose<DriveContext>(
      use as Middleware<DriveContext>[] ?? this.middleware,
    );

    await composed(context, async () => {
      context.init();
      context.initAbort(timeout);

      const { api, options } = context;
      const response = await fetch(api, options);

      context.response = response;
      context.decodeHeader();

      await (parse ?? driveBody)(
        response,
        context,
        { onReceived },
      );
    });

    return context as FetchContext<T>;
  }

  public drive = (async<T>(...args: DriveParams<T>) => {
    return (await this.request(over(...args))).body;
  }) as DriveFunc;
}
