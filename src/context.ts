/**
 * @author mango
 * @description fetch context
 */

import { isNil, isObject, isURLSearchParams } from '@busymango/is-esm';

import type { DriveContextOptions } from './model';
import { isNonRawBodyInit } from "./utils";

export default class DriveContext<T = unknown> {
  public api: string;

  public options: DriveContextOptions;

  public body?: T;

  public data?: object;

  public response?: Response;

  public responseType?: string | null;

  constructor (
    api: string,
    data?: object,
    params?: RequestInit,
  ) {
    const {
      headers,
      ...options
    } = params ?? {};

    this.api = api;
    this.data = data;
    this.options = {
      ...options,
      headers: new Headers(headers),
    };
  }

  // 初始化API
  public initAPI = () => {
    const { api, data } = this;
    if (isURLSearchParams(data)) {
      const arr = api.split('?');
      const [path, ...searchs] = arr;
      const search = searchs.join('?');
      const queries = `${data.toString()}&${search}`;
      this.api = `${path}?${new URLSearchParams(queries).toString()}`;
    }
  } 

  public initBody = () => {
    const { body, headers } = this.options;
    
    if (isNil(body)) {
      const { data } = this;
      if (isNonRawBodyInit(data)) {
        this.options.body = data;
      } else if (isObject(data)) {
        this.options.body = JSON.stringify(data);
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
      }
    }
  }

  public initMethod = () => {
    if (!this.options.method) {
      const { body } = this.options;
      this.options.method = (
        isNil(body) || isURLSearchParams(body)
      ) ? 'GET' : 'POST';
    }
  }
}
