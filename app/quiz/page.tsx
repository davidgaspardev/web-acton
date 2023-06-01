"use client";

import Image from "next/image";
import ActonLogoSmall from "../../assets/acton-logo-small.png";
import { useEffect, useId, useState } from "react";
import { quizList } from "@/helpers/data";
import { getPercentageByMeta } from "@/helpers/math";

type QuizPagePros = {
  onClick: () => void;
};

export default function QuizPage(props: QuizPagePros) {
  const { onClick } = props;
  const [quizIndex, setQuizIndex] = useState(0);

  const id = useId();

  function hiddenQuiz(callback: () => void) {
    const quizElement = document.getElementById(id) as HTMLElement;
    quizElement.style.opacity = "0";

    setTimeout(callback, 150);
  }

  function showQuiz() {
    const quizElement = document.getElementById(id) as HTMLElement;
    quizElement.style.opacity = "1";
  }

  useEffect(() => {
    if (quizIndex > 0) showQuiz();
  }, [quizIndex]);

  return (
    <section className="flex flex-col items-center h-screen">
      <header className="h-[80px] pt-4 flex items-center justify-center">
        <Image className="w-[120px]" src={ActonLogoSmall} alt="Acton logo small" />
      </header>

      <div className="max-w-[360px] p-4 flex flex-col flex-1">
        <h2 className="font-semibold text-[16pt] opacity-80">Sua saúde!</h2>

        <div id={id} className="flex-1 transaction-opacity duration-150 ease-linear">
          <h3 className="opacity-75">{quizList[quizIndex].question}</h3>

          <div className="py-5">
            {quizList[quizIndex].answers.map((answer) => (
              <div
                onClick={() => {
                  if (quizList.length - 1 === quizIndex) {
                    alert("acabou");
                    return;
                  }
                  hiddenQuiz(() => setQuizIndex((it) => it + 1));
                }}
                className="bg-[#D7D7D7] text-[#654C8D] cursor-pointer m-3 h-[34px] flex items-center justify-center rounded-full transition-colors duration-250 ease-linear hover:bg-[#654C8D] hover:text-white"
              >
                <h5>{answer}</h5>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[80px]">
          <div className="w-full h-1 bg-[#D6D6D6] rounded-full">
            <div
              className={`bg-[#82A741] transition-all duration-300 ease-linear h-full rounded-full`}
              style={{
                width: `${getPercentageByMeta(quizIndex, quizList.length)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
