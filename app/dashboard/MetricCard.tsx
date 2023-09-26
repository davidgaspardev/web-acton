import { MetricInfo, MetricsInfo } from "@/helpers/types"
import ViverBem from "../../assets/viver-bem-logo.png";
import VivaLeve from "../../assets/viva-leve-logo.png";
import VidaAtiva from "../../assets/vida-ativa-logo.png";
import { useCallback } from "react";
import Image from "next/image";

type MetricMethoCardProps = {
    data: MetricInfo;
};

export default function MetricMethoCard(props: MetricMethoCardProps): JSX.Element {
    const { quantity, methodology } = props.data;
    const logoWidth = 145;

    const loadImage = useCallback(() => {
        switch (methodology) {
            case "VIDA ATIVA": return VidaAtiva;
            case "VIVA LEVE": return VivaLeve;
            case "VIVER BEM": return ViverBem;
            default: throw Error(`'${methodology}' invalid for load image`);
        }
    }, [ methodology ]);

    return (
        <Container>
            <Image
                src={loadImage()}
                alt="Methodology logo"
                width={logoWidth}
                height={logoWidth * 0.58298}/>

            <h2 className="font-bold text-lg mt-2">{quantity}</h2>
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
            <h2 className="text-center">MAPEAMENTO<br/>REALIZADOS</h2>
            <h3>{data.map(metric => metric.quantity).reduce((acc, curr) => acc + curr, 0)}</h3>
        </Container>
    );
}

type ContainerProps = {
    children: React.ReactNode
}

function Container(props: ContainerProps): JSX.Element {
    const { children } = props;

    return (
        <div className="bg-[#EAEDF3] w-[200px] h-[180px] mx-4 my-6 flex flex-col items-center justify-center">
            {children}
        </div>
    )
}
