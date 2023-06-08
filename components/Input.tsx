import { useId } from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "number" | "tel";
  className?: string;
  onValue: (value: string) => void;
  pattern?: string;
  required?: boolean;
  options?: string[];
};

export function Input(props: InputProps) {
  const {
    className,
    label,
    type,
    placeholder,
    value,
    onValue,
    required,
    pattern,
    options,
  } = props;

  const id = useId();

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className="bg-transparent border-b-2 text-white border-white px-2 py-1 placeholder:text-white/75 focus:outline-none"
        id={id}
        type={type || "text"}
        pattern={pattern}
        value={value}
        placeholder={placeholder}
        onChange={({ target: { value } }) => onValue(value)}
        required={required}
        list={`options-${id}`}
      />
      {options && options.length > 0 && (
        <datalist id={`options-${id}`}>
          {options.map((option) => (
            <option key={option} value={option}></option>
          ))}
        </datalist>
      )}
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
      className={`bg-white rounded-full h-[35px] w-[220px] cursor-pointer ${
        className || ""
      }`}
      type="submit"
      value={name}
    />
  );
}
