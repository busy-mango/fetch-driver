import { describe, it, expect } from 'vitest';

import DriveContext from '../src/context';

describe('DriveContext', () => {
  it('should initialize API correctly', () => {
    const api = '/api';
    const data = { param1: 'value1', param2: 'value2' };
    const context = new DriveContext(api, new URLSearchParams(data));
    context.init();
    expect(context.api).toStrictEqual('/api?param1=value1&param2=value2');
  });

  it('should initialize body correctly', () => {
    const data = { key: 'value' };
    const context = new DriveContext('/api', data);
    context.init();
    expect(context.options.body).toStrictEqual(JSON.stringify(data));
    expect(context.options.headers.get('Content-Type')).toStrictEqual('application/json');
  });

  it('should initialize method correctly', () => {
    const context1 = new DriveContext('/api');
    context1.init();
    expect(context1.options.method).toStrictEqual('GET');

    const context2 = new DriveContext('/api', { key: 'value' });
    context2.init();
    expect(context2.options.method).toStrictEqual('POST');
  });
});
