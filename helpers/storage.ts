import { Nullable } from "./types";

/**
 * Abstration for local storage from browser
 */
export default class LocalStorage {
  private readonly storage = () => sessionStorage;
  private static instance: LocalStorage;

  // Address of data in local storage
  private readonly KEY_TOKEN = "TOKEN";
  private readonly KEY_CURRENT_LOCATION = "CURRENT_LOCATION";
  private readonly KEY_BRANCH_ID = "BRANCH_ID";

  private constructor() {}

  public static getInstance(): LocalStorage {
    if (!this.instance) {
      this.instance = new LocalStorage();
    }

    return this.instance;
  }

  public setToken(token: string) {
    const { storage, KEY_TOKEN } = this;

    return storage().setItem(KEY_TOKEN, token);
  }

  public findToken(): string | null {
    const { storage, KEY_TOKEN } = this;

    return storage().getItem(KEY_TOKEN);
  }

  public setLocation(latitude: number, longitude: number) {
    const { storage, KEY_CURRENT_LOCATION } = this;

    return storage().setItem(
      KEY_CURRENT_LOCATION,
      JSON.stringify([latitude, longitude])
    );
  }

  public getLoction(): Nullable<[number, number]> {
    const { storage, KEY_CURRENT_LOCATION } = this;

    const location = storage().getItem(KEY_CURRENT_LOCATION);

    if (location) {
      return JSON.parse(location);
    }

    return null;
  }

  public setBranchId(branchId: number) {
    const { storage, KEY_BRANCH_ID } = this;

    return storage().setItem(KEY_BRANCH_ID, branchId.toString());
  }

  public getBranchId(): Nullable<number> {
    const { storage, KEY_BRANCH_ID } = this;

    const branchIdString = storage().getItem(KEY_BRANCH_ID);

    return branchIdString ? Number(branchIdString) : null;
  }
}
