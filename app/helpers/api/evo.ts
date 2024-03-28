import { DEBUG_MODE, EVO_API_BASE_URL, EVO_API_PASSWORD, EVO_API_USERNAME } from "@/helpers/env";
import { GenderOptions, UserData } from "@/helpers/types";
import { loadBasicAuthHeaderValue } from "../utils/auth";

/**
 * EVO API client (integration)
 *
 * @link https://evo-abc.readme.io/
 */
export default class EvoApi {
  private static instance: EvoApi;
  private constructor() {}

  public static getInstance(): EvoApi {
    if (!this.instance) this.instance = new EvoApi();

    return this.instance;
  }

  public createUser = async (userData: UserData) => {
    const { loadGender } = this;
    const {
      fullname: name,
      email,
      whatsapp: cellphone,
      gender
    } = userData;

    try {
      const body = JSON.stringify({
        name,
        email,
        cellphone,
        gender: loadGender(gender),
        note: "Acton integration",
      });

      const response = await fetch(`${EVO_API_BASE_URL}/v1/prospects`, {
        method: "POST",
        headers: {
          Authorization: loadBasicAuthHeaderValue(
            EVO_API_USERNAME,
            EVO_API_PASSWORD
          ),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body
      });

      if (DEBUG_MODE) {
        console.log("request auth:", loadBasicAuthHeaderValue(
          EVO_API_USERNAME,
          EVO_API_PASSWORD
        ));
        console.log("request path:", `${EVO_API_BASE_URL}/v1/prospects`);
        console.log("request body:", body);
      }

      if (response.status === 200) {
        const result: { idProspect: number } = await response.json();
        userData.prospectId = result.idProspect;
      } else {
        throw Error(await response.text());
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  private removeUndefinedKeys = (obj: { [key: string]: any }) => {
    for (const key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    }
    return obj;
  }

  private loadGender = (gender: GenderOptions) => {
    switch (gender) {
      case "Masculino".toUpperCase():
        return "M";
      case "Feminino".toUpperCase():
        return "F";
      default:
        return undefined;
    }
  }
}
