const variants = {
  default: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-700',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const classes = `${base} ${variants[variant]} ${className}`.trim();
  return <span className={classes}>{children}</span>;
}
