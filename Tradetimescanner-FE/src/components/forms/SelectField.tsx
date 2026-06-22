import React from "react";
import { Controller } from "react-hook-form";

interface InputFieldProps {
  control: any;
  name: string;
  rules?: object;
  placeholder: string;
  setIsDisabled?: any;
  title: string;
  // options: Array<string> | Array<{ value: string; label: string }>;
  options: any;
  isValue?: boolean;
}

const SelectField: React.FC<InputFieldProps> = ({
  control,
  name,
  rules = {},
  placeholder,
  title,
  options,
  isValue,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className="my-2">
          <div className="flex items-center justify-between">
            <p className="text-xs mb-2">{title}</p>
          </div>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`block bg-gray-50 text-xs py-3 px-4 rounded-sm w-full shadow-xs border ${
              error ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">{placeholder}</option>
            {options.map((option: any, index: number) => (
              <>
                {isValue ? (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ) : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )}
              </>
            ))}
          </select>
          {error && (
            <span className="text-red-500 text-xs self-stretch">
              {error.message || "Error"}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default SelectField;
