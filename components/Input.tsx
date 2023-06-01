import { useId } from "react";

type InputTextProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  text?: string;
  className?: string;
  onText: (text: string) => void;
};

export function InputText(props: InputTextProps) {
  const { className, label, placeholder, text, onText, id: propsId } = props;

  const id = propsId || useId();

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className="bg-transparent border-b-2 text-white border-white px-2 py-1 placeholder:text-white/75 focus:outline-none"
        id={id}
        type="text"
        value={text}
        placeholder={placeholder}
        onChange={({ target }) => onText(target.value)}
      />
    </div>
  );
}

type InputSubmitProps = {
  className?: string;
  name: string;
};

export function InputSubmit(props: InputSubmitProps) {
  const { className, name } = props;

  return (
    <input
      className={`bg-white rounded-full h-[30px] w-[220px] cursor-pointer ${
        className || ""
      }`}
      type="submit"
      value={name}
    />
  );
}
