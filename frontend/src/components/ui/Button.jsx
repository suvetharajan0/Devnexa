export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-control px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}