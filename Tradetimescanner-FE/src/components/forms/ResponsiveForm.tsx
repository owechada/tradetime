import React, { ReactNode } from "react";
import { useResponsive } from "../../hooks/useResponsive";

interface ResponsiveFormProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  layout?: 'single' | 'two-column' | 'adaptive';
  spacing?: 'compact' | 'normal' | 'relaxed';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface FormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

interface FormRowProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
  responsive?: boolean;
}

const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  className = "",
  onSubmit,
  layout = 'adaptive',
  spacing = 'normal',
  maxWidth = 'md'
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getFormClasses = () => {
    const baseClasses = "w-full";
    
    // Max width classes
    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg", 
      xl: "max-w-xl",
      full: "max-w-full"
    };

    // Spacing classes
    const spacingClasses = {
      compact: "space-y-3",
      normal: "space-y-4",
      relaxed: "space-y-6"
    };

    // Responsive spacing adjustments
    const responsiveSpacing = isMobile ? "space-y-4" : spacingClasses[spacing];

    return `${baseClasses} ${maxWidthClasses[maxWidth]} ${responsiveSpacing} ${className}`;
  };

  const getContainerClasses = () => {
    if (isMobile) {
      return "px-4 py-6";
    }
    if (isTablet) {
      return "px-6 py-8";
    }
    return "px-8 py-10";
  };

  return (
    <div className={getContainerClasses()}>
      <form onSubmit={onSubmit} className={getFormClasses()}>
        {children}
      </form>
    </div>
  );
};

const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  description,
  className = ""
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <div className="space-y-1">
          <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-base'}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const FormRow: React.FC<FormRowProps> = ({
  children,
  className = "",
  columns = 1,
  responsive = true
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getGridClasses = () => {
    if (!responsive) {
      return `grid grid-cols-${columns} gap-4`;
    }

    // Responsive grid behavior
    if (isMobile) {
      return "grid grid-cols-1 gap-4"; // Always single column on mobile
    }
    
    if (isTablet && columns > 2) {
      return "grid grid-cols-2 gap-4"; // Max 2 columns on tablet
    }

    return `grid grid-cols-${columns} gap-4`;
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
};

interface FormActionsProps {
  children: ReactNode;
  className?: string;
  alignment?: 'left' | 'center' | 'right' | 'between';
  stack?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = "",
  alignment = 'center',
  stack = false
}) => {
  const { isMobile } = useResponsive();

  const getAlignmentClasses = () => {
    const alignmentMap = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between'
    };

    return alignmentMap[alignment];
  };

  const getLayoutClasses = () => {
    if (stack || isMobile) {
      return "flex flex-col space-y-3";
    }
    return `flex ${getAlignmentClasses()} space-x-3`;
  };

  return (
    <div className={`${getLayoutClasses()} pt-4 ${className}`}>
      {children}
    </div>
  );
};

interface ValidationMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'success';
  className?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = 'error',
  className = ""
}) => {
  const { isMobile } = useResponsive();

  const getTypeClasses = () => {
    const typeMap = {
      error: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      success: 'text-green-600 bg-green-50 border-green-200'
    };

    return typeMap[type];
  };

  const getIconForType = () => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-start space-x-2 p-3 rounded-lg border ${getTypeClasses()} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        {getIconForType()}
      </div>
      <p className={`${isMobile ? 'text-sm' : 'text-xs'} font-medium`}>
        {message}
      </p>
    </div>
  );
};

export {
  ResponsiveForm,
  FormSection,
  FormRow,
  FormActions,
  ValidationMessage
};