/**
 * FormField — Campo de formulario con validación y feedback accesible.
 * Incluye labels, mensajes de error, estados de validación y accesibilidad WCAG.
 */
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  required = false,
  disabled = false,
  placeholder,
  helperText,
  autoComplete,
  maxLength,
  pattern,
  min,
  max,
  step,
  inputMode,
  className = '',
  ...props
}) {
  const { dark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputId = `field-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  // Estilos dinámicos
  const cardBg = dark ? '#0D1117' : '#f9fafb';
  const border = error 
    ? '#EF4444' 
    : success 
    ? '#059669'
    : focused
    ? '#0052FF'
    : dark ? '#1F2630' : '#e5e7eb';
  
  const textH = dark ? '#E6EDF3' : '#111827';
  const textM = dark ? '#8B9498' : '#6b7280';

  const handleFocus = (e) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold"
          style={{ color: textH }}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-label="requerido">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          {...props}
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
          min={min}
          max={max}
          step={step}
          inputMode={inputMode}
          aria-invalid={!!error}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          aria-required={required}
          className="w-full px-4 py-2.5 rounded-xl border-2 text-sm transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: cardBg,
            borderColor: border,
            color: textH,
            paddingRight: isPassword || success || error ? '2.75rem' : undefined,
          }}
        />

        {/* Iconos de estado */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {error && (
            <AlertCircle 
              size={18} 
              style={{ color: '#EF4444' }}
              aria-hidden="true"
            />
          )}
          {!error && success && (
            <CheckCircle 
              size={18} 
              style={{ color: '#059669' }}
              aria-hidden="true"
            />
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: textM }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Mensajes de ayuda y error */}
      {helperText && !error && (
        <p 
          id={helperId}
          className="text-xs"
          style={{ color: textM }}
        >
          {helperText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: '#EF4444' }}
          role="alert"
        >
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * TextArea — Campo de texto multilínea con las mismas características.
 */
export function FormTextArea({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  success,
  required = false,
  disabled = false,
  placeholder,
  helperText,
  rows = 4,
  maxLength,
  className = '',
  ...props
}) {
  const { dark } = useTheme();
  const [focused, setFocused] = useState(false);

  const inputId = `field-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  const cardBg = dark ? '#0D1117' : '#f9fafb';
  const border = error 
    ? '#EF4444' 
    : success 
    ? '#059669'
    : focused
    ? '#0052FF'
    : dark ? '#1F2630' : '#e5e7eb';
  
  const textH = dark ? '#E6EDF3' : '#111827';
  const textM = dark ? '#8B9498' : '#6b7280';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold"
          style={{ color: textH }}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-label="requerido">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          {...props}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          aria-required={required}
          className="w-full px-4 py-2.5 rounded-xl border-2 text-sm transition-all outline-none resize-y disabled:opacity-50"
          style={{
            background: cardBg,
            borderColor: border,
            color: textH,
          }}
        />
        
        {/* Contador de caracteres */}
        {maxLength && (
          <div 
            className="absolute bottom-2 right-2 text-xs tabular-nums"
            style={{ color: textM }}
            aria-live="polite"
          >
            {value?.length || 0}/{maxLength}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p 
          id={helperId}
          className="text-xs"
          style={{ color: textM }}
        >
          {helperText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: '#EF4444' }}
          role="alert"
        >
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
