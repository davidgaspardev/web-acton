"use client";

import { useEffect, useId, useRef, useState } from "react";
import { QuizData, UserData } from "@/helpers/types";
import QuizStage from "./QuizStage";
import ResultStage from "./ResultStage";
import LoginStage from "./LoginStage";
import StarterStage from "./StarterStage";

/**
 *
 * Link reference: https://sistemaacton.tfx.company/
 */
export default function MainPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const userRef = useRef<UserData>();
  const resultRef = useRef<QuizData[]>();
  const id = useId();

  function hiddenScreen(callback: () => void) {
    const mainElement = document.getElementById(id) as HTMLElement;
    mainElement.style.opacity = "0";

    setTimeout(callback, 150);
  }

  function showScreen() {
    const mainElement = document.getElementById(id) as HTMLElement;
    mainElement.style.opacity = "1";
  }

  useEffect(() => {
    if (stageIndex > 0) showScreen();
  }, [stageIndex]);

  return (
    <main
      id={id}
      className="bg-white w-full h-screen flex flex-col items-center justify-center transition-opacity duration-150 ease-linear"
    >
      {stageIndex === 0 && <StarterStage onClick={() => nextStage()} />}
      {stageIndex === 1 && (
        <LoginStage
          onClick={(user) => {
            userRef.current = user;
            nextStage();
          }}
        />
      )}
      {stageIndex === 2 && (
        <QuizStage
          onClick={(result) => {
            resultRef.current = result;
            nextStage();
          }}
        />
      )}
      {stageIndex === 3 && <ResultStage />}
    </main>
  );

  function nextStage(): void {
    return hiddenScreen(() => setStageIndex((it) => it + 1));
  }
}
