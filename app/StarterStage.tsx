import Image from "next/image";
import ActonLogo from "../assets/acton-logo.png";
import ActonButton from "../assets/acton-button.png";
import ActonAvatar from "../assets/acton-avatar.gif";

type StarterStageProps = {
  onClick: () => void;
};

export default function StarterStage(props: StarterStageProps) {
  const { onClick } = props;
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex h-[150px] items-center justify-center w-[180px]">
          <Image src={ActonLogo} alt="Acton logo" />
        </div>

        <div className="flex flex-1 items-center justify-center pb-48">
          <Image
            onClick={onClick}
            className="cursor-pointer w-[140px]"
            src={ActonButton}
            alt="Acton button"
          />
        </div>
      </div>
      <Image
        className="fixed -bottom-[200px] -left-[80px] w-[380px]"
        src={ActonAvatar}
        alt="Acton avatar"
      />
    </>
  );
}
