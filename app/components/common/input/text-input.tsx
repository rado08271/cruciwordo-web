import type { PropsWithChildren, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

type Props = PropsWithChildren & {
  title?: ReactNode;
  required?: boolean;
  placeholder?: string;
  onValueChange: (value: string) => void;
  error?: string;
};

const TextInput = ({ title, required, placeholder, onValueChange, error }: Props) => {
  const [value, onSetValue] = useState("");

  return (
    <div className={"flex flex-col gap-2 text-start"}>
      {title && (
        <label htmlFor={"text-input"} className={"inline-flex gap-1"}>
          <span className={"text-red-500 font-extrabold"}>{required ? "*" : ""}</span>
          {title}
        </label>
      )}
      <input
        className={"p-2 border-2 border-gray-200 rounded-sm outline-blue-700"}
        id={"text-input"}
        onChange={
          onValueChange !== null
            ? event => {
                const text = event.target.value;

                onValueChange(text);
                onSetValue(text);
              }
            : null
        }
        type={"text"}
        placeholder={placeholder ?? ""}
        required={required ?? false}
        value={value}
      />
      {
        <label htmlFor={"text-input"} className={"text-sm text-red-500 text-right min-w-8"}>
          {error ?? ""}
        </label>
      }
    </div>
  );
};

export default TextInput;
