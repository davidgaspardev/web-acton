import { UserData } from "@/helpers/types";

export default class EvoApi {
  private static instance: EvoApi;
  private constructor() { }

  public static getInstance(): EvoApi {
    if (!this.instance) this.instance = new EvoApi();

    return this.instance;
  }

  public createUser = async (userData: UserData) => {
    try {

    } catch (err) {
      throw err;
    }
  }
}
