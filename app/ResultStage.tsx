import { specialNeeds } from "@/helpers/data";
import {
  QuizData,
  ResultInfoData,
  SpecialNeedData,
  UserData,
} from "@/helpers/types";
import { useEffect, useState } from "react";

type ResultStageProps = {
  user: UserData;
  result: QuizData[];
};

export default function ResultStage(props: ResultStageProps) {
  const { user, result: responses } = props;
  const [result, setResult] = useState<ResultInfoData>();

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

      setResult({
        name: user.fullname,
        methodology,
        level,
        stage,
        specialNeeds: specialNeedsSelected
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 3),
        createdAt: new Date(),
      });
    }
  }, [user, responses, result]);
  return (
    <div>
      <div>
        {result && (
          <div>
            <h2 className="font-bold pb-8">Resultado (testing)</h2>
            <h3>Nome do usuário: {result.name}</h3>
            <h4>Métodologia: {result.methodology}</h4>
            <h4>Nivel: {result.level}</h4>
            <h4>Fase: {result.stage}</h4>
            <h4>Necessidades especiais:</h4>
            <h4>- {result.specialNeeds[0].name}</h4>
            <h4>- {result.specialNeeds[1].name}</h4>
            <h4>- {result.specialNeeds[2].name}</h4>
          </div>
        )}
      </div>
    </div>
  );
}
