/**
 * @author mango
 * @description fetch core
 */

import { isObject } from "@busymango/is-esm";

import { compose } from "./compose";
import DriveContext from "./context";
import type {
  DriveFunc,
  DriveMiddleware,
  DriveOptions,
  DriveReport,
  ExtraOptions,
  FetchContext,
  FirstParam,
  Middleware,
} from "./model";
import { methods } from "./model";
import { parser } from "./parser";

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
  private report?: DriveReport;

  private middleware: DriveMiddleware[];

  constructor(
    middleware: DriveMiddleware[] = [],
    params?: { report?: DriveReport },
  ) {
    this.report = params?.report;
    this.middleware = middleware;

    methods.forEach((method) => {
      const name = method.toLowerCase() as Lowercase<typeof method>;
      this.drive[name] = async <T>(...args: DriveParams<T>) =>
        (await this.request({ ...over(...args), method })).body;
    });
  }

  public request = async <T>({
    api,
    use,
    data,
    timeout,
    receiver,
    parse = parser(),
    ...init
  }: DriveOptions<T>) => {
    const context = new DriveContext<T>(api, data, init);

    const composed = compose<DriveContext>(
      (use as Middleware<DriveContext>[]) ?? this.middleware,
    );

    await composed(context, async () => {
      context.init();
      context.initAbort(timeout);

      const { api, options } = context;

      this.report?.curl(api, options);
      const res = await fetch(api, options);

      context.response = res;
      context.decodeHeader(res);
      await parse(res, context, { receiver });
    });

    return context as FetchContext<T>;
  };

  public drive = (async <T>(...args: DriveParams<T>) => {
    return (await this.request(over(...args))).body;
  }) as DriveFunc;
}
