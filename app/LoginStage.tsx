import { InputSubmit, Input, InputSelect } from "@/components/Input";
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
  const [gender, setgender] = useState<string>("");

  return (
    <form
      className="w-full h-full bg-[#7C65B5] flex flex-col items-center justify-center"
      onSubmit={(event) => {
        if (!event.defaultPrevented) event.preventDefault();

        if (!fullname || !email || !whatsapp || !gender) {
          alert("Por favor preenchar todos os campos");
          return;
        }

        const user: UserData = {
          fullname,
          email,
          whatsapp,
          gender,
        };

        onClick(user);
      }}
    >
      <Image className="mb-10" src={ActonLogin} alt="Acton login logo" width={100} />

      <Input
        className="mb-3 w-4/6"
        placeholder="Nome Completo"
        value={fullname}
        onValue={setFullname}
        required={true}
      />

      <Input
        className="mb-3 w-4/6"
        placeholder="E-mail"
        type="email"
        value={email}
        onValue={setEmail}
        required={true}
      />

      <Input
        className="mb-3 w-4/6"
        placeholder="Whatsapp"
        type="tel"
        pattern="[0-9]{11}"
        value={whatsapp}
        onValue={setWhatsapp}
        required={true}
      />

      <InputSelect
        className="mb-4 w-4/6"
        placeholder="Gênero"
        value={gender}
        onValue={setgender}
        required={true}
        options={["Masculino", "Feminino", "Trans", "Outro", "Prefiro não dizer"]}
      />

      <InputSubmit className="mt-5 text-[#7C65B5]" name="Avançar" />
    </form>
  );
}
