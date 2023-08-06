import { GenderOptions, UserData } from "../types";

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
      "Outro",
      "Prefiro não dizer",
    ];

    if (!allOptions.includes(gender)) {
      throw new Error(`gender invalid: ${gender}`);
    }

    if (gender === "Prefiro não dizer") return "DESCONHECIDO";

    return gender.toUpperCase();
  };
}
