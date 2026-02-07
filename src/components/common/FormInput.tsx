import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
  multiline?: boolean;
  type?: string;
}

export function FormInput({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  icon, 
  multiline,
  type = 'text'
}: FormInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="form-group"
    >
      <label className="form-label">
        {icon}
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-textarea"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
        />
      )}
    </motion.div>
  );
}
