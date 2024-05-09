import { InputSubmit, Input, InputSelect } from "@/components/Input";
import { GenderOptions, PositionInfo, UserData } from "@/helpers/types";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ActonLogin from "../assets/acton-login.png";
import UsersApi from "@/helpers/api/users";
import { generateSessionCode } from "@/helpers/math";
import { WarningNotificationController } from "@/components/Notification";

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
  const [loading, setLoading] = useState<boolean>(false);

  const lockRef = useRef<boolean>(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              storagePosition({ latitude, longitude });
            },
            async (error) => {
              console.error(error);
              const position = await getCurrentPositionByIp();
              storagePosition(position);
            }
          );
        } else {
          const position = await getCurrentPositionByIp();
          storagePosition(position);
        }
      } catch (error) {
        console.error(error);
        WarningNotificationController.show(
          "ERROR",
          "Não foi possível obter sua localização"
        );
      }
    };

    getLocation();
  }, []);

  return (
    <div className="w-full h-full bg-[#7C65B5] flex items-center justify-center">
      <form
        className="max-w-[512px] w-full flex flex-col items-center"
        onSubmit={async (event) => {
          if (!event.defaultPrevented) event.preventDefault();
          if (lockRef.current) return;
          lockRef.current = true;
          setLoading(true);

          try {
            if (!fullname || !whatsapp || !gender) {
              WarningNotificationController.show("INFO", "Por favor preenchar todos os campos");
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
            setLoading(false);

            WarningNotificationController.show("ERROR", String(e));
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
          required={true}
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

        <InputSubmit diabled={loading} className="mt-5 text-[#7C65B5]" name="Avançar" />
      </form>
    </div>
  );
}


/**
 * Get current position by IP
 *
 * @returns {Promise<PositionInfo>}
 */
async function getCurrentPositionByIp(): Promise<PositionInfo> {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  const ip = data.ip;

  const positionResponse = await fetch(`https://ipapi.co/${ip}/json/`);
  const positionData = await positionResponse.json();
  const { latitude, longitude } = positionData;

  return { latitude, longitude };
}

/**
 * Storage position
 *
 * @param {LocationInfo} location
 */
async function storagePosition(location: PositionInfo) {
  console.log("Location: ", location);
}
