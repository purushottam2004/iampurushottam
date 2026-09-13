import type { ButtonHTMLAttributes, CSSProperties } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1.1rem',
  borderRadius: '8px',
  border: '1px solid transparent',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.15s ease',
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { background: '#646cff', color: '#fff' },
  secondary: { background: 'transparent', color: '#646cff', borderColor: '#646cff' },
}

export function Button({ variant = 'primary', style, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    />
  )
}
