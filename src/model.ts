/**
 * @author mango
 * @description fetch type define
 */
import DriveContext from "./context";

// middleware next func
export type Next = () => Promise<void>;

// base middleware
export type Middleware<T> = (context: T, next: Next) => Promise<void>;

// drive middleware
export type DriveMiddleware<T = unknown> = (context: DriveContext<T>, next: Next) => void;

// drive context options
export type DriveContextOptions = {
  headers: Headers;
} & Omit<RequestInit, 'headers'>;

// call the drive by DriveOptions
export type DriveOptions = RequestInit & {
  api: string;
  data?: object;
};

// drive func overloading
export interface DriveFunc {
  <T>(opts: DriveOptions): Promise<T>;
  <T>(api: string, data?: object, init?: RequestInit): Promise<T>;
  // get: <T>(api: string, data?: object, init?: Omit<RequestInit, 'method'>) => Promise<T>;
};

// drive func first param
export type FirstParam = string | DriveOptions;

// drive context after fetch over
export type FetchContext<T> = Required<DriveContext<T>>;

export const methods: RequestInit['method'][] = [
  'GET',
  'POST',
  'HEAD',
  'TRACE',
  'DELETE',
  'CONNECT',
  'OPTIONS',
];
