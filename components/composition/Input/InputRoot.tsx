import { createContext, ReactNode, useId } from 'react';
import { twMerge } from "tailwind-merge";

export const InputContext = createContext<{ id: string }>({ id: "" });

interface InputRootProps {
  className?: string;
  children: ReactNode;
  id?: string;
}

export default function InputRoot(props: InputRootProps) {
  const { className, children, id: propId } = props;

  const id = useId();

  return (
    <InputContext.Provider value={{ id: propId || id }}>
      <div className={twMerge("py-1 px-2", className)}>
        {children}
      </div>
    </InputContext.Provider>
  );
}
