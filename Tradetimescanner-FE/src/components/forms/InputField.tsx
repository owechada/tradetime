import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useResponsive } from "../../hooks/useResponsive";
import { useAccessibility } from "../../hooks/useAccessibility";
import { useResponsivePolish } from "../../hooks/useResponsivePolish";
import "../../styles/responsive-polish.css";

interface InputFieldProps {
  control: any;
  name: string;
  defaultvalue?: string;
  rules?: object;
  isDisabled?:boolean;
  placeholder: string;
  secureTextEntry?: boolean;
  tooltip?:JSX.Element,
  title?: string;
  type?: any;
  numberOfLines?: number;
  maxLength?: number;
  showCount?: boolean;
  isTextArea?: boolean;
  style?: any;
  contClass?: any;
  responsive?: boolean; // Enable responsive behavior
  fullWidth?: boolean; // Force full width on all devices
  ariaLabel?: string;
  ariaDescribedBy?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  control,
  name,
  isDisabled,
  rules = {},
  placeholder,
  title,
  type,
  tooltip,
  defaultvalue,
  maxLength,
  showCount,
  isTextArea,
  style,
  contClass,
  responsive = true,
  fullWidth = false,
  ariaLabel,
  ariaDescribedBy,
  required = false,
}) => {
  const [inptype, settype] = useState(type);
  const [passvisible, setpassvisible] = useState(false);
  const [focused, setfocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isMobile, isTablet } = useResponsive();
  const { 
    getAccessibilityClasses, 
    ariaAttributes,
    getKeyboardHandlers 
  } = useAccessibility({ 
    componentType: 'input',
    focusVariant: 'default'
  });
  
  const {
    touchDevice,
    microInteractionsEnabled,
    getResponsiveSpacing,
    addTouchFeedback,
  } = useResponsivePolish();

  // Responsive width classes
  const getResponsiveWidth = () => {
    if (fullWidth) return "w-full";
    if (!responsive) return "w-[300px]";
    
    if (isMobile) return "w-full";
    if (isTablet) return "w-full max-w-md";
    return "w-[300px]";
  };

  // Responsive padding and sizing
  const getResponsivePadding = () => {
    if (isMobile) return "py-4 px-4"; // Larger touch targets on mobile
    if (isTablet) return "py-3.5 px-4";
    return "py-3 px-4";
  };

  // Responsive text sizing
  const getResponsiveTextSize = () => {
    if (isMobile) return "text-base"; // Larger text on mobile for better readability
    return "text-sm";
  };

  // Touch-friendly icon sizing
  const getIconSize = () => {
    return isMobile ? 24 : 20;
  };

  // Responsive label positioning
  const getLabelClasses = () => {
    if (isMobile) return "text-sm font-medium mb-2 text-textbg flex justify-between items-start flex-col sm:flex-row gap-1";
    return "text-xs font-medium m-2 text-textbg flex justify-start items-start";
  };

  // Get responsive polish classes
  const getPolishClasses = (error?: any) => {
    const baseClasses = [
      'input-responsive',
      'input-micro',
      'transition-responsive',
      'focus-ring-responsive',
    ];

    if (error) {
      baseClasses.push('error');
    }

    return baseClasses.join(' ');
  };

  // Handle input focus with polish effects
  const handleFocus = () => {
    setfocused(true);
  };

  // Handle input blur with polish effects
  const handleBlur = () => {
    setfocused(false);
  };

  // Handle password toggle with touch feedback
  const handlePasswordToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (touchDevice) {
      addTouchFeedback(event.currentTarget);
    }
    
    const newType = inptype === "password" ? "text" : "password";
    settype(newType);
    setpassvisible(!passvisible);
  };
 
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultvalue}
      rules={rules}
      render={({
        field: { value = defaultvalue, onChange },
        fieldState: { error },
      }) => (
        <div className={`${contClass ? contClass : ""} ${getResponsiveWidth()} relative`}>
          {title && (
            <div className={getLabelClasses()}>
              <p className={`${getResponsiveTextSize()} font-medium text-textbg flex items-center`}>
                {title}
                {tooltip && <span className="ml-2">{tooltip}</span>}
              </p>
              {showCount && (
                <p className={`${getResponsiveTextSize()} text-gray-500`}>
                  {`${value?.length > 0 ? value?.length : 0}${maxLength ? "/" + maxLength : ""}`}
                </p>
              )}
            </div>
          )}

          {isTextArea ? (
            <textarea
              value={value}
              placeholder={placeholder}
              onChange={(text) => {
                onChange(text);
              }}
              aria-label={ariaLabel || title || placeholder}
              aria-describedby={ariaDescribedBy || (error ? `${name}-error` : undefined)}
              aria-required={required}
              aria-invalid={!!error}
              {...ariaAttributes}
              {...getKeyboardHandlers()}
              className={getAccessibilityClasses(`block bg-white ${getResponsiveTextSize()} ${getResponsivePadding()} ${getPolishClasses(error)} custom-outline rounded-xl w-full shadow-sm border-2 ${
                focused 
                  ? "border-primary shadow-lg shadow-primary/20" 
                  : error 
                    ? "border-red-500 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300"
              } resize-none`)}
              style={style}
              maxLength={maxLength || undefined}
              rows={isMobile ? 4 : 3}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          ) : (
            <div
              className={`flex items-center border-2 ${getPolishClasses(error)} ${
                focused 
                  ? "border-primary shadow-lg shadow-primary/20" 
                  : error 
                    ? "border-red-500 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 shadow-sm"
              } bg-white rounded-xl overflow-hidden`}
            >
              <input
                type={inptype || "text"}
                value={value}
                disabled={isDisabled}
                id={name}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                onChange={(text) => onChange(text)}
                style={style}
                aria-label={ariaLabel || title || placeholder}
                aria-describedby={ariaDescribedBy || (error ? `${name}-error` : undefined)}
                aria-required={required}
                aria-invalid={!!error}
                {...ariaAttributes}
                {...getKeyboardHandlers()}
                className={getAccessibilityClasses(`block bg-transparent ${getResponsiveTextSize()} ${getResponsivePadding()} w-full text-gray-900 placeholder-gray-500 ${
                  error ? "text-red-600" : ""
                } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`)}
                maxLength={maxLength || undefined}
              />
              {type === "password" && (
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className={getAccessibilityClasses(`flex items-center justify-center ${isMobile ? 'p-3 min-w-[44px]' : 'p-2 min-w-[40px]'} text-textbg hover:text-primary transition-responsive rounded-lg ${touchDevice ? 'touch-feedback' : 'hover-lift'}`)}
                  aria-label={passvisible ? "Hide password" : "Show password"}
                >
                  {passvisible ? (
                    <IoMdEye size={getIconSize()} />
                  ) : (
                    <IoMdEyeOff size={getIconSize()} />
                  )}
                </button>
              )}
            </div>
          )}

          {error && (
            <div id={`${name}-error`} className={`mt-2 flex items-start space-x-2 ${isMobile ? 'text-sm' : 'text-xs'} text-red-600 font-medium fade-in`}>
              <svg className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error.message || "Error"}</span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default InputField;