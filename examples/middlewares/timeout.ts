import { downloader, fields2search, type DriveMiddleware, src2name } from '../../index';

/**
 * 如果是附件请求则直接下载附件
 */

export const disposition: DriveMiddleware = async (context, next) => {
  await next();

  const { response } = context;

  if (response?.ok) {
    const { api } = context;
    const { headers } = response;
    // 如果是附件请求则直接下载附件
    if (headers.has("Content-Disposition")) {
      const disposition = headers.get("Content-Disposition");
      const [mode, ...fields] = disposition?.trim()?.split(';') ?? [];
    
      if (mode.trim() === 'attachment') {
        const params = fields2search(fields);
        context.body = await response.blob();
        const name = params.get('filename') ?? src2name(api);
        const src = URL.createObjectURL(context.body as Blob);
        downloader(src, name);
        
        return URL.revokeObjectURL(src);
      }
    }
  }
}
