import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { InputContext } from "./InputRoot";

interface InputLabelProps {
  className?: string;
  text: string;
}

export default function InputLabel(props: InputLabelProps) {
  const { className, text } = props;

  const { id } = useContext(InputContext);

  return (
    <label
      htmlFor={id}
      className={twMerge(
        "text-white",
        className
      )}>
      {text}
    </label>
  );
}
