import * as React from "react";
import { LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  icon?: LucideIcon;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, touched, icon: Icon, helperText, className, ...props }, ref) => {
    
    const getInputStyles = () => {
      const base = "w-full h-14 px-5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all font-medium text-[15px]";
      const iconPadding = Icon ? "pl-12" : "";
      
      if (!touched) return `${base} ${iconPadding} border-slate-200 focus:ring-[#0f4c81]/10 focus:border-[#0f4c81]`;
      if (error) return `${base} ${iconPadding} border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50/10`;
      return `${base} ${iconPadding} border-green-200 focus:ring-green-100 focus:border-green-500 bg-green-50/10`;
    };

    const getIconStyles = () => {
      if (!touched) return "text-[#0f4c81]";
      if (error) return "text-red-400";
      return "text-green-500";
    };

    return (
      <div className="space-y-2 transition-all">
        <label className="text-xs font-extrabold text-slate-700 tracking-wider uppercase ml-1">
          {label}
        </label>
        
        <div className="relative group">
          <input
            ref={ref}
            className={`${getInputStyles()} ${className || ""}`}
            {...props}
          />
          {Icon && (
            <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${getIconStyles()}`} />
          )}
        </div>

        {touched && error ? (
          <p className="text-[11px] text-red-500 font-bold ml-1">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 italic font-medium ml-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
