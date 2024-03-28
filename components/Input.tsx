import { useId } from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "number" | "tel" | "email" | "password";
  className?: string;
  onValue: (value: string) => void;
  pattern?: string;
  required?: boolean;
  options?: string[];
  maxLength?: number;
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
    maxLength,
  } = props;

  const id = useId();

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className="bg-transparent border-b-2 text-white border-white px-2 py-1 placeholder:text-white/75 focus:outline-none w-full"
        id={id}
        type={type || "text"}
        pattern={pattern}
        value={value}
        placeholder={placeholder}
        onChange={({ target: { value } }) => onValue(value)}
        required={required}
        list={`options-${id}`}
        maxLength={maxLength}
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

export function InputDark(props: InputProps) {
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
    maxLength,
  } = props;

  const id = useId();

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className="bg-gray-100 border-b-2 text-gray-900 border-white px-2 py-1 placeholder:text-black/82 focus:outline-none mx-[5px] my-2 w-[calc(100%-10px)] rounded-md text-xs"
        id={id}
        type={type || "text"}
        pattern={pattern}
        value={value}
        placeholder={placeholder}
        onChange={({ target: { value } }) => onValue(value)}
        required={required}
        list={`options-${id}`}
        maxLength={maxLength}
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

type InputSelectProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "number" | "tel" | "email";
  className?: string;
  onValue: (value: string) => void;
  pattern?: string;
  required?: boolean;
  options: string[];
};

export function InputSelect(props: InputSelectProps) {
  const { className, label, placeholder, value, onValue, required, options } = props;

  const id = useId();

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        className="bg-transparent border-b-2 text-white border-white px-2 py-1 placeholder:text-white/75 focus:outline-none w-full"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={({ target: { value } }) => onValue(value)}
        required={required}
      >
        {placeholder && (
          <option key="" value="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

type InputSubmitProps = {
  className?: string;
  diabled?: boolean;
  name: string;
};

export function InputSubmit(props: InputSubmitProps) {
  const { className, diabled, name } = props;

  return (
    <div className={`bg-white rounded-full flex items-center justify-center h-[48px] w-[220px] ${
      className || ""
    } ${ diabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
     {
      diabled ? (
        <svg className="animate-spin h-5 w-5 text-[#7c65b5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <input
          className="h-full w-full rounded-fullcursor-pointer"
          type="submit"
          value={name}
        />
      )
     }
    </div>
  );
}
