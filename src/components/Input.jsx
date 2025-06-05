import React from 'react';

const Input = React.forwardRef(
  ({ label, type, text, children, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="">{label}</label>}
        <input
          type={type}
          ref={ref}
          className={`${className}`}
          {...props}
        />
      </div>
    );
  }
);

export default Input;