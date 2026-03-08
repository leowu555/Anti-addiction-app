/**
 * ProgressBar - Shows progress (0-100) with optional label.
 */

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  label,
  showValue = false,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="mb-1 flex justify-between text-sm text-stone-500">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-stone-500 transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
