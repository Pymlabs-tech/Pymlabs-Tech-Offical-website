type Props = {
  className?: string;
  /** 'dark' = on dark backgrounds (reversed wordmark), 'light' = on light backgrounds */
  on?: 'dark' | 'light';
  /** 'lockup' = mark beside wordmark (header); 'full' = the stacked official logo (footer) */
  variant?: 'lockup' | 'full';
};

/**
 * The official PYMLABS TECHNOLOGY logo (brand-source/pymlabs-logo-original.png),
 * separated into mark and wordmark with the background removed. Shapes and colours
 * are unchanged; the "reversed" files only turn the navy letters white for dark backgrounds.
 */
export default function Logo({ className = '', on = 'dark', variant = 'lockup' }: Props) {
  if (variant === 'full') {
    return (
      <img
        src={on === 'dark' ? '/brand/pymlabs-logo-reversed.webp' : '/brand/pymlabs-logo.webp'}
        width={400}
        height={280}
        alt="PYMLABS Technology"
        className={`h-auto w-[180px] ${className}`}
        decoding="async"
        loading="lazy"
      />
    );
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/brand/pymlabs-mark.webp" width={69} height={80} alt="" className="h-9 w-auto" decoding="async" />
      <img
        src={on === 'dark' ? '/brand/pymlabs-wordmark-reversed.webp' : '/brand/pymlabs-wordmark.webp'}
        width={257}
        height={64}
        alt="PYMLABS Technology"
        className="h-[30px] w-auto"
        decoding="async"
      />
    </span>
  );
}
