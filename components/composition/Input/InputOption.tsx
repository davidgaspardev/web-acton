import { twMerge } from "tailwind-merge";

interface InputOptionProps {
  className?: string;
  text: string;
  value: string | number;
}

export default function InputOption(props: InputOptionProps) {
  const { className, text, value } = props;

  return (
    <option
      className={twMerge("bg-transparent text-white", className)}
      value={value}
    >
      {text}
    </option>
  );
}
