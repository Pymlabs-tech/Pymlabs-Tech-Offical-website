import type { CSSProperties, ElementType, ReactNode } from 'react';

type Props = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children?: ReactNode;
  id?: string;
};

/**
 * Fades and lifts its content in once it scrolls into view.
 * Visible by default without JavaScript; see `.js [data-reveal]` in index.css.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, id }: Props) {
  return (
    <Tag data-reveal="" id={id} className={className} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
