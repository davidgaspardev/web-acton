import { ReactNode, useContext } from "react";
import { InputContext } from "./InputRoot";
import { twMerge } from "tailwind-merge";

interface InputSelectProps {
  className?: string;
  children: ReactNode;
  placeholder?: string;
  value?: string | number;
  onValue: (value: string | number) => void;
  required?: boolean;
}

export default function InputSelect(props: InputSelectProps) {
  const { className, children, placeholder, value, onValue, required } = props;
  const { id } = useContext(InputContext);

  const isNumber = typeof value === "number";

  return (
    <select
      id={id}
      className={twMerge("bg-transparent border-b-2 text-white border-white px-2 py-1 placeholder:text-white/75 focus:outline-none w-full", className)}
      placeholder={placeholder}
      value={value}
      onChange={({ target: { value } }) => onValue(isNumber ? Number(value) : value)}
      required={required}
      >
      {children}
    </select>
  );
}
