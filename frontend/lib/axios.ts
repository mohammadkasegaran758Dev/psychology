// // src/lib/axios.ts
// import { storeApi } from "@/lib/http/create-api-client";

// export default storeApi;
// src/lib/axios.ts
/**
 * @deprecated Use `storeApi` from `@/lib/http` instead.
 * NOTE: previously used localStorage key "token"; canonical key is "auth_token".
 */
export { storeApi as api } from "@/lib/http/store-api";
export { storeApi as default } from "@/lib/http/store-api";
