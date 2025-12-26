import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline'
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'px-4 py-2 rounded'
  const styles = variant === 'primary' ? 'bg-[#006D77] text-white' : 'border border-[#4F7C82] text-[#0B2E33]'
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
