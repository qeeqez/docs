import {createOpenAPI} from "fumadocs-openapi/server";
import apiDocument from "../../api.json";

const OPENAPI_DOCUMENT_ID = "./api.json";

export const openapi = createOpenAPI({
  input: () => ({
    [OPENAPI_DOCUMENT_ID]: apiDocument,
  }),
});
