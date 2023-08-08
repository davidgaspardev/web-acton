import { QuizData, QuizFromDatabase, UserData } from "../types";

export default class QuizzesApi {
  private static instance: QuizzesApi;
  private constructor() {}

  public static getInstance(): QuizzesApi {
    if (!this.instance) this.instance = new QuizzesApi();

    return this.instance;
  }

  public create = async (quizData: QuizData, userData: UserData) => {
    const { convertDataToDataFromDatabase } = this;

    try {
      const quiz = convertDataToDataFromDatabase(quizData, userData);

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(quiz),
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
    quizData: QuizData,
    userData: UserData
  ): QuizFromDatabase => {
    return {
      question: quizData.question,
      answer: quizData
        .selected!.map((select) => quizData.answers[select])
        .join(", "),
      date: new Date(),
      sessionCode: userData.sessionCode!,
      userId: userData.id!,
    };
  };
}
