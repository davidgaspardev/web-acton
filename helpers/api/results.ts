import { MetricsInfo, ResultData, ResultFromDatabase, UserData } from "../types";

export default class ResultsApi {
  private LOG_TAG = "RestultsApi";

  private static instance: ResultsApi;
  private constructor() {}

  public static getInstance(): ResultsApi {
    if (!this.instance) this.instance = new ResultsApi();

    return this.instance;
  }

  public save = async (resultData: ResultData, userData: UserData) => {
    const { convertDataToDataFromDatabase, LOG_TAG } = this;

    try {
      const result = convertDataToDataFromDatabase(resultData, userData);

      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody);
      }
    } catch (e) {
      throw e;
    }
  };

  private convertDataToDataFromDatabase = (
    resultData: ResultData,
    userData: UserData
  ): ResultFromDatabase => {
    return {
      ...resultData,
      needs: resultData.needs.map((need) => need.showName).join(", "),
      userId: userData.id!,
      sessionCode: userData.sessionCode!,
    };
  };

  public getMetrics = async (): Promise<MetricsInfo> => {
    const { LOG_TAG } = this;

    try {
      const response = await fetch("/api/results/metrics", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody);
      }

      return (responseBody as { data: MetricsInfo }).data;
    } catch (e) {
      console.error(LOG_TAG, e);
      throw e;
    }
  };
}
