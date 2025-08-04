import { MetricInfo, MetricsInfo } from "@/helpers/types"
import ViverBem from "../../assets/viver-bem-logo.png";
import VivaLeve from "../../assets/viva-leve-logo.png";
import VidaAtiva from "../../assets/vida-ativa-logo.png";
import { useCallback } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type MetricMethoCardProps = {
    data: MetricInfo;
};

export default function MetricMethoCard(props: MetricMethoCardProps): JSX.Element {
    const { quantity, methodology } = props.data;
    const logoWidth = 145;

      const methodology_fixed = useCallback(() => {
        switch (methodology) {
            case "VIDA ATIVA":
            case "vida_ativa":
                return "VIDA ATIVA";
            case "VIVA LEVE":
            case "viva_leve":
                return "VIVA LEVE";
            case "VIVER BEM":
            case "viver_bem":
            case "viva_bem":
                return "VIVER BEM";
            default:
                throw Error(`'${methodology}' invalid for methodology_fixed`);
        }
    }, [methodology]);

    const loadImage = useCallback(() => {
        switch (methodology) {
            case "VIDA ATIVA" : return VidaAtiva;
            case "vida_ativa": return VidaAtiva;
            case "VIVA LEVE": return VivaLeve;
            case "viva_leve": return VivaLeve;
            case "VIVER BEM": return ViverBem;
            case "viver_bem": return ViverBem;
            case "viva_bem": return ViverBem;
            default: throw Error(`'${methodology}' invalid for load image`);
        }
    }, [ methodology ]);

    return (
        <Container
          className={methodology === "VIDA ATIVA" ? "bg-[#F7C3C0]" : methodology === "VIVER BEM" ? "bg-[#FDE6BD]" : "bg-[#BEECF5]"}>
            <Image
                src={loadImage()}
                alt="Methodology logo"
                width={logoWidth}
                height={logoWidth * 0.58298}/>

            <h2 className={twMerge(
              "font-bold text-lg mt-3",
              methodology === "VIDA ATIVA" ? "text-[#E9645B]" : methodology === "VIVER BEM" ? "text-[#FABE54]" : "text-[#56CDE6]"
            )}>{quantity} {quantity > 1 ? "clientes" : "cliente"}</h2>
        </Container>
    )
}

type MetricCountCardProps = {
    data: MetricsInfo;
};

export function MetricCountCard(props: MetricCountCardProps): JSX.Element {
    const { data } = props;

    return (
        <Container>
            <h2 className="text-center opacity-75 text-sm">MAPEAMENTO<br/>REALIZADOS</h2>
            <h1 className="font-bold text-4xl mt-2">{data.map(metric => metric.quantity).reduce((acc, curr) => acc + curr, 0)}</h1>
        </Container>
    );
}

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
}

function Container(props: ContainerProps): JSX.Element {
    const { children, className } = props;

    return (
        <div className={twMerge("bg-[#EAEDF3] w-[200px] h-[180px] mx-4 my-6 flex flex-col items-center justify-center rounded-md", className)}>
            {children}
        </div>
    )
}
