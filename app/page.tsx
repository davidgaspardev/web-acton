"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Callback, QuizData, UserData } from "@/helpers/types";
import QuizStage from "./QuizStage";
import ResultStage from "./ResultStage";
import LoginStage from "./LoginStage";
import StarterStage from "./StarterStage";
import { ErrorNotification, InfoNotification, WarningNotification } from "@/components/Notification";
import LocalStorage from "@/helpers/storage";

/**
 *
 * Link reference: https://sistemaacton.tfx.company/
 */
export default function MainPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const userRef = useRef<UserData>();
  const resultRef = useRef<QuizData[]>();
  const id = useId();

  const handleHiddenScreen = useCallback(
    (callback?: Callback) => {
      const mainElement = document.getElementById(id) as HTMLElement;
      mainElement.style.opacity = "0";

      if (callback) setTimeout(callback, 150);
    },
    [id]
  );

  const handleShowScreen = useCallback(
    (callback?: Callback) => {
      const mainElement = document.getElementById(id) as HTMLElement;
      mainElement.style.opacity = "1";

      if (callback) setTimeout(callback, 150);
    },
    [id]
  );

  useEffect(() => {
    handleShowScreen();
  }, [stageIndex, handleShowScreen]);

  return (
    <main
      id={id}
      className="bg-white w-full absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-150 ease-linear"
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
          user={userRef.current!}
          onClick={(result) => {
            resultRef.current = result;
            nextStage();
          }}
        />
      )}
      {stageIndex === 3 && (
        <ResultStage
          user={userRef.current!}
          result={resultRef.current!}
          onFinish={() => {
            resetStage();
          }}
        />
      )}
      <WarningNotification />
      <ErrorNotification />
      <InfoNotification />
    </main>
  );

  function nextStage(): void {
    return handleHiddenScreen(() =>
      setStageIndex((currentStage) => currentStage + 1)
    );
  }

  function prevStage(): void {
    return handleHiddenScreen(() =>
      setStageIndex((currentStage) => currentStage - 1)
    );
  }

  function resetStage(): void {
    return handleHiddenScreen(() => setStageIndex(0));
  }
}
