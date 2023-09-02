import { GenderOptions, UserData, UserModel } from "../types";

export default class UsersApi {
  private static instance: UsersApi;
  private constructor() {}

  public static getInstance(): UsersApi {
    if (!this.instance) this.instance = new UsersApi();

    return this.instance;
  }

  /**
   * Register user on database
   *
   * @param {string} user
   * @returns {string} id registed
   */
  public register = async (user: UserData): Promise<string> => {
    const { loadGender } = this;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          gender: loadGender(user.gender),
        }),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody);
      }

      const responseBody = await response.json();
      if (typeof responseBody["data"]["id"] !== "string") {
        throw new Error("User id don't received");
      }

      return responseBody["data"]["id"] as string;
    } catch (e) {
      throw e;
    }
  };

  private loadGender = (gender: GenderOptions): string => {
    const allOptions = [
      "Masculino",
      "Feminino",
      "Trans",
      "Outros",
      "Prefiro não dizer",
    ];

    if (!allOptions.includes(gender)) {
      throw new Error(`gender invalid: ${gender}`);
    }

    if (gender === "Prefiro não dizer") return "DESCONHECIDO";

    return gender.toUpperCase();
  };

  public getUsersByPage = async (
    page: number,
    conf: { token: string }
  ): Promise<UserModel[]> => {
    try {
      const { token } = conf;
      const response = await fetch(`/api/users?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody);
      }

      if (!Array.isArray(responseBody["data"])) {
        throw new Error("Invalid return data structure");
      }

      return responseBody["data"] as UserModel[];
    } catch (e) {
      throw e;
    }
  };
}
