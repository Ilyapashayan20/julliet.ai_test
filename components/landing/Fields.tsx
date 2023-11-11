import clsx from 'clsx';
import { InputHTMLAttributes, ChangeEvent, ChangeEventHandler } from 'react';

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm';

interface LabelProps {
  id?: string;
  children: React.ReactNode;
}

function Label({ id, children }: LabelProps) {
  return (
    <label
      htmlFor={id}
      className="block mb-3 text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  );
}

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  label?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function TextField({
  id,
  label,
  name,
  value,
  type = 'text',
  className = '',
  onChange,
  required = false,
  autoComplete = 'off',
  ...props
}: Props) {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    return null;
  };

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input
        id={id}
        name={name}
        type={type}
        className={formClasses}
        onChange={handleOnChange}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete={autoComplete}
        required={required}
        {...props}
      />
    </div>
  );
}

interface SelectProps {
  id?: string;
  label?: string;
  name?: string;
  className?: string;
  props?: any;
  children: React.ReactNode;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  value?: string;
}

export function SelectField({
  id,
  label,
  className = '',
  onChange,
  children
}: SelectProps) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} onChange={onChange} className={clsx(formClasses, 'pr-8')}>
        {children}
      </select>
    </div>
  );
}
