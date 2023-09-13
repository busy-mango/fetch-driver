import { describe, it, expect } from 'vitest';
import FetchDriver from '../src/fetch';
import { isURLSearchParams } from '@busymango/is-esm';

type CatFactModel = {
  fact?: string;
  length?: number;
}

describe('Successful GET request', () => {
  const api = 'https://catfact.ninja/fact';
  const { drive, request } = new FetchDriver();

  it('should return a promise', () => {
		const promise = drive('https://catfact.ninja/fact');
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

  it('Mock fetch', async () => {
    const res = await drive<CatFactModel>(api);
    expect(res.fact?.length).toBe(res.length);
  });

  it('Abort fetch', async () => {
    try {
      await drive<CatFactModel>({ api, timeout: 0 });
      throw new Error('Abort not executed');
    } catch (error) {
      const isDOMException = error instanceof DOMException;
      expect(isDOMException && error.name === 'AbortError').toBe(true);
    }
  });
});
