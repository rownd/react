import classNames from 'classnames';
import React from 'react';
import './Toggle.scss';

interface ToggleProps {
  name?: string;
  label?: string;
  className?: string;
  subLabel?: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  checked: boolean;
  /** Determines whether or not a user can toggle the toggle */
  enabled?: boolean;
  disabled?: boolean;
  icon?: {
    disabled?: React.ReactElement;
    enabled?: React.ReactElement;
  };
}

const Toggle: React.FC<ToggleProps> = ({
  name,
  subLabel,
  className,
  label,
  onChange,
  checked,
  enabled = true,
  disabled,
  icon,
}) => {
  return (
    <div
      className={classNames('toggle', {
        [`${className}`]: Boolean(className),
      })}
    >
      {label && <label className="rp-toggle__label">{label}</label>}
      {enabled && (
        <div
          className={classNames('rp-toggle', {
            'rp-toggle__disabled': disabled,
          })}
        >
          <div
            className={classNames('rp-toggle__icon', {
              'rp-toggle__icon--checked': checked,
              'rp-toggle__icon--not-checked': !checked,
            })}
          >
            {checked ? icon?.enabled : icon?.disabled}
          </div>
          <input
            name={name}
            checked={checked}
            onChange={onChange}
            type="checkbox"
            className="rp-toggle__input"
          />
          {subLabel && (
            <label className="rp-toggle__sublabel">{subLabel}</label>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;
