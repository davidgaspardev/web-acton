import { QuizData, UserData } from "@/helpers/types";
import { useEffect } from "react";

type ResultStageProps = {
  user: UserData;
  result: QuizData[];
};

export default function ResultStage(props: ResultStageProps) {
  const { user, result } = props;

  useEffect(() => {
    console.log("User:", user);
    console.log("Result:", result);
    for (const questionResult of result) {
      // if (questionResult.id ==)
    }
  }, [user, result]);
  return (
    <div>
      <h1>I'm here</h1>
    </div>
  );
}
