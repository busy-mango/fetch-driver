import { describe, it, expect } from 'vitest';

import { isURLSearchParams } from '@busymango/is-esm';

import FetchDriver from '../src/fetch';

type CatFactModel = {
  fact?: string;
  length?: number;
}

describe('Successful GET request', () => {
  const api = 'https://catfact.ninja/fact';
  const { drive, request } = new FetchDriver();

  it('should return a promise', () => {
		const promise = drive(api);
		expect(promise).to.be.an.instanceof(Promise);
		expect(promise).to.have.property('then');
	});

  it('should resolve into response', async () => {
    const data = new URLSearchParams({ test: 'test' });
    
		const ctx = await request<CatFactModel>({ api, data });
    
		expect(ctx.api).toStrictEqual(`${api}?${data.toString()}`);
    expect(ctx.body.fact?.length).toBe(ctx.body.length);
		expect(
      isURLSearchParams(ctx.data) && ctx.data.toString(),
    ).toStrictEqual(data.toString());

    expect(ctx.response).to.be.an.instanceof(Response);
    expect(ctx.responseType).toStrictEqual('json');
	});

  it('should parse json data', async () => {
    const data = new URLSearchParams({ test: 'test' });
    const res = await drive<CatFactModel>(api, data);
    expect(res.fact?.length).toBe(res.length);
  });

  it('should abort fetch when timeout', async () => {
    try {
      await drive<CatFactModel>({ api, timeout: 0 });
      throw new Error('Abort not executed');
    } catch (error) {
      const isDOMException = error instanceof DOMException;
      expect(isDOMException && error.name === 'AbortError').toBe(true);
    }
  });

  it('should get percentage onReceived', async () => {
    const current = {
      percentage: 0,
    }

    await drive({
      api: 'https://www.api-football.com/public/doc/openapi.yaml',
      onReceived: (cur) => {
        const { percentage: pre } = current;
        expect(cur >= pre && cur <= 100).toBeTruthy();
        current.percentage = Number(cur.toFixed(2));
      }
    });
  });
});
