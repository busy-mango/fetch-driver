declare const request: <T>({ api, use, data, parse, timeout, onReceived, ...init }: import("@busymango/fetch-driver").DriveOptions<T>) => Promise<Required<import("@busymango/fetch-driver").DriveContext<T>>>, drive: import("@busymango/fetch-driver").DriveFunc;
export { drive, request };
export default drive;
