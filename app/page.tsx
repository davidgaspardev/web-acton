"use client";

import Image from "next/image";
import { useState } from "react";
import { InputSubmit, InputText } from "@/components/Input";
import ActonLogo from "../assets/acton-logo.png";
import ActonButton from "../assets/acton-button.png";
import ActonAvatar from "../assets/acton-avatar.gif";
import ActonLogin from "../assets/acton-login.png";
import { UserData } from "@/helpers/types";

export default function MainPage() {
  return (
    <main className="bg-white w-full h-screen flex flex-col items-center justify-center">
      {/* <StarterStage onClick={() => {}} /> */}
      <LoginStage onClick={(user) => console.log("user:", user)} />
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
