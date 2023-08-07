import { specialNeeds } from "@/helpers/data";
import { QuizData, ResultData, SpecialNeedData, UserData } from "@/helpers/types";
import { useEffect, useState } from "react";
import ActonLogoSmall from "../assets/acton-logo-small.png";
import Image, { StaticImageData } from "next/image";
import ViverBem from "../assets/viver-bem-logo.png";
import VivaLeve from "../assets/viva-leve-logo.png";
import VidaAtiva from "../assets/vida-ativa-logo.png";
import ActonAvatar from "../assets/acton-avatar.gif";
import { format } from "date-fns";

type ResultStageProps = {
  user: UserData;
  result: QuizData[];
  onFinish: (result: ResultData) => void;
};

export default function ResultStage(props: ResultStageProps) {
  const { user, result: responses, onFinish } = props;
  const [result, setResult] = useState<ResultData>();

  useEffect(() => {
    if (result === undefined) {
      const whatDoYouWant = (() => {
        const reponse = responses.find((response) => response.id === 18)!;
        return reponse.answers[reponse.selected![0]];
      })();
      const trainerTime = (() => {
        const reponse = responses.find((response) => response.id === 19)!;
        return reponse.answers[reponse.selected![0]];
      })();
      const level = (() => {
        switch (trainerTime) {
          case "Nunca Treinei":
            return 1;
          case "6 meses":
            return 2;
          case "1 ano":
            return 4;
          case "2 anos":
            return 5;
          case "3 anos":
            return 6;
          default:
            throw Error("trainerTime expection");
        }
      })();
      const stage = (() => {
        switch (trainerTime) {
          case "Nunca Treinei":
            return 1;
          case "6 meses":
            return 6;
          case "1 ano":
            return 11;
          case "2 anos":
            return 13;
          case "3 anos":
            return 16;
          default:
            throw Error("trainerTime expection");
        }
      })();
      const methodology = (() => {
        switch (whatDoYouWant) {
          case "Perder peso":
            return level === 1 ? "VIVA LEVE" : "VIVER BEM";
          case "Qualidade de Vida":
            return "VIVA LEVE";
          case "Ganhar Massa Muscular":
            return level === 1 ? "VIVA LEVE" : "VIDA ATIVA";
          default:
            throw Error("trainerTime expection");
        }
      })();

      const specialNeedsSelected = new Array<SpecialNeedData>();
      const questionId3 = (() => {
        const reponse = responses.find((response) => response.id === 3)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId3 === "Sim") {
        specialNeedsSelected.push(
          specialNeeds.find((it) => it.name === "Dor Física")!
        );
      }

      const questionId4 = (() => {
        const reponse = responses.find((response) => response.id === 4)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId4 === "Sim") {
        specialNeedsSelected.push(
          specialNeeds.find(
            (it) => it.name === "Problemas Cardíacos ou Pressão Alta"
          )!
        );
      }

      const questionId5 = (() => {
        const reponse = responses.find((response) => response.id === 5)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId5 === "Sim") {
        specialNeedsSelected.push(
          specialNeeds.find((it) => it.name === "Diabetes")!
        );
      }

      const questionId8 = (() => {
        const reponse = responses.find((response) => response.id === 8)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId8 === "Sim") {
        specialNeedsSelected.push(
          specialNeeds.find((it) => it.name === "Qualidade de Vida")!
        );
      }

      const questionId10 = (() => {
        const reponse = responses.find((response) => response.id === 10)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId10 === "Sim") {
        console.log(specialNeeds);
        specialNeedsSelected.push(
          specialNeeds.find((it) => it.name === "Disposição")!
        );
      }

      const questionId11 = (() => {
        const reponse = responses.find((response) => response.id === 11)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId11 === "Sim" && questionId10 === "Não") {
        specialNeedsSelected.push(
          specialNeeds.find((it) => it.name === "Disposição")!
        );
      }

      const questionId12 = (() => {
        const reponse = responses.find((response) => response.id === 12)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId12 === "Sim") {
        specialNeedsSelected.push(
          specialNeeds.find((it) => it.name === "Ansiedade")!
        );
      }

      const questionId14 = (() => {
        const reponse = responses.find((response) => response.id === 14)!;
        return reponse.answers[reponse.selected![0]];
      })();

      if (questionId14 === "Sim") {
        specialNeedsSelected.push(
          specialNeeds.find((it) => it.name === "Qualidade do Sono")!
        );
      }

      const resultData = {
        name: user.fullname,
        methodology,
        level,
        stage,
        needs: specialNeedsSelected
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 3),
        date: new Date(),
      };

      setResult(resultData);

      try {
        printerResult(resultData);
      } catch (err) {
        console.error(err);
      }

      setTimeout(onFinish, 30 * 1000);
    }
  }, [user, responses, result, onFinish]);

  return (
    <div className="h-full w-full">
      {result && (
        <div className="flex flex-col h-full">
          <Header className="flex-[3]" username={result.name} />
          <Methodology
            className="flex-[5]"
            level={result.level}
            stage={result.stage}
            image={(() => {
              switch (result.methodology) {
                case "VIVA LEVE":
                  return VivaLeve;
                case "VIDA ATIVA":
                  return VidaAtiva;
                default:
                  return ViverBem;
              }
            })()}
          />
          <SpecialNeeds
            className="flex-[4]"
            needs={result.needs.map((specialNeed) => specialNeed.showName)}
          />
        </div>
      )}
    </div>
  );

  function printerResult(result: ResultData) {
    // @ts-ignore
    MessageInvoker.postMessage(JSON.stringify(result));
  }
}

type HeaderProps = {
  className?: string;
  username: string;
};

function Header(props: HeaderProps) {
  const { username, className } = props;

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        className ? className : ""
      }`.trim()}
    >
      <Image
        src={ActonLogoSmall}
        alt="Acton logo small"
        width={120}
        className="pb-5"
      />
      <h1 className="text-xl font-medium text-[#40444D]">Análise concluída,</h1>
      <h2 className="text-[#40444D]">{username}</h2>
    </div>
  );
}

type MethodologyProps = {
  className?: string;
  image: StaticImageData;
  level: number;
  stage: number;
};

function Methodology(props: MethodologyProps) {
  const { className, image, level, stage } = props;

  return (
    <div
      className={`flex flex-col justify-center z-10 text-[#40444D] items-center ${
        className ? className : ""
      }`.trim()}
    >
      <h2 className="text-xl text-[#40444D] font-medium">Métodologia</h2>
      <Image className="py-4" src={image} alt="Methodology logo" width={360} />
      <div className="flex flex-row justify-center gap-4">
        <div>
          <h4 className="text-center text-[#40444D] ">Fase</h4>
          <div className="flex justify-center items-center w-[70px] h-[75px] bg-[#DEE2E7] rounded-md">
            <h3 className="font-bold text-[#40444D] text-3xl">{stage}</h3>
          </div>
        </div>
        <div>
          <h4 className="text-center text-[#40444D] ">Nível</h4>
          <div className="flex justify-center items-center w-[70px] h-[75px] bg-[#DEE2E7] rounded-md">
            <h3 className="font-bold text-[#40444D] text-3xl">{level}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

type SpecialNeedsProps = {
  className?: string;
  needs: string[];
};

function SpecialNeeds(props: SpecialNeedsProps) {
  const { className, needs } = props;
  return (
    <div
      className={`flex relative flex-col justify-center items-center ${
        className ? className : ""
      }`.trim()}
    >
      <div className="w-[80%] z-10">
        <h3 className="font-medium">Data da análise</h3>
        <h4 className="text-sm">{format(new Date(), "dd/MM/yyyy")}</h4>
        <h3 className="font-medium mt-3">Necessiades especiais</h3>
        {needs.map((need, index) => (
          <h4 key={`need-${index}`} className="text-sm">
            {need}
          </h4>
        ))}
      </div>

      <Image
        className="absolute -bottom-8 -right-[55px] md:right-[0px]"
        src={ActonAvatar}
        width={200}
        alt="ActonAvatar"
      />
    </div>
  );
}
