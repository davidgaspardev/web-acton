const MissingEnv = (envName: string) => {
  //throw Error(`Missing environment variable: ${envName}`);
};

export const EVO_API_ENABLE = process.env.EVO_API_ENABLE === "true";
export const EVO_API_BASE_URL = process.env.EVO_API_BASE_URL!; // || MissingEnv("EVO_API_BASE_URL");
export const EVO_API_USERNAME = process.env.EVO_API_USERNAME!; // || MissingEnv("EVO_API_USERNAME");
export const EVO_API_PASSWORD = process.env.EVO_API_PASSWORD!;

export const WPP_API_PHONE = process.env.WPP_API_PHONE!; // || MissingEnv("WPP_API_PHONE");
export const WPP_API_FBCLID = process.env.WPP_API_FBCLID!; // || MissingEnv("EVO_API_PASSWORD");

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "acton-jwt-screte-key";
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
export const ORIGINS_ALLOWED = process.env.ORIGINS_ALLOWED || "*";
export const USER_PAGE_SIZE =
  Number.isInteger(Number(process.env.USER_PAGE_SIZE)) &&
  Number(process.env.USER_PAGE_SIZE) > 0
    ? Number(process.env.USER_PAGE_SIZE)
    : 100;
