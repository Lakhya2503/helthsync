import { useState } from 'react';

export default function ErrorBanner({ message, dismissible = true, onDismiss }) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!visible) return null;

  return (
    <div className="error-banner">
      <div className="error-content">
        <span className="error-icon">⚠</span>
        <span className="error-message">{message}</span>
      </div>
      {dismissible && (
        <button className="error-close" onClick={handleDismiss} aria-label="Dismiss error">
          &times;
        </button>
      )}
    </div>
  );
}

// Usage:
// <ErrorBanner message="Invalid email address" dismissible onDismiss={handleErrorDismiss} />