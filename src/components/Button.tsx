import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'light' | 'dark' | 'ghost-light' | 'ghost-dark';

const base =
  'group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-[16px] font-medium tracking-[-0.01em] transition-[background-color,color,transform,box-shadow] duration-300 ease-out active:scale-[0.97] focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-electric text-white hover:bg-electric-600',
  light: 'bg-white text-ink hover:bg-paper-100',
  dark: 'bg-ink text-white hover:bg-ink-700',
  'ghost-light': 'bg-white/10 text-white hover:bg-white/[0.16]',
  'ghost-dark': 'bg-ink/[0.06] text-ink hover:bg-ink/10',
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
};

const Arrow = () => (
  <ArrowRight
    aria-hidden="true"
    className="h-[18px] w-[18px] transition-transform duration-300 ease-out group-hover:translate-x-1"
  />
);

/** Internal route link styled as a button */
export function ButtonLink({ to, children, variant = 'primary', className = '', arrow }: CommonProps & { to: string }) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

/** External / mailto link styled as a button */
export function ButtonAnchor({
  href,
  children,
  variant = 'primary',
  className = '',
  arrow,
}: CommonProps & { href: string }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {arrow && <Arrow />}
    </a>
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  arrow,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
