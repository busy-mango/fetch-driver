/**
 * @author mango
 * @description fetch error
 */

import DriveContext from './context';

export interface FetchErrorParams<T> {
  code?: T;
  cause?: unknown;
  context: DriveContext;
}

export class FetchError<T = number> extends Error {
  public code?: T;

	public context?: DriveContext;
	
	constructor(
    message: string,
    params: FetchErrorParams<T>,
  ) {
    super(message, {
      cause: params?.cause
    });

    this.code = params?.code;
    this.context = params?.context;    
	}
}
