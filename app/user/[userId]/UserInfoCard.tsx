import Image from "next/image";
import { ResultModel, UserModel } from "@/helpers/types"
import ViverBem from "@/assets/viver-bem-logo.png";
import VivaLeve from "@/assets/viva-leve-logo.png";
import VidaAtiva from "@/assets/vida-ativa-logo.png";
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
        <div className="flex flex-col w-[420px] p-3 rounded bg-gray-200">
            <h1 className=" text-2xl">{info.fullname}</h1>
            <h1>{info.whatsapp}</h1>
            { info.email && <h1>{info.email}</h1>}
            { getLastResult() && (
                <>
                    <div className="bg-gray-300 w-full h-[1.5px] rounded-sm my-2"/>
                    <Methology result={getLastResult()} />
                </>
            )}
            { info.prospectId && (
              <a
                className="text-center underline"
                href={loadLinkToEVO(info.prospectId)}>Acessar via sistema EVO: <strong>{info.prospectId}</strong></a>
            )}
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
            <div className="mt-2">
                <h4><strong>Necessidades especiais</strong></h4>
                {result.needs.split(",").map((need, index) => (
                    <h3 key={`${index}-${need}`}>{need}</h3>
                ))}
            </div>
        </div>
    )
}

function loadLinkToEVO(prospectId: number): string {
  return `https://evo-release.w12app.com.br/#/app/actoacademia/0/oportunidades/${prospectId}//perfil`;
}
