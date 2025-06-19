import { BranchModel } from "../types";

export default class BranchesApi {
  private static instance: BranchesApi;
  private constructor() {}

  public static getInstance(): BranchesApi {
    if (!this.instance) this.instance = new BranchesApi();

    return this.instance;
  }

  public getBranches = async (): Promise<BranchModel[]> => {
    try {
      const response = await fetch("/api/branches", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody);
      }

      const responseBody = await response.json();
      if (!Array.isArray(responseBody["data"])) {
        throw new Error("Branches don't received");
      }

      return responseBody["data"];
    } catch (e) {
      throw e;
    }
  };
}
