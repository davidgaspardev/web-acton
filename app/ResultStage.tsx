import { specialNeeds } from "@/helpers/data";
import {
  QuizData,
  ResultData,
  ResultToPrint,
  SpecialNeedData,
  UserData,
} from "@/helpers/types";
import { useEffect, useState } from "react";
import ActonLogoSmall from "../assets/acton-logo-small.png";
import Image, { StaticImageData } from "next/image";
import ViverBem from "../assets/viver-bem-logo.png";
import VivaLeve from "../assets/viva-leve-logo.png";
import VidaAtiva from "../assets/vida-ativa-logo.png";
import ActonAvatar from "../assets/acton-avatar.gif";
import { format } from "date-fns";
import ResultsApi from "@/helpers/api/results";
import PopUp from "@/components/tmp/PopUp";
import { isInSpecificAndroidWebView } from "@/helpers/tools";

const resultsApi = ResultsApi.getInstance();

type ResultStageProps = {
  user: UserData;
  result: QuizData[];
  onFinish: (result: ResultData) => void;
};

export default function ResultStage(props: ResultStageProps) {
  const { user, result: responses, onFinish } = props;
  const [result, setResult] = useState<ResultData>();
  const [hasPopUp, setHasPopUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("Starting UseEffect in ResultStage")
    async function fetchAIResult() {
      setLoading(true);
      try {
        const response = await fetch("/api/ai-opinion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizzes: responses.map((q) => ({
              question: q.question,
              answer: q.selected ? q.answers[q.selected[0]] : "",
            })),
            client_name: user.fullname,
          }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        const { treino, condicoes, ai_opinion } = data;

        // needs: garantir string para o banco
        let needsString = "";
        if (condicoes && typeof condicoes === "object") {
         Object.entries(condicoes).forEach(([key, value]) => {
            if (typeof value === "boolean" && value) {
              needsString += `${key}, `;
            } else if (typeof value === "string" && value) {
              needsString += `${value}, `;
            }
          });
        }
        var nivel = typeof treino?.nivel == "number" ? treino?.nivel : parseInt(treino?.nivel, 10) || 1;
        var fase = typeof treino?.fase == "number" ? treino?.fase : parseInt(treino?.fase, 10) || 1;
        

        const resultData = {
          methodology: treino?.tipo || "",
          level: nivel,
          stage: fase,
          needs: needsString,
          ai_opinion: ai_opinion ? ai_opinion : "",
          condicoes,
          date: new Date(),
        };
        setResult(resultData);
        resultsApi.save(resultData, user);
      } catch (err) {
        console.error(`error in fetching AI result: ${err}`);
      } finally {
        setLoading(false);
        if (!isInSpecificAndroidWebView())
          setTimeout(() => setHasPopUp(true), 1 * 1000);
        setTimeout(onFinish, 60 * 1000);
      }
    }
    if (result === undefined) {
      fetchAIResult();
    }
  }, [user, responses, result, onFinish]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h2 className="text-2xl font-bold text-[#40444D] mb-4">
          gerando análise do seu treino
        </h2>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#40444D]" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {result && (
        <div className="flex flex-col h-full">
          <Header className="flex-[3]" username={user.fullname} />
          <Methodology
            className="flex-[5]"
            level={result.level}
            stage={result.stage}
            image={(() => {
              switch (result.methodology) {
                case "viva_leve":
                case "VIVA LEVE":
                  return VivaLeve;
                case "vida_ativa":
                case "VIDA ATIVA":
                  return VidaAtiva;
                default:
                  return ViverBem;
              }
            })()}
          />
          <SpecialNeeds
            className="flex-[4]"
            needs={typeof result.needs === 'string' ? result.needs.split(',').map(n => n.trim()).filter(Boolean) : []}
          />
        </div>
      )}

      {hasPopUp && <PopUp onClick={() => setHasPopUp(false)} />}
    </div>
  );

  function printerResult(result: ResultToPrint) {
    // Só envie para MessageInvoker se ele existir (mobile/webview). Caso contrário, ignore.
    if (typeof window !== 'undefined' && (window as any).MessageInvoker) {
      (window as any).MessageInvoker.postMessage(JSON.stringify(result));
    } else {
      // Ambiente web normal: apenas loga para debug
      console.log("printerResult (web):", result);
    }
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
      <h2 className="text-xl text-[#40444D] font-medium">Metodologia</h2>
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
