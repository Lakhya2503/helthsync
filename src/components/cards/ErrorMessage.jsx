import PropTypes from 'prop-types';
import { X, AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  retryText = 'Retry', 
  onDismiss, 
  dismissible = true,
  variant = 'default', // 'default' | 'danger' | 'warning' | 'info'
  className = '',
  fullWidth = false
}) => {
  // Variant styles
  const variantStyles = {
    default: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    },
    danger: {
      bg: 'bg-red-100',
      border: 'border-red-300',
      text: 'text-red-800',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: <AlertTriangle className="h-5 w-5 text-blue-500" />
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <div 
      className={`
        ${currentVariant.bg} 
        ${currentVariant.border} 
        ${currentVariant.text}
        ${fullWidth ? 'w-full' : 'max-w-max'}
        rounded-lg p-4 border-l-4 shadow-sm
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {currentVariant.icon}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {message}
            </p>
            {dismissible && (
              <button
                onClick={onDismiss}
                className="ml-3 p-1 rounded-md hover:bg-opacity-20 hover:bg-current focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {onRetry && (
            <div className="mt-2">
              <button
                onClick={onRetry}
                className={`
                  px-3 py-1 text-sm font-medium rounded-md 
                  ${variant === 'warning' ? 
                    'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' :
                    'bg-red-100 hover:bg-red-200 text-red-800'
                  }
                `}
              >
                {retryText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  retryText: PropTypes.string,
  onDismiss: PropTypes.func,
  dismissible: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'danger', 'warning', 'info']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool
};

export default ErrorMessage;