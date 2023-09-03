export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "acton-jwt-screte-key";
export const DEBUG_MODE = process.env.DEBUG_MODE === "true";
export const ORIGINS_ALLOWED = process.env.ORIGINS_ALLOWED || "*";
export const USER_PAGE_SIZE =
  Number.isInteger(Number(process.env.USER_PAGE_SIZE)) &&
  Number(process.env.USER_PAGE_SIZE) > 0
    ? Number(process.env.USER_PAGE_SIZE)
    : 100;
