/**
 * Abstration for local storage from browser
 */
export default class LocalStorage {
  private readonly storage = sessionStorage;
  private static instance: LocalStorage;

  // Address of data in local storage
  private readonly KEY_TOKEN = "TOKEN";

  private constructor() {}

  public static getInstance(): LocalStorage {
    if (!this.instance) {
      this.instance = new LocalStorage();
    }

    return this.instance;
  }

  public setToken(token: string) {
    const { storage, KEY_TOKEN } = this;

    return storage.setItem(KEY_TOKEN, token);
  }

  public findToken(): string | null {
    const { storage, KEY_TOKEN } = this;

    return storage.getItem(KEY_TOKEN);
  }
}
