import Image from "next/image";
import { ResultModel, UserModel } from "@/helpers/types"
import ViverBem from "@/assets/viver-bem-logo.png";
import VivaLeve from "@/assets/viva-leve-logo.png";
import VidaAtiva from "@/assets/vida-ativa-logo.png";
import IcEvo from "@/assets/svg/ic-evo.svg";
import { useCallback } from "react";

type UserInfoCardProps = {
    info: UserModel;
}

export default function UserInfoCard(props: UserInfoCardProps): JSX.Element {
    const { info } = props;

    const getLastResult = useCallback(() => {
        return info.results[0];
    }, [ info ])

    return (
        <div className="flex flex-col w-[440px] rounded bg-gray-200">
          <div className="p-3">
            <h1 className="text-2xl">{info.fullname}</h1>
            <h1>{info.whatsapp}</h1>
            { info.email && <h1>{info.email}</h1>}
            { getLastResult() && (
                <>
                    <div className="bg-gray-300 w-full h-[1.5px] rounded-sm my-2"/>
                    <Methology result={getLastResult()} />
                </>
            )}
          </div>
          { info.prospectId && <EvoLink prospectId={info.prospectId}/> }
        </div>
    )
}

type MethologyProps = {
    result: ResultModel
};

function Methology(props: MethologyProps): JSX.Element {
    const { result } = props;

    const loadImage = useCallback(() => {
        switch (result.methodology) {
            case "VIDA ATIVA": return VidaAtiva;
            case "VIVA LEVE": return VivaLeve;
            case "VIVER BEM": return ViverBem;
            default: throw Error(`invalid for load image`);
        }
    }, [ result ]);


    return (
        <div className="my-2">
            <div className="flex flex-row items-center">
                <Image
                    src={loadImage()}
                    height={64}
                    alt="Methology logo"/>
                <h1 className="ps-4 text-xl"><strong>{result.methodology}</strong> |  NIVEL {result.level} FASE {result.stage}</h1>

            </div>
            {
              result.needs.length > 0 && (
                <div className="mt-2">
                  <h4><strong>Necessidades especiais</strong></h4>
                  {result.needs.split(",").map((need, index) => (
                    <h3 key={`${index}-${need}`}>{need}</h3>
                  ))}
                </div>
              )
            }
        </div>
    )
}

type EvoLinkProps = {
  prospectId: number;
  memberId?: number;
}

function EvoLink(props: EvoLinkProps): JSX.Element {
  const { prospectId, memberId } = props;

  const openEvo = useCallback(() => {
    const evoLink = !!memberId ? loadLinkToEVO(memberId, "MEMBER") : loadLinkToEVO(prospectId, "PROSTECT");
    window.open(evoLink, "_blank");
  },[prospectId, memberId]);

  return (
    <div className="w-full h-10 bg-[#262b2c] flex felx-row cursor-pointer rounded-b-md" onClick={openEvo}>
      <div className="px-4 h-full flex justify-center items-center">
        <Image
            src={IcEvo}
            width={55}
            alt="EVO icon"/>
      </div>
      <div className="flex-1 flex flex-row items-center border-l border-l-[#424242] pl-4">
        <p
        className="text-white text-sm">
          Acessar via sistema EVO: <strong>{prospectId}</strong></p>
      </div>
    </div>
  );
}

export function loadLinkToEVO(id: number, type: "PROSTECT" | "MEMBER"): string {
  return `https://evo-release.w12app.com.br/#/app/actoacademia/1/${type === "MEMBER" ? "clientes" : "oportunidades"}/${id}//perfil`;
}
