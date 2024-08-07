import { InputSubmit, Input as InputBasic, InputSelect } from "@/components/Input";
import { BranchModel, GenderOptions, PositionInfo, UserData } from "@/helpers/types";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ActonLogin from "../assets/acton-login.png";
import UsersApi from "@/helpers/api/users";
import { generateSessionCode } from "@/helpers/math";
import { WarningNotificationController } from "@/components/Notification";
import { twMerge } from "tailwind-merge";
import BranchesApi from "@/helpers/api/branches";
import { Input } from "@/components/composition/Input";
import LocalStorage from "@/helpers/storage";

const usersApi = UsersApi.getInstance();
const localStorage = LocalStorage.getInstance();

type LoginStageProps = {
  onClick: (user: UserData) => void;
};

export default function LoginStage(props: LoginStageProps) {
  const { onClick } = props;

  const [fullname, setFullname] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [gender, setGender] = useState<GenderOptions | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [branchId, setBranchId] = useState<number>();
  const [branches, setBranches] = useState<BranchModel[]>([]);

  const lockRef = useRef<boolean>(false);

  const handleSubmitRegister = useCallback(async (event: FormEvent) => {
    if (!event.defaultPrevented) event.preventDefault();
    if (lockRef.current) return;
    lockRef.current = true;
    setLoading(true);

    try {
      if (!fullname || !whatsapp || !gender || !branchId) {
        WarningNotificationController.show("INFO", "Por favor preenchar todos os campos");
        return;
      }

      const user: UserData = {
        fullname,
        cpf,
        email,
        whatsapp,
        gender,
        branchId
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
  }, [fullname, cpf, email, whatsapp, gender, branchId, onClick]);

  useEffect(() => {
    if(branchId) localStorage.setBranchId(branchId);
  }, [branchId]);

  useEffect(() => {
    //@ts-ignore
    window.onCurrentLocation = (latitude: number, longitude: number) => {
      // Make something with latitude and longitude
      console.log("Latitude: ", latitude);
      console.log("Longitude: ", longitude);
    };

    const getLocation = async () => {
      try {
        // @ts-ignore
        CurrentLocationInvoker?.postMessage("");
      } catch(err) {
        try {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;

                // @ts-ignore
                window.onCurrentLocation(latitude, longitude);
              },
              async (error) => {
                console.error(error);
                const { latitude, longitude } = await getCurrentPositionByIp();

                // @ts-ignore
                window.onCurrentLocation(latitude, longitude);
              }
            );
          } else {
            const { latitude, longitude } = await getCurrentPositionByIp();

            // @ts-ignore
            window.onCurrentLocation(latitude, longitude);
          }
        } catch (error) {
          console.error(error);
          WarningNotificationController.show(
            "ERROR",
            "Não foi possível obter sua localização"
          );
        }
      }
    };

    const getBranches = async () => {
      const branches = await BranchesApi.getInstance().getBranches();

      setBranches(branches);

      const defaultBranchId = localStorage.getBranchId();
      setBranchId(defaultBranchId || branches[0].id);
    };

    getLocation();
    getBranches();

    return () => {
      //@ts-ignore
      delete window.onCurrentLocation;
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#7C65B5] flex items-center justify-center">
      <form
        className="max-w-[512px] w-full flex flex-col items-center"
        onSubmit={handleSubmitRegister}
      >
        <Image className="mb-14" src={ActonLogin} alt="Acton login logo" width={180} />

        <InputBasic
          className="mb-4 w-5/6"
          placeholder="Nome Completo"
          value={fullname}
          onValue={setFullname}
          required={true}
        />

        <InputBasic
          className="mb-4 w-5/6"
          placeholder="CPF 123.456.789-10"
          pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
          maxLength={14}
          value={cpf}
          onValue={setCpf}
          required={true}
        />

        <InputBasic
          className="mb-4 w-5/6"
          placeholder="E-mail"
          type="email"
          value={email}
          onValue={setEmail}
          required={true}
        />

        <InputBasic
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

        <FooterSelect>
          <Input.Root className="flex flex-row items-center gap-2">
            <Input.Label text="Sua academia:" className="text-[#484848]"/>
            <Input.Select
              className="flex-1 border-none text-[#484848] bg-[#48484810] rounded-sm"
              placeholder="Selecione uma unidade"
              value={branchId}
              onValue={(value) =>  setBranchId(value as number)}
              required={true}
            >
              {branches.map((branch) => (
                <Input.Option key={branch.id} value={branch.id} text={branch.name}/>
              ))}
            </Input.Select>
          </Input.Root>
        </FooterSelect>

        <InputSubmit diabled={loading} className="mt-5 text-[#7C65B5]" name="Avançar" />
      </form>
    </div>
  );
}

type FooterSelectProps = {
  className?: string;
  children: React.ReactNode;
};

function FooterSelect(props: FooterSelectProps) {
  const { children, className } = props;

  return (
    <footer className={twMerge("fixed bottom-0 w-screen h-12 bg-yellow-400 flex items-center justify-center", className)}>
      {children}
    </footer>
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
