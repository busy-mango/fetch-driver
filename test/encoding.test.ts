import { describe, it, expect } from 'vitest';
import FetchDriver from '../src/fetch';
import { isUndefined } from '@busymango/is-esm';

describe('external encoding', () => {
  const { drive, request } = new FetchDriver([]);

	describe('data uri', () => {
		it('should accept base64-encoded gif data uri', async () => {
			const { response } = await request({
        api: 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
      });

      const { status, headers } = response;
			expect(status).toStrictEqual(200);
			expect(headers.get('Content-Type')).toStrictEqual('image/gif');

			const buffer = await response.arrayBuffer();
			expect(buffer.byteLength).toStrictEqual(35);
			expect(buffer).to.be.an.instanceOf(ArrayBuffer);

      const res = await drive('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
      console.log('res', res);

		});

		it('should accept data uri with specified charset', async () => {
			const { response } = await request({
        api: 'data:text/plain;charset=UTF-8;page=21,the%20data:1234,5678'
      });

      const { status, headers } = response;
			expect(status).toStrictEqual(200);
			expect(headers.get('Content-Type')).toStrictEqual(
        'text/plain;charset=UTF-8,page=21',
      );

			expect(await response.text()).toStrictEqual('the data:1234,5678');
		});

		it('should accept data uri of plain text', async () => {
      const { response } = await request({ api: 'data:,Hello%20World!' })

      const { status, headers } = response;
      expect(status).toStrictEqual(200);
			expect(headers.get('Content-Type')).toStrictEqual(
        'text/plain;charset=US-ASCII',
      );

      expect(await response.text()).toStrictEqual('Hello World!');
		});

		it('should get undefined data uri', async () => {
      const res = await drive('data:,Hello%20World!');
      expect(isUndefined(res)).toBeTruthy();
		});
	});
});