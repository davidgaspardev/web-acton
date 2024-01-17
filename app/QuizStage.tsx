"use client";

import Image from "next/image";
import ActonLogoSmall from "@/assets/acton-logo-small.png";
import BackArrowIcon from "@/assets/back-arrow.png";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { quizList } from "@/helpers/data";
import { getPercentageByMeta } from "@/helpers/math";
import { Callback, QuizData, UserData } from "@/helpers/types";
import QuizzesApi from "@/helpers/api/quizzes";
import InputModal from "@/components/InputModal";

const quizzesApi = QuizzesApi.getInstance();

type QuizPros = {
  user: UserData;
  onClick: (results: QuizData[]) => void;
};

export default function Quiz(props: QuizPros) {
  const { onClick, user } = props;
  const [quizIndex, setQuizIndex] = useState(0);
  // Used only the question is hasMultiSelection
  const [selectedList, setSelectedList] = useState<number[]>([]);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);

  const hasInputModalForSingleAnswer = useRef<boolean>(false);

  const id = useId();

  const handleHiddenQuiz = useCallback(
    (callback?: Callback) => {
      const quizElement = document.getElementById(id) as HTMLElement;
      quizElement.style.opacity = "0";

      if (callback) setTimeout(callback, 150);
    },
    [id]
  );

  const handleShowQuiz = useCallback(
    (callback?: Callback) => {
      const quizElement = document.getElementById(id) as HTMLElement;
      quizElement.style.opacity = "1";

      if (callback) setTimeout(callback, 150);
    },
    [id]
  );

  useEffect(() => {
    handleShowQuiz();
  }, [quizIndex, handleShowQuiz]);

  return (
    <section className="flex flex-col items-center h-full w-full">
      <BackArrow
        show={quizIndex > 0}
        onClick={() => {
          handleHiddenQuiz(() => {
            if (quizIndex === 2) {
              if(user.inputs) user.inputs = undefined;
              setQuizIndex(
                (it) =>
                  it - (quizIndex === 2 && quizList[0].selected![0] === 0 ? 1 : 2)
              );
            } else setQuizIndex((it) => it - 1);
          });
        }}
      />
      <Header />

      <div className="max-w-[360px] sm:max-w-[520px] w-full p-4 flex flex-col flex-1">
        <h2 className="font-semibold text-[16pt] opacity-80 sm:pt-4 sm:text-3xl">
          Sua saúde!
        </h2>

        <div id={id} className="flex-1 transaction-opacity duration-150 ease-linear">
          <div className="h-[75px] sm:[80px] flex flex-col justify-center">
            <h3 className="opacity-75 sm:text-xl">{quizList[quizIndex].question}</h3>
          </div>

          <div className="py-5">
            {quizList[quizIndex].answers.map((answer, index) => (
              <div
                key={`${quizIndex}-${index}`}
                onClick={async () => {
                  if (quizList[quizIndex].hasMultiSelection) {
                    setSelectedList((selectedList) => {
                      // Unselect
                      if (selectedList.includes(index)) {
                        // Clean input if index is "Outros"
                        if(quizList[quizIndex].answers[index] === "Outros") user.inputs = undefined;
                        return selectedList.filter(
                          (selectedIndex) => selectedIndex !== index
                        );
                      }

                      // Select
                      if(quizList[quizIndex].answers[index] === "Outros") {
                        setShowInputModal(true);
                      }
                      return selectedList.concat([index]);
                    });
                    return;
                  }

                  hasInputModalForSingleAnswer.current = (quizList[quizIndex].id === 6 || quizList[quizIndex].id === 7) && quizList[quizIndex].answers[index] === "Sim"

                  if(hasInputModalForSingleAnswer.current) {
                    setShowInputModal(true);
                  }

                  // Storage answer selected
                  quizList[quizIndex].selected = [index];
                  // TODO: Save on database
                  quizzesApi.create(quizList[quizIndex], user);

                  // Check if is the last question
                  if (quizList.length - 1 === quizIndex) {
                    onClick(quizList);
                    return;
                  }

                  // Next question
                  if(!hasInputModalForSingleAnswer.current) handleHiddenQuiz(() => {
                    if (quizIndex === 0) {
                      setQuizIndex((it) => it + (index === 0 ? 1 : 2));
                    } else {
                      setQuizIndex((it) => it + 1);
                    }
                  });
                }}
                className={`${
                  selectedList.includes(index) && selectedList.length > 0
                    ? "bg-[#654C8D] text-[#D7D7D7]"
                    : "bg-[#D7D7D7] text-[#654C8D]"
                } cursor-pointer m-3 h-[34px] sm:h-[40px] sm:mx-6 sm:my-4 flex items-center justify-center rounded-full transition-colors duration-250 ease-linear hover:bg-[#654C8D] hover:text-white`}
              >
                <h5>{answer}</h5>
              </div>
            ))}
            {quizList[quizIndex].hasMultiSelection && (
              <div
                onClick={async () => {
                  // Storage answer selected
                  quizList[quizIndex].selected = selectedList;
                  // TODO: Save on database
                  quizzesApi.create(quizList[quizIndex], user);

                  setSelectedList([]);
                  handleHiddenQuiz(() => setQuizIndex((it) => it + 1));
                }}
                className={`${
                  selectedList.length > 0 ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300 ease-linear m-3 h-[34px] sm:h-[40px] sm:mx-6 sm:my-4 flex items-center justify-center bg-[#829932] text-white rounded-full cursor-pointer`}
              >
                <h5>Avançar</h5>
              </div>
            )}
          </div>
        </div>

        <ProgressBar percentage={getPercentageByMeta(quizIndex, quizList.length)} />

        {
          (showInputModal && !hasInputModalForSingleAnswer.current) && (
            <InputModal
              title="Digite abaixo o local da sua dor"
              onClick={(userInput) => {
                if(!user.inputs) user.inputs = new Array<string>();
                user.inputs.push(userInput);

                setShowInputModal(false);
              }}
              placeholder="Ex: Dor aguda na parte inferior da perna"/>
          )
        }

        {
          (showInputModal && hasInputModalForSingleAnswer.current) && (
            <InputModal
              title={
                quizList[quizIndex].id === 6 ? "Informe sua lesão abaixo" : "Informe seu medicamento abaixo"
              }
              onClick={(userInput) => {
                if(!user.inputs) user.inputs = new Array<string>();
                user.inputs.push(userInput);

                setShowInputModal(false);

                handleHiddenQuiz(() => setQuizIndex((it) => it + 1));
              }}
              placeholder={quizList[quizIndex].id === 6 ? "Ex: Tendinite no pulso" : "Ex: Clonazepam"} />
          )
        }
      </div>
    </section>
  );
}

function Header() {
  return (
    <header className="h-[80px] pt-4 flex items-center justify-center">
      <Image className="w-[120px]" src={ActonLogoSmall} alt="Acton logo small" />
    </header>
  );
}

type ProgressBarProps = {
  percentage: number;
};

function ProgressBar(prps: ProgressBarProps) {
  const { percentage } = prps;
  return (
    <div className="h-[50px]">
      <div className="w-full h-1 bg-[#D6D6D6] rounded-full">
        <div
          className={`bg-[#82A741] transition-all duration-300 ease-linear h-full rounded-full`}
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>
      <h4 className="text-[#9AB766] text-center py-3">
        {percentage.toPrecision(2)}%
      </h4>
    </div>
  );
}

type BackArrowProps = {
  show: boolean;
  onClick: () => void;
};

function BackArrow(props: BackArrowProps) {
  const { show, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={`absolute top-0 pt-4 h-[80px] cursor-pointer flex justify-center items-center ${
        show ? "left-8" : "-left-20"
      } transition-all duration-150 ease-linear`}
    >
      <Image src={BackArrowIcon} alt="Back arrow icon" width={20} />
    </div>
  );
}
