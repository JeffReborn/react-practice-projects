type FormFieldProps = {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  options?: string[];
  className?: string;
};

function FromField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  options = [],
  className = 'border rounded p-2',
}: FormFieldProps) {
  const renderInput = () => {
    const commonProps = {
      name,
      value,
      onChange,
      className,
    };
    const inputTypes: Record<string, React.ReactNode> = {
      text: <input type="text" {...commonProps} />,
      email: <input type="email" {...commonProps} />,
      textarea: <textarea {...commonProps} />,
      select: (
        <select {...commonProps}>
          <option value="">Select a rating</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ),
    };
    return inputTypes[type] || inputTypes.text;
  };
  return (
    <label className="flex flex-col">
      {label}: {renderInput()}
    </label>
  );
}
export default FromField;
