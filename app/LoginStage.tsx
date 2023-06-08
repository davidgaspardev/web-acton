import { InputSubmit, Input } from "@/components/Input";
import { UserData } from "@/helpers/types";
import { useState } from "react";
import Image from "next/image";
import ActonLogin from "../assets/acton-login.png";

type LoginStageProps = {
  onClick: (user: UserData) => void;
};

export default function LoginStage(props: LoginStageProps) {
  const { onClick } = props;

  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [sex, setSex] = useState<string>("");

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
      <Image className="mb-10" src={ActonLogin} alt="Acton login logo" width={100} />

      <Input
        className="mb-3"
        placeholder="Nome Completo"
        value={fullname}
        onValue={setFullname}
        required={true}
      />

      <Input
        className="mb-3"
        placeholder="E-mail"
        value={email}
        onValue={setEmail}
        required={true}
      />

      <Input
        className="mb-3"
        placeholder="Whatsapp"
        type="tel"
        pattern="[0-9]{11}"
        value={whatsapp}
        onValue={setWhatsapp}
        required={true}
      />

      <Input
        className="mb-4"
        placeholder="Sexo"
        value={sex}
        onValue={setSex}
        required={true}
        options={["Masculino", "Feminino"]}
      />

      <InputSubmit className="mt-5 text-[#7C65B5]" name="Avançar" />
    </form>
  );
}
