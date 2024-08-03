import {
  DEBUG_MODE,
  EVO_API_BASE_URL,
  EVO_API_PASSWORD,
  EVO_API_USERNAME,
} from "@/helpers/env";
import { Optional } from "@/helpers/types";
import { loadBasicAuthHeaderValue } from "../utils/auth";
import { Prospect, UserCreateData, GenderOptions } from "../utils/types";

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

  public createUser = async (
    userData: UserCreateData,
    auth?: { username: string; password: string }
  ) => {
    const { loadGender } = this;
    const { fullname: name, cpf, email, whatsapp: cellphone, gender } = userData;
    const { username, password } = auth || {};

    try {
      const body = JSON.stringify({
        name,
        cpf,
        email,
        cellphone,
        gender: loadGender(gender),
        notes: "Acton integration",
      });

      const response = await fetch(`${EVO_API_BASE_URL}/v1/prospects`, {
        method: "POST",
        headers: {
          Authorization: loadBasicAuthHeaderValue(
            username || EVO_API_USERNAME,
            password || EVO_API_PASSWORD
          ),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });

      if (DEBUG_MODE) {
        console.log(
          "request auth:",
          loadBasicAuthHeaderValue(EVO_API_USERNAME, EVO_API_PASSWORD)
        );
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
      // throw err;
    }
  };

  public findByEmail = async (email: string): Promise<Optional<Prospect[]>> => {
    try {
      const response = await fetch(
        `${EVO_API_BASE_URL}/v1/prospects?email=${email}`,
        {
          method: "GET",
          headers: {
            Authorization: loadBasicAuthHeaderValue(
              EVO_API_USERNAME,
              EVO_API_PASSWORD
            ),
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        const result: Prospect[] = await response.json();
        return result.length ? result : undefined;
      } else {
        throw Error(await response.text());
      }
    } catch (err) {
      console.error(err);
      // throw err;
    }
  };

  private loadGender = (gender: GenderOptions) => {
    switch (gender) {
      case "MASCULINO":
        return "M";
      case "FEMININO":
        return "F";
      default:
        return undefined;
    }
  };
}
