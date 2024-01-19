import { useState } from "react";
import { Input, InputDark } from "./Input";

type InputModalProps = {
  title: string;
  placeholder?: string;
  onClick: (result: string) => void;
}

export default function InputModal(props: InputModalProps): JSX.Element {
  const { title, placeholder, onClick } = props;

  const [result, setResult] = useState<string>();

  return (
    <div className="bg-[#00000043] fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
      <div className="w-72 bg-white rounded-md flex flex-col items-center justify-center">
        <h1 className="mt-8 mb-4">{title}</h1>
        <div className="w-[90%]">
          <InputDark onValue={setResult} placeholder={placeholder} />
        </div>

        <div className="h-10 mt-4 w-full flex items-center justify-center rounded-b-md cursor-pointer bg-green-600 hover:bg-green-500" onClick={() => result && onClick(result)}>
          <h3 className="text-white">Registrar</h3>
        </div>
      </div>
    </div>
  );
}
