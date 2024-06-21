/**
 * @author mango
 * @description fetch type define
 */
import type DriveContext from "./context";

// middleware next func
export type Next = () => Promise<void>;

// base middleware
export type Middleware<T> = (context: T, next: Next) => Promise<void>;

// drive middleware
export type DriveMiddleware<T = unknown> = (
  context: DriveContext<T>,
  next: Next,
) => void;

// drive context options
export type DriveContextOptions = {
  headers: Headers;
} & Omit<RequestInit, "headers">;

export interface ReceivedFunc<T> {
  (percentage: number, context: DriveContext<T>): void;
}

export interface BodyParseFunc<T> {
  (
    response: Response,
    context: DriveContext<T>,
    extra?: {
      onReceived?: ReceivedFunc<T>;
    },
  ): Promise<void>;
}

export type ExtraOptions<T> = {
  /** abort fetch before timeout */
  timeout?: number;
  /** use extra middleware in current fetch */
  use?: DriveMiddleware<T>[];
  /** progress callback */
  onReceived?: ReceivedFunc<T>;
  /** body parse */
  parse?: BodyParseFunc<T>;
};

// call the drive by DriveOptions
export type DriveOptions<T> = RequestInit &
  ExtraOptions<T> & {
    api: string;
    data?: object;
  };

export interface DriveMethodFunc {
  <T>(
    api: string,
    data?: object,
    init?: Omit<RequestInit, "method">,
  ): Promise<T>;
}

export type DriveFuncAttrs = Record<
  "get" | "put" | "post" | "head" | "trace" | "delete" | "connect" | "options",
  DriveMethodFunc
>;

// drive func overloading
export interface DriveFunc extends DriveFuncAttrs {
  <T>(opts: DriveOptions<T>): Promise<T>;
  <T>(
    /** the fetch USVString */
    api: string,
    /** the fetch body */
    data?: object,
    /** the fetch request init */
    init?: RequestInit,
  ): Promise<T>;
}

// drive func first param
export type FirstParam<T> = string | DriveOptions<T>;

// drive context after fetch over
export type FetchContext<T> = Required<DriveContext<T>>;

export const methods: RequestInit["method"][] = [
  "GET",
  "POST",
  "HEAD",
  "TRACE",
  "DELETE",
  "CONNECT",
  "OPTIONS",
];
