import { GenderOptions, UserData } from "../types";

export default class UsersApi {
  private static instance: UsersApi;
  private constructor() {}

  public static getInstance(): UsersApi {
    if (!this.instance) this.instance = new UsersApi();

    return this.instance;
  }

  public register = async (user: UserData) => {
    const { loadGender } = this;

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
