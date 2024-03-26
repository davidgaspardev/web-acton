import { EVO_API_BASE_URL, EVO_API_PASSWORD, EVO_API_USERNAME } from "@/helpers/env";
import { UserData } from "@/helpers/types";
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
    console.log("I'm here");

    try {
      const { fullname: name, email, whatsapp: cellphone, gender } = userData;

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
        body: JSON.stringify({
          name,
          email,
          cellphone,
          gender,
          node: "Acton integration",
        }),
      });

      if (response.status === 200) {
        const result = await response.json();
        console.log("EVO result:", result);
      } else {
        throw Error(JSON.stringify(response));
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
