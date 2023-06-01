"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";
import { InputSubmit, InputText } from "@/components/Input";
import ActonLogo from "../assets/acton-logo.png";
import ActonButton from "../assets/acton-button.png";
import ActonAvatar from "../assets/acton-avatar.gif";
import ActonLogin from "../assets/acton-login.png";
import { UserData } from "@/helpers/types";
import QuizPage from "./quiz/page";

/**
 *
 * Link reference: https://sistemaacton.tfx.company/
 */
export default function MainPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const id = useId();
  // const router = useRouter();

  function hiddenScreen(callback: () => void) {
    const mainElement = document.getElementById(id) as HTMLElement;
    mainElement.style.opacity = "0";

    setTimeout(callback, 150);
  }

  function showScreen() {
    const mainElement = document.getElementById(id) as HTMLElement;
    mainElement.style.opacity = "1";
  }

  useEffect(() => {
    if (stageIndex > 0) showScreen();
  }, [stageIndex]);

  return (
    <main
      id={id}
      className="bg-white w-full h-screen flex flex-col items-center justify-center transition-opacity duration-150 ease-linear"
    >
      {stageIndex === 0 && (
        <StarterStage
          onClick={() => hiddenScreen(() => setStageIndex((it) => it + 1))}
        />
      )}
      {stageIndex === 1 && (
        <LoginStage
          onClick={(user) => hiddenScreen(() => setStageIndex((it) => it + 1))}
        />
      )}
      {stageIndex === 2 && <QuizPage />}
    </main>
  );
}

type StarterStageProps = {
  onClick: () => void;
};

function StarterStage(props: StarterStageProps) {
  const { onClick } = props;
  return (
    <>
      <div className="flex flex-col h-screen">
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

type LoginStageProps = {
  onClick: (user: UserData) => void;
};

function LoginStage(props: LoginStageProps) {
  const { onClick } = props;

  const [fullname, setFullname] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [whatsapp, setWhatsapp] = useState<string>();
  const [sex, setSex] = useState<string>();

  return (
    <form
      className="w-full h-full bg-[#7C65B5] flex flex-col items-center justify-center"
      onSubmit={(event) => {
        if (!event.defaultPrevented) event.preventDefault();

        if (!fullname || !email || !whatsapp || !sex) {
          alert("Por favor preenchar todos os campos");
          return;
        }

        const user: UserData = {
          fullname,
          email,
          whatsapp,
          sex,
        };

        onClick(user);
      }}
    >
      <Image className="mb-10" src={ActonLogin} alt="Acton login logo" width={140} />

      <InputText
        className="mb-3"
        placeholder="Nome Completo"
        text={fullname}
        onText={setFullname}
      />
      <InputText
        className="mb-3"
        placeholder="E-mail"
        text={email}
        onText={setEmail}
      />
      <InputText
        className="mb-3"
        placeholder="Whatsapp"
        text={whatsapp}
        onText={setWhatsapp}
      />
      <InputText className="mb-3" placeholder="Sexo" text={sex} onText={setSex} />

      <InputSubmit className="mt-5 text-[#7C65B5]" name="Avançar" />
    </form>
  );
}
