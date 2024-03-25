import { InputSubmit, Input, InputSelect } from "@/components/Input";
import { GenderOptions, UserData } from "@/helpers/types";
import { useRef, useState } from "react";
import Image from "next/image";
import ActonLogin from "../assets/acton-login.png";
import UsersApi from "@/helpers/api/users";
import { generateSessionCode } from "@/helpers/math";

const usersApi = UsersApi.getInstance();

type LoginStageProps = {
  onClick: (user: UserData) => void;
};

export default function LoginStage(props: LoginStageProps) {
  const { onClick } = props;

  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [gender, setGender] = useState<GenderOptions | undefined>();

  const lockRef = useRef<boolean>(false);

  return (
    <div className="w-full h-full bg-[#7C65B5] flex items-center justify-center">
      <form
        className="max-w-[512px] w-full flex flex-col items-center"
        onSubmit={async (event) => {
          if (!event.defaultPrevented) event.preventDefault();
          if (lockRef.current) return;
          lockRef.current = true;

          try {
            if (!fullname || !whatsapp || !gender) {
              alert("Por favor preenchar todos os campos");
              return;
            }

            const user: UserData = {
              fullname,
              email,
              whatsapp,
              gender,
            };

            const userId = await usersApi.register(user);
            user.id = userId;
            user.sessionCode = generateSessionCode();

            onClick(user);
          } catch (e) {
            console.error(e);
            lockRef.current = false;
          }
        }}
      >
        <Image className="mb-14" src={ActonLogin} alt="Acton login logo" width={180} />

        <Input
          className="mb-4 w-5/6"
          placeholder="Nome Completo"
          value={fullname}
          onValue={setFullname}
          required={true}
        />

        <Input
          className="mb-4 w-5/6"
          placeholder="E-mail"
          type="email"
          value={email}
          onValue={setEmail}
          // required={true}
        />

        <Input
          className="mb-4 w-5/6"
          placeholder="Whatsapp"
          type="tel"
          pattern="[0-9]{11}"
          maxLength={11}
          value={whatsapp}
          onValue={setWhatsapp}
          required={true}
        />

        <InputSelect
          className="mb-6 w-5/6"
          placeholder="Gênero"
          value={gender}
          onValue={(option) => setGender(option as GenderOptions)}
          required={true}
          options={
            [
              "Masculino",
              "Feminino",
              "Trans",
              "Outros",
              "Prefiro não dizer",
            ] as GenderOptions[]
          }
        />

        <InputSubmit className="mt-5 text-[#7C65B5]" name="Avançar" />
      </form>
    </div>
  );
}
