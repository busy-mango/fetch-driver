import FetchDriver from "@busymango/fetch-driver";

import disposition from "./middlewares/disposition";

const { request, drive } = new FetchDriver([disposition]);

export { drive, request };

export default drive;
